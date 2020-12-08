import { StyleSheet } from 'react-native';
import { blueZodiac, botticelli, catskillWhite, downriver, mobster, shamrock, white } from '../../../constants/Colors';
const styles = StyleSheet.create({
    container: {
        padding: 20
    },
    smallContainer: {
        padding: 5
    },
    aiCenter: {
        alignItems: 'center'
    },
    nameWrapper: {
        backgroundColor: downriver,
        borderTopLeftRadius: 5,
        borderTopRightRadius: 5,
        paddingHorizontal: 20,
        paddingVertical: 5,
        flexDirection: 'row',
        alignItems: 'center'
    },
    blockCaptionWrapper: {
        paddingLeft: 75
    },
    blockCaption: {
        fontSize: 18
    },
    blockTitleImage: {
        width: 60,
        height: 60,
        resizeMode: 'contain',
        marginRight: 20
    },
    blockImage: {
        position: 'absolute',
        top: 10,
        left: 15,
        width: 60,
        height: 60,
        resizeMode: 'contain'
    },
    textWhite: {
        color: white
    },
    infoBlock: {
        backgroundColor: catskillWhite
    },
    col: {
        flex: 1,
        flexDirection: 'column'
    },
    row: {
        flex: 1,
        flexDirection: 'row'
    },
    spaceBetween: {
        justifyContent: 'space-between',
        alignItems: 'center'
    },
    borderBottom: {
        borderBottomWidth: 1,
        borderBottomColor: botticelli
    },
    paddingView: {
        flex: 1,
        height: 20,
        backgroundColor: white
    },
    label: {
        color: blueZodiac
    },
    paddingRight: {
        paddingRight: 4
    },
    marginBottom: {
        marginBottom: 15
    },
    indicatorBlockItem: {
        backgroundColor: shamrock,
        margin: 5,
        padding: 20,
        borderRadius: 3
    },
    textBig: {
        fontSize: 28
    },
    textMiddle: {
        fontSize: 24
    },
    bottomAlign: {
        marginTop: 2,
        marginLeft: 5
    },
    indicatorBlock: {
        padding: 10,
        paddingBottom: 0
    },
    textGray: {
        color: mobster
    }
});

export default styles;
