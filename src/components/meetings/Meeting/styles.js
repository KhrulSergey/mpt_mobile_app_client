import { StyleSheet } from 'react-native';
import { catskillWhite, linkWater, manatee, periwinkleGray, shamrock } from '../../../constants/Colors';

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
    textWrapper: {
        paddingBottom: 15
    },
    textToday: {
        fontSize: 12
    },
    textCaption: {
        fontSize: 18
    },
    infoBlock: {
        backgroundColor: catskillWhite,
        marginBottom: 10,
        borderRadius: 5
    },
    infoBlockNow: {
        backgroundColor: linkWater,
    },
    borderBottom: {
        borderBottomWidth: 1,
        borderBottomColor: periwinkleGray
    },
    text: {
        fontSize: 12
    },
    dateStyle: {
        color: shamrock,
        fontSize: 14
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
    button: {
        backgroundColor: shamrock
    }
});

export default styles;
