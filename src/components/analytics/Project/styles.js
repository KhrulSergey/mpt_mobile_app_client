import { StyleSheet } from 'react-native';
import { botticelli, catskillWhite, downriver, froly, shamrock, white, yellowOrange } from '../../../constants/Colors';

const styles = StyleSheet.create({
    flexWrapper: {
        flex: 1
    },
    container: {
        padding: 20
    },
    nameWrapper: {
        backgroundColor: downriver,
        borderRadius: 5,
        marginBottom: 5
    },
    blockCaption: {
        fontSize: 18
    },
    largeCaption: {
        fontSize: 20,
        marginBottom: 6
    },
    textWhite: {
        color: white
    },
    infoBlock: {
        backgroundColor: catskillWhite
    },
    borderBottom: {
        borderBottomWidth: 1,
        borderBottomColor: botticelli
    },
    row: {
        flexDirection: 'row'
    },
    spaceBetween: {
        justifyContent: 'space-between'
    },
    textBold: {
        fontWeight: 'bold'
    },
    statusWrapperOk: {
        backgroundColor: shamrock
    },
    statusWrapperWarning: {
        backgroundColor: yellowOrange
    },
    statusWrapperDanger: {
        backgroundColor: froly
    },
    statusWrapper: {
        borderRadius: 3,
        padding: 3,
        width: 200
    },
    statusText: {
        fontSize: 12,
        color: white,
        alignSelf: 'center'
    },
    paddingRight: {
        paddingRight: 4
    },
    marginRight: {
        marginRight: 10
    },
    paddingTop: {
        paddingTop: 8
    },
    header: {
        backgroundColor: downriver
    },
    nameCol: {
        flex: 70
    },
    jcCenter: {
        justifyContent: 'center'
    },
    valueCol: {
        flex: 15
    }
});

export default styles;
