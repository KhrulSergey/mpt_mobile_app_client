import { StyleSheet } from 'react-native';
import { shamrock, white } from '../../../constants/Colors';

const styles = StyleSheet.create({
    flexWrapper: {
        flex: 1
    },
    backgroundImage: {
        width: null,
        height: null,
        // resizeMode: 'cover',
        backgroundColor: 'transparent'
    },
    justifyContentCenter: {
        justifyContent: 'center',
        alignItems: 'center'
    },
    row: {
        flexDirection: 'row'
    },
    alignItemsFlexStart: {
        alignItems: 'flex-start',
        paddingTop: 100
    },
    eagleLogo: {
        width: 134,
        height: 140.5,
        marginBottom: 20
    },
    gispLogo: {
        width: 258,
        height: 45,
        marginBottom: 80
    },
    paddingBottom: {
        paddingBottom: 40
    },
    registerText: {
        color: white,
        fontSize: 16
    },
    linkText: {
        color: shamrock,
        paddingHorizontal: 6
    },
    codeText: {
        color: shamrock,
        fontSize: 24,
        paddingTop: 10,
        paddingBottom: 10
    },
    button: {
        backgroundColor: shamrock
    }
});

export default styles;
