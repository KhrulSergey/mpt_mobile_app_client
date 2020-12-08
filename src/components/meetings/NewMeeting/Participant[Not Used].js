import React, { PureComponent } from 'react';
import { View, TouchableOpacity } from 'react-native';
import { connect } from 'react-redux';
import { removeMeetingParticipant } from '../../../actions';
import { Text } from '../../common';

import styles from './styles';

class Participant extends PureComponent {
    onParticipantSelected = () => {
        this.props.removeMeetingParticipant(this.props.item);
    };

    render() {
        const { item } = this.props;

        const { participantWrapper, participantText, newParticipantText } = styles;

        return (
            <TouchableOpacity onPress={this.onParticipantSelected.bind(this)}>
                <View style={participantWrapper}>
                    <Text style={[participantText, item.new && newParticipantText]}>
                        {this.props.item.name}
                    </Text>
                </View>
            </TouchableOpacity>
        );
    }
}

export default connect(null, { removeMeetingParticipant })(Participant);
