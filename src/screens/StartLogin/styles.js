import { StyleSheet } from "react-native";
import { PD, DEVICE } from "helper/Consts";
import { Colors } from "helper";

export default StyleSheet.create({
    mg: {
        marginVertical: PD.PADDING_2,
        width: DEVICE.DEVICE_WIDTH,
        alignItems: "center"
    },
    icon: {
        marginTop: DEVICE.DEVICE_HEIGHT * 0.175,
        height: 68,
        width: 68,
        alignSelf: "center"
    },
    btnLogin: {
        width: "90%",
        backgroundColor: Colors.Deluge
    },
    btnRegister: {
        width: "90%",
        backgroundColor: Colors.Hopbush
    }
});
