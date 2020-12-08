import { StyleSheet } from 'react-native';
import { black, catskillWhite, froly, midnight, mystic, periwinkleGray, shamrock, white } from '../../../../constants/Colors';

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
    alignItemsCenter: {
        alignItems: 'center'
    },
    spaceBetween: {
        justifyContent: 'space-between'
    },
    infoBlock: {
        backgroundColor: catskillWhite,
        borderRadius: 5
    },
    caption: {
        fontSize: 18
    },
    borderTop: {
        borderTopWidth: 1,
        borderTopColor: mystic
    },
    textInput: {
        borderColor: mystic,
        backgroundColor: white
    },
    textInputInvalid: {
        borderColor: froly,
    },
    radioButton: {
        fontSize: 26,
        color: shamrock
    },
    button: {
        backgroundColor: midnight
    },
    buttonDeleteQuestion: {
        backgroundColor: periwinkleGray,
        borderRadius: 3,
        height: 35,
        width: 180
    },
    buttonDeleteAnswer: {
        backgroundColor: periwinkleGray,
        borderRadius: 3,
        marginLeft: 10,
        height: 40,
        width: 40
    },
    buttonDeleteAnswerIcon: {
        backgroundColor: 'transparent',
        color: black,
        fontSize: 42,
        top: -1,
        left: 12
    },
    alignSelfEnd: {
        alignSelf: 'flex-end'
    },
    questionTypeText: {
        paddingLeft: 5,
        paddingRight: 50
    },
    marginBottom: {
        marginBottom: 10
    },
    footer: {
        height: 60,
        paddingHorizontal: 20,
        alignItems: 'center'
    },
    buttonSave: {
        backgroundColor: shamrock,
        marginLeft: 20
    }
});

export default styles;
