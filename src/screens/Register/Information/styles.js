import { PD, DEVICE, DIMENSION } from "helper/Consts";
import { FONT_SF } from "assets";
import { Colors } from "helper";
import { responsiveFontSize } from "react-native-responsive-dimensions";

export default {
    mg: {
        marginVertical: PD.PADDING_2,
        width: DEVICE.DEVICE_WIDTH,
        alignItems: "center"
    },
    icon: {
        paddingTop: DEVICE.DEVICE_HEIGHT * 0.25,
        height: 68,
        width: 68,
        alignSelf: "center"
    },
    card: {
        flexDirection: "row",
        width: "90%",
        alignSelf: "center",
        marginTop: PD.PADDING_3
    },
    btnCalender: {
        flex: 3,
        marginRight: PD.PADDING_3,
        paddingHorizontal: DIMENSION.BUTTON_HEIGHT / 2,
        height: DIMENSION.BUTTON_HEIGHT,
        borderRadius: DIMENSION.BUTTON_RADIUS,
        justifyContent: "center",
        alignItems: "center",
        alignSelf: "center",
        backgroundColor: Colors.Deluge,
        flexDirection: "row",
        fontFamily: FONT_SF.BOLD,
        backgroundColor: Colors.Dusty_Gray,
        // opacity: 0.5,
        flexDirection: "row"
    },
    text: {
        textAlign: "center",
        color: "white",
        fontSize: responsiveFontSize(2.5),
        fontFamily: FONT_SF.BOLD
    },
    btnCalender1: {
        flex: 2,
        height: DIMENSION.BUTTON_HEIGHT,
        borderRadius: DIMENSION.BUTTON_RADIUS,
        justifyContent: "center",
        alignItems: "center",
        alignSelf: "center",
        backgroundColor: Colors.Deluge,
        flexDirection: "row",
        fontFamily: FONT_SF.BOLD,
        backgroundColor: Colors.Dusty_Gray,
        flexDirection: "row"
    },
    iconCheck: {
        height: 35,
        width: 35,
        alignSelf: "center"
    },
    checkBox: {
        flex: 2,
        height: DIMENSION.BUTTON_HEIGHT,
        borderRadius: DIMENSION.BUTTON_RADIUS,
        justifyContent: "center",
        alignItems: "center",
        alignSelf: "center",
        // backgroundColor: Colors.Deluge,
        flexDirection: "row",
        fontFamily: FONT_SF.BOLD
        // backgroundColor: Colors.Dusty_Gray
    },
    input: {
        // height: 45,
        width: DEVICE.DEVICE_WIDTH,
        alignItems: "center"
    },
    error: {
        fontSize: responsiveFontSize(2.2),
        color: Colors.Alizarin_Crimson,
        textAlign: "center"
    }
};
