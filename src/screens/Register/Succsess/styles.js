import { PD, DEVICE, DIMENSION } from "helper/Consts";
import { responsiveFontSize } from "react-native-responsive-dimensions";
import { FONT_SF } from "assets";

export default {
    mg: {
        marginVertical: PD.PADDING_2,
        width: DEVICE.DEVICE_WIDTH,
        alignItems: "center"
    },
    icon: {
        marginVertical: DEVICE.DEVICE_HEIGHT * 0.2,
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
        fontSize: responsiveFontSize(2.5),
        fontFamily: FONT_SF.BOLD
    },
    success: {
        height: 80,
        width: 80,
        alignSelf: "center"
    }
};
