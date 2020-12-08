import { StyleSheet } from 'react-native';
// import { midnightWithOpacity } from '../../../constants/Colors';

const styles = StyleSheet.create({
    backgroundImage: {
        flex: 1,
        width: null,
        height: null,
        // resizeMode: 'cover',
        backgroundColor: 'transparent'
    },
    wrapper: {
        flex: 1,
        flexDirection: 'column',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    container: {
        flex: 15,
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
        // backgroundColor: midnightWithOpacity
    },
    eagleFlat: {
        width: 201,
        height: 210.75
    },
    welcomeTextWrapper: {
        paddingTop: 25,
        paddingBottom: 15,
        alignItems: 'center'
    },
    welcomeText: {
        fontSize: 24,
        marginBottom: 10,
    },
    nameText: {
        fontSize: 24
    },
    textWhite: {
        color: '#FFF'
    },
    bottomPanel: {
        width: '100%',
        paddingTop: 100,
        paddingLeft: 50,
        paddingRight: 50,
        paddingBottom: 50,
        flex: 1,
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    bottomCol: {
        // flexDirection: 'row',
        flex: 1,
    },
    row: {
        flexDirection: 'row'
    },
    flexCenter: {
        alignItems: 'center',
    },
    gispLogo: {
        width: 266,
        height: 30,
    },
    fingerImg: {
        width: 53,
        height: 68,
        marginRight: 20,
    },
    authText: {
        fontSize: 12,
        color: '#6f84a1',
    },
    authTextWrapper: {
        alignItems: 'flex-start',
        flexDirection: 'column',
        justifyContent: 'center',
    }
});

export default styles;
