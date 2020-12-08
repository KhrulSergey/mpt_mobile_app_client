import format from 'date-fns/format';
import React, { PureComponent } from 'react';
import { View, ScrollView, TouchableOpacity, FlatList, Platform } from 'react-native';
import { Icon, Fab, Tab, Tabs, Item, Input } from 'native-base';
import {
    RTCPeerConnection,
    RTCIceCandidate,
    RTCSessionDescription,
    RTCView,
    MediaStreamTrack,
    getUserMedia
} from 'react-native-webrtc';
import { Actions } from 'react-native-router-flux';
import Config from 'react-native-config';
import * as transform from 'sdp-transform';
import { Text, LoadingIndicator } from '../../../components/common';
import { TIME } from '../../../constants/DateTime';
import { trackByIndex } from '../../../constants/util';

import styles from './styles';

let rpc_id = 0;
let offerId = null;
const remotePeerIds = {};

const msg = (method, params, remotePeerId) => {
    const msg = {
        jsonrpc: '2.0',
        method,
        id: rpc_id++
    };
    if (params) {
        msg.params = params;
        if (remotePeerId) {
            remotePeerIds[msg.id] = remotePeerId;
        }
        if (params.sdpOffer && method === 'publishVideo') {
            offerId = msg.id;
        }
    }
    console.log('message', msg, JSON.stringify(msg));
    return JSON.stringify(msg);
};

const filterCodecs = (description) => {
    if (Platform.OS === 'ios') {
        const newDescription = description;
        const sdp = description.sdp;
        const parsedSdp = transform.parse(sdp);

        console.log('parsedSdp', parsedSdp);

        parsedSdp.media = parsedSdp.media.map(media => {
            if (media.type === 'video') {
                const index = media.rtp.findIndex(rtp => rtp.codec.toLowerCase() === 'h264');
                if (index !== -1) {
                    const h264Codec = media.rtp[index];
                    media.rtp.splice(index, 1);
                    const baseRtp = [h264Codec];
                    media.rtp = baseRtp.concat(media.rtp);
                }
            }
            return media;
        });

        newDescription.sdp = transform.write(parsedSdp);
        return newDescription;
    }
    return description;
};

const configuration = {
    bundlePolicy: 'balanced',
    iceTransportPolicy: 'all',
    rtcpMuxPolicy: 'require',
    iceCandidatePoolSize: 0,
    tcpCandidatePolicy: 'enabled',
    candidateNetworkPolicy: 'all',
    continualGatheringPolicy: 'gather_once',
    iceServers: [{ urls: ['stun:stun.l.google.com:19302'] }]
};
const connection = { optional: [{ DtlsSrtpKeyAgreement: true }] };
const constraintsToOffer = { mandatory: { offerToReceiveAudio: false, offerToReceiveVideo: false }, optional: [{ DtlsSrtpKeyAgreement: true }] };
const constraintsToReceive = { mandatory: { offerToReceiveAudio: true, offerToReceiveVideo: true }, optional: [{ DtlsSrtpKeyAgreement: true }] };
const wssUri = Config.MEETINGS_SERVER_URL;
const userAlias = 'Я';
const videoConstraints = {
    minWidth: 640,
    minHeight: 480,
    // width: { min: 640, ideal: 1280, max: 1920 },
    // height: { min: 480, ideal: 720, max: 1080 },
    minFrameRate: 30
};

class GroupCall extends PureComponent {
    constructor(props) {
        super(props);
        this.pcPeers = {};
        this.iceCandidates = [];
        this.localStream = null;
        this.state = {
            info: 'Initializing',
            status: 'init',
            connected: false,
            isFront: true,
            mainViewSrc: null,
            remoteList: {},
            textRoomData: [],
            textInputValue: ''
        };
        this.getLocalStream(true, (stream) => {
            this.localStream = stream;
            const remoteList = this.state.remoteList;
            remoteList[this.props.username] = { stream: stream.toURL(), active: true };
            this.setState({ ...this.state, remoteList, mainViewSrc: stream.toURL(), status: 'ready' });
            this.socket = new WebSocket(wssUri);
            this.socket.onopen = () => {
                console.log('connection opened');
                this.socket.send(msg('joinRoom', { user: this.props.username, room: this.props.room, dataChannels: true }));
            };
            this.socket.onmessage = (e) => {
                console.log('a message was received', e);
                const data = JSON.parse(e.data);
                console.log(data);
                if (data.result && data.result.sdpOffer) {
                    console.log('data.result.sdpOffer IS HERE', data.result);
                }
                if (data.result && data.result.sessionId) {
                    console.log('data.result.sessionId IS HERE', data.result);
                }
                switch (data.method) {
                    case 'participantJoined':
                        this.createPC(data.params.id, false, true);
                        this.receiveTextData({ message: `Пользователь ${data.params.id} зашел в комнату.` });
                        break;
                    case 'participantLeft':
                        this.onUserLeft(data.params.name);
                        this.receiveTextData({ message: `Пользователь ${data.params.name} покинул комнату.` });
                        break;
                    case 'participantPublished':
                        this.receiveVideoFrom(this.pcPeers[data.params.id], data.params.id);
                        //this.socket.send(msg('receiveVideoFrom', { sender: `${data.params.id}_webcam`, sdpOffer: this.pcPeers[this.props.username].localDescription.sdp }, data.params.id));
                        this.setState({ ...this.state, info: `User ${data.params.id} published video` });
                        // this.exchange({ peerId: data.params.id });
                        break;
                    case 'participantUnpublished':
                        this.setState({ ...this.state, info: `User ${data.params.name} unpublished video` });
                        break;
                    case 'iceCandidate': // received ICE candidate
                        console.log(data.params.endpointName);
                        this.onIceCandidate(this.pcPeers[data.params.endpointName], { ...data.params });
                        break;
                    case 'sendMessage':
                        if (data.params.user !== this.props.username) {
                            this.receiveTextData({ user: data.params.user, message: data.params.message });
                        }
                        break;
                    case 'mediaError':
                        this.setState({ ...this.state, info: `MediaError: ${data.params.error}` });
                        break;
                }
                if (data.result && data.result.value && data.result.sessionId && !data.result.sdpAnswer) { // joined a room
                    // this.createPC(data.result.sessionId, true);
                    this.createPC(this.props.username, true);
                    data.result.value.forEach((remotePeer) => {
                        this.createPC(remotePeer.id, false);
                    });
                }
                if (data.result && data.result.sdpAnswer) { // received sdp answer
                    console.log('received sdpAnswer', data);
                    if (data.id === offerId) {
                        console.log('sdpAnswer data.id === offerId', data.id);
                        this.onSdpAnswer(this.props.username, data.result.sdpAnswer);
                    } else {
                        console.log('sdpAnswer data.id !== offerId', data.id);
                        const peerId = remotePeerIds[data.id];
                        if (peerId) {
                            this.onSdpAnswer(remotePeerIds[data.id], data.result.sdpAnswer);
                        } else {
                            console.log('WTF');
                        }
                    }
                }
            };
            this.socket.onerror = (e) => {
                console.log('an error occurred', e, e.message);
            };
            this.socket.onclose = (e) => {
                console.log('connection closed', e, e.code, e.reason);
                Actions.pop();
            };
        });
    }

    getLocalStream = (isFront, callback) => {
        let videoSourceId;

        // on android, you don't have to specify sourceId manually, just use facingMode
        // uncomment it if you want to specify
        if (Platform.OS === 'ios') {
            MediaStreamTrack.getSources(sourceInfos => {
                console.log('sourceInfos: ', sourceInfos);
                for (let i = 0; i < sourceInfos.length; i++) {
                    const sourceInfo = sourceInfos[i];
                    if (sourceInfo.kind === 'video' && sourceInfo.facing === (isFront ? 'front' : 'back')) {
                        videoSourceId = sourceInfo.id;
                    }
                }
            });
        }
        getUserMedia({
            audio: true,
            video: {
                mandatory: videoConstraints,
                width: { min: 640, ideal: 1280 },
                height: { min: 480, ideal: 720 },
                facingMode: (isFront ? 'user' : 'environment'),
                optional: (videoSourceId ? [{ sourceId: videoSourceId }] : []),
            }
        }, (stream) => {
            console.log('getUserMedia success', stream);
            callback(stream);
        }, console.log);
    };

    onIceCandidate = (pc, candidate) => {
        const iceCandidate = new RTCIceCandidate(candidate);
        if (pc) {
            pc.addIceCandidate(iceCandidate);
        }
        // We save the ice candidate for later when we receive the SDP
        this.iceCandidates.push(iceCandidate);
    };

    onSdpAnswer = (peerId, sdpAnswer) => {
        console.log('onSdpAnswer', peerId);
        const sessionDescription = {
            type: 'answer',
            sdp: sdpAnswer
        };
        const pc = this.pcPeers[peerId];
        if (pc) {
            pc.setRemoteDescription(new RTCSessionDescription(sessionDescription), () => {
                // After receiving the SDP we add again the ice candidates, in case they were forgotten (bug)
                this.iceCandidates.forEach((iceCandidate) => {
                    pc.addIceCandidate(iceCandidate);
                });
            }, (e) => console.log('setRemoteDescription error', e));
        }
    };

    receiveVideoFrom = (pc, peerId) => {
        pc.createOffer((desc) => {
            console.log('createOffer on remote peer', desc);
            pc.setLocalDescription(filterCodecs(desc), () => {
                console.log('setLocalDescription', pc.localDescription);
                this.socket.send(msg('receiveVideoFrom', { sender: `${peerId}_webcam`, sdpOffer: pc.localDescription.sdp }, peerId));
            }, (e) => console.log('setLocalDescription error', e));
        }, console.log, constraintsToReceive);
    };

    createPC = (peerId, isOffer, startedWithoutStream) => {
        console.log('createPC', peerId);
        const pc = new RTCPeerConnection(configuration, connection);
        this.pcPeers[peerId] = pc;
        if (isOffer) this.setState({ ...this.state, connected: true });

        pc.onicecandidate = (event) => {
            console.log('onicecandidate', event, event.candidate);
            if (event.candidate) { // FIXME this caused createOffer loops
                this.socket.send(msg('onIceCandidate', { endpointName: peerId, ...event.candidate }));
            }
        };

        pc.onnegotiationneeded = () => {
            console.log('onnegotiationneeded', isOffer);
            if (isOffer) {
                pc.createOffer((desc) => {
                    console.log('createOffer on me', desc);
                    pc.setLocalDescription(filterCodecs(desc), () => {
                        console.log('setLocalDescription', pc.localDescription);
                        this.socket.send(msg('publishVideo', { sdpOffer: pc.localDescription.sdp, doLoopback: false }));
                    }, e => console.log('setLocalDescription error', e));
                }, console.log, constraintsToOffer);
            } else if (!startedWithoutStream) {
                this.receiveVideoFrom(pc, peerId);
            }
        };

        pc.oniceconnectionstatechange = (event) => {
            console.log('oniceconnectionstatechange', event.target.iceConnectionState);
            // if (event.target.iceConnectionState === 'completed') {
            //     setTimeout(() => {
            //         this.getStats();
            //     }, 1000);
            // }
            if (isOffer && event.target.iceConnectionState === 'connected') {
                this.setState({ ...this.state, status: 'connected' });
                //this.createDataChannel(peerId);
            }
        };

        pc.onsignalingstatechange = (event) => {
            console.log('onsignalingstatechange', event.target.signalingState);
        };

        pc.onaddstream = (event) => {
            console.log('onaddstream', event, event.stream);
            if (!isOffer) {
                const remoteList = { ...this.state.remoteList };
                remoteList[peerId] = { stream: event.stream.toURL() };
                this.setState({ ...this.state, remoteList, info: 'One peer join!' });
            }
        };

        pc.onremovestream = (event) => {
            console.log('onremovestream', event.stream);
        };

        pc.addStream(this.localStream);

        return pc;
    };

    // exchange = (data) => {
    //     const peerId = data.peerId;
    //     let pc;
    //     if (peerId in this.pcPeers) {
    //         pc = this.pcPeers[peerId];
    //     } else {
    //         pc = this.createPC(peerId, false);
    //     }
    //     console.log('exchange data', data);
    //     pc.createOffer((desc) => {
    //         console.log('createOffer', desc);
    //         pc.setLocalDescription(desc, () => {
    //             console.log('setLocalDescription', pc.localDescription);
    //             this.socket.send(msg('receiveVideoFrom', { sender: `${peerId}_webcam`, sdpOffer: pc.localDescription.sdp }, peerId));
    //         }, console.log);
    //     }, console.log, constraintsToReceive);
    //     // const data1 = { sdp: data.sdp.replace('setup:active', 'setup:actpass'), type: data.type };
    //     // pc.setRemoteDescription(new RTCSessionDescription(data), () => {
    //     //     if (pc.remoteDescription.type === 'offer') { // TODO offer
    //     //         pc.createAnswer((desc) => {
    //     //             console.log('createAnswer', desc);
    //     //             pc.setLocalDescription(desc, () => {
    //     //                 console.log('setLocalDescription', pc.localDescription);
    //     //                 //this.socket.send(msg('publishVideo', { sdpOffer: pc.localDescription.sdp, doLoopback: false }));
    //     //                 this.socket.send(msg('receiveVideoFrom', { sender: 'pc_webcam', sdpOffer: pc.remoteDescription.sdp }));
    //     //             }, (error) => console.log('setLocalDescription error', error));
    //     //         }, (error) => console.log('createAnswer error', error));
    //     //     }
    //     // }, console.log);
    // };

    onUserLeft = (peerId) => {
        const pc = this.pcPeers[peerId];
        if (this.state.mainViewSrc === pc) {
            this.changeMainViewSrc(this.props.username);
        }
        // const viewIndex = pc.viewIndex;
        pc.close();
        delete this.pcPeers[peerId];

        const remoteList = this.state.remoteList;
        if (remoteList[peerId].active) {
            remoteList[this.props.username].active = true;
        }
        delete remoteList[peerId];
        this.setState({ ...this.state, remoteList, info: `User ${peerId} left the room` });
    };

    getStats = () => {
        const pc = this.pcPeers[Object.keys(this.pcPeers)[0]];
        if (pc.getRemoteStreams()[0] && pc.getRemoteStreams()[0].getAudioTracks()[0]) {
            const track = pc.getRemoteStreams()[0].getAudioTracks()[0];
            console.log('track', track);
            pc.getStats(track, (report) => {
                console.log('getStats report', report);
            }, console.log);
        }
    };

    switchVideoType = () => {
        const isFront = !this.state.isFront;
        this.setState({ ...this.state, isFront });
        this.getLocalStream(isFront, (stream) => {
            const mainViewSrcIsLocal = this.localStream.toURL() === this.state.remoteList[this.props.username].stream;
            if (this.localStream) {
                Object.keys(this.pcPeers).forEach((peerId) => {
                    const pc = this.pcPeers[peerId];
                    pc && pc.removeStream(this.localStream);
                });
                this.localStream.release();
            }
            this.localStream = stream;

            const remoteList = this.state.remoteList;
            const newStreamUrl = stream.toURL();
            remoteList[this.props.username].stream = newStreamUrl;
            if (mainViewSrcIsLocal) {
                this.setState({ ...this.state, remoteList, mainViewSrc: newStreamUrl });
            } else {
                this.setState({ ...this.state, remoteList });
            }

            Object.keys(this.pcPeers).forEach((peerId) => {
                const pc = this.pcPeers[peerId];
                pc && pc.addStream(this.localStream);
            });
        });
    };

    test = () => {
        console.log(offerId, remotePeerIds, this.pcPeers, this.iceCandidates, this.state);
    };

    receiveTextData = (data) => {
        const textRoomData = this.state.textRoomData.slice();
        textRoomData.push({ ...data, time: format(Date.now(), TIME) });
        this.setState({ ...this.state, textRoomData });
    };

    textRoomPress = () => {
        const textRoomData = this.state.textRoomData.slice();
        textRoomData.push({ user: userAlias, message: this.state.textInputValue, time: format(Date.now(), TIME) });
        this.socket.send(msg('sendMessage', { message: this.state.textInputValue, userMessage: this.props.username, roomMessage: this.props.room }));
        this.setState({ ...this.state, textRoomData, textInputValue: '' });
    };

    changeMainViewSrc = (newPeerId) => {
        console.log('changeMainViewSrc', newPeerId);
        const remoteList = this.state.remoteList;
        Object.keys(remoteList).forEach((peerId) => {
            remoteList[peerId].active = peerId === newPeerId;
        });
        this.setState({ ...this.state, mainViewSrc: this.state.remoteList[newPeerId].stream, remoteList });
    };

    handleLeaveAction = () => {
        this.socket.send(msg('leaveRoom'));
        Object.keys(this.pcPeers).forEach((peerId) => {
            this.pcPeers[peerId].close();
            delete this.pcPeers[peerId];
        });
        this.socket.close();
        this.pcPeers = {};
        this.iceCandidates = [];
        this.localStream = null;
        // this.setState({ ...this.state, status: 'init', connected: false, mainViewSrc: null, remoteList: {/* [this.props.username]: this.state.remoteList[this.props.username] */}, textRoomData: [], textInputValue: '' });
    };

    renderItem = ({ item }) => {
        const { flexWrapper, row, chatTime, chatUserMessage, chatNotification } = styles;

        return (
            <View style={[row, flexWrapper]}>
                <View style={{ width: Platform.OS === 'ios' ? 50 : 40 }}>
                    <Text style={chatTime}>
                        {item.time}
                    </Text>
                </View>
                <View style={flexWrapper}>
                    {item.user ?
                        <Text style={item.user === userAlias ? chatUserMessage : null}>{item.user}: {item.message}</Text>
                        :
                        <Text style={chatNotification}>{item.message}</Text>
                    }
                </View>
            </View>
        );
    };
    
    renderRemoteStreamList = (list) => {
        const { remoteStreamListWrapper, remoteView, remoteViewActive, streamView, remoteViewTextWrapper, remoteViewText } = styles;

        return (
            <ScrollView horizontal contentContainerStyle={remoteStreamListWrapper}>
                {Object.keys(list).map((peerId) => {
                    // console.log('remoteList item', peerId, 'url', list[peerId]);
                    return (
                        <TouchableOpacity key={peerId} style={[remoteView, list[peerId].active && remoteViewActive]} onPress={this.changeMainViewSrc.bind(this, peerId)}>
                            <RTCView objectFit='cover' streamURL={list[peerId].stream} style={streamView} />
                            <View style={remoteViewTextWrapper}>
                                <Text style={remoteViewText}>{peerId}</Text>
                            </View>
                        </TouchableOpacity>
                    );
                })}
            </ScrollView>
        );
    };

    renderRemoteUserList = (list) => {
        const { container, userText, userActive } = styles;

        return (
            <View style={container}>
                {Object.keys(list).map((peerId) => {
                    return (
                        <TouchableOpacity key={peerId} onPress={this.changeMainViewSrc.bind(this, peerId)}>
                            <Text style={[userText, list[peerId].active && userActive]}>{peerId}</Text>
                        </TouchableOpacity>
                    );
                })}
            </View>
        );
    };

    renderTextRoom = () => {
        const { flexWrapper, container, textInputWrapper, sendButton } = styles;

        return (
            <View style={[flexWrapper, container]}>
                <FlatList
                    style={flexWrapper}
                    data={this.state.textRoomData}
                    keyExtractor={trackByIndex}
                    renderItem={this.renderItem.bind(this)}
                />
                <Item style={textInputWrapper}>
                    <Input
                        style={{ paddingBottom: 5 }}
                        placeholder='Текст сообщения'
                        multiline
                        onChangeText={value => this.setState({ ...this.state, textInputValue: value })}
                        value={this.state.textInputValue}
                    />
                    <Icon active name='md-send' style={sendButton} onPress={this.textRoomPress.bind(this)} />
                </Item>
            </View>
        );
    };

    render() {
        const { flexWrapper, header, rightPaneWrapper, row, button, buttonLeave, roomTextWrapper, roomText, bottomPaneWrapper, streamView, overlay } = styles;

        return (
            <View style={flexWrapper}>
                {Platform.OS === 'ios' && <View style={header} />}
                {this.state.status === 'connected' ?
                    <View style={flexWrapper}>
                        <View style={flexWrapper}>
                            <View style={[flexWrapper, row]}>
                                <View style={flexWrapper}>
                                    <RTCView objectFit='cover' streamURL={this.state.mainViewSrc} style={streamView} />
                                    <View style={roomTextWrapper}>
                                        <Text style={roomText}>
                                            {this.props.meetingName}
                                        </Text>
                                    </View>
                                    {Config.ENV === 'development' &&
                                    <Fab
                                        style={button}
                                        position='bottomLeft'
                                        onPress={this.switchVideoType.bind(this)}
                                    >
                                        <Icon name='ios-reverse-camera' />
                                    </Fab>
                                    }
                                    {Config.ENV === 'development' &&
                                    <Fab
                                        style={button}
                                        position='bottomRight'
                                        onPress={this.test.bind(this)}
                                    >
                                        <Icon name='md-text' />
                                    </Fab>
                                    }
                                    <Fab
                                        style={buttonLeave}
                                        position='topRight'
                                        // active={this.state.connected}
                                        onPress={this.handleLeaveAction.bind(this)}
                                    >
                                        <Icon name='ios-log-out' />
                                    </Fab>
                                </View>
                                <View style={rightPaneWrapper}>
                                    <Tabs initialPage={1}>
                                        <Tab heading='Участники' tabStyle={Platform.OS === 'ios' ? { backgroundColor: 'transparent' } : null}>
                                            {this.renderRemoteUserList(this.state.remoteList)}
                                        </Tab>
                                        <Tab heading='Сообщения' tabStyle={Platform.OS === 'ios' ? { backgroundColor: 'transparent' } : null}>
                                            {this.renderTextRoom()}
                                        </Tab>
                                    </Tabs>
                                </View>
                            </View>
                        </View>
                        <View style={bottomPaneWrapper}>
                            {this.renderRemoteStreamList(this.state.remoteList)}
                        </View>
                    </View>
                    :
                    <LoadingIndicator />
                }
            </View>
        );
    }
}

export default GroupCall;
