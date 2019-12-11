import { StyleSheet, Platform } from "react-native";
import { PD, DEVICE, DIMENSION } from "helper/Consts";
import { responsiveFontSize } from "react-native-responsive-dimensions";
import { Colors, GlobalStyles } from "helper";
import { FONT_SF } from "assets";

const AVATAR_SIZE_WRAP = DEVICE.DEVICE_WIDTH * 0.1;
const AVATAR_SIZE = AVATAR_SIZE_WRAP - 4;
export default StyleSheet.create({
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
    boxContent: {
        marginTop: PD.PADDING_4,
        flexDirection: "column",
        width: "100%"
    },
    vote: {
        justifyContent: "flex-start",
        flexDirection: "column",
        width: "100%",
        marginBottom: 16
    },
    textVote: {
        color: Colors.TEXT_PAY,
        fontSize: 12,
        lineHeight: 18,
        fontWeight: "bold",
        marginBottom: 9
    },
    rating: {
        justifyContent: "flex-start",
        alignItems: "center",
        borderRadius: responsiveFontSize(0.2),
        padding: 3,
        width: "53%",
        backgroundColor: Colors.Dusty_Gray,
        flexDirection: "row"
    },
    distance: {
        color: Colors.WHITE_COLOR,
        fontSize: responsiveFontSize(2),
        fontWeight: "bold"
    },
    sendComent: {
        width: "100%"
    },
    textVote: {
        color: Colors.TEXT_PAY,
        fontSize: 12,
        lineHeight: 18,
        fontWeight: "bold",
        marginBottom: 9
    },
    inputContainer: {
        borderRadius: 10,
        width: "100%",
        height: 100,
        marginBottom: 5,
        marginTop: 5,
        backgroundColor: Colors.Dusty_Gray
    },
    inputs: {
        height: "100%",
        marginLeft: 20,
        flex: 1
    },
    buttonConfirm: {
        backgroundColor: Colors.Deluge,
        width: "100%",
        marginTop: PD.PADDING_6
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
    },
    detailWrap: {
        borderBottomWidth: 1,
        borderBottomColor: Colors.Mamba,
        width: "100%",
        marginTop: DEVICE.DEVICE_WIDTH * 0.1,
        paddingBottom: PD.PADDING_1
    },
    containerWrap: {
        flex: 1,
        marginTop: DIMENSION.NEW_HEADER_HEIGHT,
        paddingHorizontal: PD.PADDING_6
    },
    detailText: {
        fontSize: responsiveFontSize(2.75),
        color: Colors.Mamba,
        fontFamily: FONT_SF.BOLD
    },
    container: {
        backgroundColor: Colors.Revolver,
        flex: 1
    },
    itemTitle: {
        fontSize: responsiveFontSize(2.5),
        color: "#fff",
        // lineHeight: responsiveFontSize(2.5),
        alignContent: "center",
        fontFamily: FONT_SF.BOLD
    },
    itemIcon: {
        color: Colors.Mamba,
        fontSize: responsiveFontSize(3.25)
    },
    avatarWrap: {
        height: AVATAR_SIZE_WRAP,
        width: AVATAR_SIZE_WRAP,
        borderRadius: AVATAR_SIZE_WRAP / 2,
        justifyContent: "center",
        backgroundColor: Colors.WHITE_COLOR,
        alignItems: "center"
    },
    avatar: {
        height: AVATAR_SIZE,
        width: AVATAR_SIZE,
        borderRadius: AVATAR_SIZE / 2
    },
    avatarContainer: {
        flexDirection: "row",
        alignItems: "center",
        marginVertical: PD.PADDING_1
    },
    nameText: {
        fontSize: responsiveFontSize(2.2),
        color: Colors.Mamba
        // fontFamily: FONT_SF.BOLD
    },
    nameWrap: {
        paddingLeft: AVATAR_SIZE * 0.3
    },
    textDescription: {
        fontSize: responsiveFontSize(2),
        color: Colors.Mamba
        // fontFamily: FONT_SF.BOLD
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
    }
});

// export default styles;
