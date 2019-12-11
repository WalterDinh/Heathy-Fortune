import { StyleSheet } from "react-native";
import { Const, Colors } from "helper/index";
import { PD, DEVICE, DIMENSION } from "helper/Consts";
import { responsiveFontSize } from "react-native-responsive-dimensions";
const width = Const.DEVICE.DEVICE_WIDTH;
const height = Const.DEVICE.DEVICE_HEIGHT;

export default {
  boxList: { marginTop: (-DEVICE.DEVICE_HEIGHT * 0.3) / 1.1, zIndex: 2 }
};
