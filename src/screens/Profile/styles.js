import { StyleSheet, Platform } from "react-native";
import { PD, DEVICE } from "helper/Consts";
import { responsiveFontSize } from "react-native-responsive-dimensions";
import { Colors, GlobalStyles } from "helper";
import { FONT_SF } from "assets";

export default // StyleSheet.create(
{
    containerStyle: {
        flex: 1,
        backgroundColor: Colors.WHITE_COLOR
    },
    imageHeader: {
        height: DEVICE.DEVICE_HEIGHT * 0.6,
        width: DEVICE.DEVICE_WIDTH,
        zIndex: -1
    },
    content: {
        flex: 1,
        marginTop: -DEVICE.DEVICE_HEIGHT * 0.23,
        backgroundColor: Colors.Athens_Gray,
        borderTopRightRadius: DEVICE.DEVICE_HEIGHT * 0.1,
        borderBottomLeftRadius: DEVICE.DEVICE_HEIGHT * 0.1,
        alignItems: "center",
        zIndex: 1
    },
    headerContent: {
        height: DEVICE.DEVICE_HEIGHT * 0.16,
        width: DEVICE.DEVICE_WIDTH,
        paddingLeft: "5%",
        justifyContent: "center"
        // backgroundColor: "green"
    },
    headerWrap: {
        height: "70%",
        width: DEVICE.DEVICE_WIDTH * 0.8
    },
    nameText: {
        fontSize: responsiveFontSize(3.2),
        fontFamily: FONT_SF.BOLD
    },
    address: {
        fontSize: responsiveFontSize(2)
    },
    bodyContent: {
        height: DEVICE.DEVICE_HEIGHT * 0.28,
        backgroundColor: Colors.WHITE_COLOR,
        width: DEVICE.DEVICE_WIDTH * 0.9,
        borderRadius: DEVICE.DEVICE_HEIGHT * 0.05,
        alignItems: "center"
    },
    bodyTopContent: {
        flex: 1,
        width: "85%",
        borderBottomColor: Colors.Athens_Gray,
        borderBottomWidth: 1,
        flexDirection: "row"
    },
    bodyBottomContent: {
        flex: 1,
        width: "85%",
        flexDirection: "row"
    },
    itemWrap: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center"
    },
    btn: {
        paddingHorizontal: 10
    },
    centerBtn: {
        // backgroundColor: "green",
        justifyContent: "center",
        alignItems: "center",
        width: "100%"
    },
    textBtn: {
        color: Colors.Lynch,
        fontSize: responsiveFontSize(2),
        paddingTop: Platform.select({
            ios: PD.PADDING_1,
            android: PD.PADDING_1
        })
    },
    iconStyle: {
        color: Colors.Lynch
    },
    footerWrap: {
        flex: 1,
        alignItems: "center",
        justifyContent: "center"
    },
    btnSignOut: {
        backgroundColor: Colors.Alizarin_Crimson,
        width: DEVICE.DEVICE_WIDTH * 0.9
    }
};
// );

// export default styles;
