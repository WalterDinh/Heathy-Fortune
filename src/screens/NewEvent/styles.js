import { PD, DEVICE, DIMENSION } from "helper/Consts";
import { responsiveFontSize } from "react-native-responsive-dimensions";
import { Colors } from "helper";
import { FONT_SF } from "assets";
const AVATAR_SIZE = DEVICE.DEVICE_WIDTH * 0.096;
const AVATAR_SIZE_RADIUS = AVATAR_SIZE * 0.5;
const DEFAULT_AVATAR = "https://i.imgur.com/Htnp2Ra.png";
export default {
    dateView: {
        // flexDirection: "row",
        width: "100%",
        alignSelf: "center",
        marginTop: PD.PADDING_2
        // backgroundColor: "red"
    },
    btnCalender: {
        flex: 3,
        // marginRight: PD.PADDING_3,
        paddingHorizontal: DIMENSION.BUTTON_HEIGHT / 2,
        height: DIMENSION.BUTTON_HEIGHT,
        borderRadius: DIMENSION.BUTTON_RADIUS,
        justifyContent: "center",
        alignItems: "center",
        alignSelf: "center",
        // backgroundColor: Colors.Deluge,
        flexDirection: "row",
        fontFamily: FONT_SF.BOLD,
        backgroundColor: Colors.Dusty_Gray,
        // opacity: 0.5,
        flexDirection: "row",
        width: "100%"
    },
    text: {
        textAlign: "center",
        color: "white",
        fontSize: responsiveFontSize(2),
        fontFamily: FONT_SF.BOLD
    },
    titleField: {
        fontSize: responsiveFontSize(2.25),
        color: Colors.WHITE_COLOR,
        paddingBottom: PD.PADDING_2
    },
    tagContent: {
        flexDirection: "row",
        justifyContent: "space-evenly",
        width: "100%",
        flexWrap: "wrap",
        alignItems: "center",
        height: "auto",
        paddingHorizontal: 0,
        backgroundColor: Colors.Dusty_Gray,
        paddingVertical: PD.PADDING_3
    },
    tagWrap: {
        backgroundColor: Colors.Victoria,
        width: "44%",
        flexDirection: "row",
        justifyContent: "center",
        alignItems: "center",
        borderRadius: PD.PADDING_4,
        paddingVertical: PD.PADDING_2
    },
    inputWrap: {
        flexDirection: "row",
        justifyContent: "center",
        alignItems: "center",
        borderRadius: PD.PADDING_5,
        paddingHorizontal: PD.PADDING_2,
        borderBottomWidth: 1,
        borderColor: Colors.Athens_Gray
        // height: 45
    },
    icon: {
        color: Colors.Victoria,
        fontSize: responsiveFontSize(4)
    },
    avatarItem: {
        marginLeft: responsiveFontSize(2),
        marginRight: responsiveFontSize(1.5),
        width: AVATAR_SIZE,
        borderRadius: AVATAR_SIZE_RADIUS,
        height: AVATAR_SIZE
    },
    searchContainer: {
        // justifyContent: "center",
        // alignItems: "center",
        alignSelf: "center",
        backgroundColor: Colors.WHITE_COLOR,
        width: DEVICE.DEVICE_WIDTH * 0.9,
        borderRadius: PD.PADDING_4,
        flex: 1,
        marginTop: PD.PADDING_2
    },
    btnActive: {
        backgroundColor: Colors.Victoria,
        width: "100%",
        marginTop: PD.PADDING_6,
        marginBottom: PD.PADDING_6
    },
    container: {
        backgroundColor: Colors.Revolver,
        height: "100%",
        width: "100%"
    },
    boxDate: {
        flex: 3,
        flexDirection: "row",
        justifyContent: "center"
    },
    icon: {
        color: Colors.Mamba,
        fontSize: responsiveFontSize(3)
    },
    boxIcon: { justifyContent: "center", paddingRight: PD.PADDING_2 },
    title: {
        fontSize: responsiveFontSize(2.3),
        color: "#fff",
        // lineHeight: responsiveFontSize(2.3),
        alignContent: "center",
        fontFamily: FONT_SF.BOLD
    },
    boxTitle: {
        justifyContent: "center",
        flex: 6
    },
    containerTitle: {
        flexDirection: "row",
        marginTop: DEVICE.DEVICE_HEIGHT * 0.04
    },
    containerInput: {
        width: "100%",
        height: DIMENSION.BUTTON_HEIGHT,
        backgroundColor: Colors.Dusty_Gray,
        paddingHorizontal: PD.PADDING_3,
        borderRadius: DIMENSION.INPUT_RADIUS,
        marginTop: PD.PADDING_2
        // paddingVertical: PD.PADDING_1
    },
    containerDescription: {
        width: "100%",
        minHeight: DEVICE.DEVICE_HEIGHT * 0.12,
        backgroundColor: Colors.Dusty_Gray,
        paddingHorizontal: PD.PADDING_3,
        borderRadius: DIMENSION.INPUT_RADIUS,
        marginTop: PD.PADDING_2,
        paddingVertical: PD.PADDING_1
    },
    containerPrice: {
        width: "100%",
        height: DIMENSION.INPUT_HEIGHT,
        borderRadius: DIMENSION.INPUT_RADIUS,
        flexDirection: "row",
        marginTop: PD.PADDING_2,
        paddingHorizontal: PD.PADDING_3,
        backgroundColor: Colors.Dusty_Gray,
        justifyContent: "center",
        alignItems: "center"
    },
    inputPrice: {
        color: Colors.WHITE_COLOR,
        width: "100%",
        // flex: 6,
        textAlign: "left",
        fontSize: responsiveFontSize(2.5)
    },
    containerTime: {
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "flex-start",
        paddingBottom: PD.PADDING_2
    },
    
};
