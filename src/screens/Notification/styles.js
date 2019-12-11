import { StyleSheet } from "react-native";
import { Const, Colors } from "helper/index";
import { FONT_SF } from "assets";
import { PD, DEVICE, DIMENSION } from "helper/Consts";
import { responsiveFontSize } from "react-native-responsive-dimensions";
const width = Const.DEVICE.DEVICE_WIDTH;
const height = Const.DEVICE.DEVICE_HEIGHT;

const RATIO = DEVICE.DEVICE_HEIGHT / DEVICE.DEVICE_WIDTH;
const HEIGHT = RATIO > 2 ? DEVICE.DEVICE_HEIGHT * 0.115 : DEVICE.DEVICE_HEIGHT * 0.13;
const AVATAR_SIZE = DEVICE.DEVICE_WIDTH * 0.1;
const AVATAR_SIZE_RADIUS = AVATAR_SIZE * 0.5;
const AVATAR_SIZE_WRAP = AVATAR_SIZE + 4;
const AVATAR_SIZE_WRAP_RADIUS = AVATAR_SIZE_WRAP * 0.5;
const styles = StyleSheet.create({
    inputContainer: {
        width: "90%",
        marginBottom: 0.02 * height
    },
    bodyModal: {
        width: DEVICE.DEVICE_WIDTH * 0.9,
        //   height: DEVICE.DEVICE_HEIGHT * 0.35,
        backgroundColor: Colors.Athens_Gray,
        borderTopRightRadius: DIMENSION.BORDER_BOTTOM_LEFT_RADIUS,
        borderBottomLeftRadius: DIMENSION.BORDER_BOTTOM_LEFT_RADIUS,
        flexDirection: "column",
        paddingVertical: PD.PADDING_6,
        paddingHorizontal: PD.PADDING_6
    },
    boxIcon: {
        marginHorizontal: PD.PADDING_1,
        width: AVATAR_SIZE,
        height: AVATAR_SIZE,
        borderRadius: AVATAR_SIZE_RADIUS,
        alignItems: "center",
        justifyContent: "center",
        textAlign: "center",
        textAlignVertical: "center"
    },
    modelContainer: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        zIndex: 18
    },
    boxModel: {
        width: DEVICE.DEVICE_WIDTH * 0.9,
        backgroundColor: Colors.Athens_Gray,
        borderRadius: 40,
        flexDirection: "column",
        zIndex: 20,
        flexDirection: "column",
        position: "absolute",
        paddingVertical: PD.PADDING_6,
        paddingHorizontal: PD.PADDING_6
    },
    name: {
        fontFamily: FONT_SF.MEDIUM,
        lineHeight: responsiveFontSize(2),
        fontSize: responsiveFontSize(2)
    },
    time: {
        fontFamily: FONT_SF.THIN,
        opacity: 0.6,
        lineHeight: responsiveFontSize(2),
        fontSize: responsiveFontSize(2)
    },
    containerIcon: {
        flexDirection: "row",
        justifyContent: "space-between",
        marginVertical: responsiveFontSize(1.5),
        zIndex: 1,
        height: AVATAR_SIZE
    },
    avatarWrap: {
        height: AVATAR_SIZE_WRAP,
        width: AVATAR_SIZE_WRAP,
        borderRadius: AVATAR_SIZE_WRAP_RADIUS,
        borderWidth: responsiveFontSize(1),
        backgroundColor: Colors.WHITE_COLOR,
        justifyContent: "center",
        alignItems: "center",
        borderColor: "#FFF"
    },
    textName: {
        paddingLeft: responsiveFontSize(1.5),
        fontSize: responsiveFontSize(1.5),
        fontFamily: FONT_SF.MEDIUM_ITALIC,
        color: Colors.WHITE_COLOR
    },
    avatar: {
        height: AVATAR_SIZE,
        width: AVATAR_SIZE,
        borderRadius: AVATAR_SIZE_RADIUS
    },
    titleModelCall: {
        color: "#000",
        lineHeight: responsiveFontSize(3.2),
        fontSize: responsiveFontSize(3),
        fontFamily: FONT_SF.BOLD
    },
    line: {
        marginVertical: responsiveFontSize(1.5),
        height: 1,
        opacity: 0.5,
        width: "100%",
        backgroundColor: Colors.BackForest
    },
    icon: { color: "white", fontSize: responsiveFontSize(3) },
    boxModelCancel: {
        width: DEVICE.DEVICE_WIDTH * 0.9,
        backgroundColor: Colors.Athens_Gray,
        borderTopRightRadius: DIMENSION.BORDER_BOTTOM_LEFT_RADIUS,
        borderBottomLeftRadius: DIMENSION.BORDER_BOTTOM_LEFT_RADIUS,
        flexDirection: "column",
        paddingVertical: PD.PADDING_6,
        paddingHorizontal: PD.PADDING_6
    },
    boxTitle: {
        flexDirection: "column",
        height: DEVICE.DEVICE_HEIGHT * 0.23
    },
    titleModelCancel: {
        color: "#000",
        fontSize: responsiveFontSize(3.25),
        fontFamily: FONT_SF.BOLD
    },
    contentModelCancel:{ color: "#998FA2", fontSize: responsiveFontSize(2.25) },
    btnCancel:{
        backgroundColor: "#9599B3",
        marginRight: PD.PADDING_3
    }
});
export default styles;
