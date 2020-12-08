import { StyleSheet } from 'react-native';
import { catskillWhite, chathamsBlue, froly, linkWater, manatee, periwinkleGray, shamrock } from '../../../constants/Colors';

const styles = StyleSheet.create({
    container: {
        padding: 20
    },
    footerContainer: {
        padding: 10
    },
    flexWrapper: {
        flex: 1
    },
    row: {
        flexDirection: 'row'
    },
    alignItemsCenter: {
        alignItems: 'center'
    },
    header: {
        height: 66,
        paddingHorizontal: 20,
        justifyContent: 'space-between',
        alignItems: 'center'
    },
    textToday: {
        fontSize: 12
    },
    textCaption: {
        fontSize: 18
    },
    infoBlock: {
        backgroundColor: catskillWhite,
        marginTop: 10,
        marginLeft: 20,
        marginRight: 20,
        borderRadius: 5
    },
    infoBlockNow: {
        backgroundColor: linkWater,
        marginTop: 10,
        marginLeft: 20,
        marginRight: 20,
        borderRadius: 5
    },
    borderBottom: {
        borderBottomWidth: 1,
        borderBottomColor: periwinkleGray
    },
    text: {
        fontSize: 12
    },
    textBlue: {
        color: chathamsBlue
    },
    dateStyle: {
        color: shamrock,
        fontSize: 14
    },
    textNew: {
        fontSize: 16,
        color: froly,
        paddingRight: 10
    },
    caption: {
        fontSize: 18
    },
    smallCaption: {
        fontSize: 10,
        color: manatee,
        paddingBottom: 4
    },
    marginTop: {
        marginTop: 15
    },
    clockIcon: {
        marginRight: 8,
        fontSize: 18,
        color: shamrock
    },
    dateString: {
        flex: 1,
        flexDirection: 'row',
        alignItems: 'flex-start',
        justifyContent: 'flex-start',
    },
    meetingHeader: {
        flex: 1,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
    },
    meetingHeaderLeft: {
        maxWidth: '90%'
    },
    button: {
        backgroundColor: shamrock
    }
});

export default styles;
