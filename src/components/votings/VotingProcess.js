import React, { PureComponent } from 'react';
import { View, ScrollView, FlatList, TouchableWithoutFeedback } from 'react-native';
import { Actions } from 'react-native-router-flux';
import { connect } from 'react-redux';
import { fetchVotingProcess } from '../../actions';
import { Text } from '../common';
import { trackById } from '../../constants/util';

import styles from './VotingProcessStyles';

class VotingProcess extends PureComponent {
    componentDidMount() {
        this.props.fetchVotingProcess();
    }

    goToSubjectVotingResult() {
        Actions.voting({ title: 'Результаты голосования' });
    }

    goToSummarizedVotingResult() {
        Actions.votingResult();
    }

    renderItem = ({ item }) => {
        return <Text>{item.name}</Text>;
    };

    renderTouchableItem = ({ item }) => {
        const { label } = styles;

        return (
            <TouchableWithoutFeedback onPress={this.goToSubjectVotingResult.bind(this)}>
                <View>
                    <Text style={label}>{item.name}</Text>
                </View>
            </TouchableWithoutFeedback>
        );
    };

    render() {
        const { name, subjects_num, subjects_started_num, subjects_completed_num, subjects_not_started, subjects_started, subjects_completed } = this.props.votingProcess;

        const { container, captionWrapper, caption, row, paddingRight, infoBlock, label, paddingBottom } = styles;

        return (
            <ScrollView>
                <View style={container}>
                    <View style={captionWrapper}>
                        <Text style={caption}>
                            {name}
                        </Text>
                        <TouchableWithoutFeedback onPress={this.goToSummarizedVotingResult.bind(this)}>
                            <View>
                                <Text style={label}>
                                    Просмотреть сводную информацию
                                </Text>
                            </View>
                        </TouchableWithoutFeedback>
                    </View>
                    <View style={infoBlock}>
                        <View style={container}>
                            <View style={[row, paddingBottom]}>
                                <Text style={paddingRight}>
                                    Общее количество субъектов голосования:
                                </Text>
                                <Text style={label}>
                                    {subjects_num}
                                </Text>
                            </View>
                            <View style={[row, paddingBottom]}>
                                <Text style={paddingRight}>
                                    Количество субъектов голосования, приступивших к голосованию:
                                </Text>
                                <Text style={label}>
                                    {subjects_started_num}
                                </Text>
                            </View>
                            <View style={[row, paddingBottom]}>
                                <Text style={paddingRight}>
                                    Количество субъектов голосования, завершивших голосование:
                                </Text>
                                <Text style={label}>
                                    {subjects_completed_num}
                                </Text>
                            </View>
                            <Text>
                                Перечень субъектов голосования, не приступивших к голосованию:
                            </Text>
                            <FlatList
                                style={container}
                                data={subjects_not_started}
                                // extraData={this.state}
                                keyExtractor={trackById}
                                renderItem={this.renderItem.bind(this)}
                            />
                            <Text>
                                Перечень субъектов голосования, приступивших к голосованию:
                            </Text>
                            <FlatList
                                style={container}
                                data={subjects_started}
                                // extraData={this.state}
                                keyExtractor={trackById}
                                renderItem={this.renderItem.bind(this)}
                            />
                            <Text>
                                Перечень субъектов голосования, завершивших голосование:
                            </Text>
                            <FlatList
                                style={container}
                                data={subjects_completed}
                                // extraData={this.state}
                                keyExtractor={trackById}
                                renderItem={this.renderTouchableItem.bind(this)}
                            />
                        </View>
                    </View>
                </View>
            </ScrollView>
        );
    }
}

const mapStateToProps = state => {
    return { votingProcess: state.votingProcess };
};

export default connect(mapStateToProps, { fetchVotingProcess })(VotingProcess);
