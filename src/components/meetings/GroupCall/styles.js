import { StyleSheet } from 'react-native';
import { black, blackWithOpacity, blueZodiac, botticelli, froly, midnight, shamrock, shuttleGray, white } from '../../../constants/Colors';

const styles = StyleSheet.create({
    streamView: {
        height: '100%'
    },
    remoteView: {
        width: 128,
        height: 96,
        marginHorizontal: 2
    },
    remoteViewActive: {
        borderWidth: 2,
        borderColor: shamrock
    },
    userText: {
        fontSize: 16
    },
    userActive: {
        color: shamrock
    },
    flexWrapper: {
        flex: 1
    },
    streamWrapper: {
        flex: 3
    },
    borderRight: {
        borderRightWidth: 1,
        borderRightColor: botticelli
    },
    rightPaneWrapper: {
        width: 300,
        borderBottomWidth: 1,
        borderBottomColor: botticelli
    },
    container: {
        padding: 10
    },
    row: {
        flexDirection: 'row'
    },
    header: {
        height: 20,
        backgroundColor: midnight
    },
    remoteStreamListWrapper: {
        height: '100%',
        alignItems: 'center',
        paddingHorizontal: 3
    },
    button: {
        backgroundColor: shamrock
    },
    buttonLeave: {
        backgroundColor: froly
    },
    roomTextWrapper: {
        position: 'absolute',
        left: 20,
        top: 15,
        width: '80%',
        backgroundColor: 'transparent'
    },
    roomText: {
        fontSize: 36,
        color: white,
        textShadowColor: black,
        textShadowOffset: { width: 2, height: 2 },
        textShadowRadius: 5
    },
    remoteViewTextWrapper: {
        position: 'absolute',
        left: 5,
        top: 5,
        width: '90%',
        backgroundColor: 'transparent'
    },
    remoteViewText: {
        fontSize: 12,
        color: white,
        textShadowColor: black,
        textShadowOffset: { width: 1, height: 1 },
        textShadowRadius: 1
    },
    bottomPaneWrapper: {
        height: 100
    },
    textInputWrapper: {
        minHeight: 54,
        borderTopWidth: 0.5,
        borderTopColor: botticelli
    },
    sendButton: {
        paddingLeft: 5,
        paddingBottom: 10,
        color: shamrock,
        alignSelf: 'flex-end'
    },
    chatTime: {
        fontWeight: 'bold'
    },
    chatUserMessage: {
        color: blueZodiac
    },
    chatNotification: {
        color: shuttleGray
    },
    overlay: {
        position: 'absolute',
        width: '100%',
        height: '100%',
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: blackWithOpacity
    }
});

export default styles;
