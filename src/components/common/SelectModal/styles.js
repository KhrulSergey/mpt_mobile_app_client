import { StyleSheet } from 'react-native';
import { midnightWithOpacity, shamrock, white } from '../../../constants/Colors';

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
    row: {
        flexDirection: 'row'
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
        color: white,
        marginBottom: 5
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
    buttonWrapper: {
        paddingHorizontal: 15
    },
    button: {
        margin: 15
    },
    buttonApply: {
        backgroundColor: shamrock,
        flex: 3
    }
});

export default styles;
