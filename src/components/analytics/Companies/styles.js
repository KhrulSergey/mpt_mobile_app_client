import { StyleSheet } from 'react-native';
import { botticelli, chathamsBlue, downriver, froly, shamrock, white } from '../../../constants/Colors';

const styles = StyleSheet.create({
    row: {
        flexDirection: 'row' 
    },
    filterBlock: {
        height: 60
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
    nameCol: {
        flex: 4
    },
    industryCol: {
        flex: 3
    },
    regionCol: {
        flex: 2
    },
    borderRight: {
        borderRightWidth: 1,
        borderRightColor: botticelli
    },
    text: {
        fontSize: 12,
        margin: 10
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
        color: froly
    }
});

export default styles;
