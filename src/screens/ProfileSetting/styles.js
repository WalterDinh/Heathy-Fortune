import { StyleSheet } from "react-native";
import { Colors, GlobalStyles } from "helper";
import { PD } from "helper/Consts";

export default StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: Colors.Athens_Gray
    },
    containerHeader: {
        backgroundColor: Colors.Victoria
    },
    content: {
        flex: 1,
        padding: PD.PADDING_2
    }
});
