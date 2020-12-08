import React, { PureComponent } from 'react';
import { View, TouchableOpacity } from 'react-native';
import { connect } from 'react-redux';
import { addMeetingParticipant } from '../../../actions';
import { Text } from '../../common';

import styles from './styles';

class User extends PureComponent {
    onUserSelected = () => {
        this.props.addMeetingParticipant(this.props.item);
    };

    render() {
        const { participantWrapper, participantText } = styles;

        return (
            <TouchableOpacity onPress={this.onUserSelected.bind(this)}>
                <View style={participantWrapper}>
                    <Text style={participantText}>
                        {this.props.item.name}
                    </Text>
                </View>
            </TouchableOpacity>
        );
    }
}

export default connect(null, { addMeetingParticipant })(User);
