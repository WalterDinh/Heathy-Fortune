import React from "react";
import { View, Platform, TouchableOpacity, ActivityIndicator } from "react-native";
import { AppText, AppImage } from "components";
import { PD, DEVICE, CHAT_TYPE } from "helper/Consts";
import { Images, FONT_SF } from "assets";
import { responsiveFontSize } from "react-native-responsive-dimensions";
import { Colors } from "helper";
import FastImage from "react-native-fast-image";
import { covertMessage } from "./Functions";
import { Icon } from "native-base";
// import { TouchableOpacity } from "react-native-gesture-handler";
const moment = require("moment");
const AVATAR =
    "https://firebasestorage.googleapis.com/v0/b/yo-learner-test.appspot.com/o/yo-learn-avatar%2Fdefault_avatar.png?alt=media&token=fa92022d-e2ae-421d-a23f-04eef8f5a1df";

const HEIGHT =
    DEVICE.DEVICE_HEIGHT / DEVICE.DEVICE_WIDTH < 2 ? DEVICE.DEVICE_HEIGHT * 0.12 : DEVICE.DEVICE_HEIGHT * 0.11;
const WIDTH = DEVICE.DEVICE_WIDTH;
const WIDTH_M = WIDTH - PD.PADDING_4;
const OUTLINE_SIZE = WIDTH_M * 0.18;
const AVATAR_SIZE = OUTLINE_SIZE - 8;

const compareDate = time => {
    let today = moment().utc(new Date());
    let inToday =
        today.utc().isSame(moment.utc(time), "date") &&
        today.utc().isSame(moment.utc(time), "month") &&
        today.utc().isSame(moment.utc(time), "year");

    if (inToday) {
        return moment
            .utc(time)
            .local()
            .format("HH:mm");
    } else {
        return moment
            .utc(time)
            .local()
            .format("DD-MM-YY");
    }
};

const CardAvatar = (
    props = {
        onPress,
        onLongPress,
        source,
        online,
        groupName,
        lastMessage,
        time,
        unreadMessage,
        chatRoom,
        userId,
        messageType,
        notificationSilent,
        loadingNotiSilent
    }
) => {
    let {
        onPress = () => {},
        onLongPress = () => {},
        source = AVATAR,
        online = true,
        groupName = "",
        lastMessage = "",
        time = "",
        unreadMessage = "",
        chatRoom = {},
        userId = -1,
        messageType = 0,
        notificationSilent,
        loadingNotiSilent
    } = props;
    let timeShow = compareDate(time);
    let message = covertMessage(messageType, chatRoom, lastMessage, userId);
    return (
        <TouchableOpacity onPress={() => onPress()} onLongPress={() => onLongPress()} style={styles.container}>
            <View style={styles.content}>
                <View style={styles.leftContent}>
                    {online ? <Online /> : <Offline />}
                    <View style={styles.imageOutLine}>
                        <AppImage source={{ uri: source }} style={styles.image} resizeMode="cover" />
                    </View>
                </View>
                <View style={styles.centerContent}>
                    <View style={{ height: HEIGHT, justifyContent: "center" }}>
                        <AppText numberOfLines={1} text={groupName} style={[styles.groupName]} />
                        <AppText
                            numberOfLines={2}
                            text={message}
                            style={[
                                styles.groupMessage,
                                unreadMessage > 0 ? { fontFamily: FONT_SF.MEDIUM, color: "#000" } : {}
                            ]}
                        />
                    </View>
                </View>
                <View style={styles.rightContent}>
                    <View style={{ height: OUTLINE_SIZE }}>
                        <View style={styles.timeWrap}>
                            <AppText text={timeShow} style={styles.time} />
                        </View>
                        <View style={styles.badgetWrap}>
                            {unreadMessage > 0 && (
                                <View style={styles.badget}>
                                    <AppText text={unreadMessage} style={styles.badgetText} />
                                </View>
                            )}
                            {notificationSilent && !loadingNotiSilent && (
                                <View style={styles.silent}>
                                    <View style={styles.badgetWrap}>
                                        <Icon
                                            name="ios-notifications-off"
                                            style={{
                                                color: "lightgrey",
                                                fontSize: responsiveFontSize(4),
                                                paddingLeft: PD.PADDING_1
                                            }}
                                        />
                                    </View>
                                </View>
                            )}
                            {loadingNotiSilent && (
                                <View style={styles.silent}>
                                    <View style={styles.badgetWrap}>
                                        <ActivityIndicator size="small" color="lightgrey" />
                                    </View>
                                </View>
                            )}
                        </View>
                    </View>
                </View>
            </View>
        </TouchableOpacity>
    );
};

const Online = (props = {}) => {
    return (
        <View style={styles.onlineDotOutline}>
            <View style={{ height: 12, width: 12, borderRadius: 6, backgroundColor: "#90bd3f" }} />
        </View>
    );
};

const Offline = (props = {}) => {
    return (
        <View style={styles.offlineDotOutline}>
            <View style={{ height: 12, width: 12, borderRadius: 6, backgroundColor: "#9d9d9d" }} />
        </View>
    );
};

const styles = {
    container: {
        width: WIDTH,
        height: HEIGHT,
        justifyContent: "center",
        backgroundColor: Colors.CONTENT_COLOR
    },
    content: {
        marginLeft: PD.PADDING_4,
        flexDirection: "row",
        borderBottomWidth: 1,
        borderColor: Colors.WHITE_COLOR
    },
    imageOutLine: {
        height: OUTLINE_SIZE,
        width: OUTLINE_SIZE,
        borderRadius: WIDTH_M * 0.09,
        padding: 8,
        backgroundColor: "rgba(255,255,255,0.5)",
        alignItems: "center",
        justifyContent: "center",
        overflow: "hidden"
    },
    image: {
        height: AVATAR_SIZE,
        width: AVATAR_SIZE,
        borderRadius: AVATAR_SIZE / 2
    },
    groupNameWrap: {
        justifyContent: "flex-start",
        alignItems: "flex-start"
    },
    groupName: {
        fontSize: responsiveFontSize(2.5),
        lineHeight: responsiveFontSize(3),
        fontFamily: FONT_SF.MEDIUM,
        color: Colors.BLACK_TEXT_COLOR
    },
    groupMessageWrap: {
        justifyContent: "flex-start",
        alignItems: "flex-start"
    },
    groupMessage: {
        fontSize: responsiveFontSize(2),
        lineHeight: responsiveFontSize(2.5),
        fontFamily: FONT_SF.REGULAR,
        color: "#999999"
    },
    leftContent: {
        width: WIDTH_M * 0.2,
        justifyContent: "center",
        lignItems: "flex-start",
        height: HEIGHT
    },
    centerContent: {
        width: WIDTH_M * 0.6,
        height: HEIGHT,
        justifyContent: "center"
    },
    rightContent: {
        width: WIDTH_M * 0.2,
        height: HEIGHT,
        alignItems: "center",
        justifyContent: "center"
    },

    badget: {
        backgroundColor: Colors.MAIN_COLOR,
        height: 25,
        width: 25,
        borderRadius: 12.5,
        alignItems: "center",
        justifyContent: "center"
    },
    timeWrap: {
        flex: 1,
        justifyContent: "center"
    },
    time: {
        fontSize: responsiveFontSize(1.8),
        color: Colors.MAIN_COLOR
    },
    badgetWrap: {
        flex: 1.5,
        justifyContent: "center",
        alignItems: "center",
        flexDirection: "row"
    },
    badgetText: {
        color: Colors.WHITE_COLOR
    },
    onlineDotOutline: {
        padding: 4,
        position: "absolute",
        height: 16,
        width: 16,
        borderRadius: 9,
        bottom: AVATAR_SIZE * 0.33,
        right: AVATAR_SIZE * 0.2,
        zIndex: 1,
        backgroundColor: "#ffffff",
        justifyContent: "center",
        alignItems: "center"
    },
    offlineDotOutline: {
        padding: 4,
        position: "absolute",
        height: 16,
        width: 16,
        borderRadius: 9,
        bottom: 0,
        right: AVATAR_SIZE * 0.1,
        zIndex: 1,
        backgroundColor: "#ffffff",
        justifyContent: "center",
        alignItems: "center"
    },
    silent: {
        zIndex: 3,
        // position: "absolute",
        // right: 0,
        height: HEIGHT
        // padding: 8,
        // paddingBottom: 8
    }
};

export default CardAvatar;
