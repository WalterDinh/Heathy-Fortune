import { DEVICE, DIMENSION, PD } from "helper/Consts";
import { responsiveFontSize } from "react-native-responsive-dimensions";
import { Colors } from "helper";
import { FONT_SF } from "assets";

export default {
    container: {
        flex: 1,
        backgroundColor: Colors.SKY_BLUE
    },
    body: {
        flex: 1,
        justifyContent: "space-evenly",
        padding: PD.PADDING_4
    },
    view: {
        height: 100
    },
    textView: {
        alignItems: "center"
    },
    text: {
        textAlign: "center",
        fontSize: responsiveFontSize(2.4),
        color: Colors.BLACK_TEXT_COLOR
    },
    button: {
        fontSize: responsiveFontSize(2.3),
        fontFamily: FONT_SF.MEDIUM
        // fontWeight:
    }
};
