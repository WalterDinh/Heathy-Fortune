import React from "react";
import { View, Alert, Platform } from "react-native";
import { connect } from "react-redux";
import { AppImage, AppText, HeaderApp, Button, Container, AppModal, Text, TextInput } from "components";
import styles from "./styles";
import { Input, Item, Form, Icon, CheckBox, Picker } from "native-base";
import { PD, DEVICE, DIMENSION, EVENT_STATUS, EVENT } from "helper/Consts";
import { Colors, Const } from "helper";
import I18n from "helper/locales";
import _ from "lodash";
import { responsiveFontSize } from "react-native-responsive-dimensions";
import { FONT_SF } from "assets";
import {
    getEventRequest,
    changeStatusEvent,
    eventSuccess,
    getEventSuccess,
    cancelEventSuccess,
    completeEventSuccess,
    ratingEventSuccess,
    activeEventSuccess
} from "actions/eventActions";
import * as actionType from "../../actions/types";
import moment from "moment";
import { alertActions, chatHistoriesAction, eventActions } from "actions";
import { getMettingAgendaRequest } from "actions/meetingAgendaActions";
import { numberToCurrency } from "helper/convertLang";
import * as RNFirebase from "react-native-firebase";
import StarRating from "react-native-star-rating";

const DEFAULT_AVATAR = "https://i.imgur.com/Htnp2Ra.png";
const AVATAR_SIZE_WRAP = DEVICE.DEVICE_WIDTH * 0.1;
const AVATAR_SIZE = AVATAR_SIZE_WRAP - 4;

class DetailEvent extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            dataEvent: {},
            showModel: false,
            rating: 0,
            checkRating: false,
            comment: ""
        };
    }

    _loadInfo() {
        const { dispatch, navigation } = this.props;
        const dataDetail = navigation.getParam("item")
            ? navigation.getParam("item")
            : navigation.getParam("eventWating")
            ? navigation.getParam("eventWating")
            : navigation.getParam("historyDetail");
        const { id } = dataDetail;
        dispatch(getEventRequest(id));
    }

    componentDidMount() {
        const { dispatch, navigation } = this.props;
        this._loadInfo();
        if (navigation.getParam("historyDetail")) {
            this.setState({ history: true, eventWating: false });
        }
        if (navigation.getParam("eventWating")) {
            this.setState({ history: false, eventWating: true });
        }
        if (navigation.getParam("item")) {
            this.setState({ history: false, eventWating: false });
        }
    }

    componentDidUpdate(prevProps) {
        const { eventReducer, navigation, userReducer, dispatch } = this.props;
        const { dataEvent } = this.state;
        if (eventReducer !== prevProps.eventReducer) {
            if (eventReducer.type === actionType.GET_EVENT_DETAIL_SUCCESS) {
                this.setState({
                    dataEvent: eventReducer.dataDetailEvent,
                    rating: eventReducer.dataDetailEvent.rating,
                    comment: eventReducer.dataDetailEvent.comment
                });
            }
            if (eventReducer.type === actionType.ACTIVE_EVENT_SUCCESS) {
                // console.log("ACTIVE_EVENT_SUCCESS");
                let content = {
                    notificationId: [
                        userReducer.data.device_id,
                        this.getSender(eventReducer.dataDetailEvent).device_id
                    ],
                    noti: {
                        body: ` ${userReducer.data.last_name} ${I18n.t("notification.activeEventSuccess")}`,
                        title: "Thông báo"
                    },
                    message: {
                        sender: userReducer.data,
                        to: this.getSender(eventReducer.dataDetailEvent),
                        type: "eventActive"
                    }
                };
                chatHistoriesAction.sendNotiForOther(content);
                dispatch(eventActions.eventRequest({ page1: 1 }));
            }
            if (eventReducer.type === actionType.COMPLETE_EVENT_SUCCESS) {
                // console.log("ACTIVE_EVENT_SUCCESS");
                let content = {
                    notificationId: [
                        userReducer.data.device_id,
                        this.getSender(eventReducer.dataDetailEvent).device_id
                    ],
                    noti: {
                        body: ` ${userReducer.data.last_name} ${I18n.t("notification.activeEventSuccess")}`,
                        title: "Thông báo"
                    },
                    message: {
                        sender: userReducer.data,
                        to: this.getSender(eventReducer.dataDetailEvent),
                        type: "eventCancel"
                    }
                };
                chatHistoriesAction.sendNotiForOther(content);
                // dispatch(eventActions.eventRequest({ page1: 1 }));
            }
            // if (eventReducer.type === actionType.CANCEL_EVENT_SUCCESS) {
            //     let content = {
            //         notificationId: [
            //             userReducer.data.device_id,
            //             this.getSender(eventReducer.dataDetailEvent).device_id
            //         ],
            //         noti: {
            //             body: ` ${userReducer.data.last_name} ${I18n.t("notification.cancelEventSuccess")}`,
            //             title: "Thông báo"
            //         },
            //         message: {
            //             sender: userReducer.data,
            //             to: this.getSender(eventReducer.dataDetailEvent),
            //             type: 2
            //         }
            //     };
            //     chatHistoriesAction.sendNotiForOther(content);
            //     this.setTimeout(() => {
            //         dispatch(eventActions.eventRequest({ page1: 1 }));
            //     }, 500);
            // }
            if (eventReducer.type === actionType.GET_EVENT_SUCCESS && !this.state.checkRating) {
                navigation.goBack();
            }
        }
    }
    onSender() {
        const { dataEvent } = this.state;
        for (let i = 0; i < dataEvent.member.length; i++) {
            if (dataEvent.member[i].id === dataEvent.name_creator) return dataEvent.member[i];
        }
    }
    cancelNotification = async id => {
        try {
            const cancel = await RNFirebase.notifications().cancelNotification(id);
            console.log(cancel);
        } catch (e) {
            console.error(e);
        }
    };
    setReminder = async () => {
        const { notificationTime, enableNotification, dataEvent } = this.state;
        const date = (moment(dataEvent.appointment_time).unix() + 100) * 1000;
        // date.setMinutes(date.getMinutes() + 2);
        console.log("GGGGGGGG", date);
        RNFirebase.notifications().scheduleNotification(this.buildNotification(), {
            fireDate: date,
            repeatInterval: "day",
            exact: true
        });
    };

    buildNotification = () => {
        const { dataEvent } = this.state;
        const title = Platform.OS === "android" ? "Daily Reminder" : "";
        console.log("ssssssssss.");

        const notification = new RNFirebase.notifications.Notification()
            .setNotificationId(`${dataEvent.id}`)
            .setTitle(dataEvent.title)
            .setBody({
                body: I18n.t("notification.scheduleNotification"),
                sender: this.onSender(),
                dataEvent: dataEvent,
                // to: dataEvent.member[1],
                type: "appointmentTime"
            })
            .android.setPriority(RNFirebase.notifications.Android.Priority.High)
            .android.setChannelId("general")
            .android.setAutoCancel(true);
        return notification;
    };

    onStart = () => {
        if (Platform.OS == "ios") {
            BackgroundTimer.start();
        }
        this._interval = BackgroundTimer.setInterval(() => {
            this.sendNotification();
        }, 1000);
    };

    sendNotification() {
        const { currentRoom } = this.props.chatHistoriesReducer;
        let { messages, user, groupName, chatRoomInfo } = this.state;

        let notificationId = [];
        let results = this.chatRoomInfo.users.map(async item => {
            // return item.notificationId;
            console.log("chatRoomInfo ===>>> ", chatRoomInfo);

            if (item.id != user.id) {
                if (item.type == USER_TYPE.STUDENT) {
                    notificationId.push(item.notificationId);
                    return item.notificationId;
                }
                await firebase
                    .database()
                    .ref(`/status/`)
                    .orderByChild("id")
                    .endAt(item.id)
                    .limitToLast(1)
                    .once("value", childSnapshot => {
                        const message = childSnapshot.toJSON();
                        let value = message ? Object.values(message) : "";
                        if (
                            value &&
                            value[0].id == item.id &&
                            value[0].notificationSilent &&
                            Object.values(value[0].notificationSilent).indexOf(chatRoomInfo.id) > -1
                        ) {
                            return;
                        }
                        if (value == "" || value[0].id != item.id || value[0].status) {
                            console.log("item ===>>", item);
                            notificationId.push(item.notificationId);
                            return item.notificationId;
                        }
                    });
            }
        });
        Promise.all(results).then(() => {
            console.log("ressssdajshdkasd", notificationId);

            const body = this.convertNoti(messages[0].type, messages[0].text);
            let name = user.name;
            let group_type = currentRoom.type;
            let group_name = group_type == GROUP_TYPE.GROUP ? groupName : "";
            const title = {
                name,
                group_name
            };
            let content = {
                notificationId,
                noti: {
                    body,
                    title: group_type == GROUP_TYPE.GROUP ? name + " gửi tới " + group_name : name
                },
                message: {
                    body,
                    title,
                    type: "Chat",
                    chatRoomId: this.chatRoomInfo.id,
                    group_type
                }
            };
            chatHistoriesAction.sendNotiForOther(content);
            console.log("content ===>> ", content);
        });
    }

    renderItemContent(title, content) {
        if (title == I18n.t("detailEvent.time")) {
            return (
                <View>
                    <AppText
                        text={moment(content.appointment_time).format("LLLL")}
                        style={[
                            styles.textDescription,
                            title == I18n.t("detailEvent.time") && {
                                textTransform: "capitalize",
                                paddingTop: PD.PADDING_1
                            }
                        ]}
                    />
                    {content.appointment_end_time && (
                        <AppText
                            text={moment(content.appointment_end_time).format("LLLL")}
                            style={[
                                styles.textDescription,
                                title == I18n.t("detailEvent.time") && {
                                    textTransform: "capitalize",
                                    paddingTop: PD.PADDING_1
                                }
                            ]}
                        />
                    )}
                </View>
            );
        } else {
            return _.isString(content) ? (
                <AppText
                    text={content}
                    style={[
                        styles.textDescription,
                        title == I18n.t("detailEvent.time") && {
                            textTransform: "capitalize"
                        }
                    ]}
                />
            ) : title == I18n.t("detailEvent.category") ? (
                !_.isEmpty(content) &&
                content.map((item, index) => (
                    <View key={index}>
                        <AppText key={index} text={item.tag_name} style={styles.textDescription} />
                    </View>
                ))
            ) : (
                !_.isEmpty(content) &&
                content.map((item, index) => (
                    <View style={styles.avatarContainer} key={index}>
                        <View style={styles.avatarWrap}>
                            <AppImage
                                source={{ uri: item.img_url ? item.img_url : DEFAULT_AVATAR }}
                                style={styles.avatar}
                                resizeMode="cover"
                            />
                        </View>
                        <View style={styles.nameWrap}>
                            <AppText
                                key={index}
                                text={item.first_name + " " + item.last_name}
                                style={styles.nameText}
                            />
                        </View>
                    </View>
                ))
            );
        }
    }

    renderItem(nameIcon, title, content) {
        return (
            <View style={styles.boxContent}>
                <View style={{ flexDirection: "row" }}>
                    <View style={{ justifyContent: "center", flex: 1 }}>
                        <Icon name={nameIcon} type="MaterialCommunityIcons" style={styles.itemIcon} />
                    </View>
                    <View style={{ justifyContent: "center", flex: 6 }}>
                        <AppText text={title} style={styles.itemTitle} />
                    </View>
                </View>
                <View style={{ flexDirection: "row" }}>
                    {title == I18n.t("detailEvent.description") ? null : <View style={{ flex: 1 }} />}
                    <View style={{ flex: 6, flexDirection: "column" }}>
                        <View style={{ flexDirection: "column" }}>{this.renderItemContent(title, content)}</View>
                    </View>
                </View>
            </View>
        );
    }

    _refreshData() {
        const { navigation } = this.props;
        const time = navigation.getParam("time");
        if (!_.isEmpty(time) || !_.isUndefined(time)) {
            this._loadData(time);
        }
        this._loadInfo();
        console.log("datasda", time);
    }

    _loadData(date) {
        const { month, year, dateString } = date;
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
    onSendReview = () => {
        const { dispatch, userReducer } = this.props;
        const { rating, comment, dataEvent } = this.state;
        const params = {
            id: dataEvent.id,
            body: {
                rating,
                comment
            }
        };
        changeStatusEvent(params).then(res => {
            if (res.error) {
                paramsAlert = {
                    title: I18n.t("Alert.notice"),
                    content: I18n.t("detailEvent.acceptError"),
                    type: Const.ALERT_TYPE.ERROR
                };
                dispatch(alertActions.openAlert(paramsAlert));
            } else {
                dispatch(eventActions.eventRequest({ page1: 1 }));
                // this._refreshData();
                this.setState({ checkRating: false });
                // this.setReminder();
            }
        });
    };
    _onPressAcceptBtn(data) {
        const { dispatch, userReducer } = this.props;
        console.log("cascaassacasccsacassssssssssssssssssssssssssss", data);
        const params = {
            id: data.id,
            body: {
                status: 1
            }
        };
        changeStatusEvent(params).then(res => {
            console.log("res", res);
            if (res.error) {
                paramsAlert = {
                    title: I18n.t("Alert.notice"),
                    content: I18n.t("detailEvent.acceptError"),
                    type: Const.ALERT_TYPE.ERROR
                };
                dispatch(alertActions.openAlert(paramsAlert));
            } else {
                dispatch(activeEventSuccess(res.response));
                dispatch(eventActions.eventRequest({ page1: 1 }));
                this.setReminder();
            }
        });
    }

    _onPressCompleteBtn(data) {
        const { dispatch } = this.props;
        const appointment_end_time = moment().format();
        // console.log("now =====>>>>", now);
        const params = {
            id: data.id,
            body: {
                status: 2,
                appointment_end_time
            }
        };
        changeStatusEvent(params).then(res => {
            console.log("res", res);
            if (res.error) {
                paramsAlert = {
                    title: I18n.t("Alert.notice"),
                    content: I18n.t("detailEvent.onCompleteError"),
                    type: Const.ALERT_TYPE.ERROR
                };
                dispatch(alertActions.openAlert(paramsAlert));
            } else {
                dispatch(completeEventSuccess(res.response));
                // dispatch(eventActions.eventRequest({ page1: 1 }));
                this.setState({ checkRating: true });
            }
        });
    }
    getSender = item => {
        const { userReducer } = this.props;
        let sender = {};

        item.member.map(i => {
            if (userReducer.data.username !== i.username) sender = i;
        });
        return sender;
    };
    _onPressCancelBtn(data) {
        const { dispatch, userReducer, eventReducer, navigation } = this.props;
        const { dataEvent } = this.state;
        const params = {
            id: data.id,
            body: {
                status: 3
            }
        };
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
                    notificationId: [
                        userReducer.data.device_id,
                        this.getSender(eventReducer.dataDetailEvent).device_id
                    ],
                    noti: {
                        body: ` ${userReducer.data.last_name} ${I18n.t("notification.cancelEventSuccess")}`,
                        title: "Thông báo"
                    },
                    message: {
                        sender: userReducer.data,
                        to: this.getSender(eventReducer.dataDetailEvent),
                        type: "eventCancel"
                    }
                };
                chatHistoriesAction.sendNotiForOther(content);
                // this.setTimeout(() => {
                dispatch(eventActions.eventRequest({ page1: 1 }));
                // }, 500);
                this.cancelNotification(`${dataEvent.id}`);
                // dispatch(cancelEventSuccess(res.response));
            }
        });
    }

    renderBtn(data) {
        const { status } = data;
        console.log(
            "cccccccccccccccccc",
            status == EVENT_STATUS.WAIT && moment(data.appointment_time).unix() < moment().unix(),
            moment(data.appointment_time),
            moment(),
            status
        );
        if (status > EVENT_STATUS.ACCEPTED) {
            return null;
        } else {
            return (
                <View style={{ width: "100%", marginTop: 16, marginBottom: PD.PADDING_1 }}>
                    {status == EVENT_STATUS.WAIT && moment(data.appointment_time).unix() > moment().unix() ? (
                        <Button
                            title={I18n.t("detailEvent.acceptBtn")}
                            isShadow
                            rightIcon
                            onPress={() => this._onPressAcceptBtn(data)}
                            style={styles.buttonConfirm}
                        />
                    ) : null}
                    {status !== EVENT_STATUS.WAIT && moment(data.appointment_time).unix() < moment().unix() ? (
                        <Button
                            title={I18n.t("detailEvent.completeBtn")}
                            isShadow
                            rightIcon
                            onPress={() => this._onPressCompleteBtn(data)}
                            style={{
                                backgroundColor: Colors.Salem,
                                width: "100%",
                                marginTop: status == EVENT_STATUS.WAIT ? PD.PADDING_2 : PD.PADDING_6
                            }}
                        />
                    ) : null}
                    {moment(data.appointment_time).unix() - 1800 > moment().unix() && (
                        <Button
                            title={I18n.t("detailEvent.cancelBtn")}
                            isShadow
                            rightIcon
                            // onPress={() => this.confirm(data)}
                            onPress={() => {
                                this.setState({ showModel: true });
                            }}
                            style={{
                                backgroundColor: Colors.Alizarin_Crimson,
                                width: "100%",
                                marginTop: PD.PADDING_1,
                                marginBottom: PD.PADDING_6
                            }}
                        />
                    )}
                </View>
            );
        }
    }
    onStarRatingPress = rating => {
        this.setState({ rating });
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

    renderModal() {
        const { showModel, dataEvent } = this.state;
        return (
            <AppModal visible={showModel}>
                <View
                    style={{
                        flex: 1,
                        justifyContent: "center",
                        alignItems: "center"
                    }}
                >
                    <View style={styles.bodyModal}>
                        <View
                            style={{
                                flexDirection: "column",
                                height: DEVICE.DEVICE_HEIGHT * 0.23
                            }}
                        >
                            <AppText
                                text={I18n.t("detailEvent.titleModal")}
                                style={{
                                    color: "#000",
                                    fontSize: responsiveFontSize(3.25),
                                    fontFamily: FONT_SF.BOLD
                                }}
                            />
                            <AppText
                                text={I18n.t("detailEvent.modal")}
                                style={{ color: "#998FA2", fontSize: responsiveFontSize(2.25) }}
                            />
                        </View>
                        <View style={{ flexDirection: "row", justifyContent: "flex-end" }}>
                            <Button
                                title={I18n.t("detailEvent.cancelBtn")}
                                style={{
                                    backgroundColor: "#9599B3",
                                    marginRight: PD.PADDING_3
                                }}
                                onPress={() => {
                                    this._onPressCancelBtn(dataEvent);
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
                </View>
            </AppModal>
        );
    }
    onFilter() {
        const { userReducer } = this.props;
        const { dataEvent } = this.state;
        for (let i = 0; i < dataEvent.member.length; i++) {
            if (dataEvent.member[i].id !== userReducer.data.id) return dataEvent.member[i];
        }
    }
    render() {
        const { navigation, eventReducer, userReducer } = this.props;
        const { dataEvent, history, eventWating, checkRating } = this.state;
        // const { appointment_time, price } = renderItem;
        console.log("==============================================");
        console.log("dataEvent", dataEvent, dataEvent.name_creator, userReducer.data.id);
        console.log("==============================================");

        if (_.isEmpty(dataEvent)) {
            return (
                <View style={styles.container}>
                    <HeaderApp isBack title={I18n.t("detailEvent.title")} navigation={navigation} />
                </View>
            );
        }
        return (
            <View style={styles.container}>
                <HeaderApp isBack title={dataEvent.title} navigation={navigation} avatar={this.onFilter().img_url} />
                <Container showsVerticalScrollIndicator={false} style={styles.containerWrap}>
                    <View style={styles.detailWrap}>
                        <AppText text="Chi tiết" style={styles.detailText} />
                    </View>
                    {this.renderItem(
                        "clock-outline",
                        I18n.t("detailEvent.time"),
                        _.isEmpty(dataEvent.appointment_time) ? I18n.t("detailEvent.noInfo") : dataEvent
                    )}
                    {this.renderItem(
                        "account-multiple-outline",
                        I18n.t("detailEvent.member"),
                        _.isEmpty(dataEvent.member) ? I18n.t("detailEvent.noInfo") : dataEvent.member
                    )}
                    {/* {this.renderItem(
                        "newspaper",
                        I18n.t("detailEvent.category"),
                        _.isEmpty(dataEvent.tag) ? I18n.t("detailEvent.noInfo") : dataEvent.tag
                    )} */}
                    {this.renderItem(
                        "message-bulleted",
                        I18n.t("detailEvent.description"),
                        _.isEmpty(dataEvent.description) ? I18n.t("detailEvent.noInfo") : dataEvent.description
                    )}
                    {this.renderItem("credit-card", `${numberToCurrency(dataEvent.price) || "0"} đồng/giờ`)}
                    {dataEvent.status == 2 || checkRating ? this.renderDone("star", "Đánh giá") : null}
                    {dataEvent.status == 3 ||
                    dataEvent.status == 2 ||
                    (dataEvent.name_creator == userReducer.data.id && eventWating) ||
                    checkRating ? (
                        <View style={{ height: responsiveFontSize(2) }} />
                    ) : (
                        this.renderBtn(dataEvent)
                    )}
                </Container>
                {this.renderModal()}
            </View>
        );
    }
    renderDone(nameIcon, title) {
        const { userReducer } = this.props;
        const { comment, rating, checkRating, notification, dataEvent } = this.state;
        // Alert.alert('asdasd',JSON.stringify( comment));
        return (
            <View style={styles.boxContent}>
                <View style={styles.vote}>
                    <View style={{ flexDirection: "row" }}>
                        <View style={{ justifyContent: "center", flex: 1 }}>
                            <Icon name={nameIcon} type="MaterialCommunityIcons" style={styles.itemIcon} />
                        </View>
                        <View style={{ justifyContent: "center", flex: 6 }}>
                            <AppText text={title} style={styles.itemTitle} />
                        </View>
                    </View>
                    <View style={styles.rating}>
                        {dataEvent.rating == 0 ? (
                            <StarRating
                                emptyStar="ios-star-outline"
                                fullStar="ios-star"
                                halfStar="ios-star-half"
                                iconSet="Ionicons"
                                maxStars={5}
                                starSize={responsiveFontSize(3.5)}
                                rating={rating}
                                selectedStar={rating => this.onStarRatingPress(rating)}
                                fullStarColor={Colors.Santas_Gray}
                                showRating
                            />
                        ) : (
                            <StarRating
                                emptyStar="ios-star-outline"
                                fullStar="ios-star"
                                halfStar="ios-star-half"
                                iconSet="Ionicons"
                                maxStars={5}
                                disabled
                                starSize={responsiveFontSize(3.5)}
                                rating={rating}
                                selectedStar={rating => this.onStarRatingPress(rating)}
                                fullStarColor={Colors.Santas_Gray}
                                showRating
                            />
                        )}
                        <AppText text={`  ${rating} sao`} style={styles.distance} />
                    </View>
                </View>
                <View style={styles.sendComent}>
                    {/* <AppText text="Comment" style={styles.textVote} /> */}
                    <View style={styles.inputContainer}>
                        <Input
                            multiline={true}
                            style={{ color: "white", width: "100%" }}
                            value={comment}
                            disabled={_.isEmpty(dataEvent.comment) ? false : true}
                            onChangeText={comment => this.setState({ comment })}
                        />
                    </View>
                </View>
                {dataEvent.rating != 0 ? null : (
                    <Button
                        isShadow
                        style={styles.buttonConfirm}
                        title="ĐÁNH GIÁ"
                        titleColor={Colors.TEXT_LOGIN}
                        onPress={() => this.onSendReview()}
                    />
                )}
            </View>
        );
    }
}
function mapStateToProps(state) {
    return {
        userReducer: state.userReducer,
        eventReducer: state.eventReducer
    };
}
DetailEvent = connect(mapStateToProps)(DetailEvent);

export default DetailEvent;
