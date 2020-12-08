import { StyleSheet } from 'react-native';
import { catskillWhite, mystic, shamrock, white } from '../../../constants/Colors';

const styles = StyleSheet.create({
    container: {
        padding: 20
    },
	captionWrapper: {
        paddingTop: 5,
        paddingBottom: 20
    },
    caption: {
        fontSize: 20
    },
    questionWrapper: {
        backgroundColor: mystic
    },
    questionText: {
        fontSize: 14
    },
    answersWrapper: {
        backgroundColor: catskillWhite
    },
    button: {
        backgroundColor: shamrock,
        marginTop: 10
    },
    row: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingBottom: 12
    },
    answerText: {
        fontSize: 12,
        marginLeft: 10
    },
    checkbox: {
        fontSize: 26,
        color: shamrock
    },
    textInput: {
        borderColor: mystic,
        backgroundColor: white
    }
});

export default styles;
