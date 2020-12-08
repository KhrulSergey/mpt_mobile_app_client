import { StyleSheet } from 'react-native';
import { botticelli, chathamsBlue, downriver, froly, shamrock, white, yellowOrange } from '../../../constants/Colors';

const styles = StyleSheet.create({
    listWrapper: {
        // paddingTop: 20,
        paddingBottom: 74
    },
    row: {
        flexDirection: 'row' 
    },
    filterBlock: {
        height: 60,
        borderBottomWidth: 1,
        borderTopWidth: 1,
        borderColor: botticelli
    },
    borderBottom: {
        borderBottomWidth: 1,
        borderBottomColor: botticelli
    },
    header: {
        backgroundColor: downriver
    },
    flexWrapper: {
        flex: 1
    },
    container: {
        padding: 10
    },
    industryCol: {
        flex: 23
    },
    importCol: {
        flex: 13
    },
    industryWideCol: {
        flex: 36
    },
    projectNumCol: {
        flex: 16
    },
    borderRight: {
        borderRightWidth: 1,
        borderRightColor: botticelli
    },
    text: {
        fontSize: 12
    },
    textBlue: {
        color: chathamsBlue
    },
    textWhite: {
        color: white
    },
    statusOk: {
        color: shamrock
    },
    statusWarning: {
        color: yellowOrange
    },
    statusDanger: {
        color: froly
    },
    eagleShape: {
        position: 'absolute',
        top: 20,
        right: 20,
        width: 290,
        height: 290
    },
    summaryButton: {
        width: 250,
        height: 42,
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: downriver
    }
});

export default styles;
