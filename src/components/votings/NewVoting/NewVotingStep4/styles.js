import { StyleSheet } from 'react-native';
import { shamrock } from '../../../../constants/Colors';

const styles = StyleSheet.create({
    container: {
        padding: 20
    },
    flexWrapper: {
        flex: 1
    },
    button: {
        backgroundColor: shamrock,
        alignSelf: 'flex-end',
        marginBottom: 20,
        marginRight: 20
    },
    footer: {
        height: 60,
        paddingHorizontal: 20,
        justifyContent: 'flex-end',
        alignItems: 'center',
    },
    footerButton: {
        backgroundColor: shamrock
    }
});

export default styles;
