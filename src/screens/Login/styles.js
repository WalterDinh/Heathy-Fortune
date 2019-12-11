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
    inputsWrap: {
        width: width,
        justifyContent: "center",
        alignItems: "center",
        marginTop: 0.1 * height
    },
    leftStyle: {
        width: 0.025 * height,
        height: 0.025 * height
    },
    dropdown: {
        width: "100%",
        height: DIMENSION.INPUT_HEIGHT,
        borderRadius: 30,
        backgroundColor: "#fff",
        marginBottom: PD.PADDING_3,
        justifyContent: "center",
        paddingHorizontal: 25,
        flexDirection: "row",
        flex: 1
    },
    errorText: {
        fontSize: responsiveFontSize(2.5),
        color: Colors.RED_COLOR,
        marginVertical: 0.02 * height,
        textAlign: "center"
    },
    btn: {
        backgroundColor: Colors.Deluge,
        width: "90%"
    },
    logoApp: {
        width: "100%",
        height: 0.1 * height,
        marginTop: 0.03 * height
    },
    btnText: {
        marginTop: 0.01 * height
    },
    btnBottomWrap: {
        flex: 1,
        justifyContent: "flex-end",
        paddingBottom: width * 0.1
    },
    btnTextStyle: {
        fontSize: responsiveFontSize(2.5)
    }
});
export default styles;
