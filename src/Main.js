/* eslint-disable no-class-assign */
import React, { useReducer } from "react";
import { connect } from "react-redux";
import { SafeAreaView } from "react-navigation";
import { View, Modal, AsyncStorage, Vibration, StyleSheet, Platform, ToastAndroid } from "react-native";
import Spinner from "react-native-loading-spinner-overlay";
import Navigator from "./navigation";
import { isIphoneX } from "react-native-iphone-x-helper";
import { Icon, Root } from "native-base";
import { Colors } from "helper/index";
import { AppText, Button, LocalNotification } from "components";
import { Const } from "helper/index";
import { alertActions, userActions, doctorActions, eventActions, types } from "actions";
import firebase from "react-native-firebase";
import I18n from "helper/locales";
import { onNavigate } from "actions/navigateAction";
import { GROUP_TYPE, ALERT_TYPE } from "helper/Consts";
import * as RNFirebase from "react-native-firebase";

const _ = require("lodash");
const forceInset = { bottom: "never", top: "never" };
var Sound = require("react-native-sound");

class MainApp extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            showAlert: true,
            lang: props.languageReducer.language,
            vibration: props.settingReducer.data.vibration,
            sound: props.settingReducer.data.sound,
            messageNoti: props.settingReducer.data.messageNoti,
            groupNoti: props.settingReducer.data.groupNoti,
            title: "",
            content: "",
            type: ALERT_TYPE.SUCCESS,
            showAlert: false
        };

        this.sound = new Sound("messenger.mp3", Sound.MAIN_BUNDLE, error => {
            if (error) {
                console.log("failed to load the sound", error);
                return;
            }
        });
    }

    async componentDidMount(prevProps) {
        // Create chanel for android
        const channel = new firebase.notifications.Android.Channel(
            "general",
            "General",
            firebase.notifications.Android.Importance.Max
        ).setDescription("General");
        // Create the channel
        firebase.notifications().android.createChannel(channel);

        await this.requestNotificationPermission();

        await this.getDeviceToken();

        // this.initMessageListener(channel);

        // if (Platform.OS === "android") {
        this.initialNotification();
        // }

        this.initNotificationDisplayedListener();

        this.initNotificationReceiveListener(channel);

        this.initNotificationOpenedListener();
    }

    componentDidUpdate(prev) {
        const { settingReducer, languageReducer, alertReducer } = this.props;
        if (prev.settingReducer !== settingReducer) {
            this.setState({
                vibration: settingReducer.data.vibration,
                sound: settingReducer.data.sound,
                messageNoti: settingReducer.data.messageNoti,
                groupNoti: settingReducer.data.groupNoti
            });
        }
        if (prev.languageReducer !== languageReducer) {
            I18n.locale = languageReducer.language;
            console.log(languageReducer);
            this.setState({ lang: languageReducer.language });
        }
        if (prev.alertReducer !== alertReducer) {
            const { title, content, type, showAlert } = alertReducer;
            if (prev.alertReducer.showAlert !== alertReducer.showAlert) {
                this.setState({ title, content, type, showAlert });
            }
        }
    }

    playSound() {
        this.sound.stop(() => {
            this.sound.play(success => {
                if (success) {
                    console.log("successfully finished playing");
                } else {
                    console.log("playback failed due to audio decoding errors");
                }
            });
        });
    }

    requestNotificationPermission = () => {
        firebase
            .messaging()
            .requestPermission()
            .then(() => {
                // User has authorised
                console.log("Notification authorized");
            })
            .catch(error => {
                // User has rejected permissions
                console.log(error);
            });
    };

    async updateNotificationId(deviceToken) {
        try {
            await AsyncStorage.setItem(Const.LOCAL_STORAGE.DEVICE_TOKEN, deviceToken);
        } catch (error) {
            console.log(error);
        }
        const { userReducer } = this.props;
        if (!_.isEmpty(userReducer.data)) {
            console.log(userReducer.data);
            const result = await userActions.updateNotificationId({
                id: userReducer.data.id,
                deviceToken
            });
            console.log("result result ", result);
        }
    }

    getDeviceToken = () => {
        firebase
            .messaging()
            .getToken()
            .then(fcmToken => {
                if (fcmToken) {
                    // GET DEVICE TOKEN AND SEND TO SERVER
                    console.log("fcmToken", fcmToken);
                    this.updateNotificationId(fcmToken);
                } else {
                    // user doesn't have a device token yet
                }
            });
    };

    // initMessageListener = channel => {
    //     if (this.messageListener) return;
    //     this.messageListener = firebase.messaging().onMessage(message => {});
    // };

    // initMessageListener = channel => {
    //     if (this.messageListener) return;
    //     this.messageListener = firebase.messaging().onMessage(message => {});
    // };

    initialNotification = async () => {
        const notificationOpen = await firebase.notifications().getInitialNotification();
        console.log("initialNotification: ", notificationOpen);
        if (_.isEmpty(notificationOpen)) {
            return;
        }
        const { action, notification } = notificationOpen;
        setTimeout(() => {
            if (action) {
                // alert("open");
                if (notification._data.type == "Chat") {
                    // PRESS NOTIFICATION TO CHAT

                    this.dispatchNavigate("Chat", notification._data.chatRoomId);
                    return;
                }
                return;
            }
        }, 2000);
    };

    initNotificationDisplayedListener() {
        this.notificationDisplayedListener = firebase.notifications().onNotificationDisplayed(notification => {
            console.log("Notification displayed: ", notification);
            // Process your notification as required
            // ANDROID: Remote notifications do not contain the channel ID. You will have to specify this manually if you'd like to re-display the notification.
        });
    }

    initNotificationReceiveListener(channel) {
        const _this = this;
        const { userReducer, navigation, chatReducer } = this.props;

        this.notificationListener = firebase.notifications().onNotification(notification => {
            // const { userReducer } = this.props;

            const { vibration, sound, messageNoti, groupNoti } = _this.state;
            console.log("initNotificationReceiveListener", notification);
            const { currentRoom } = this.props;
            const { _data, _body, _title } = notification;
            // if (!_data.caller) {
            //     if (_.isEmpty(currentRoom) || currentRoom.id != _data.chatRoomId) {
            //         if (
            //             (!messageNoti && _data.group_type == GROUP_TYPE.PRIVATE) ||
            //             (!groupNoti && _data.group_type == GROUP_TYPE.GROUP)
            //         )
            //             return;

            //         sound && this.playSound();

            //         vibration && Vibration.vibrate([500, 200, 50, 400]);
            //         this.notiRef.openNoti(_data.title, _data.body, () => {
            //             this.dispatchNavigate("Chat", _data.chatRoomId);
            //             // alert("Hello");
            //         });
            //     }
            // }
            this.props.dispatch(eventActions.eventRequest({ page1: 1 }));

            console.log("receiveListener", _body);
            // const dataUser = JSON.parse(_data.sender);
            if (_body.type == "appointmentTime") {
                console.log("appointmentTime", _body);
                this.dispatchNavigate("Notification", {
                    data: _body.dataEvent
                });
                return;
            }
            if (_data.sender && JSON.parse(_data.sender).username !== userReducer.data.username) {
                switch (_data.type) {
                    case "chat":
                        this.notiRef.openNoti(JSON.parse(_data.sender), _body, _title, () =>
                            this.dispatchNavigate("Chat", {
                                id: JSON.parse(_data.chatRoomInfo).id,
                                chatRoomInfo: JSON.parse(_data.chatRoomInfo)
                            })
                        );
                        break;
                    case "eventInactive":
                        this.notiRef.openNoti(JSON.parse(_data.sender), _body, _title, () =>
                            this.dispatchNavigate("EventUncomfirmation")
                        );
                        break;
                    case "eventCancel":
                        this.notiRef.openNoti(JSON.parse(_data.sender), _body, _title, () =>
                            this.dispatchNavigate("HistoryStack")
                        );
                        break;

                    case "eventActive":
                        this.notiRef.openNoti(JSON.parse(_data.sender), _body, _title, () =>
                            this.dispatchNavigate("Notification")
                        );
                        this.setReminder();
                        break;
                    default:
                        break;
                }
            }
            console.log("appointmentTime", _body, _body.dataEvent);

            // ToastAndroid.show("A pikachu appeared nearby !", ToastAndroid.SHORT);
        });
    }
    setReminder = async () => {
        const { notificationTime, enableNotification, dataEvent } = this.state;
        const date = (moment(dataEvent.appointment_time).unix() + 100) * 1000;
        // date.setMinutes(date.getMinutes() + 2);
        console.log("GGGGGGGG", date);

        // if (enableNotification) {
        // schedule notification
        RNFirebase.notifications().scheduleNotification(this.buildNotification(), {
            fireDate: date,
            repeatInterval: "day",
            exact: true
        });
        // } else {
        //     return false;
        // }
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
                // to: dataEvent.member[1],
                type: "appointmentTime"
            })
            .android.setPriority(RNFirebase.notifications.Android.Priority.High)
            .android.setChannelId("general")
            .android.setAutoCancel(true);
        return notification;
    };
    dispatchNavigate(screen, roomId) {
        const { dispatch } = this.props;
        dispatch(onNavigate(screen, roomId));
    }

    async openNotificationEnrollment(params) {
        const { dispatch } = this.props;
        // const userMode = await Storage.get(Consts.STORAGE.USER_MODE);
        // dispatch(notificationActions.openNotificationEnrollment(params));
    }

    async openNotificationQuestions(params) {
        const { dispatch } = this.props;
        // setTimeout(() => {
        //     console.log("ffffffffffffffffffffff receiver");
        //     this.dispatchNavigate("Chat", notification._data.chatRoomId);
        // }, 10000);
        // dispatch(notificationActions.openNotificationQuestions(params));
    }

    initNotificationOpenedListener() {
        this.notificationOpenedListener = firebase.notifications().onNotificationOpened(notificationOpen => {
            const { action, notification } = notificationOpen;
            console.log("receiver background", notificationOpen);

            if (action) {
                // alert("open");
                if (notification._data.type == "Chat") {
                    // PRESS NOTIFICATION TO CHAT
                    this.dispatchNavigate("Chat", notification._data.chatRoomId);
                    return;
                }
                return;
            }
        });
    }

    renderAlert(title, content, type, showAlert) {
        const { dispatch } = this.props;
        let color = Colors.MAIN_COLOR;
        let icon = "ios-checkmark";
        switch (type) {
            case Const.ALERT_TYPE.SUCCESS:
                color = Colors.MAIN_COLOR;
                break;
            case Const.ALERT_TYPE.ERROR:
                color = Colors.RED_COLOR;
                icon = "ios-close";
                break;
            case Const.ALERT_TYPE.WARNING:
                color = Colors.YELLOW_COLOR;
                icon = "ios-information";
                break;
            default:
                break;
        }
        return (
            <Modal
                animationType="slide"
                transparent={true}
                visible={showAlert}
                onRequestClose={() => {
                    // Alert.alert('Modal has been closed.');
                }}
            >
                <View style={styles.containerModal}>
                    <View style={styles.contentModal}>
                        <View style={styles.headerModal}>
                            <View style={[styles.headerImage, { backgroundColor: color }]}>
                                <Icon name={icon} style={{ fontSize: 50, color: "white" }} />
                            </View>
                        </View>
                        <View style={styles.bodyModal}>
                            <AppText text={title} style={styles.titleAlert} />
                            <AppText text={content} style={styles.contentAlert} />
                            <Button
                                style={{ width: 150, height: 40 }}
                                title={"OK"}
                                onPress={() => {
                                    dispatch(alertActions.closeAlert());
                                }}
                            />
                        </View>
                    </View>
                </View>
            </Modal>
        );
    }

    render() {
        const { loadingReducer, alertReducer } = this.props;
        if (isIphoneX()) {
            return (
                <SafeAreaView forceInset={forceInset} style={styles.container}>
                    <Root>
                        <View style={styles.content}>
                            <Navigator />
                            <LocalNotification onRef={noti => (this.notiRef = noti)} />
                            <Spinner visible={loadingReducer.show} />
                            {this.renderAlert(
                                this.state.title,
                                this.state.content,
                                this.state.type,
                                this.state.showAlert
                            )}
                        </View>
                    </Root>
                </SafeAreaView>
            );
        } else {
            return (
                <View style={styles.content}>
                    <Root>
                        <Navigator />
                        <LocalNotification onRef={noti => (this.notiRef = noti)} />
                        <Spinner visible={loadingReducer.show} />
                        {this.renderAlert(this.state.title, this.state.content, this.state.type, this.state.showAlert)}
                    </Root>
                </View>
            );
        }
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "#db6500"
    },
    content: {
        width: "100%",
        height: "100%"
    },
    titleAlert: {
        fontSize: Const.FONT_SIZE.TITLE,
        marginTop: 16,
        fontWeight: "500",
        color: "black"
    },
    contentAlert: {
        width: "80%",
        fontSize: Const.FONT_SIZE.CONTENT_SIZE + 2,
        marginTop: 6,
        textAlign: "center",
        marginBottom: 16,
        color: "black"
    },
    containerModal: {
        width: "100%",
        height: "100%",
        backgroundColor: "rgba(0,0,0,0.5)"
    },
    contentModal: {
        marginTop: "20%",
        alignItems: "center",
        width: "100%"
    },
    headerModal: {
        width: 60,
        height: 60,
        justifyContent: "center",
        borderRadius: 30,
        borderColor: Colors.WHITE_COLOR,
        alignItems: "center",
        backgroundColor: Colors.WHITE_COLOR,
        zIndex: 999
    },
    headerImage: {
        width: 50,
        height: 50,
        justifyContent: "center",
        borderRadius: 25,
        alignItems: "center"
    },
    bodyModal: {
        marginTop: -30,
        backgroundColor: "white",
        padding: 16,
        width: "80%",
        borderRadius: 5,
        alignItems: "center",
        borderRadius: 40
    }
});

function mapStateToProps(state) {
    return {
        loadingReducer: state.loadingReducer,
        alertReducer: state.alertReducer,
        userReducer: state.userReducer,
        currentRoom: state.chatHistoriesReducer.currentRoom,
        languageReducer: state.languageReducer,
        settingReducer: state.settingReducer
    };
}
MainApp = connect(mapStateToProps)(MainApp);
export default MainApp;
