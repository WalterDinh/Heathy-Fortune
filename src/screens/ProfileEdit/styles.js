import { StyleSheet, Platform } from "react-native";
import { PD, DEVICE } from "helper/Consts";
import { responsiveFontSize } from "react-native-responsive-dimensions";
import { Colors, GlobalStyles } from "helper";
import { FONT_SF } from "assets";

export default StyleSheet.create({
    containerStyle: {
        flex: 1,
        backgroundColor: Colors.Athens_Gray
    },
    imageHeader: {
        height: DEVICE.DEVICE_HEIGHT * 0.6,
        width: DEVICE.DEVICE_WIDTH
    },
    content: {
        flex: 1,
        // height: "100%",
        // width: "100%",
        marginTop: -DEVICE.DEVICE_HEIGHT * 0.23,
        // backgroundColor: Colors.Athens_Gray,
        // borderTopRightRadius: DEVICE.DEVICE_HEIGHT * 0.1,
        // borderBottomLeftRadius: DEVICE.DEVICE_HEIGHT * 0.1,
        // alignItems: "center",
        paddingVertical: PD.PADDING_2
    },
    titleField: {
        fontSize: responsiveFontSize(2),
        fontFamily: FONT_SF.SEMIBOLD,
        paddingVertical: PD.PADDING_1
    },
    containerFirstTab: {
        flex: 1,
        // height: DEVICE.DEVICE_HEIGHT * 0.5,
        backgroundColor: Colors.Athens_Gray,
        paddingHorizontal: PD.PADDING_4
    },
    btnStyle: {
        width: "100%",
        height: 45
        // marginTop: PD.PADDING_4
    },
    autoCompleteBtn: {
        width: "100%",
        height: 45
        // backgroundColor: Colors.WHITE_COLOR
    },
    autoCompleteBtnText: {
        // color: Colors.BLACK_TEXT_COLOR,
        // fontFamily: FONT_SF.REGULAR
    },
    tagContent: {
        flexDirection: "row",
        justifyContent: "space-evenly",
        width: "100%",
        flexWrap: "wrap",
        height: "auto",
        paddingHorizontal: 0,
        backgroundColor: Colors.WHITE_COLOR,
        paddingVertical: PD.PADDING_3
    },
    tagWrap: {
        backgroundColor: Colors.Victoria,
        width: "44%",
        marginBottom: PD.PADDING_2,
        justifyContent: "center",
        alignItems: "center",
        borderRadius: PD.PADDING_4,
        paddingVertical: PD.PADDING_2
    }
});
