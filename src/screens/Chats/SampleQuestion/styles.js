import { StyleSheet, Platform } from "react-native";
import { PD, DEVICE, DIMENSION } from "helper/Consts";
import { responsiveFontSize } from "react-native-responsive-dimensions";
import { Colors, GlobalStyles } from "helper";
import { FONT_SF } from "assets";

export default StyleSheet.create({
    containerHeader: {
        borderBottomLeftRadius: DIMENSION.BORDER_BOTTOM_LEFT_RADIUS,
        backgroundColor: Colors.WHITE_COLOR,
        width: "100%",
        paddingHorizontal: "5%",
        paddingVertical: PD.PADDING_4
    },
    contentWrap: {
        paddingHorizontal: "5%",
        flexDirection: "row",
        flex: 1,
        justifyContent: "center",
        alignItems: "flex-start"
    }
});
