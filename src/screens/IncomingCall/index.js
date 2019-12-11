import React from "react";
import {
    View,
    Alert,
    ImageBackground,
    TouchableOpacity,
    StatusBar,
    Dimensions,
    Platform,
    Vibration,
    DeviceEventEmitter,
    Image
} from "react-native";
import { connect } from "react-redux";
import { Const, Colors } from "helper/index";
import { types, userActions } from "actions/index";
import { Container, Button, AppImage, Input, AppText, AppImageCircle } from "components/index";
import styles from "./styles";
import I18n from "helper/locales";
import { Images } from "assets";
import LinearGradient from "react-native-linear-gradient";
import IncallManager from "react-native-incall-manager";
import firebase from "firebase";
const { width: DEVICE_WIDTH, height: DEVICE_HEIGHT } = Dimensions.get("window");
import { callHistoryRequest } from "actions/callActions";
import { Grayscale } from "react-native-color-matrix-image-filters";

const width = Const.DEVICE.DEVICE_WIDTH;
const height = Const.DEVICE.DEVICE_HEIGHT;
const PATTERN = [5000, 1000, 0];
class IncomingCall extends React.Component {
    constructor(props) {
        super(props);
        const { state } = props.navigation;
        const { params } = state;
        const { callData } = params;
        const { caller, to, isVideo } = callData;
        console.log("+++++++++++++++++++++++++++++++++++++++", params, isVideo);
        this.state = {
            call: false,
            active: false,
            isVideo: isVideo
        };
        this.friendId = caller;
        this.callData = callData;
        this.myId = to;
        this.myDb = firebase.database().ref(`video-call/${to}`);
        this.callerDb = firebase.database().ref(`video-call/${caller}`);
        this.isToVIdeo = false;
        this.isFinished = false;
    }

    async componentDidMount() {
        await IncallManager.checkRecordPermission();
        IncallManager.start({
            media: this.state.isVideo ? "video" : "audio",
            auto: true
        });
        // DeviceEventEmitter.addListener("WiredHeadset", data => {
        //     console.log("test incoming", JSON.stringify(data));
        //     const { deviceName, hasMic, isPlugged = false } = data;
        //     IncallManager.setForceSpeakerphoneOn(!isPlugged);
        //     if (isPlugged) {
        //         IncallManager.chooseAudioRoute("WIRED_HEADSET");
        //     } else {
        //         IncallManager.chooseAudioRoute("SPEAKER_PHONE");
        //     }
        // });
        const { isRingtone = true, isCallVibration = true } = this.callData;
        console.log("12312311111", isRingtone, isCallVibration, this.callData);
        if (isRingtone) {
            IncallManager.startRingtone("_BUNDLE_", [], "", 60);
        } else {
            IncallManager.stopRingtone();
        }
        if (isCallVibration) {
            Vibration.vibrate(PATTERN, true);
        }
        this.myDb.limitToLast(1).on("child_added", childSnapshot => {
            const item = childSnapshot.toJSON();
            const { status, to } = item;
            if (status === "finished" && to === this.myId && !this.isToVIdeo && !this.isFinished) {
                this.isFinished = true;
                IncallManager.stopRingtone();
                IncallManager.setKeepScreenOn(false);
                IncallManager.setForceSpeakerphoneOn(false);
                IncallManager.stop();
                this.props.navigation.goBack();
                // this.myDb.remove();
                this.props.dispatch(callHistoryRequest(this.myId));
            }
        });
    }

    findCaller = () => {
        // console.log("test contact reducer", this.props.contactReducer);
        return null;
        // const { contactReducer } = this.props;
        // const { data = {} } = contactReducer;
        // const { response = [] } = data;
        // if (response.length === 0) {
        //     return null;
        // }
        // const returnItem = response.find(item => {
        //     const { about_user = {} } = item;
        //     const { id } = about_user;
        //     return id === this.friendId;
        // });
        // return returnItem;
    };

    componentDidUpdate(prevProps) {}

    canceledCall = () => {
        IncallManager.stopRingtone();
        IncallManager.setKeepScreenOn(false);
        IncallManager.setForceSpeakerphoneOn(false);
        console.log("2321312312311", this.myDb, this.callerDb);
        this.callerDb.push({
            caller: this.friendId,
            to: this.myId,
            status: "finished",
            isCanReceive: true
        });
        this.myDb.push({
            caller: this.friendId,
            to: this.myId,
            status: "finished",
            isCanReceive: true
        });
    };

    acceptCall = () => {
        IncallManager.stopRingtone();
        IncallManager.setKeepScreenOn(true);
        // IncallManager.setForceSpeakerphoneOn(true);
        Vibration.cancel();
        this.callerDb
            .push({
                caller: this.friendId,
                to: this.myId,
                status: "connected",
                isCanReceive: false,
                isVideo: this.callData.isVideo,
                media: {
                    width: DEVICE_WIDTH,
                    height: DEVICE_HEIGHT
                }
            })
            .then(data => {
                console.log("132323111111  gggg", data);
                this.isToVIdeo = true;
                this.props.navigation.replace("VideoCall", {
                    roomId: this.myId,
                    userId: this.myId,
                    callerId: this.friendId,
                    isVideo: this.callData.isVideo,
                    callData: this.callData
                });
            });
    };

    render() {
        const { navigation } = this.props;
        const { callData } = this;
        const { active } = this.state;
        const { callerName = "", isVideo, avatar = "" } = callData;
        const callerItem = this.findCaller();
        let showName, showAvatar;
        if (!!callerItem) {
            const { nickname = "", avatar: ava = "" } = callerItem;
            showName = nickname;
            showAvatar = ava;
        } else {
            showName = callerName;
            showAvatar = avatar;
        }
        return (
            <Container scrollEnabled={false}>
                <ImageBackground
                    style={{ width: "100%", height: "100%", alignItems: "center" }}
                    source={{ uri: showAvatar }}
                >
                    <LinearGradient colors={Colors.GRADIENTBLACK} style={styles.gradient} />
                    <AppImage source={{ uri: showAvatar }} style={styles.avatar} resizeMode="cover" />
                    <AppText text={showName} style={styles.txtCallName} />
                    <AppText text={`Cuộc gọi ${isVideo ? "hình ảnh" : "âm thanh"}...`} style={styles.txtCalling} />

                    <View
                        style={{
                            flexDirection: "row",
                            width: "100%",
                            justifyContent: "space-between",
                            position: "absolute",
                            bottom: 50,
                            paddingHorizontal: 30
                        }}
                    >
                        <Button
                            onPress={this.acceptCall}
                            style={{
                                width: 70,
                                height: 70,
                                borderRadius: 35,
                                backgroundColor: "#50B800"
                            }}
                            centerContent={
                                <Image
                                    tintColor={Colors.WHITE_COLOR}
                                    source={require("../../assets/icon/call-inactive.png")}
                                    style={{ width: 30, height: 30, tintColor: Colors.WHITE_COLOR }}
                                />
                            }
                        />
                        <Button
                            onPress={this.canceledCall}
                            style={{
                                width: 70,
                                height: 70,
                                borderRadius: 35,
                                backgroundColor: "#FF4B56"
                            }}
                            centerContent={
                                <Image
                                    source={require("../../assets/icon/btn-close.png")}
                                    style={{ width: 30, height: 30, tintColor: Colors.WHITE_COLOR }}
                                />
                            }
                        />
                    </View>
                </ImageBackground>
            </Container>
        );
    }
}

function mapStateToProps(state) {
    return {
        contactReducer: state.contactReducer
    };
}
IncomingCall = connect(mapStateToProps)(IncomingCall);

export default IncomingCall;
