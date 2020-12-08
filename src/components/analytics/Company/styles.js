import { StyleSheet } from 'react-native';
import { blueZodiac, botticelli, catskillWhite, downriver, manatee, white } from '../../../constants/Colors';

const styles = StyleSheet.create({
    container: {
        padding: 20,
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
        borderTopRightRadius: 5
    },
    blockCaptionWrapper: {
        paddingLeft: 80
    },
    blockCaption: {
        fontSize: 18
    },
    blockImage: {
        position: 'absolute',
        top: 10,
        left: 15,
        width: 60,
        height: 60,
        resizeMode: 'contain'
    },
    integrationImage: {
        position: 'absolute',
        top: 20,
        left: 50,
        width: 100,
        height: 75
    },
    integrationInfoBlock: {
        backgroundColor: 'transparent',
        paddingTop: 10,
        paddingBottom: 10
    },
    percentText: {
        fontSize: 46
    },
    jcCenter: {
        justifyContent: 'center'
    },
    integrationText: {
        lineHeight: 20
    },
    noDataText: {
        fontSize: 14,
        fontWeight: 'bold'
    },
    textWhite: {
        color: white
    },
    infoBlock: {
        backgroundColor: catskillWhite
    },
    paddingView: {
        flex: 1,
        height: 20,
        backgroundColor: white
    },
    row: {
        flex: 1,
        flexDirection: 'row'
    },
    spaceBetween: {
        justifyContent: 'space-between'
    },
    borderBottom: {
        borderBottomWidth: 1,
        borderBottomColor: botticelli
    },
    borderTop: {
        borderTopWidth: 1,
        borderTopColor: botticelli
    },
    borderRight: {
        borderRightWidth: 1,
        borderRightColor: botticelli
    },
    smallCaption: {
        color: manatee,
        fontSize: 10,
        marginBottom: 2
    },
    label: {
        color: blueZodiac
    },
    largeCaption: {
        fontSize: 20,
        marginBottom: 6
    },
    textBold: {
        fontWeight: 'bold'
    },
    paddingRight: {
        paddingRight: 4
    },
    paddingRightPercent: {
        paddingRight: 15
    },
    marginBottom: {
        marginBottom: 15
    }
});

export default styles;
