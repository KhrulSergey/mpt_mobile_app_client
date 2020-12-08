import { StyleSheet } from 'react-native';
import { blueZodiac, midnight, shamrock } from '../../../../constants/Colors';

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
    textWrapper: {
        marginBottom: 10,
        marginTop: 10
    },
    paddingBottom: {
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
    buttonDate: {
        backgroundColor: midnight,
        marginBottom: 30
    },
    footer: {
        height: 60,
        justifyContent: 'flex-end',
        alignItems: 'center',
        paddingHorizontal: 20
    },
    footerButton: {
        backgroundColor: shamrock
    },
    datePicker: {
        height: 200,
        width: 300
    }
});

export default styles;
