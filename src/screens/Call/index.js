import React from "react";
import {
    View,
    Alert,
    ImageBackground,
    TouchableOpacity,
    StatusBar,
    Dimensions,
    DeviceEventEmitter
} from "react-native";
import { connect } from "react-redux";
import { Const, Colors } from "helper/index";
import { types, userActions } from "actions/index";
import { chatHistoriesAction } from "actions";
import { Container, Button, AppImage, Input, AppText, AppImageCircle } from "components/index";
import styles from "./styles";
import I18n from "helper/locales";
import { Images } from "assets";
import LinearGradient from "react-native-linear-gradient";
import NoteScreen from "./NoteScreen";
import EndCall from "./EndCall";
import firebase from "firebase";
import IncallManager from "react-native-incall-manager";
import { ServiceHandle } from "helper";
import { thisExpression } from "@babel/types";
import { callAddRequest } from "actions/callActions";
import { notificationActions } from "actions/notificationActions";
import { Grayscale } from "react-native-color-matrix-image-filters";

const moment = require("moment");

const { width: DEVICE_WIDTH, height: DEVICE_HEIGHT } = Dimensions.get("window");

class Call extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            call: false,
            active: false,
            isSpeaker: false,
            mute: false
        };
        this.isToVideoCall = false;
        this.isAddCallLog = false;
        this.isHeadPhone = false;
    }

    componentDidUpdate(prevProps) {}

    componentWillUnmount() {
        console.log("ggggggggg will un mount", this.friendId);
        this.friendId = null;
        this.myId = null;
        this.myDb = null;
    }

    checkFriendStatus = content => {
        // let isNoti;
        firebase
            .database()
            .ref(`/status/`)
            .orderByChild("id")
            .endAt(this.friendId)
            .limitToLast(1)
            .once("value", childSnapshot => {
                const lastItem = childSnapshot.toJSON();
                const value = Object.values(lastItem);
                const item = value[0];
                console.log("test status firebase", item);
                const { id = 0, status = true } = item;
                if (this.user.friendType === Const.USER_TYPE.STUDENT) {
                    return this.sendNoti(content);
                } else {
                    if (id > 0 && status) {
                        return this.sendNoti(content);
                    } else {
                        return;
                    }
                }
                // return false;
            });

        // return isNoti;
    };

    sendNoti(content) {
        console.log("13111111122111111", content);
        chatHistoriesAction.sendNotiForOther(content);
    }

    checkCall(isVideo) {
        const { userReducer } = this.props;
        const { data } = userReducer;
        const { first_name, last_name, img_url, amount = 0 } = data;
        // const { first_name, last_name } = userReducer;
        const { notificationId } = this.user;
        // this.calledDb.limitToLast(1).once("value", childSnapshot => {
        //     console.log("childSnapshot.toJSON()", childSnapshot.toJSON());

        //     const child = childSnapshot.toJSON() || {};
        //     if(child) {

        //         const item = Object.values(child)[0] || {};
        //         const { isCanReceive = true, caller = 0, status } = item || {};
        //     }
        //     if (!!item && !isCanReceive) {
        //         if (caller !== this.myId) {
        //             this.busy();
        //             return;
        //         }
        //     } else {
        // console.log("ffffffffffffffffffffffffaaaaaaaaaaaaaaaaaaaaaa", {
        //     caller: this.myId,
        //     to: this.friendId,
        //     status: "dialing",
        //     isCanReceive: false,
        //     callerName: first_name + " " + last_name,
        //     avatar: img_url,
        //     isVideo: this.user.isVideo
        // });
        this.calledDb
            .push({
                caller: this.myId,
                to: this.friendId,
                status: "dialing",
                isCanReceive: false,
                callerName: first_name + " " + last_name,
                avatar: img_url,
                isVideo: this.user.isVideo
            })
            .then(async data => {
                // let content = {
                //     notificationId: [notificationId],
                //     noti: {
                //         body: `Bạn có cuộc gọi ${
                //             this.user.isVideo ? "hình ảnh" : "âm thanh"
                //         } từ ${first_name} ${last_name}`,
                //         title: "Thông báo"
                //     },
                //     message: {
                //         avatar: img_url,
                //         caller: this.myId,
                //         callerName: first_name + " " + last_name,
                //         isCanReceive: false,
                //         isVideo: this.user.isVideo,
                //         status: "dialing",
                //         to: this.friendId
                //     }
                // };
                // this.checkFriendStatus(content);
                this.myDb
                    .push({
                        caller: this.myId,
                        to: this.friendId,
                        status: "dialing",
                        isCanReceive: false
                    })
                    .catch(e => console.log("eeeee", e));
            })
            .catch(error => {
                console.log("error ", error);
            });
        //     }
        // });
    }

    busy() {
        IncallManager.setKeepScreenOn(false);
        IncallManager.setForceSpeakerphoneOn(false);
        IncallManager.stopRingback();
        IncallManager.stop({ busytone: "_BUNDLE_" });
        clearTimeout(this.callTimeOut);
        setTimeout(() => {
            this.props.navigation.goBack();
        }, 2000);
    }

    async componentWillMount() {
        this.callTimeOut = setTimeout(() => {
            // this.props.navigation.goBack();
            this.toggleModal();
        }, 60000);

        const { userReducer } = this.props;
        const { data } = userReducer;
        const { amount = 0 } = data;
        this.user = this.props.navigation.getParam("item") || {};
        const { calledId = 0, of_user = 0, isVideo = false, notificationId } = this.user;
        this.friendId = await calledId;
        this.myId = await of_user;
        this.myDb = firebase.database().ref(`video-call/${of_user}`);
        this.calledDb = firebase.database().ref(`video-call/${calledId || 0}`);
        // if (amount <= 0) {
        //     Alert.alert(
        //         "Thông báo",
        //         "Số dư không đủ để thực hiện cuộc gọi, vui lòng nạp thêm tiền!",
        //         [{ text: "OK", onPress: () => this.props.navigation.goBack() }],
        //         { cancelable: false }
        //     );
        //     return;
        // } else {
        await IncallManager.checkRecordPermission();
        console.log("wwwwwwwwwwwwwwwwwwwwwwwww", isVideo ? "video" : "audio");
        IncallManager.start({
            media: isVideo ? "video" : "audio",
            auto: true,
            ringback: "_BUNDLE_"
        });
        if (!isVideo) {
            IncallManager.setForceSpeakerphoneOn(false);
        } else {
            IncallManager.setForceSpeakerphoneOn(true);
        }
        IncallManager.setKeepScreenOn(true);
        this.checkCall(isVideo);
        // firebase
        //     .database()
        //     .ref(`/status/`)
        //     .orderByChild("id")
        //     .endAt(this.friendId)
        //     .limitToLast(1)
        //     .once("value", childSnapshot => {
        //         console.log('q2eweqaew',  childSnapshot.toJSON());

        //         const lastItem = childSnapshot.toJSON();
        //         const value = Object.values(lastItem);
        //         const item = value[0];
        //         console.log("test status firebase", item);
        //         const { id = 0, status = true } = item;
        //         if (this.user.friendType === Const.USER_TYPE.STUDENT) {
        //             return this.checkCall(isVideo);
        //         } else {
        //             if (id > 0 && status) {
        //                 return this.checkCall(isVideo);
        //             } else {
        //                 this.busy();
        //                 return;
        //             }
        //         }
        //     });

        this.myDb.limitToLast(1).on("child_added", childSnapshot => {
            const lastItem = childSnapshot.toJSON();
            const { isCanReceive, caller, status, to } = lastItem;
            if (status === "connected" && caller === this.myId) {
                if (!!this.callTimeOut) {
                    clearTimeout(this.callTimeOut);
                }
                IncallManager.stopRingback();
                this.calledDb
                    .push({
                        caller: this.myId,
                        to: this.friendId,
                        status: "connected",
                        isCanReceive: false,
                        isVideo: this.user.isVideo,
                        isCaller: true,
                        media: {
                            width: DEVICE_WIDTH,
                            height: DEVICE_HEIGHT
                        },
                        from: this.user.from
                    })
                    .then(data => {
                        this.isToVideoCall = true;
                        this.props.navigation.replace("VideoCall", {
                            roomId: this.friendId,
                            isFrom: true,
                            userId: this.myId,
                            callerId: this.myId,
                            isVideo: this.user.isVideo,
                            note: this.note,
                            isSpeaker: this.state.isSpeaker,
                            isMute: this.state.mute,
                            consultant_fee: this.props.navigation.state.params.consultant_fee,
                            callData: {
                                callerName: this.user.nickname,
                                avatar: this.user.avatar
                            }
                        });
                    })
                    .catch(e => {
                        console.log("2313231231111", e);
                    });
                return;
            }
            if (status === "finished" && caller === this.myId && !this.isToVideoCall) {
                if (!!this.callTimeOut) {
                    clearTimeout(this.callTimeOut);
                }
                IncallManager.stopRingback();
                IncallManager.setKeepScreenOn(false);
                IncallManager.setForceSpeakerphoneOn(false);
                IncallManager.stop({ busytone: "_BUNDLE_" });
                if (!!this.myDb) {
                    this.myDb.remove();
                    if (!!this.calledDb) this.calledDb.remove();
                }
                if (!this.isAddCallLog) {
                    const paramsAdd = {
                        user_call_id: this.myId,
                        user_receive_id: this.friendId,
                        start_time: moment()
                            .utc()
                            .format("YYYY-MM-DDTHH:mm:ss.SSSSSS"),
                        end_time: moment()
                            .utc()
                            .format("YYYY-MM-DD HH:mm:ss.SSSSSS"),
                        duration: 0,
                        note_called_user: this.note
                    };
                    callAddRequest(paramsAdd, this.myId);
                    this.isAddCallLog = true;
                }
                IncallManager.stop();
                this.props.navigation.goBack();
                return;
            }
        });
        return;
        // }
    }

    toggleModal = () => {
        const { userReducer } = this.props;
        const { data } = userReducer;
        const { user, avatar, amount = 111111110, first_name, last_name } = data;
        const { calledId = 0, of_user = 0, isVideo = false, notificationId } = this.user;
        if (!!this.callTimeOut) {
            clearTimeout(this.callTimeOut);
        }
        let content = {
            notificationId: [notificationId],
            noti: {
                body: `Bạn có cuộc gọi nhỡ từ ${first_name} ${last_name}`,
                title: "Thông báo"
            },
            message: {
                avatar: avatar,
                caller: this.myId,
                callerName: first_name + " " + last_name,
                isCanReceive: false,
                isVideo: this.user.isVideo,
                to: this.friendId
            }
        };

        IncallManager.stop({ busytone: "_BUNDLE_" });
        IncallManager.setKeepScreenOn(false);
        IncallManager.setForceSpeakerphoneOn(false);
        IncallManager.stopRingback();
        if (amount > 0) {
            this.checkFriendStatus(content);
        }
        this.calledDb.push({
            caller: this.myId,
            to: this.friendId,
            status: "finished",
            isCanReceive: true
        });
        this.myDb.push({
            caller: this.myId,
            to: this.friendId,
            status: "finished",
            isCanReceive: true
        });
    };

    renderButton = (source, title, onPress) => {
        return (
            <View>
                <TouchableOpacity onPress={onPress} style={styles.btnNoteDisable}>
                    <AppImage local source={source} style={{ width: 30, height: 30 }} />
                </TouchableOpacity>
                <AppText text={title} style={{ color: Colors.WHITE_COLOR, textAlign: "center" }} />
            </View>
        );
    };

    changeSpeaker = () => {
        // IncallManager.setSpeakerphoneOn(!this.state.isSpeaker);
        console.log("123111111111", this.state.isSpeaker);
        IncallManager.setForceSpeakerphoneOn(!this.state.isSpeaker);
        this.setState({ isSpeaker: !this.state.isSpeaker });
    };

    mute = () => {
        this.setState({ mute: !this.state.mute });
    };

    render() {
        const { navigation } = this.props;
        const { call, active, avatar, name } = this.state;
        const user = this.user;
        return (
            <Container scrollEnabled={false}>
                <StatusBar backgroundColor="transparent" barStyle="light-content" translucent={true} />

                {call ? (
                    <NoteScreen
                        onEndCall={() => {
                            this.toggleModal(), this.setState({ call: false });
                        }}
                        onSave={value => {
                            this.setState({ note: value, call: false });
                        }}
                        onChangeNote={text => (this.note = text)}
                        isMute={this.state.mute}
                        isSpeaker={this.state.isSpeaker}
                        onMute={this}
                        onSpeaker={this.changeSpeaker}
                        onPress={() => {
                            this.setState({ call: false });
                            this.note = this.state.note;
                        }}
                        inputRef={input => (this.inputNote = input)}
                        source={{ uri: user.avatar }}
                    />
                ) : (
                    <ImageBackground
                        style={{ width: "100%", height: "100%", alignItems: "center" }}
                        source={{ uri: user.avatar }}
                    >
                        <LinearGradient colors={Colors.GRADIENTBLACK} style={styles.gradient} />
                        <AppImage source={{ uri: user.avatar }} style={styles.avatar} resizeMode="cover" />
                        <AppText text={user.nickname} style={styles.txtCallName} />
                        <AppText text="Đang gọi..." style={styles.txtCalling} />
                        <View style={styles.viewBtn}>
                            {this.renderButton(
                                require("../../assets/icon/ic-note.png"),
                                I18n.t("CallScreen.note"),
                                () => {
                                    this.setState({ call: true }, () => {
                                        this.inputNote.focus();
                                    });
                                }
                            )}
                            {this.renderButton(
                                !this.state.isSpeaker
                                    ? require("../../assets/icon/ic-externalSpeaker.png")
                                    : require("../../assets/icon/ic-externalSpeaker-active.png"),
                                I18n.t("CallScreen.externalSpeaker"),
                                this.changeSpeaker
                            )}
                            {this.renderButton(
                                !this.state.mute
                                    ? require("../../assets/icon/ic-mute.png")
                                    : require("../../assets/icon/ic-mute-active.png"),
                                I18n.t("CallScreen.mute"),
                                this.mute
                            )}
                        </View>
                        <Button
                            style={{
                                width: "40%",
                                backgroundColor: "#FF4B56",
                                marginTop: 30
                            }}
                            centerContent={
                                <AppImage
                                    local
                                    source={require("../../assets/icon/ic-horizontalCall.png")}
                                    style={{ width: 25, height: 10 }}
                                />
                            }
                            onPress={() => this.toggleModal()}
                        />
                    </ImageBackground>
                )}
            </Container>
        );
    }
}

function mapStateToProps(state) {
    return {
        userReducer: state.userReducer
    };
}
Call = connect(mapStateToProps)(Call);

export default Call;
