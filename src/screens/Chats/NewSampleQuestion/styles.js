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
        flexDirection: "column"
    },
    contentWrap: {
        paddingHorizontal: "5%",
        flexDirection: "row",
        flex: 1,
        justifyContent: "center",
        alignItems: "flex-start"
    },
    avatarStyle: {
        height: DEVICE.DEVICE_WIDTH * 0.15,
        width: DEVICE.DEVICE_WIDTH * 0.15,
        borderRadius: (DEVICE.DEVICE_WIDTH * 0.15) / 2
    },
    titleText: {
        fontSize: responsiveFontSize(2.5),
        color: Colors.Deluge,
        fontFamily: FONT_SF.MEDIUM
    },
    contentInput: {
        width: "100%",
        textAlignVertical: "top",
        textAlign: "left",
        minHeight: DEVICE.DEVICE_HEIGHT * 0.5,
        paddingTop: PD.PADDING_4,
        paddingLeft: 20,
        paddingRight: 20
    },
    footerWrap: {
        flexDirection: "row",
        width: "100%",
        justifyContent: "space-between",
        paddingVertical: PD.PADDING_2
    }
});
