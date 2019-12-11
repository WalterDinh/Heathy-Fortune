import React from "react";
import {
    View,
    ImageBackground,
    AsyncStorage,
    KeyboardAvoidingView,
    TouchableOpacity,
    RefreshControl,
    Platform
} from "react-native";
import { connect } from "react-redux";
import { Const, Helper, Colors } from "helper";
import { types, userActions, eventActions, chatActions, alertActions } from "actions/index";
import { getEventRequest, changeStatusEvent, eventSuccess, getEventSuccess } from "actions/eventActions";
import { Container, Button, AppImage, Input, HeaderApp, AppText, AppModal, ItemBorder } from "components";
import { DIMENSION, DEVICE, PD } from "helper/Consts";
import styles from "./styles";
import { ICON, FONT_SF, Images } from "assets";
import I18n from "helper/locales";
import { getMettingAgendaRequest } from "actions/meetingAgendaActions";
import { chatHistoriesAction } from "actions";
import { requestLogin } from "actions/loginActions";
import CountryPicker from "react-native-country-picker-modal";
import { responsiveFontSize } from "react-native-responsive-dimensions";
import { Header } from "react-navigation";
import { Fab, Icon } from "native-base";
import firebase from "firebase";
import _ from "lodash";
const moment = require("moment");
const width = Const.DEVICE.DEVICE_WIDTH;
const height = Const.DEVICE.DEVICE_HEIGHT;
import * as RNFirebase from "react-native-firebase";
import { navigateReducer } from "reducers/navigateReducer";

class Notification extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            listEvent: [],
            page: 1,
            loading: false,
            refreshing: false,
            showModel: false,
            showModelCall: false,
            dataEvent: {},
            member: [],
            titleEvent: ""
        };
        this.page = 1;
        props.dispatch(userActions.requestTag());
    }
    async componentWillMount() {
        // getChatRoomDetail(105).then(res => {
        //     console.log("response drawer", res);
        // });
        // this.checkPermission("microphone");
        // if (!!myId && type !== "LOGOUT" && !!userRe) {

        this.firebaseA = firebase
            .database()
            .ref(`video-call/${this.props.userReducer.data.id}`)
            .limitToLast(1)
            .on("child_added", childSnapshot => {
                let lastItem = childSnapshot.toJSON();
                const { to, caller, status } = lastItem;
                const userRe = this.props.userReducer || {};
                console.log("lastItem___________", lastItem);
                if (status === "dialing") {
                    const { data = {}, type = "" } = userRe;
                    const { id: myId = 0 } = data;
                    // getUserData()
                    if (to === myId && !!userRe && type !== "LOGOUT" && !!data) {
                        // const { settingReducer = {} } = this.props;
                        // const { data = {} } = settingReducer;
                        const data = {
                            soundCall: true,
                            vibrationCall: true,
                            onlineStatus: true
                        };
                        const { soundCall = true, vibrationCall = true, onlineStatus = true } = data;
                        // console.log("test reducer", settingReducer, soundCall, vibrationCall);
                        // if (!!settingReducer && onlineStatus) {
                        // ServiceHandle.get(`call_log_user/${userRe.data.id}/`)
                        //     .then(res => {
                        //         if (!res.error) {
                        //             lastItem.isRingtone = soundCall;
                        //             lastItem.isCallVibration = vibrationCall;
                        this.props.navigation.push("IncomingCall", {
                            callData: lastItem
                        });
                        //         }
                        //     })
                        //     .catch(e => {
                        //         console.log("error get call", e);
                        //     });
                        // }
                    }
                }
                if (status === "finished" && !!userRe && !!userRe.data) {
                    // firebase
                    //     .database()
                    //     .ref(`video-call/${userRe.data.id}`)
                    //     .remove();
                }
            });
    }

    componentDidMount() {
        const { userReducer, dispatch } = this.props;
        console.log("userReducer", userReducer);
        // this.setReminder();

        dispatch(eventActions.eventRequest({ page1: this.page }));
    }
    componentDidUpdate(prevProps) {
        const { eventReducer, dispatch, navigation, chatReducer, userReducer, navigateReducer } = this.props;
        const { refreshing, loading, listEvent,showModelCall } = this.state;
        console.log("Chat");
        if (prevProps !== this.props) {

            if (eventReducer.type === types.GET_EVENT_SUCCESS) {
                this.setState({
                    listEvent: _.orderBy(eventReducer.eventActive.results, ["appointment_time"], ["asc"])
                });
            }
            if (navigateReducer.type === types.ON_NAVIGATE) {
                if (navigateReducer.screen === "Chat") {
                    navigation.navigate(navigateReducer.screen, {
                        id: navigateReducer.roomId.id,
                        chatRoomInfo: navigateReducer.roomId.chatRoomInfo
                    });
                } else if (navigateReducer.screen === "HistoryStack") {
                    navigation.navigate(navigateReducer.screen);
                } else if (navigateReducer.screen === "EventUncomfirmation") {
                    navigation.navigate(navigateReducer.screen);
                } else if (navigateReducer.screen === "Notification") {
                    navigation.navigate(navigateReducer.screen);
                } else if (navigateReducer.screen === "Notification" && !_.isEmpty(navigateReducer.roomId)) {
                    // navigation.navigate(navigateReducer.screen);
                    console.log("Chat2", navigateReducer.roomId,showModelCall);

                    this.setState({
                        dataEvent: navigateReducer.roomId.data,
                        member: navigateReducer.roomId.data.member,
                        showModelCall: true,
                        titleEvent: navigateReducer.roomId.data.title
                    });
                }
            }
            if (eventReducer.type === types.GET_EVENT_ACTIVE_SUCCESS) {
                this.setState({
                    listEvent: [...listEvent, ...eventReducer.dataEventActive.results]
                });
            }
            if (chatReducer.type === types.CREATE_GROUP_CHAT_SUCCESS) {
                console.log("chatReducer.data.response", chatReducer.data.response);

                navigation.navigate("Chat", {
                    id: chatReducer.data.response.id,
                    chatRoomInfo: chatReducer.data.response
                });
            }
            if (eventReducer.type === types.CANCEL_EVENT_SUCCESS) {
                dispatch(eventActions.eventRequest({ page1: 1 }));
            }
        }
    }

    callOnPress() {
        const { navigation, chatHistoriesReducer, userReducer } = this.props;
        const { member } = this.state;
        // console.log("chatRoomInfo", chatRoomInfo);
        const friendInfo = member.find(item => {
            return item.id !== userReducer.data.id;
        });
        console.log("friendInfo", friendInfo);

        const item = {
            avatar:
                "https://firebasestorage.googleapis.com/v0/b/yo-learner-test.appspot.com/o/yo-learn-avatar%2Fdefault_avatar.png?alt=media&token=fa92022d-e2ae-421d-a23f-04eef8f5a1df",
            // navigation.getParam("avatar"),
            nickname: friendInfo.last_name,
            calledId: friendInfo.id,
            of_user: userReducer.data.id,
            isVideo: false,
            from: "Chat",
            notificationId: friendInfo.device_id,
            friendType: friendInfo.type
        };
        console.log("item", item);

        navigation.navigate("Call", {
            item
        });
    }

    videoCallOnPress() {
        const { navigation, chatHistoriesReducer, userReducer } = this.props;
        const { member } = this.state;
        // console.log("chatRoomInfo", chatRoomInfo);
        const friendInfo = member.find(item => {
            return item.id !== userReducer.data.id;
        });
        console.log("friendInfo", friendInfo);
        const item = {
            avatar:
                "https://firebasestorage.googleapis.com/v0/b/yo-learner-test.appspot.com/o/yo-learn-avatar%2Fdefault_avatar.png?alt=media&token=fa92022d-e2ae-421d-a23f-04eef8f5a1df",
            // navigation.getParam("avatar"),
            nickname: friendInfo.last_name,
            calledId: friendInfo.id,
            of_user: userReducer.data.id,
            isVideo: true,
            from: "Chat",
            notificationId: friendInfo.device_id,
            friendType: friendInfo.type
        };
        navigation.navigate("Call", {
            item
        });
    }

    _refreshData() {
        const { navigation } = this.props;
        const time = navigation.getParam("time");
        if (_.isEmpty(time) || _.isUndefined(time)) {
            this._loadData(time);
        }
        console.log("datasda", time);
    }
    _onPressItem(item) {
        console.log("item", item);
        const { navigation } = this.props;
        navigation.navigate("DetailEvent", { item });
    }
    goNewEvent() {
        const { navigation } = this.props;
        navigation.navigate("NewEvent");
    }
    getSender = item => {
        const { userReducer } = this.props;
        let sender = [];

        item.member.map(i => {
            if (!_.isEmpty(i)) sender.push({ user_ids: i.id });
        });
        console.log("item", item);
        return sender;
    };
    _loadData(date) {
        const { day, month, year, dateString } = date;
        var endOfMonth = moment(dateString)
            .endOf("month")
            .format("DD");
        const { dispatch } = this.props;
        const param = {
            start_date: `${year}-${month}-01`,
            end_date: `${year}-${month}-${endOfMonth}`
        };
        dispatch(getMettingAgendaRequest(param));
    }
    getReceiver = item => {
        const { userReducer } = this.props;
        let sender = {};

        item.member.map(i => {
            if (userReducer.data.username !== i.username) sender = i;
        });
        return sender;
    };
    cancelNotification = async id => {
        try {
            const cancel = await RNFirebase.notifications().cancelNotification(id);
            console.log(cancel);
        } catch (e) {
            console.error(e);
        }
    };

    _onPressCancel(data) {
        console.log("dataaaaaaaaaa", data);
        const { dispatch, userReducer } = this.props;
        const params = {
            id: data.id,
            body: {
                status: 2
            }
        };
        dispatch(eventActions.eventRequest({ page1: this.page }));
        this.setState({ showModel: true });
        changeStatusEvent(params).then(res => {
            if (res.error) {
                paramsAlert = {
                    title: I18n.t("Alert.notice"),
                    content: I18n.t("detailEvent.onCancelError"),
                    type: Const.ALERT_TYPE.ERROR
                };
                dispatch(alertActions.openAlert(paramsAlert));
            } else {
                let content = {
                    notificationId: [userReducer.data.device_id, this.getReceiver(data).device_id],
                    noti: {
                        body: I18n.t("notification.cancelEventSuccess"),
                        title: "Thông báo"
                    },
                    message: {
                        avatar: userReducer.data.avatar,
                        sender: userReducer.data,
                        to: this.getReceiver(data),
                        type: "event"
                    }
                };
                chatHistoriesAction.sendNotiForOther(content);
            }
            dispatch(eventActions.eventRequest({ page1: 1 }));

            this.cancelNotification(`${data.id}`);
        });
    }
    _onChat(item) {
        const { userReducer, dispatch, eventReducer } = this.props;
        const param = {
            user_ids: this.getSender(item),
            name: item.title
        };
        console.log("_onChat", param);

        dispatch(chatActions.requestCreateGroupChat(param));
    }
    _onNextPage() {
        const { userReducer, dispatch, eventReducer } = this.props;
        const countPage = Math.ceil(eventReducer.eventActive.count / 10);

        console.log("userReducer", countPage);
        if (this.page < countPage) {
            this.page = this.page + 1;
            dispatch(eventActions.eventRequest({ page1: this.page, status: 1 }));
        }
    }
    onRefresh = () => {
        const { userReducer, dispatch, eventReducer } = this.props;
        const { refreshing } = this.state;
        this.page = 1;
        if (!refreshing) this.setState({ refreshing: true });
        dispatch(eventActions.eventRequest({ page1: this.page }));
    };

    onPressRelay() {
        const { dataEvent } = this.state;
        const { navigation } = this.props;
        this.setState({ showModel: false });
        console.log("==============================================");
        console.log("dataEventdataEventdataEventdataEvent", dataEvent);
        console.log("==============================================");
        navigation.navigate("NewEvent", { item: dataEvent });
    }
    renderAvartar() {
        const { userReducer } = this.props;
        const { member, dataEvent } = this.state;
        const friendInfo = member.find(item => {
            return item.id !== userReducer.data.id;
        });
        return (
            <View style={{ flexDirection: "row" }}>
                <View style={styles.avatarWrap}>
                    <AppImage
                        source={{
                            uri: !_.isEmpty(friendInfo) ? friendInfo.img_url : ""
                        }}
                        style={styles.avatar}
                        resizeMode="cover"
                    />
                </View>
                <View style={{ justifyContent: "space-between", paddingLeft: responsiveFontSize(1.8) }}>
                    <AppText text={!_.isEmpty(friendInfo) ? friendInfo.last_name : ""} style={styles.name} />
                    <AppText
                        text={moment(dataEvent.appointment_time)
                            .startOf("hour")
                            .fromNow()}
                        style={styles.time}
                    />
                </View>
            </View>
        );
    }
    renderModalCall() {
        const { showModelCall, dataEvent, titleEvent } = this.state;
        console.log("dadataEvent", dataEvent);
        return (
            <AppModal visible={showModelCall} onPress={() => this.setState({ showModelCall: false })}>
                <View style={styles.modelContainer}>
                    <View style={styles.boxModel}>
                        <AppText text={dataEvent.title} style={styles.titleModelCall} />
                        <View style={styles.line} />
                        <View style={styles.containerIcon}>
                            {this.renderAvartar()}
                            <View style={{ flexDirection: "row" }}>
                                <TouchableOpacity
                                    hitSlop={{ top: 10, left: 10, right: 10, bottom: 10 }}
                                    style={[styles.boxIcon, { backgroundColor: Colors.Victoria }]}
                                    onPress={() => this.callOnPress()}
                                >
                                    <Icon name="md-call" style={styles.icon} />
                                </TouchableOpacity>

                                <TouchableOpacity
                                    hitSlop={{ top: 10, left: 10, right: 10, bottom: 10 }}
                                    style={[styles.boxIcon, { backgroundColor: Colors.Hopbush, zIndex: 1 }]}
                                    onPress={() => this.videoCallOnPress()}
                                >
                                    <Icon name="md-videocam" style={styles.icon} />
                                </TouchableOpacity>
                                <TouchableOpacity
                                    hitSlop={{ top: 10, left: 10, right: 10, bottom: 10 }}
                                    onPress={() => this.setState({ showModelCall: false })}
                                    style={[styles.boxIcon, { backgroundColor: Colors.Alizarin_Crimson }]}
                                >
                                    <Icon name="md-close" style={styles.icon} />
                                </TouchableOpacity>
                            </View>
                        </View>
                    </View>
                </View>
            </AppModal>
        );
    }
    renderModal() {
        const { showModel, dataEvent } = this.state;
        return (
            <AppModal visible={showModel}>
                <TouchableOpacity onPress={() => this.setState({ showModel: false })} style={styles.modelContainer}>
                    <View style={styles.boxModelCancel}>
                        <View style={styles.boxTitle}>
                            <AppText text={I18n.t("detailEvent.titleModal")} style={styles.titleModelCancel} />
                            <AppText text={I18n.t("detailEvent.modal")} style={styles.contentModelCancel} />
                        </View>
                        <View style={{ flexDirection: "row", justifyContent: "flex-end" }}>
                            <Button
                                title={I18n.t("detailEvent.cancelBtn")}
                                style={styles.btnCancel}
                                onPress={() => {
                                    this._onPressCancel(dataEvent);
                                    this.setState({ showModel: false });
                                }}
                            />
                            <Button
                                title={I18n.t("detailEvent.btnModel")}
                                onPress={() => {
                                    this.onPressRelay();
                                }}
                            />
                        </View>
                    </View>
                </TouchableOpacity>
            </AppModal>
        );
    }
    showCancelModel(data) {
        this.setState({ dataEvent: data, showModel: true });
    }
    showCallModel(data) {
        this.setState({ dataEvent: data, member: data.member, showModelCall: true, titleEvent: data.title });
    }
    render() {
        const { navigation, eventReducer } = this.props;
        const { listEvent, loading } = this.state;
        console.log("eventReducer", listEvent);
        return (
            <View style={{ zIndex: 1, flex: 1, backgroundColor: "#9599B3" }}>
                <HeaderApp
                    isBack
                    containerStyle={{ zIndex: 5 }}
                    navigation={navigation}
                    title={I18n.t("header.list")}
                />
                <View
                    style={{
                        marginTop: DIMENSION.NEW_HEADER_HEIGHT / 2,
                        zIndex: 2,
                        width: "100%",
                        maxHeight: "100%"
                    }}
                >
                    {!_.isEmpty(eventReducer.eventActive) && eventReducer.eventActive.results ? (
                        <ItemBorder
                            data={listEvent}
                            onCall={item => this.showCallModel(item)}
                            onCancel={item => this.showCancelModel(item)}
                            onChat={item => this._onChat(item)}
                            onLoadMore={() => this._onNextPage()}
                            onPress={item => this._onPressItem(item)}
                        />
                    ) : null}
                </View>
                {this.renderModalCall()}
                {this.renderModal()}
            </View>
        );
    }
}

function mapStateToProps(state) {
    return {
        userReducer: state.userReducer,
        eventReducer: state.eventReducer,
        chatReducer: state.chatReducer,
        navigateReducer: state.navigateReducer
    };
}
Notification = connect(mapStateToProps)(Notification);
export default Notification;
