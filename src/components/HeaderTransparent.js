import React from "react";
import { View, StyleSheet, StatusBar } from "react-native";
import { connect } from "react-redux";
import { DIMENSION, DEVICE, PD } from "helper/Consts";
import { isIphoneX, getStatusBarHeight } from "react-native-iphone-x-helper";
import { Colors } from "helper";
import { Button, AppText } from "./index";
import { Icon } from "native-base";
import { responsiveFontSize } from "react-native-responsive-dimensions";
import { FONT_SF } from "assets";

const hitSlop = {
    top: PD.PADDING_2,
    bottom: PD.PADDING_2,
    left: PD.PADDING_2,
    right: PD.PADDING_2
};

const HEADER_HEIGHT = DIMENSION.HEADER_HEIGHT;

class HeaderTransparent extends React.Component {
    constructor(props) {
        super(props);
        this.state = {};
    }

    onPress = props => {
        const { navigation, onPressBack } = this.props;
        if (onPressBack) {
            console.log("press Back", onPressBack);
            onPressBack();
            return;
        }
        navigation.goBack();
    };

    render() {
        const { title, containerStyle, absolute = false, titleStyle, iconStyle } = this.props;
        return (
            <View style={[styles.container, absolute ? styles.absoluteStyle : null, containerStyle]}>
                <StatusBar translucent barStyle="light-content" backgroundColor="transparent" />
                <View style={styles.leftContent}>
                    <Button
                        centerContent={
                            <Icon
                                name="chevron-left"
                                style={[styles.icon, iconStyle]}
                                type={"MaterialCommunityIcons"}
                            />
                        }
                        style={styles.btn}
                        onPress={() => this.onPress()}
                    />
                </View>
                <View style={styles.centerContent}>
                    {title ? <AppText text={title} style={[styles.title, titleStyle]} /> : null}
                </View>
                <View style={styles.rightContent}></View>
            </View>
        );
    }
}

const styles = StyleSheet.create({
    container: {
        height: HEADER_HEIGHT + DIMENSION.STATUS_BAR_HEIGHT,
        width: DEVICE.DEVICE_WIDTH,
        paddingTop: DIMENSION.STATUS_BAR_HEIGHT,
        backgroundColor: "transparent",
        justifyContent: "space-between",
        flexDirection: "row"
    },
    leftContent: {
        width: DEVICE.DEVICE_WIDTH * 0.2,
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "flex-start"
    },
    centerContent: {
        width: DEVICE.DEVICE_WIDTH * 0.6,
        justifyContent: "center",
        alignItems: "center"
    },
    rightContent: {
        width: DEVICE.DEVICE_WIDTH * 0.2
    },
    icon: {
        paddingHorizontal: PD.PADDING_2,
        color: Colors.WHITE_COLOR,
        fontSize: responsiveFontSize(5)
    },
    btn: {
        backgroundColor: "transparent",
        height: "auto",
        paddingHorizontal: 0
    },
    title: {
        fontSize: responsiveFontSize(2.3),
        fontFamily: FONT_SF.BOLD,
        color: Colors.WHITE_COLOR
    },
    absoluteStyle: {
        position: "absolute",
        top: 0,
        zIndex: 1
    }
});

function mapStateToProps(state) {
    return {
        navigateReducer: state.navigateReducer
    };
}

HeaderTransparent = connect(mapStateToProps)(HeaderTransparent);
export default HeaderTransparent;
