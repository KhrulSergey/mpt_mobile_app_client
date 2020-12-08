import { StyleSheet } from 'react-native';
import { biscay, catskillWhite, mystic, white } from '../../../constants/Colors';

const styles = StyleSheet.create({
    container: {
        padding: 20
    },
    questionWrapper: {
        backgroundColor: mystic
    },
    questionText: {
        fontSize: 16
    },
    answersWrapper: {
        flex: 1,
        backgroundColor: catskillWhite
    },
    row: {
        flexDirection: 'row'
    },
    spaceBetween: {
        justifyContent: 'space-between'
    },
    chartWrapper: {
        minHeight: 400,
        justifyContent: 'center'
    },
    paddingBottom: {
        paddingBottom: 15
    },
    answerText: {
        fontSize: 15,
        paddingBottom: 5
    },
    barFilled: {
        backgroundColor: biscay,
        height: 35,
        justifyContent: 'center',
        borderTopLeftRadius: 3,
        borderBottomLeftRadius: 3,
        paddingLeft: 10
    },
    barNotFilled: {
        backgroundColor: mystic,
        height: 35,
        borderTopRightRadius: 3,
        borderBottomRightRadius: 3
    },
    buttonWrapper: {
        alignItems: 'flex-end'
    },
    button: {
        backgroundColor: white,
        alignItems: 'center',
        borderRadius: 3,
        width: 300,
        height: 35
    },
    graphIcon: {
        fontSize: 26,
        marginRight: 8
    },
    barText: {
        fontWeight: 'bold',
        color: white
    },
    textBlue: {
        color: biscay
    },
    paddingRight: {
        paddingRight: 5
    }
});

export default styles;
