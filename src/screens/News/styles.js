import { StyleSheet, Platform } from "react-native";
import { PD, DEVICE, DIMENSION } from "helper/Consts";
import { responsiveFontSize } from "react-native-responsive-dimensions";
import { Colors, GlobalStyles } from "helper";
import { FONT_SF } from "assets";

export default // StyleSheet.create(
{
    containerStyle: {
        flex: 1,
        backgroundColor: Colors.Athens_Gray,
        paddingHorizontal: DEVICE.DEVICE_WIDTH * 0.03,
        paddingTop: DEVICE.DEVICE_HEIGHT * 0.23
    },
    card: {
        borderRadius: DEVICE.DEVICE_WIDTH * 0.11,
        backgroundColor: "#fff",
        paddingHorizontal: DEVICE.DEVICE_WIDTH * 0.08,
        paddingVertical: DEVICE.DEVICE_HEIGHT * 0.05,
        flexDirection: "column",
        marginVertical: PD.PADDING_3
    },
    img: {
        height: DEVICE.DEVICE_HEIGHT * 0.17,
        width: "100%",
        borderBottomLeftRadius: DIMENSION.BORDER_BOTTOM_LEFT_RADIUS,
        borderBottomRightRadius: DEVICE.DEVICE_WIDTH * 0.03,
        borderTopRightRadius: DIMENSION.BORDER_BOTTOM_LEFT_RADIUS,
        borderTopLeftRadius: DEVICE.DEVICE_WIDTH * 0.03
    }
};
// );

// export default styles;
