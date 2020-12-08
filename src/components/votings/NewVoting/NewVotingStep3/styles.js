import { StyleSheet } from 'react-native';
import { botticelli, shamrock, selago } from '../../../../constants/Colors';

const styles = StyleSheet.create({
    container: {
        padding: 20
    },
    flexWrapper: {
        flex: 1
    },
    row: {
        flexDirection: 'row'
    },
    flexWrap: {
        flexWrap: 'wrap'
    },
    filterBlock: {
        height: 60
    },
    filterSelectionBlock: {
        backgroundColor: selago
    },
    borderRight: {
        borderRightWidth: 1,
        borderRightColor: botticelli
    },
    buttonWrapper: {
        paddingHorizontal: 30,
        paddingVertical: 15
    },
    button: {
        backgroundColor: shamrock,
        alignSelf: 'center'
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
