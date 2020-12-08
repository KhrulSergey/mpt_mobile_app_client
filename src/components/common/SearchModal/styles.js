import { StyleSheet } from 'react-native';
import { midnightWithOpacity, periwinkleGray, shamrock, white } from '../../../constants/Colors';

const styles = StyleSheet.create({
    filterModal: {
        position: 'absolute',
        backgroundColor: midnightWithOpacity,
        overflow: 'hidden'
    },
    fullWidth: {
        width: '100%'
    },
    flexWrapper: {
        flex: 1
    },
    container: {
        paddingTop: 20,
        paddingHorizontal: 20
    },
    fetchingIndicator: {
        position: 'absolute',
        top: 26,
        right: 26
    },
    row: {
        flexDirection: 'row'
    },
    tagListWrapper: {
        height: 40,
        marginBottom: 10
    },
    districtList: {
        paddingHorizontal: 30
    },
    districtListItem: {
        marginBottom: 30
    },
    districtListName: {
        fontSize: 20,
        marginBottom: 20,
        color: white
    },
    regionName: {
        paddingLeft: 25,
        fontSize: 16,
        color: white
    },
    regionNameSelected: {
        color: shamrock
    },
    selectedIcon: {
        position: 'absolute',
        color: shamrock,
        fontSize: 28,
        top: -3
    },
    companyName: {
        paddingLeft: 25,
        fontSize: 12,
        color: periwinkleGray
    },
    marginBottom: {
        marginBottom: 5
    },
    buttonWrapper: {
        paddingHorizontal: 15
    },
    button: {
        margin: 15
    },
    buttonApply: {
        backgroundColor: shamrock,
        flex: 3
    },
    buttonReset: {
        backgroundColor: white,
        flex: 1
    }
});

export default styles;
