import { StyleSheet } from 'react-native';
import { blueZodiac, midnight } from '../../../constants/Colors';

const styles = StyleSheet.create({
    container: {
        padding: 20,
        height: '100%'
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
    datePicker: {
        height: 200,
        width: 300
    },
    textWrapper: {
        marginBottom: 10,
        marginTop: 10
    },
    text: {
        fontSize: 18
    },
    label: {
        color: blueZodiac,
        paddingLeft: 5
    },
    button: {
        backgroundColor: midnight,
        marginBottom: 30
    }
});

export default styles;
