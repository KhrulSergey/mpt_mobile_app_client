import React, { PureComponent } from 'react';
import { StatusBar, Platform, AsyncStorage, View, Text } from 'react-native';
import { Scene, Stack, Router, Actions, Lightbox } from 'react-native-router-flux';
import { store } from './configureStore';
import * as actions from './actions';
import Redirect from './components/index/Redirect';
import RegisterPage from './components/index/RegisterPage';
import Menu from './components/index/Menu';
import Map from './components/analytics/Map';
import ProjectsShowcase from './components/analytics/ProjectsShowcase';
import ProjectsSummarized from './components/analytics/ProjectsSummarized';
import Region from './components/analytics/Region';
import Projects from './components/analytics/Projects';
import Project from './components/analytics/Project';
import Companies from './components/analytics/Companies';
import Company from './components/analytics/Company';
import Votings from './components/votings/Votings';
import Voting from './components/votings/Voting';
import VotingResult from './components/votings/VotingResult';
import NewVoting from './components/votings/NewVoting';
import Meetings from './components/meetings/Meetings';
import Meeting from './components/meetings/Meeting';
import NewMeeting from './components/meetings/NewMeeting';
import GroupCall from './components/meetings/GroupCall';
import FilterModal from './components/common/FilterModal';
import RegionFilterModal from './components/common/RegionFilterModal';
import StatusFilterModal from './components/common/StatusFilterModal';
import SelectModal from './components/common/SelectModal';
import SearchModal from './components/common/SearchModal';
import QuarterSelectorModal from './components/analytics/Map/QuarterSelectorModal';
import UrlSelectorModal from './components/common/UrlSelectorModal';
import { midnight, midnightDarker, paradiso, white } from './constants/Colors';
import { back, close, menu } from './constants/Icons';

export const renderTitle = ({ title }) => {
    const synchronizedAt = store.getState().auth.synchronizedAt;
    return (
        <View style={{ width: '100%' }}>
            <View style={{ alignItems: 'center', marginRight: Platform.OS === 'ios' ? 0 : 56 }}>
                <Text style={{ fontSize: 18, color: white }}>
                    {title}
                </Text>
                {synchronizedAt &&
                    <Text style={{ fontSize: 12, color: paradiso }}>
                        База от {synchronizedAt}
                    </Text>
                }
            </View>
        </View>
    );
};

export const renderMenuTitle = () => {
  return (
    <View style={{ width: '100%', alignItems: 'center' }}>
        <Text style={{ fontSize: 20, color: white, marginRight: Platform.OS === 'ios' ? 0 : 56 }}>
            Министерство промышленности и торговли
        </Text>
    </View>
  );
};

const logout = () => {
    try {
        AsyncStorage.removeItem('gispUser')
        .then(() => Actions.register());
    } catch (error) {
        console.log(error);
    }
};

const onEnter = (sceneName) => {
    const { quarter, year } = store.getState().mapData.periodArchived;
    const { selected: industriesOnMap } = store.getState().mapIndustryFilter;
    const { selected: regionsOnMap } = store.getState().mapRegionFilter;
    const { selected: projectGroupOnMap } = store.getState().mapProjectGroupFilter;
    const { selected: industriesOnProjects, doNotApplyFilter } = store.getState().projectsIndustryFilter;
    const { selected: regionsOnProjects } = store.getState().projectsRegionFilter;
    const { selected: projectGroupOnProjects } = store.getState().projectsProjectGroupFilter;
    switch (sceneName) {
        case 'map':
            if (Actions.prevScene === 'projectsShowcase') {
                store.dispatch(actions.fetchRegionsDynamicData({ quarter, year, industries: industriesOnMap, selectedRegions: regionsOnMap, projectGroup: projectGroupOnMap }));
            } else if (Actions.prevScene === 'projects') {
                store.dispatch(actions.fetchRegionsDynamicData({ quarter, year, industries: industriesOnProjects, selectedRegions: regionsOnProjects, projectGroup: projectGroupOnProjects }));
                store.dispatch(actions.populateFilter({ filterType: 'map-industry', data: industriesOnProjects }));
                store.dispatch(actions.populateFilter({ filterType: 'map-region', data: regionsOnProjects }));
                store.dispatch(actions.populateFilter({ filterType: 'map-project-group', data: projectGroupOnProjects }));
            }
            return;
        case 'projectsShowcase':
            if (Actions.prevScene === 'projectsSummarized')
                store.dispatch(actions.fetchProjectsShowcase({ industries: industriesOnMap, regions: regionsOnMap }));
            return;
        case 'projectsSummarized':
            if (Actions.prevScene === 'projects') {
                store.dispatch(actions.fetchProjectsSummarized({ industries: doNotApplyFilter ? industriesOnMap : industriesOnProjects, regions: regionsOnProjects, projectGroup: projectGroupOnProjects }));
                if (!doNotApplyFilter) store.dispatch(actions.populateFilter({ filterType: 'map-industry', data: industriesOnProjects }));
                store.dispatch(actions.populateFilter({ filterType: 'map-region', data: regionsOnProjects }));
                store.dispatch(actions.populateFilter({ filterType: 'map-project-group', data: projectGroupOnProjects }));
            }
            return;
    }
};

const closeMenuButton = {
    onLeft: () => Actions.pop(),
    leftButtonImage: close,
    leftButtonIconStyle: { width: 24, height: 22, resizeMode: 'contain' }
};
const logOutButton = {
    onRight: logout,
    rightTitle: 'Выйти',
};
export const menuButton = {
    onLeft: () => Actions.menu({ initialized: true }),
    leftButtonImage: menu,
    leftButtonIconStyle: { width: 30, height: 24, resizeMode: 'contain' }
};
export const backButton = {
    backButtonImage: back,
    leftButtonIconStyle: { width: 24, height: 22, resizeMode: 'contain' }
};

class RouterComponent extends PureComponent {
    render() {
        StatusBar.setBarStyle('light-content', true);
        if (Platform.OS === 'android') {
            StatusBar.setBackgroundColor(midnightDarker);
            StatusBar.setTranslucent(false);
        }

        return (
            <Router
                navigationBarStyle={{ backgroundColor: midnight, height: Platform.OS === 'ios' ? 44 : 56 }}
                titleStyle={{ color: white, alignSelf: 'center', marginRight: Platform.OS === 'ios' ? 0 : 56 }}
                sceneStyle={{ backgroundColor: white, flex: 1 }}
                headerMode='screen'
            >
                <Lightbox>
                    <Stack key='root'>
                        <Scene
                            key='redirect'
                            component={Redirect}
                            hideNavBar
                        />
                        <Scene
                            key='register'
                            component={RegisterPage}
                            hideNavBar
                        />
                        <Scene
                            key='menu'
                            component={Menu}
                            renderTitle={renderMenuTitle.bind(this)}
                            {...closeMenuButton}
                            // {...logOutButton}
                        />
                        <Scene
                            key='map'
                            component={Map}
                            renderTitle={renderTitle.bind(this, { title: 'Витрина проектов' })}
                            onEnter={onEnter.bind(this, 'map')}
                            {...menuButton}
                            type='replace'
                        />
                        <Scene
                            key='projectsShowcase'
                            component={ProjectsShowcase}
                            renderTitle={renderTitle.bind(this, { title: 'Аналитика по проектам' })}
                            onEnter={onEnter.bind(this, 'projectsShowcase')}
                            {...backButton}
                        />
                        <Scene
                            key='projectsSummarized'
                            component={ProjectsSummarized}
                            renderTitle={renderTitle.bind(this, { title: 'Аналитика по проектам' })}
                            onEnter={onEnter.bind(this, 'projectsSummarized')}
                            {...backButton}
                        />
                        <Scene
                            key='region'
                            component={Region}
                            renderTitle={renderTitle.bind(this, { title: 'Паспорт региона' })}
                            {...backButton}
                        />
                        <Scene
                            key='projects'
                            component={Projects}
                            renderTitle={renderTitle.bind(this, { title: 'Проекты' })}
                            {...backButton}
                        />
                        <Scene
                            key='project'
                            component={Project}
                            renderTitle={renderTitle.bind(this, { title: 'Паспорт проекта' })}
                            {...backButton}
                        />
                        <Scene
                            key='companies'
                            component={Companies}
                            renderTitle={renderTitle.bind(this, { title: 'Предприятия' })}
                            {...backButton}
                        />
                        <Scene
                            key='company'
                            component={Company}
                            renderTitle={renderTitle.bind(this, { title: 'Паспорт предприятия' })}
                            {...backButton}
                        />
                        <Scene
                            key='votings'
                            component={Votings}
                            renderTitle={renderTitle.bind(this, { title: 'Голосования' })}
                            {...menuButton}
                            type='replace'
                        />
                        <Scene
                            key='voting'
                            component={Voting}
                            renderTitle={renderTitle.bind(this, { title: 'Голосования' })}
                            {...backButton}
                        />
                        <Scene
                            key='votingResult'
                            component={VotingResult}
                            renderTitle={renderTitle.bind(this, { title: 'Результаты голосования' })}
                            {...backButton}
                        />
                        <Scene
                            key='newVoting'
                            component={NewVoting}
                            renderTitle={renderTitle.bind(this, { title: 'Создание голосования' })}
                            {...backButton}
                        />
                        <Scene
                            key='meetings'
                            component={Meetings}
                            renderTitle={renderTitle.bind(this, { title: 'Совещания' })}
                            {...menuButton}
                            type='replace'
                        />
                        <Scene
                            key='meeting'
                            component={Meeting}
                            renderTitle={renderTitle.bind(this, { title: 'Совещания' })}
                            {...backButton}
                        />
                        <Scene
                            key='newMeeting'
                            component={NewMeeting}
                            renderTitle={renderTitle.bind(this, { title: 'Создание совещания' })}
                            {...backButton}
                        />
                        <Scene
                            key='groupCall'
                            hideNavBar
                            component={GroupCall}
                            renderTitle={renderTitle.bind(this, { title: 'Комната видеосовещания' })}
                            {...backButton}
                        />
                    </Stack>
                    <Scene key='filterModal' component={FilterModal} />
                    <Scene key='regionFilterModal' component={RegionFilterModal} />
                    <Scene key='statusFilterModal' component={StatusFilterModal} />
                    <Scene key='selectModal' component={SelectModal} />
                    <Scene key='searchModal' component={SearchModal} />
                    <Scene key='quarterSelectorModal' component={QuarterSelectorModal} />
                    <Scene key='urlSelectorModal' component={UrlSelectorModal} />
                </Lightbox>
            </Router>
        );
    }
}

export default RouterComponent;
