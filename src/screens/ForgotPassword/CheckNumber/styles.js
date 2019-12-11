import { StyleSheet } from "react-native";
import { PD, DEVICE, DIMENSION } from "helper/Consts";
import { responsiveFontSize } from "react-native-responsive-dimensions";
import { Color } from "react-native-facebook-account-kit";
import { Colors } from "helper";

export default StyleSheet.create({
    mg: {
        marginVertical: PD.PADDING_2,
        width: DEVICE.DEVICE_WIDTH,
        alignItems: "center"
    },
    icon: {
        paddingTop: DEVICE.DEVICE_HEIGHT * 0.3,
        // marginVertical: DEVICE.DEVICE_HEIGHT * 0.2,
        height: 68,
        width: 68,
        alignSelf: "center"
    },
    header: {
        paddingHorizontal: PD.PADDING_4,
        paddingVertical: PD.PADDING_3,
        flexDirection: "row"
    },
    error: {
        fontSize: responsiveFontSize(2.2),
        color: Colors.Alizarin_Crimson,
        textAlign: "center"
    },
    input: {
        // height: 45,
        width: DEVICE.DEVICE_WIDTH,
        alignItems: "center"
    }
});
