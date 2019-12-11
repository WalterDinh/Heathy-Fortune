import React from "react";
import { View, StyleSheet } from "react-native";
import { Spinner } from "native-base";
import { DEVICE } from "helper/Consts";
import { Colors } from "helper";

class AppSpinner extends React.Component {
    render() {
        const { show } = this.props;
        if (show) {
            return (
                <View style={styles.container}>
                    <Spinner color={Colors.WHITE_COLOR} />
                </View>
            );
        } else return null;
    }
}

const styles = StyleSheet.create({
    container: {
        position: "absolute",
        top: 0,
        left: 0,
        justifyContent: "center",
        alignItems: "center",
        width: DEVICE.DEVICE_WIDTH,
        height: DEVICE.DEVICE_HEIGHT,
        backgroundColor: "rgba(0, 0, 0, 0.5)"
    }
});

export default AppSpinner;
