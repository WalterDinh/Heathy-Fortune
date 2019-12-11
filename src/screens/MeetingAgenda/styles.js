import { StyleSheet } from "react-native";
import { PD, DEVICE } from "helper/Consts";
import { responsiveFontSize } from "react-native-responsive-dimensions";
import { Colors } from "helper";

const AVATAR_SIZE_WRAP = DEVICE.DEVICE_WIDTH * 0.11;
const AVATAR_SIZE = AVATAR_SIZE_WRAP - 4;

const styles = StyleSheet.create({
    item: {
        flex: 1,
        backgroundColor: Colors.Athens_Gray,
        borderTopRightRadius: PD.PADDING_6,
        borderBottomLeftRadius: PD.PADDING_6,
        marginRight: PD.PADDING_4,
        paddingHorizontal: PD.PADDING_3,
        paddingVertical: PD.PADDING_2,
        marginTop: PD.PADDING_3,
        minHeight: DEVICE.DEVICE_HEIGHT * 0.1
    },
    emptyDate: {
        flex: 1,
        backgroundColor: Colors.Bleached_Cedar,
        borderTopRightRadius: PD.PADDING_6,
        borderBottomLeftRadius: PD.PADDING_6,
        marginRight: PD.PADDING_4,
        paddingHorizontal: PD.PADDING_3,
        paddingVertical: PD.PADDING_3,
        marginTop: PD.PADDING_3
    },
    emptyText: {
        fontSize: responsiveFontSize(2),
        color: Colors.Revolver
    },
    timeText: {
        fontSize: responsiveFontSize(2),
        color: Colors.Revolver
    },
    titleText: {
        fontSize: responsiveFontSize(2),
        color: Colors.Revolver
    },
    avatarWrap: {
        height: AVATAR_SIZE_WRAP,
        width: AVATAR_SIZE_WRAP,
        borderRadius: AVATAR_SIZE_WRAP / 2,
        justifyContent: "center",
        alignItems: "center",
        position: "absolute"
    },
    avatar: {
        height: AVATAR_SIZE,
        width: AVATAR_SIZE,
        borderRadius: AVATAR_SIZE / 2
    },
    dayText: {
        textAlign: "center",
        fontSize: responsiveFontSize(3.5),
        color: Colors.WHITE_COLOR
    },
    monthText: {
        textAlign: "center",
        fontSize: responsiveFontSize(1.5),
        color: Colors.WHITE_COLOR
    }
});

export default styles;
