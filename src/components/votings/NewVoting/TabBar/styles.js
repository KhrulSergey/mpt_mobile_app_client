import { StyleSheet } from 'react-native';
import { black, catskillWhite, manatee, mystic } from '../../../../constants/Colors';

const styles = StyleSheet.create({
    container: {
        height: 58,
        backgroundColor: catskillWhite
    },
    tabBarButton: {
        flex: 1,
        // alignSelf: 'stretch',
        paddingLeft: 20,
        justifyContent: 'center'
    },
    tabBarButtonActive: {
        backgroundColor: mystic
    },
    tabBarButtonText: {
        color: black
    },
    tabBarButtonTextDisabled: {
        color: manatee
    },
    borderRight: {
        borderRightWidth: 1,
        borderRightColor: mystic
    },
    stepText: {
        fontSize: 18
    }
});

export default styles;
