import { Const } from "helper/index";
import { DIMENSION, PD } from "helper/Consts";

const width = Const.DEVICE.DEVICE_WIDTH;
const height = Const.DEVICE.DEVICE_HEIGHT;

const styles = {
    inputsWrap: {
        width: "100%",
        paddingHorizontal: 40,
        marginTop: 0.05 * height
    },
    dropdown: {
        width: "100%",
        height: DIMENSION.INPUT_HEIGHT,
        borderRadius: 30,
        backgroundColor: "#fff",
        marginBottom: PD.PADDING_3,
        justifyContent: "center",
        paddingHorizontal: 25,
        flexDirection: "row",
        flex: 1
    }
};
export default styles;
