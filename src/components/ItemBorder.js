import React from "react";
import {
    View,
    Text,
    Button,
    Input,
    Image,
    FlatList,
    StyleSheet,
    TouchableOpacity,
    ActivityIndicator,
    Alert
} from "react-native";
import FacePile from "react-native-face-pile";
import { DIMENSION, DEVICE, PD } from "helper/Consts";
import { Colors } from "helper";
import { responsiveFontSize } from "react-native-responsive-dimensions";
import { ButtonCircle, AppText, AppImage, ScheduleCard } from "./index";
import { FONT_SF } from "assets";
import { Icon } from "native-base";
import "moment/locale/vi";
import uuid from "uuid";

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
export default class ItemBorder extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            selectedId: "1",
            loading: false
        };
    }
    ramdomColor = listEvent => {
        const colorArray = [
            Colors.Limed_Spruce,
            Colors.Gray_Chateau,
            Colors.MindNight,
            Colors.RoyalBlue,
            Colors.Malibu,
            Colors.BackForest,
            Colors.VidaLoca,
            Colors.DarkKhaki,
            Colors.Revolver,
            Colors.Deluge,
            Colors.Salem
        ];
        let a = [];
        const list = _.chunk(listEvent, colorArray.length - 1);
        for (let i = 0; i < list.length; i++) {
            for (let j = 0; j < list[i].length; j++) {
                const itemEvent = { ...list[i][j], color: colorArray[j] };
                a.push(itemEvent);
            }
        }
        return a;
    };

    listAvartarMember = listMember => {
        let list = [];
        const a = listMember.map((n, index) => {
            let id = uuid.v4();
            if (!_.isEmpty(n.img_url)) {
                list.push({ id, imageUrl: n.img_url });
            }
            return list;
        });
        return list;
    };
    _onCall(item) {
        const { onCall = () => {} } = this.props;
        onCall(item);
    }
    _onPress(item) {
        const { onPress = () => {} } = this.props;
        onPress(item);
    }
    _onChat(item) {
        const { onChat = () => {} } = this.props;
        onChat(item);
    }
    _onCancel(item) {
        const { onCancel = () => {} } = this.props;
        onCancel(item);
    }
    confirm(data) {
        Alert.alert(
            "Xác nhận",
            "Bạn có chắc muốn huỷ cuộc hẹn",
            [
                // { text: "Ask me later", onPress: () => console.log("Ask me later pressed") },
                {
                    text: "Cancel",
                    onPress: () => console.log("Cancel Pressed"),
                    style: "cancel"
                },
                { text: "OK", onPress: () => this._onCancel(data) }
            ],
            { cancelable: false }
        );
    }
    convertDate(appointment_time) {
        if (
            moment().unix() - moment(appointment_time).unix() > -172800 &&
            moment().unix() - moment(appointment_time).unix() < 172800
        ) {
            return moment(appointment_time)
                .calendar()
                .toUpperCase();
        } else {
            return moment(appointment_time)
                .format("DD-MM-YYYY")
                .toUpperCase();
        }
    }

    renderItem = (index, item, lastIndex) => {
        return (
            <TouchableOpacity
                activeOpacity={0.98}
                style={[
                    styles.boxNoti,
                    {
                        backgroundColor: item.color,
                        marginTop:
                            index == lastIndex ? -DEVICE.DEVICE_HEIGHT * 0.03 : (-DEVICE.DEVICE_HEIGHT * 0.3) / 2.2
                    }
                ]}
                onPress={() => this._onPress(item)}
            >
                <AppImage source={require("../assets/icon.png")} resizeMode="contain" style={styles.iconNoti} />

                <View style={{ flex: 1 }} />
                <View style={styles.boxItemNoti}>
                    <View style={{ marginTop: responsiveFontSize(2) }}>
                        <View style={styles.containerTime}>
                            {moment().unix() - moment(item.appointment_time).unix() > -172800 &&
                            moment().unix() - moment(item.appointment_time).unix() < 172800 ? (
                                <AppText text={this.convertDate(item.appointment_time)} style={styles.topTime} />
                            ) : (
                                <AppText
                                    text={`${moment(item.appointment_time)
                                        .format("LT")
                                        .toUpperCase()} `}
                                    style={styles.appointment_time}
                                >
                                    <AppText text={this.convertDate(item.appointment_time)} style={styles.topTime} />
                                </AppText>
                            )}
                        </View>
                        <AppText text={item.title} numberOfLines={2} style={styles.contentNoti} />
                    </View>
                    <View style={{ flexDirection: "row", justifyContent: "space-between", width: "100%" }}>
                        <TouchableOpacity style={styles.bottomFacePile}>
                            <FacePile
                                numFaces={2}
                                faces={_.uniqBy(this.listAvartarMember(item.member), "id")}
                                hideOverflow
                                circleSize={responsiveFontSize(2)}
                                containerStyle={{ marginHorizontal: 8 }}
                            />
                            <AppText
                                text={
                                    item.member[1]
                                        ? `${item.member[0].last_name},${item.member[1].last_name}`
                                        : `${item.member[0].last_name}`
                                }
                                style={styles.textName}
                            />
                        </TouchableOpacity>
                        <View style={styles.containerIcon}>
                            {moment().unix() - moment(item.appointment_time).unix() > 0 &&
                            moment().unix() - moment(item.appointment_end_time).unix() < 0 ? (
                                <TouchableOpacity
                                    hitSlop={{ top: 10, left: 10, right: 10, bottom: 10 }}
                                    style={[styles.boxIcon, { backgroundColor: Colors.Victoria }]}
                                    onPress={() => this._onCall(item)}
                                >
                                    <Icon name="md-call" style={{ color: "white", fontSize: responsiveFontSize(3) }} />
                                </TouchableOpacity>
                            ) : null}
                            <TouchableOpacity
                                hitSlop={{ top: 10, left: 10, right: 10, bottom: 10 }}
                                style={[styles.boxIcon, { backgroundColor: Colors.Hopbush, zIndex: 1 }]}
                                onPress={() => this._onChat(item)}
                            >
                                <Icon
                                    name="md-chatbubbles"
                                    style={{ color: "white", fontSize: responsiveFontSize(3) }}
                                />
                            </TouchableOpacity>
                            {moment(item.appointment_time).unix() - 1800 > moment().unix() && (
                                <TouchableOpacity
                                    hitSlop={{ top: 10, left: 10, right: 10, bottom: 10 }}
                                    // disabled={moment(item.appointment_time).unix() - 1800 < moment().unix()}
                                    onPress={() => this._onCancel(item)}
                                    style={[styles.boxIcon, { backgroundColor: Colors.Alizarin_Crimson }]}
                                >
                                    <Icon name="md-close" style={{ color: "white", fontSize: responsiveFontSize(3) }} />
                                </TouchableOpacity>
                            )}
                        </View>
                    </View>
                </View>
            </TouchableOpacity>
        );
    };

    renderFooter() {
        const { loading } = this.props;
        if (!loading) return null;
        return <ActivityIndicator style={{ color: "#000" }} />;
    }

    render() {
        const { backGroupColor, containerStyle, data, checkList, refreshing, onRefresh, onLoadMore } = this.props;

        const { selectedId, loading } = this.state;
        const listEvent = _.orderBy(data, ["id"], ["asc"]);
        return (
            <FlatList
                style={[styles.container, { containerStyle }]}
                data={this.ramdomColor(data)}
                initialScrollIndex={data.length == 2 || data.length == 3 ? 0 : data.length - 1}
                getItemLayout={(data, index) => ({
                    length: DEVICE.DEVICE_WIDTH,
                    offset: DEVICE.DEVICE_WIDTH * index,
                    index
                })}
                showsVerticalScrollIndicator={false}
                inverted
                keyExtractor={(item, index) => index.toString()}
                refreshing={loading}
                onRefresh={onLoadMore}
                renderItem={({ item, index }) => this.renderItem(index, item, data.length - 1)}
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
        // backgroundColor: "white"
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
        marginLeft: responsiveFontSize(5),
        paddingRight: 10

        // justifyContent: "center"
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
        fontSize: responsiveFontSize(2.5),
        // lineHeight: responsiveFontSize(5.8),
        marginVertical: 0,
        fontFamily: FONT_SF.BOLD,
        color: Colors.WHITE_COLOR
    },
    leftContent: {
        height: "100%",
        width: "13%",
        paddingRight: 24,
        paddingBottom: responsiveFontSize(1.3),
        justifyContent: "center",
        alignItems: "center"
    },
    topTime: {
        fontSize: responsiveFontSize(1.6),
        // lineHeight: responsiveFontSize(1.8),
        // paddingLeft: responsiveFontSize(0.5),
        fontFamily: FONT_SF.SEMIBOLD,
        color: Colors.WHITE_COLOR
    },
    appointment_time: {
        fontSize: responsiveFontSize(3.25),
        // lineHeight: responsiveFontSize(3.25),
        paddingRight: responsiveFontSize(1),
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
    // titleContent: {
    //     lineHeight: responsiveFontSize(1.9),
    //     fontSize: responsiveFontSize(1.9)
    // },
    boxIcon: {
        marginHorizontal: PD.PADDING_1,
        width: AVATAR_SIZE,
        height: AVATAR_SIZE,
        borderRadius: AVATAR_SIZE_RADIUS,
        alignItems: "center",
        justifyContent: "center",
        textAlign: "center",
        textAlignVertical: "center"
    },
    containerIcon: {
        flexDirection: "row",
        justifyContent: "flex-end",
        // position: "absolute",
        right: responsiveFontSize(1.5),
        // bottom: responsiveFontSize(1.5),
        zIndex: 1,
        height: AVATAR_SIZE
        // width: "100%",
        // backgroundColor: "green"
    },
    containerTime: {
        flexDirection: "row",
        justifyContent: "flex-start",
        alignItems: "flex-end"
    }
});
