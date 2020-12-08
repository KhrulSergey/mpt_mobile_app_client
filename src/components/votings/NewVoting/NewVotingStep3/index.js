import React, { PureComponent } from 'react';
import { View, ScrollView } from 'react-native';
import { Actions } from 'react-native-router-flux';
import { connect } from 'react-redux';
import { changeVotingCurrentStep, toggleModalVisibility, toggleSelect } from '../../../../actions';
import { Button, Footer, FilterPanel, Tag } from '../../../common';

import styles from './styles';

class NewVotingStep3 extends PureComponent {
    constructor(props) {
        super(props);
        const { navbarHeight, heightWithoutNavbar } = props.dimensions;
        this.modalStyle = { height: heightWithoutNavbar - 120, marginTop: navbarHeight + 120 };
    }

    componentWillUnmount() {
        console.log('NewVotingStep3 componentWillUnmount');
        if (Actions.currentScene === 'filterModal' || Actions.currentScene === 'regionFilterModal' || Actions.currentScene === 'searchModal') {
            Actions.pop();
        }
    }

    onProceed = () => {
        this.props.changeVotingCurrentStep(4);
    };

    onRemoveSelection = (selection) => {
        this.props.toggleSelect(selection);
    };

    toggleIndustryList = () => {
        this.props.toggleModalVisibility('voting-industry');
        if (Actions.currentScene === 'filterModal') {
            Actions.pop();
        } else {
            Actions.filterModal({ currentScene: 'voting', filterType: 'voting-industry', style: this.modalStyle });
        }
    };

    toggleRegionList = () => {
        this.props.toggleModalVisibility('voting-region');
        if (Actions.currentScene === 'regionFilterModal') {
            Actions.pop();
        } else {
            Actions.regionFilterModal({ currentScene: 'voting', filterType: 'voting-region', style: this.modalStyle });
        }
    };

    toggleCompanyList = () => {
        this.props.toggleModalVisibility('voting-company');
        if (Actions.currentScene === 'searchModal') {
            Actions.pop();
        } else {
            Actions.searchModal({ filterType: 'voting-company', style: this.modalStyle });
        }
    };

    renderTags = (filterType, selectedItems) => {
        return selectedItems.map((item => {
            return <Tag key={item.id} text={item.name} onPress={this.onRemoveSelection.bind(this, { filterType, selectedItem: item })} />;
        }));
    };

    render() {
        const { voting, regionsFilter, industriesFilter, companiesFilter } = this.props;
        const { selected: selectedRegions } = regionsFilter;
        const { selected: selectedIndustries } = industriesFilter;
        const { selected: selectedCompanies } = companiesFilter;

        const { container, flexWrapper, row, flexWrap, filterBlock, filterSelectionBlock, borderRight, buttonWrapper, fullWidth, button, footer, footerButton } = styles;

        return (
            <View style={flexWrapper}>
                <View style={[row, filterBlock]}>
                    <FilterPanel
                        caption='Регионы'
                        selected={selectedRegions.length > 0 ? selectedRegions : 'Выбраны все регионы'}
                        onPress={this.toggleRegionList.bind(this)}
                        style={borderRight}
                    />
                    <FilterPanel
                        caption='Отрасли'
                        selected={selectedIndustries.length > 0 ? selectedIndustries : 'Выбраны все отрасли'}
                        onPress={this.toggleIndustryList.bind(this)}
                        style={borderRight}
                    />
                    <FilterPanel
                        caption='Предприятия'
                        selected={selectedCompanies.length > 0 ? selectedCompanies : 'Выбраны все предприятия'}
                        onPress={this.toggleCompanyList.bind(this)}
                    />
                </View>
                <View style={flexWrapper}>
                    <View style={[flexWrapper, filterSelectionBlock]}>
                        <View style={[flexWrapper, row]}>
                            <ScrollView style={[flexWrapper, borderRight]}>
                                <View style={[flexWrapper, row, flexWrap, container]}>
                                    {this.renderTags('voting-region', selectedRegions)}
                                </View>
                            </ScrollView>
                            <ScrollView style={[flexWrapper, borderRight]}>
                                <View style={[flexWrapper, row, flexWrap, container]}>
                                    {this.renderTags('voting-industry', selectedIndustries)}
                                </View>
                            </ScrollView>
                            <ScrollView style={flexWrapper}>
                                <View style={[flexWrapper, row, flexWrap, container]}>
                                    {this.renderTags('voting-company', selectedCompanies)}
                                </View>
                            </ScrollView>
                        </View>
                    </View>
                    {/*<View style={[buttonWrapper, fullWidth]}>
                        <Button style={[button, fullWidth]} onPress={this.goToPreview.bind(this)}>
                            Применить и перейти к предпросмотру
                        </Button>
                    </View>*/}
                    <Footer style={footer}>
                        <Button style={footerButton} onPress={this.onProceed.bind(this)}>
                            Сохранить и продолжить
                        </Button>
                    </Footer>
                </View>
            </View>
        );
    }
}

const mapStateToProps = state => {
    return { dimensions: state.device.dimensions };
};

export default connect(mapStateToProps, { changeVotingCurrentStep, toggleModalVisibility, toggleSelect })(NewVotingStep3);
