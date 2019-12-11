import { PD, DEVICE, DIMENSION } from "helper/Consts";
import { responsiveFontSize } from "react-native-responsive-dimensions";
import { FONT_SF } from "assets";
import { Colors } from "helper";

export default {
    mg: {
        marginVertical: PD.PADDING_2,
        width: DEVICE.DEVICE_WIDTH,
        alignItems: "center"
    },
    icon: {
        paddingVertical: DEVICE.DEVICE_HEIGHT * 0.2,
        height: 68,
        width: 68,
        alignSelf: "center"
    },
    header: {
        paddingHorizontal: PD.PADDING_4,
        paddingVertical: PD.PADDING_3,
        flexDirection: "row"
    },
    text: {
        textAlign: "center",
        color: "white",
        fontSize: responsiveFontSize(2.5)
        // fontFamily: FONT_SF.BOLD
    },
    error: {
        fontSize: responsiveFontSize(2.2),
        color: Colors.Alizarin_Crimson,
        textAlign: "center"
    },
    input: {
        // height: 45,
        width: DEVICE.DEVICE_WIDTH,
        alignItems: "center",
        marginTop: PD.PADDING_3
    }
};
