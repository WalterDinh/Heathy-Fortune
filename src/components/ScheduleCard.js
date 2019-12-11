import React from "react";
import { TouchableOpacity, View, StyleSheet } from "react-native";
import { DEVICE, DIMENSION, PD } from "helper/Consts";
import { Colors } from "helper";
import { AppImage, AppText } from "components";
import { responsiveFontSize } from "react-native-responsive-dimensions";
import { FONT_SF } from "assets";

const RATIO = DEVICE.DEVICE_HEIGHT / DEVICE.DEVICE_WIDTH;
const HEIGHT = RATIO > 2 ? DEVICE.DEVICE_HEIGHT * 0.115 : DEVICE.DEVICE_HEIGHT * 0.13;
const AVATAR_SIZE = DEVICE.DEVICE_WIDTH * 0.11;
const AVATAR_SIZE_RADIUS = AVATAR_SIZE * 0.5;
const AVATAR_SIZE_WRAP = AVATAR_SIZE + 4;
const AVATAR_SIZE_WRAP_RADIUS = AVATAR_SIZE_WRAP * 0.5;
export default class ScheduleCard extends React.Component {
    constructor(props) {
        super(props);
        this.state = {};
    }
    renderLeftContent() {
        const { avatar } = this.props;
        return (
            <View style={styles.avatarWrap}>
                <AppImage source={avatar} style={styles.avatar} />
            </View>
        );
    }
    renderRightContent() {
        const { userName, time, title } = this.props;
        return (
            <View style={styles.rightContentWrap}>
                <View style={styles.topContent}>
                    <View style={styles.nameWrap}>
                        <AppText text={userName} style={styles.textContent} />
                    </View>
                    <View style={styles.timeWrap}>
                        <AppText text={time} style={styles.textContent} />
                    </View>
                </View>
                <View style={styles.bottomContent}>
                    <AppText text={title} style={styles.titleContent} />
                </View>
            </View>
        );
    }
    render() {
        return (
            <TouchableOpacity style={styles.container}>
                <View style={styles.contentWrap}>
                    <View style={styles.content}>
                        <View style={styles.leftContent}>{this.renderLeftContent()}</View>
                        <View style={styles.rightContent}>{this.renderRightContent()}</View>
                    </View>
                </View>
            </TouchableOpacity>
        );
    }
}

const styles = StyleSheet.create({
    container: {
        height: HEIGHT
    },
    contentWrap: {
        flex: 1,
        backgroundColor: Colors.Victoria
    },
    content: {
        flex: 1,
        flexDirection: "row",
        borderBottomLeftRadius: DIMENSION.BORDER_BOTTOM_LEFT_RADIUS,
        backgroundColor: Colors.Victoria,
        borderBottomWidth: 0.5,
        borderLeftWidth: 0.5,
        borderRightWidth: 0.5,
        borderColor: Colors.Athens_Gray
    },
    leftContent: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center"
    },
    avatarWrap: {
        height: AVATAR_SIZE_WRAP,
        width: AVATAR_SIZE_WRAP,
        borderRadius: AVATAR_SIZE_WRAP_RADIUS,
        backgroundColor: Colors.WHITE_COLOR,
        justifyContent: "center",
        alignItems: "center"
    },
    avatar: {
        height: AVATAR_SIZE,
        width: AVATAR_SIZE,
        borderRadius: AVATAR_SIZE_RADIUS
    },
    rightContent: {
        flex: 3
    },
    rightContentWrap: {
        flex: 1
    },
    nameWrap: {
        flex: 1.2
    },
    timeWrap: {
        flex: 1
    },
    textContent: {
        color: Colors.Athens_Gray,
        fontSize: responsiveFontSize(1.9)
    },

    topContent: {
        flex: 1,
        flexDirection: "row",
        alignItems: "flex-end"
    },
    bottomContent: {
        flex: 1.3,
        flexDirection: "row",
        paddingRight: "20%"
    },
    titleContent: {
        fontFamily: FONT_SF.BOLD,
        color: Colors.WHITE_COLOR,
        fontSize: responsiveFontSize(2.2)
    }
});
