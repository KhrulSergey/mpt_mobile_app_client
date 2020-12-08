import React, { PureComponent } from 'react';
import { Root } from 'native-base';
import { Provider } from 'react-redux';
import firebase from 'react-native-firebase';
import configureStore from './configureStore';
import Router from './Router';

const store = configureStore();

class App extends PureComponent {
    componentDidMount() {
        this.onTokenRefreshListener = firebase.messaging().onTokenRefresh(fcmToken => {
            console.log('onTokenRefresh', fcmToken);
            store.getState().auth.fcm_token = fcmToken;
        });

        firebase.messaging().hasPermission()
            .then(enabled => {
                if (enabled) {
                    console.log('user has permissions');
                } else {
                    console.log('user doesn\'t have permission');
                }
            });

        firebase.messaging().requestPermission()
            .then(() => {
                console.log('User has authorised');
            })
            .catch(error => {
                console.log('User has rejected permissions');
            });

        this.notificationListener = firebase.notifications().onNotification((notification) => {
            console.log('onNotification', notification);
            firebase.notifications().displayNotification(notification);
        });

        this.notificationOpenedListener = firebase.notifications().onNotificationOpened((notificationOpen) => {
            // Get the action triggered by the notification being opened
            const action = notificationOpen.action;
            // Get information about the notification that was opened
            const notification = notificationOpen.notification;

            console.log('onNotificationOpened', notificationOpen);
            firebase.notifications().getBadge()
              .then(number => firebase.notifications().setBadge(number - 1));
        });
    }

    componentWillUnmount() {
        this.onTokenRefreshListener();
        this.notificationListener();
        this.notificationOpenedListener();
    }

    render() {
        return (
            <Root>
                <Provider store={store}>
                    <Router />
                </Provider>
            </Root>
        );
    }
}

export default App;
