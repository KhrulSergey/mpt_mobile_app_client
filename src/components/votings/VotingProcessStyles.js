import { StyleSheet } from 'react-native';
import { blueZodiac, catskillWhite, downriver } from '../../constants/Colors';

const styles = StyleSheet.create({
    container: {
        padding: 15
    },
    captionWrapper: {
        paddingTop: 5,
        paddingBottom: 20
    },
    caption: {
        fontSize: 18
    },
    row: {
        flexDirection: 'row'
    },
    paddingRight: {
        paddingRight: 4
    },
    infoBlock: {
        backgroundColor: catskillWhite
    },
    label: {
        color: blueZodiac
    },
    paddingBottom: {
        paddingBottom: 5
    }
});

export default styles;
