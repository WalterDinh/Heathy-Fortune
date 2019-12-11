import React from "react";
import { View, Text, Button, Input, Image, FlatList, StyleSheet, TouchableOpacity } from "react-native";
import FacePile from "react-native-face-pile";
import { DIMENSION, DEVICE, PD } from "helper/Consts";
import { Colors } from "helper";
import { responsiveFontSize } from "react-native-responsive-dimensions";
import { ButtonCircle, AppText, AppImage, ScheduleCard } from "./index";
import { FONT_SF } from "assets";
import { Icon } from "native-base";
import "moment/locale/vi";
import uuid from "uuid";
import { Snackbar } from "react-native-paper";

const _ = require("lodash");
const moment = require("moment");

const RATIO = DEVICE.DEVICE_HEIGHT / DEVICE.DEVICE_WIDTH;
const HEIGHT = RATIO > 2 ? DEVICE.DEVICE_HEIGHT * 0.115 : DEVICE.DEVICE_HEIGHT * 0.13;
const AVATAR_SIZE = DEVICE.DEVICE_WIDTH * 0.09;
const AVATAR_SIZE_RADIUS = AVATAR_SIZE * 0.5;
const AVATAR_SIZE_WRAP = AVATAR_SIZE + 4;
const AVATAR_SIZE_WRAP_RADIUS = AVATAR_SIZE_WRAP * 0.5;
const HEADER_HEIGHT = DEVICE.DEVICE_HEIGHT * 0.28;
const BORDER_RADIUS = DEVICE.DEVICE_WIDTH * 0.15;
export default class ItemListChat extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            selectedId: "1",
            loading: false
        };
    }

    renderLeftContent(senderInfo, index, item, lastIndex, checkEvent) {
        const { avatar, myProfile } = this.props;
        console.log("ssssssssssssssssss", senderInfo);
        return (
            <View style={[styles.avatarWrap, { borderColor: "#FFF" }]}>
                <AppImage
                    source={{
                        uri: _.isEmpty(senderInfo) ? "" : senderInfo[0].img_url
                    }}
                    style={styles.avatar}
                    resizeMode="cover"
                />
            </View>
        );
    }
    getSender = item => {
        const { userName, time, title, myProfile } = this.props;
        let sender = [];

        item.map(i => {
            if (i.id != myProfile.id) sender.push(i);
        });
        console.log("item", sender);
        return sender;
    };
    convertDate(appointment_time) {
        if (
            moment().unix() - moment(appointment_time).unix() > -172800 &&
            moment().unix() - moment(appointment_time).unix() < 172800
        ) {
            return moment(appointment_time).calendar();
            // .toUpperCase();
        } else {
            return moment(appointment_time).format("L");
            // .toUpperCase();
        }
    }
    renderRightContent(senderInfo, index, item, lastIndex, checkEvent) {
        const { userName, time, title, myProfile } = this.props;
        return (
            <View style={styles.rightContentWrap}>
                <View style={styles.topContent}>
                    <AppText
                        text={_.isEmpty(senderInfo) ? "" : senderInfo[0].last_name}
                        style={[styles.textContent, { color: Colors.Athens_Gray }]}
                    />
                    <AppText
                        text={
                            checkEvent
                                ? this.convertDate(item.appointment_time)
                                : this.convertDate(item.last_message_time)
                        }
                        style={[styles.textContent, { color: Colors.Athens_Gray, fontSize: responsiveFontSize(1.8) }]}
                    />
                </View>
                <View style={styles.bottomContent}>
                    <AppText
                        numberOfLines={2}
                        text={checkEvent ? item.title : item.last_message}
                        style={[
                            styles.titleContent,
                            {
                                color: "#FFF",
                                fontFamily: FONT_SF.BOLD
                            }
                        ]}
                    />
                </View>
            </View>
        );
    }

    renderItemA = (index, item, lastIndex) => {
        const { onClick } = this.props;
        console.log("csacascascascassc", item);
        let checkEvent = item.member ? true : false;
        let senderInfo = [];
        if (checkEvent) {
            senderInfo = this.getSender(item.member);
        } else {
            senderInfo = this.getSender(item.user);
        }

        return (
            <TouchableOpacity
                style={[
                    styles.boxAdvisory,
                    {
                        marginTop:
                            index == lastIndex ? -DEVICE.DEVICE_HEIGHT * 0.055 : (-DEVICE.DEVICE_HEIGHT * 0.3) / 1.1,
                        backgroundColor: !checkEvent ? Colors.MindNight : "#5F4591"
                    }
                ]}
                onPress={() => (checkEvent ? this._onPress(item) : this._onChat(item))}
            >
                <View style={{ width: "100%", height: "65%" }} />
                <View style={styles.contentAdvisory}>
                    <View style={styles.leftContent}>
                        {this.renderLeftContent(senderInfo, index, item, lastIndex, checkEvent)}
                    </View>
                    <View style={styles.rightContent}>
                        {this.renderRightContent(senderInfo, index, item, lastIndex, checkEvent)}
                    </View>
                </View>
            </TouchableOpacity>
        );
    };

    _onPress = item => {
        const { onPress = () => {} } = this.props;
        onPress(item);
    };
    _onChat = item => {
        const { onChat = () => {} } = this.props;
        onChat(item);
    };
    render() {
        const {
            backGroupColor,
            containerStyle,
            dataEventChat,
            dataChat,
            checkList,
            refreshing,
            onRefresh,
            onLoading
        } = this.props;

        const { selectedId, loading } = this.state;
        if (_.isEmpty(dataEventChat)) return null;
        return (
            <FlatList
                style={[styles.container, { containerStyle }]}
                data={dataEventChat}
                initialScrollIndex={dataEventChat.length < 5 ? 0 : dataEventChat.length - 1}
                getItemLayout={(dataEventChat, index) => ({
                    length: DEVICE.DEVICE_WIDTH,
                    offset: DEVICE.DEVICE_WIDTH * index,
                    index
                })}
                showsVerticalScrollIndicator={false}
                inverted
                keyExtractor={(item, index) => index.toString()}
                refreshing={loading}
                onRefresh={onRefresh}
                onEndReached={onLoading}
                onEndReachedThreshold={0.5}
                renderItem={({ item, index }) => this.renderItemA(index, item, dataEventChat.length - 1)}
            />
        );
    }
}
const styles = StyleSheet.create({
    contentWrap: {
        flex: 1,
        backgroundColor: Colors.Victoria,
        paddingTop: 50
    },
    container: {
        zIndex: 1
        // flexDirection: "column"
    },
    boxNoti: {
        width: "100%",
        height: DEVICE.DEVICE_HEIGHT * 0.4,
        borderBottomLeftRadius: DEVICE.DEVICE_HEIGHT * 0.1
    },
    boxAdvisory: {
        width: "100%",
        height: DEVICE.DEVICE_HEIGHT * 0.4,
        borderBottomLeftRadius: DEVICE.DEVICE_HEIGHT * 0.08,
        shadowColor: "rgba(193, 193, 193, 0.8)",
        shadowOffset: {
            width: 0,
            height: 0
        },
        shadowRadius: 3,
        shadowOpacity: 1,
        elevation: 2
    },
    contentAdvisory: {
        width: "100%",
        height: "40%",
        flexDirection: "row",
        alignItems: "flex-start",
        marginLeft: responsiveFontSize(5),
        paddingRight: 10
    },
    boxItemNoti: {
        flex: 2,
        marginLeft: 32,
        marginVertical: responsiveFontSize(3),
        paddingRight: 10,
        alignItems: "flex-start",
        justifyContent: "space-around"
        // marginBottom: 40
    },
    iconNoti: {
        position: "absolute",
        right: responsiveFontSize(3),
        bottom: responsiveFontSize(3.2),
        width: DEVICE.DEVICE_WIDTH * 0.165,
        height: DEVICE.DEVICE_WIDTH * 0.165,
        aspectRatio: 1
    },
    contentNoti: {
        fontSize: responsiveFontSize(3),
        lineHeight: responsiveFontSize(5.8),
        marginVertical: 0,
        fontFamily: FONT_SF.BOLD,
        color: Colors.WHITE_COLOR
    },
    leftContent: {
        height: "100%",
        width: "13%",
        paddingRight: 24,
        paddingBottom: responsiveFontSize(2.3),
        justifyContent: "center",
        alignItems: "center"
    },
    topTime: {
        fontSize: responsiveFontSize(1.3),
        lineHeight: responsiveFontSize(1.6),
        fontFamily: FONT_SF.SEMIBOLD,
        color: Colors.WHITE_COLOR
    },
    bottomFacePile: {
        flexDirection: "row",
        justifyContent: "flex-start",
        alignItems: "center"
    },
    avatarWrap: {
        height: AVATAR_SIZE_WRAP,
        width: AVATAR_SIZE_WRAP,
        borderRadius: AVATAR_SIZE_WRAP_RADIUS,
        borderWidth: responsiveFontSize(1),
        backgroundColor: Colors.WHITE_COLOR,
        justifyContent: "center",
        alignItems: "center"
    },
    textName: {
        paddingLeft: responsiveFontSize(1.5),
        fontSize: responsiveFontSize(1.5),
        fontFamily: FONT_SF.MEDIUM_ITALIC,
        color: Colors.WHITE_COLOR
    },
    avatar: {
        height: AVATAR_SIZE,
        width: AVATAR_SIZE,
        borderRadius: AVATAR_SIZE_RADIUS
    },
    rightContent: {
        height: "100%",
        width: "70%",
        marginRight: "17%"
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
        fontFamily: FONT_SF.MEDIUM,
        fontSize: responsiveFontSize(1.6)
    },

    topContent: {
        flex: 1,
        flexDirection: "row",
        alignItems: "flex-end",
        justifyContent: "space-between",
        paddingRight: "8%"
    },
    bottomContent: {
        flex: 1.3,
        flexDirection: "row",
        paddingRight: "10%"
    },
    titleContent: {
        lineHeight: responsiveFontSize(2.3),
        fontSize: responsiveFontSize(1.9)
    },
    boxIcon: {
        marginHorizontal: responsiveFontSize(0.5),
        width: AVATAR_SIZE,
        height: AVATAR_SIZE,
        borderRadius: AVATAR_SIZE_RADIUS,
        alignItems: "center",
        justifyContent: "center"
    },
    containerIcon: {
        flexDirection: "row",
        position: "absolute",
        right: responsiveFontSize(1.5),
        bottom: responsiveFontSize(1.5)
    }
});
