import { StyleSheet, Platform } from 'react-native';
import { blackWithOpacity, botticelli, chathamsBlue, downriver, froly, midnightWithOpacity, selago, shamrock, white } from '../../../constants/Colors';

const styles = StyleSheet.create({
    flexWrapper: {
        flex: 1
    },
    container: {
        padding: 20
    },
    paddingHorizontal: {
        paddingHorizontal: 20
    },
    row: {
        flexDirection: 'row'
    },
    filterBlock: {
        height: 60,
        borderBottomWidth: 1,
        borderBottomColor: botticelli
    },
    alignItemsCenter: {
        alignItems: 'center'
    },
    spaceBetween: {
        justifyContent: 'space-between'
    },
    borderRight: {
        borderRightWidth: 1,
        borderRightColor: botticelli
    },
    leftBlock: {
        width: 350,
        backgroundColor: downriver
    },
    comparisonButton: {
        height: 70,
        backgroundColor: midnightWithOpacity
    },
    navigationButton: {
        height: 50,
        marginBottom: 10,
        backgroundColor: midnightWithOpacity
    },
    leftPicker: Platform.OS === 'ios' ?
        { width: 50, marginRight: 15 }
        :
        { width: 50, height: 180, marginRight: 15 },
    rightPicker: Platform.OS === 'ios' ?
        { width: 70, marginHorizontal: 15 }
        :
        { width: 70, height: 180, marginHorizontal: 15 },
    panel: {
        height: 80,
        borderRadius: 3,
        marginTop: 5,
        marginHorizontal: 5,
        paddingTop: 15,
        paddingBottom: 5,
        paddingHorizontal: 20
    },
    panelOk: {
        backgroundColor: shamrock
    },
    panelWarning: {
        backgroundColor: froly
    },
    fontSize10: {
        fontSize: 10
    },
    fontSize12: {
        fontSize: 12
    },
    fontSize13: {
        fontSize: 13
    },
    fontSize16: {
        fontSize: 16
    },
    fontSize18: {
        fontSize: 18
    },
    fontSize24: {
        fontSize: 24
    },
    panelBottomText: {
        lineHeight: 24
    },
    panelIcon: {
        fontSize: 22,
        top: Platform.OS === 'ios' ? 2 : 6
    },
    comparisonButtonIcon: {
        fontSize: 28,
        marginRight: 20,
        top: Platform.OS === 'ios' ? 2 : 0
    },
    textWhite: {
        color: white
    },
    textGreen: {
        color: shamrock
    },
    paddingRight: {
        paddingRight: 5
    },
    paddingLeft: {
        paddingLeft: 20
    },
    positionAbsolute: {
        position: 'absolute'
    },
    popupStyle: {
        borderRadius: 5,
        backgroundColor: white
    },
    justifyContentCenter: {
        justifyContent: 'center'
    },
    popupSection: {
        flex: 2,
        borderBottomWidth: 1,
        borderBottomColor: selago
    },
    popupFooter: {
        flex: 3
    },
    popupHeaderWrapper: {
        flex: 3,
        backgroundColor: selago
    },
    popupHeader: {
        paddingLeft: 70
    },
    popupHeaderImage: {
        position: 'absolute',
        top: 5,
        left: 15,
        width: 42,
        height: 42,
        resizeMode: 'contain',
    },
    textBlue: {
        color: chathamsBlue
    },
    filterModal: {
        backgroundColor: midnightWithOpacity,
        overflow: 'hidden'
    },
    pickerModalWrapper: {
        position: 'absolute',
        width: '100%',
        backgroundColor: blackWithOpacity
    },
    pickerModal: {
        width: 400,
        height: 300,
        backgroundColor: midnightWithOpacity,
        borderRadius: 10
    },
    buttonApply: {
        backgroundColor: shamrock,
        flex: 1,
        marginRight: 15
    },
    buttonReset: {
        backgroundColor: white,
        flex: 1
    },
    iconEncircled: {
        width: 24,
        height: 24,
        opacity: 0.85
    }
});

export default styles;
