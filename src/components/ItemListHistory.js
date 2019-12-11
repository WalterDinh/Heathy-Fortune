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
const AVATAR_SIZE = DEVICE.DEVICE_WIDTH * 0.096;
const AVATAR_SIZE_RADIUS = AVATAR_SIZE * 0.5;
const AVATAR_SIZE_WRAP = AVATAR_SIZE + 4;
const AVATAR_SIZE_WRAP_RADIUS = AVATAR_SIZE_WRAP * 0.5;
const DEFAULT_AVATAR = "https://i.imgur.com/Htnp2Ra.png";
export default class ItemListHistory extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            loading: false
        };
    }
    renderLeftContent(senderInfo, index, data, lastIndex) {
        const { avatar, myProfile } = this.props;
        console.log("ssssssssssssssssss", senderInfo);
        return (
            <View style={[styles.avatarWrap, { borderColor: "#FFF" }]}>
                <AppImage
                    source={{
                        uri: !_.isEmpty(senderInfo) ? senderInfo[0].img_url : DEFAULT_AVATAR
                    }}
                    style={styles.avatar}
                    resizeMode="cover"
                />
            </View>
        );
    }

    getSender = item => {
        const { userName, time, title, myInfo } = this.props;
        let sender = [];
        item.map(i => {
            if (i.id != myInfo.id) sender.push(i);
        });
        console.log("item", sender);
        return sender;
    };

    checkStatus = status => {
        switch (status) {
            case 0:
                return { color: Colors.Bittersweet, text: "Quá hẹn" };
            case 1:
                return { color: Colors.ORANGE, text: "Chưa xác nhận" };
            case 2:
                return { color: Colors.GREEN_COLOR, text: "Hoàn thành" };
            case 3:
                return { color: Colors.Alizarin_Crimson, text: "Đã hủy" };
        }
    };
    renderRightContent(senderInfo, index, data, lastIndex) {
        const { userName, time, title, myProfile } = this.props;
        console.log("cacsacsacssacssc", senderInfo);
        return (
            <View style={styles.rightContentWrap}>
                <View style={styles.topContent}>
                    <AppText
                        text={!_.isEmpty(senderInfo) ? senderInfo[0].last_name : null}
                        style={[styles.textContent, { color: Colors.Athens_Gray }]}
                    />
                    <AppText
                        text={moment(data.appointment_time).format("L")}
                        style={[styles.textContent, { color: Colors.Athens_Gray, fontSize: responsiveFontSize(1.8) }]}
                    />
                </View>
                <View style={styles.bottomContent}>
                    <AppText
                        numberOfLines={2}
                        text={data.title}
                        style={[
                            styles.titleContent,
                            {
                                color: "#FFF",
                                fontFamily: FONT_SF.BOLD
                            }
                        ]}
                    />
                    <AppText
                        text={this.checkStatus(data.status).text}
                        style={[
                            styles.textContent,
                            { color: this.checkStatus(data.status).color, fontSize: responsiveFontSize(1.8) }
                        ]}
                    />
                </View>
            </View>
        );
    }
    _onPress = item => {
        const { onPress = () => {} } = this.props;
        onPress(item);
    };
    render() {
        const { data, index, lastIndex } = this.props;
        return (
            <TouchableOpacity
                style={[
                    styles.boxAdvisory,
                    {
                        marginTop:
                            index == lastIndex ? -DEVICE.DEVICE_HEIGHT * 0.055 : (-DEVICE.DEVICE_HEIGHT * 0.3) / 1.1
                    }
                ]}
                onPress={() => this._onPress(data)}
            >
                <View style={{ width: "100%", height: "65%" }} />
                <View style={styles.contentAdvisory}>
                    <View style={styles.leftContent}>
                        {this.renderLeftContent(this.getSender(data.member), index, data, lastIndex)}
                    </View>
                    <View style={styles.rightContent}>
                        {this.renderRightContent(this.getSender(data.member), index, data, lastIndex)}
                    </View>
                </View>
            </TouchableOpacity>
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
        backgroundColor: Colors.Revolver,
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
        paddingRight: "10%",
        justifyContent: "space-between"
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
