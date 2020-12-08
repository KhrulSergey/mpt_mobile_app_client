import { StyleSheet } from 'react-native';
import { botticelli, chathamsBlue, downriver, froly, shamrock, white, yellowOrange } from '../../../constants/Colors';

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
    fontSize22: {
        fontSize: 22
    },
    headerIcon: {
        color: white,
        marginRight: 10
    },
    jcCenter: {
        justifyContent: 'center'
    },
    aiCenter: {
        alignItems: 'center',
        justifyContent: 'space-between'
    },
    flexWrapper: {
        flex: 1
    },
    container: {
        padding: 10
    },
    nameCol: {
        flex: 3
    },
    companyCol: {
        flex: 3
    },
    statusCol: {
        flex: 2
    },
    techCol: {
        flex: 4
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
        color: yellowOrange
    },
    statusDanger: {
        color: froly
    }
});

export default styles;
