import React from "react";
import { Animated, StyleSheet, Modal, TouchableOpacity } from "react-native";
import { DEVICE, PD } from "helper/Consts";
import { Colors } from "helper";
import I18n from "helper/locales";
import _ from "lodash";

class AppModal extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            translateY: new Animated.Value(DEVICE.DEVICE_HEIGHT)
        };
    }

    render() {
        const { children, visible, onPress } = this.props;
        console.log("visible", visible);

        if (visible) {
            Animated.spring(this.state.translateY, {
                toValue: 0,
                duration: 1000,
                useNativeDriver: true
            }).start();
        } else {
            Animated.spring(this.state.translateY, {
                toValue: DEVICE.DEVICE_HEIGHT,
                duration: 1000,
                useNativeDriver: true
            }).start();
        }
        return (
            <Animated.View style={[styles.container, { transform: [{ translateY: this.state.translateY }] }]}>
                <TouchableOpacity style={styles.container} onPress={onPress}>
                    {children}
                </TouchableOpacity>
            </Animated.View>
        );
    }
}

export default AppModal;

const styles = StyleSheet.create({
    container: {
        position: "absolute",
        // backgroundColor: Colors.Dusty_Gray,
        width: DEVICE.DEVICE_WIDTH,
        // shadowColor: "#cccccc",
        // shadowOffset: { width: 0, height: 2 },
        // shadowRadius: PD.PADDING_4,
        // shadowOpacity: 0.5,
        // borderRadius: PD.PADDING_4,
        zIndex: 10,
        height: DEVICE.DEVICE_HEIGHT,
        top: 0,
        left: 0
    }
});
