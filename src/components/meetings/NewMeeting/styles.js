import { StyleSheet } from 'react-native';
import { blueZodiac, botticelli, midnight, shamrock } from '../../../constants/Colors';

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
    flexCenter: {
        alignItems: 'center',
        justifyContent: 'center'
    },
    jcSpaceBetween: {
        justifyContent: 'space-between'
    },
    textWrapper: {
        marginBottom: 10,
        marginTop: 10
    },
    dateWrapper: {
        width: 200,
        paddingBottom: 20
    },
    caption: {
        fontSize: 14,
        paddingBottom: 6
    },
    dateText: {
        fontSize: 18,
        color: blueZodiac,
        paddingLeft: 5
    },
    actionButton: {
        backgroundColor: midnight,
        marginBottom: 10
    },
    footer: {
        height: 60,
        justifyContent: 'flex-end',
        alignItems: 'center',
        paddingHorizontal: 20
    },
    saveButton: {
        backgroundColor: shamrock
    },
    datePicker: {
        height: 200,
        width: 300
    },
    paddingRight: {
        paddingRight: 10
    },
    usersFoundWrapper: {
        position: 'absolute',
        width: '100%',
        left: 0,
        backgroundColor: 'white',
        borderColor: botticelli,
        borderLeftWidth: 1,
        borderRightWidth: 1
    },
    borderBottom: {
        borderBottomWidth: 1,
        borderBottomColor: botticelli
    },
    participantWrapper: {
        height: 30,
        paddingLeft: 10
    },
    participantText: {
        fontSize: 14
    },
    newParticipantText: {
        color: shamrock
    },
    participantsUpdatedText: {
        color: shamrock,
        alignSelf: 'center'
    },
    paddingBottom: {
        paddingBottom: 20
    }
});

export default styles;
