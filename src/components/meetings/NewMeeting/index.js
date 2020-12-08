import React, { PureComponent } from 'react';
import { View, Keyboard } from 'react-native';
import { Content } from 'native-base';
import { Actions } from 'react-native-router-flux';
import { connect } from 'react-redux';
import { toast } from '../../../constants/util';
import { fetchMeeting, resetFilter, storeMeeting, updateMeeting, updateMeetingViewCount } from '../../../actions';
import MeetingData from './MeetingData';
import { Button, Footer, LoadingIndicator } from '../../common';

import styles from './styles';

class NewMeeting extends PureComponent {
    constructor(props) {
        super(props);
        this.state = { isKeyboardShown: false };
    }

    componentDidMount() {
        const { id, new: isNew, actionType, resetFilter } = this.props;
        console.log(actionType);
        this.props.fetchMeeting({ id, new: isNew, actionType });
        if (actionType === 'create') {
            resetFilter('meeting-user');
        }
        this.keyboardDidShowListener = Keyboard.addListener('keyboardDidShow', this.keyboardDidShow.bind(this));
        this.keyboardDidHideListener = Keyboard.addListener('keyboardDidHide', this.keyboardDidHide.bind(this));
    }

    componentWillReceiveProps(nextProps) {
        console.log('Meeting componentWillReceiveProps', this.props, nextProps);
        if (this.props.meeting.storing && !nextProps.meeting.storing && !nextProps.meeting.storingError
            || this.props.meeting.updating && !nextProps.meeting.updating && !nextProps.meeting.updatingError) {
            Actions.meetings();
        }
        if (nextProps.new && nextProps.meeting.data.id !== this.props.meeting.data.id) {
            this.props.updateMeetingViewCount(nextProps.meeting.data);
        }
    }

    componentWillUnmount() {
        this.keyboardDidShowListener.remove();
        this.keyboardDidHideListener.remove();
    }

    keyboardDidShow() {
        this.setState({ ...this.state, isKeyboardShown: true });
    }

    keyboardDidHide() {
        this.setState({ ...this.state, isKeyboardShown: false });
    }

    onSave = () => {
        const { meeting, storeMeeting, updateMeeting, usersFilter } = this.props;
        const { selected: users } = usersFilter;
        const { name, description } = meeting.data;
        if (!(name && description)) {
            toast('Название и описание совещания обязательны к заполнению!');
            return;
        }
        if (!users || users.length === 0) {
            toast('При создании совещания должны быть указаны участники!');
            return;
        }
        switch (meeting.mode) {
            case 'create':
                storeMeeting({ ...meeting.data, users });
                break;
            case 'edit':
                updateMeeting({ ...meeting.data, users });
                break;
            default:
                console.log('NewMeeting onSave: UNRESOLVED MODE!');
        }
    };

    render() {
        const { meeting, usersFilter } = this.props;
        const { data, fetching, storing, updating } = meeting;

        const { container, flexWrapper, footer, saveButton } = styles;

        return (
            <View style={flexWrapper}>
                {fetching ?
                    <LoadingIndicator />
                    :
                    <View style={flexWrapper}>
                        <Content>
                            <View style={[container, flexWrapper]}>
                                {(meeting.mode === 'create' || data.id) && <MeetingData data={data} selectedUsers={usersFilter.selected} />}
                            </View>
                        </Content>
                        {!this.state.isKeyboardShown &&
                            <Footer style={footer}>
                                <Button style={saveButton} onPress={this.onSave.bind(this)} loading={storing || updating} loadingText='Сохранение...'>
                                    Сохранить
                                </Button>
                            </Footer>
                        }
                    </View>
                }
            </View>
        );
    }
}

const mapStateToProps = state => {
    return {
        meeting: state.newMeeting,
        usersFilter: state.meetingUserFilter
    };
};

export default connect(mapStateToProps, { fetchMeeting, resetFilter, storeMeeting, updateMeeting, updateMeetingViewCount })(NewMeeting);
