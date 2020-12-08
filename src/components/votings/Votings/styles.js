import { StyleSheet } from 'react-native';
import { blueZodiac, catskillWhite, downriver, froly, mystic, shamrock, shuttleGray, white } from '../../../constants/Colors';

const styles = StyleSheet.create({
    container: {
        padding: 20,
    },
    footerContainer: {
        padding: 10
    },
    flexWrapper: {
        flex: 1
    },
    header: {
        height: 66
    },
    listSwitchButton: {
        width: 130,
        height: 30,
        borderWidth: 1,
        borderColor: downriver,
        justifyContent: 'center',
        alignItems: 'center'
    },
    leftListSwitchButton: {
        borderRightWidth: 0,
        borderTopLeftRadius: 3,
        borderBottomLeftRadius: 3
    },
    rightListSwitchButton: {
        borderLeftWidth: 0,
        borderTopRightRadius: 3,
        borderBottomRightRadius: 3
    },
    listSwitchText: {
        fontSize: 10
    },
    listSwitchButtonActive: {
        backgroundColor: downriver
    },
    listSwitchButtonNotActive: {
        backgroundColor: white
    },
    listSwitchTextActive: {
        color: white
    },
    listSwitchTextNotActive: {
        color: downriver
    },
    button: {
        backgroundColor: shamrock
    },
    infoBlock: {
        backgroundColor: catskillWhite,
        marginTop: 10,
        marginLeft: 20,
        marginRight: 20,
        borderRadius: 5,
    },
    borderBottom: {
        borderBottomWidth: 1,
        borderBottomColor: mystic,
    },
    textNew: {
        fontSize: 16,
        color: froly,
        paddingRight: 10
    },
    caption: {
        flex: 1,
        fontSize: 18
    },
    voteTitle: {
        flex: 1,
        justifyContent: 'space-between'
    },
    row: {
        flexDirection: 'row'
    },
    alignItemsCenter: {
        alignItems: 'center'
    },
    alignItemsEnd: {
        alignItems: 'flex-end',
        paddingRight: 20
    },
    descriptionStyle: {
        fontSize: 14,
        marginBottom: 10,
        lineHeight: 24
    },
    periodStyle: {
        fontSize: 13,
        color: blueZodiac
    },
    checkmarkStyle: {
        color: shamrock,
        fontSize: 36,
        paddingRight: 15
    },
    textVoted: {
        color: shuttleGray
    },
    subjectNumBlock: {
        backgroundColor: white,
        borderRadius: 5
    },
    borderRight: {
        borderRightWidth: 1,
        borderRightColor: mystic
    },
    subjectNumContainer: {
        paddingLeft: 15,
        paddingRight: 15
    }
});

export default styles;
