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
        width: "100%",
        height: "90%",
        backgroundColor: "white"
    }
});
export default styles;
