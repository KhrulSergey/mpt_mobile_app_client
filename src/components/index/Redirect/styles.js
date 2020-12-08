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
    eagleLogo: {
        width: 134,
        height: 140.5,
        marginBottom: 20
    },
    gispLogo: {
        width: 266,
        height: 30,
        marginBottom: 80
    },
    paddingBottom: {
        paddingBottom: 40
    },
    registerText: {
        color: white,
        fontSize: 16
    },
    button: {
        backgroundColor: shamrock
    }
});

export default styles;
