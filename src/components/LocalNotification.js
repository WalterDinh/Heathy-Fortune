import React, { PureComponent, Component } from "react";
import { connect } from "react-redux";
import { View, Animated, StatusBar, Platform, Text } from "react-native";
import { DIMENSION, DEVICE, PD } from "../helper/Consts";
import { AppText, AppImage } from "components";
import { FONT_SF } from "assets";
import { responsiveFontSize } from "react-native-responsive-dimensions";
import { localNotificationActions } from "actions";
import { OPEN_LOCAL_NOTIFICATION } from "actions/types";
import { TouchableOpacity } from "react-native-gesture-handler";
// import Row from "react-native-camera-roll-picker/Row";
// import { on } from "cluster";

const { STATUS_BAR_HEIGHT } = DIMENSION;
const POSITION = DEVICE.DEVICE_HEIGHT * 0.15 + STATUS_BAR_HEIGHT;
const DEFAULT_AVATAR = "https://i.imgur.com/Htnp2Ra.png";
const AVATAR_SIZE = DEVICE.DEVICE_WIDTH * 0.096;
const AVATAR_SIZE_RADIUS = AVATAR_SIZE * 0.5;

const _ = require("lodash");
class LocalNotification extends PureComponent {
    constructor(props) {
        super(props);
        this.state = {
            translateY: new Animated.Value(-POSITION),
            endNotification: false,
            data: "",
            title: ""
            // title: {
            //     name: "",
            //     group_name: ""
            // }
        };
    }
    componentDidMount() {
        this.props.onRef(this);
    }

    openNoti(data, body, title, onPress) {
        console.log("titleasas", body);
        // Platform.OS == "ios" && StatusBar.setHidden(true, "fade");
        this.setState({ endNotification: false, data, body, title, onPress }, () => {
            Animated.spring(this.state.translateY, {
                toValue: 0,
                duration: 1000,
                useNativeDriver: true
            }).start();
        });
        if (this.close) {
            clearTimeout(this.close);
        }

        this.close = setTimeout(() => {
            this.closeNoti();
        }, 3000);
    }

    closeNoti() {
        // Platform.OS == "ios" && StatusBar.setHidden(false, "slide");
        this.setState({ endNotification: true }, () => {
            Animated.spring(this.state.translateY, {
                toValue: -POSITION,
                duration: 1000,
                useNativeDriver: true
            }).start();
        });
    }

    componentWillUnmount() {}
    notificationChat(name, avatar, body, title) {
        const { endNotification } = this.state;

        return (
            <View style={{ flexDirection: "row", alignItems: "center" }}>
                <AppImage
                    source={{ uri: !_.isEmpty(avatar) ? avatar : DEFAULT_AVATAR }}
                    resizeMode="cover"
                    style={styles.avatarItem}
                />
                <View style={{ flexDirection: "column", alignItems: "flex-start" }}>
                    <AppText
                        numberOfLines={1}
                        text={title}
                        style={[styles.title, endNotification && { color: "transparent" }]}
                    />
                    <AppText
                        numberOfLines={1}
                        text={body}
                        style={[styles.content, endNotification && { color: "transparent" }]}
                    />
                </View>
            </View>
        );
    }
    render() {
        const { reminder, userReduser } = this.props;
        const { endNotification } = this.state;
        const { data, body, title, onPress } = this.state;
        console.log("const", data, body, title);
        // let name = title.name;
        // let group_name = title.group_name;
        // console.log("name, group_name", name, group_name);
        // if (!_.isEmpty(title)) {
        //     let a = JSON.parse(title).last_name;
        // }
        return !reminder ? (
            <Animated.View style={[styles.container, { transform: [{ translateY: this.state.translateY }] }]}>
                <TouchableOpacity
                    onPress={() => {
                        // !_.isEmpty(onPress)
                        //     ? onPress()
                        //     : setTimeout(() => {
                        //           this.closeNoti();
                        //       }, 300);
                        onPress();
                    }}
                >
                    {this.notificationChat(data.last_name, data.img_url, body, title)}
                </TouchableOpacity>
            </Animated.View>
        ) : (
            <Animated.View style={[styles.container, { transform: [{ translateY: this.state.translateY }] }]}>
                <TouchableOpacity
                    onPress={() => {
                        this.closeNoti();
                    }}
                >
                    <View>
                        <AppText text={body} style={[styles.content, endNotification && { color: "transparent" }]} />
                    </View>
                </TouchableOpacity>
            </Animated.View>
        );
    }
}

function mapStateToProps(state) {
    return {
        localNoti: state.localNotificationReducer
    };
}
LocalNotification = connect(mapStateToProps)(LocalNotification);
export default LocalNotification;

const styles = {
    container: {
        position: "absolute",
        // marginTop: DIMENSION.STATUS_BAR_HEIGHT,
        // height: DEVICE.DEVICE_HEIGHT * 0.15,
        backgroundColor: "rgba(235,235,240,0.95)",
        width: DEVICE.DEVICE_WIDTH,
        shadowColor: "#cccccc",
        shadowOffset: { width: 0, height: 2 },
        shadowRadius: PD.PADDING_4,
        shadowOpacity: 0.5,
        // borderRadius: PD.PADDING_4,
        paddingHorizontal: PD.PADDING_4,
        marginTop: STATUS_BAR_HEIGHT,

        paddingVertical: PD.PADDING_2,
        paddingBottom: PD.PADDING_1,
        zIndex: 9999999
    },
    title: {
        fontFamily: FONT_SF.SEMIBOLD,
        fontSize: responsiveFontSize(2.1)
    },
    content: {
        fontFamily: FONT_SF.REGULAR,
        fontSize: responsiveFontSize(2),
        width: DEVICE.DEVICE_WIDTH * 0.9,
        lineHeight: responsiveFontSize(3.5)
    },
    avatarItem: {
        marginLeft: responsiveFontSize(2),
        marginRight: responsiveFontSize(1.5),
        width: AVATAR_SIZE,
        borderRadius: AVATAR_SIZE_RADIUS,
        height: AVATAR_SIZE
    }
};
