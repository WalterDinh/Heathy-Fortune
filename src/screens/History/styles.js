import { StyleSheet } from "react-native";
import { Const, Colors } from "helper/index";
import { PD, DEVICE, DIMENSION } from "helper/Consts";
import { responsiveFontSize } from "react-native-responsive-dimensions";
const width = Const.DEVICE.DEVICE_WIDTH;
const height = Const.DEVICE.DEVICE_HEIGHT;
const styles = StyleSheet.create({
    inputContainer: {
        width: "90%",
        marginBottom: 0.02 * height
    },
    container: {
        zIndex: 3,
        // flex: 1
        // flexDirection: "column"
    }
});
export default styles;
