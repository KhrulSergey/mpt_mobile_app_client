import { StyleSheet } from 'react-native';
import { chathamsBlue, midnight, shamrock, white } from '../../../constants/Colors';

const styles = StyleSheet.create({
    flexWrapper: {
        flex: 1
    },
    container: {
        backgroundColor: chathamsBlue,
        justifyContent: 'center'
    },
    menuList: {
        flexDirection: 'row',
        alignItems: 'center'
    },
    menuListItem: {
        height: '100%',
        justifyContent: 'center',
        alignItems: 'center'
    },
    borderRight: {
        borderRightWidth: 2,
        borderRightColor: midnight
    },
    image: {
        width: 200,
        height: 200
    },
    menuListItemText: {
        color: white,
        fontSize: 28
    },
    eventNumBlock: {
        height: 20
    },
    eventNumText: {
        color: shamrock,
        fontSize: 14
    },
    footer: {
        position: 'absolute',
        height: 80,
        width: '100%',
        bottom: 0,
        alignItems: 'center',
        justifyContent: 'center'
    },
    gispLogo: {
        width: 258,
        height: 45
    }
});

export default styles;
