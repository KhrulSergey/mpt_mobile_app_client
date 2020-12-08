import React, { PureComponent } from 'react';
import { View } from 'react-native';
import { connect } from 'react-redux';
import { Actions } from 'react-native-router-flux';
import { fetchVoting, storeVotingSuccess, updateVotingViewCount, resetFilter } from '../../../actions';
import NewVotingStep1 from './NewVotingStep1';
import NewVotingStep2 from './NewVotingStep2';
import NewVotingStep3 from './NewVotingStep3';
import NewVotingStep4 from './NewVotingStep4';
import { TabBar } from './TabBar';
import { LoadingIndicator } from '../../common';

import styles from './styles';

class NewVoting extends PureComponent {
    componentDidMount() {
        const { actionType, id, fetchVoting, storeVotingSuccess, resetFilter } = this.props;
        if (actionType === 'create') {
            storeVotingSuccess();
            resetFilter('voting-region'); // TODO move them to success response handler?
            resetFilter('voting-industry');
            resetFilter('voting-company');
        } else if (actionType === 'edit') {
            fetchVoting({ id, actionType, new: this.props.new });
        }
    }

    componentWillReceiveProps(nextProps) {
        if (this.props.voting.storing && !nextProps.voting.storing && !nextProps.voting.storingError
            || this.props.voting.updating && !nextProps.voting.updating && !nextProps.voting.updatingError) {
            Actions.votings();
        }
        if (nextProps.new && nextProps.voting.data.id !== this.props.voting.data.id) {
            this.props.updateVotingViewCount({ ...nextProps.voting.data, period: nextProps.period });
        }
    }

    renderContent = () => {
        const { voting, regionsFilter, industriesFilter, companiesFilter, actionType } = this.props;
        switch (voting.currentStep) {
            case 0:
            case 1:
                return <NewVotingStep1 voting={voting} />;
            case 2:
                return <NewVotingStep2 voting={voting} />;
            case 3:
                return <NewVotingStep3 voting={voting} regionsFilter={regionsFilter} industriesFilter={industriesFilter} companiesFilter={companiesFilter} />;
            case 4:
                return <NewVotingStep4 voting={voting} regionsFilter={regionsFilter} industriesFilter={industriesFilter} companiesFilter={companiesFilter} actionType={actionType} />;
            default:
                return null;
        }
    };

    render() {
        const { actionType, voting } = this.props;
        const { currentStep, fetching } = voting;

        const { flexWrapper } = styles;

        return (
            <View style={flexWrapper}>
                <TabBar step={currentStep} actionType={actionType} />
                {fetching ?
                    <LoadingIndicator />
                    :
                    <View style={flexWrapper}>
                        {this.renderContent()}
                    </View>
                }
            </View>
        );
    }
}

const mapStateToProps = state => {
    return {
        voting: state.newVoting,
        regionsFilter: state.votingRegionFilter,
        industriesFilter: state.votingIndustryFilter,
        companiesFilter: state.votingCompanyFilter
    };
};

export default connect(mapStateToProps, { fetchVoting, storeVotingSuccess, updateVotingViewCount, resetFilter })(NewVoting);
