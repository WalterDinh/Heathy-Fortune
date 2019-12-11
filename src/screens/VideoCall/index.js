import React, { Component } from "react";
import { connect } from "react-redux";
import {
    Platform,
    View,
    Dimensions,
    TouchableOpacity,
    Text,
    DeviceEventEmitter,
    StatusBar,
    ImageBackground,
    BackHandler
} from "react-native";
import LinearGradient from "react-native-linear-gradient";
import { Container, Button, AppImage, Input, AppText, AppImageCircle } from "components/index";
import I18n from "helper/locales";
import {
    RTCPeerConnection,
    RTCMediaStream,
    RTCIceCandidate,
    RTCSessionDescription,
    RTCView,
    MediaStreamTrack,
    mediaDevices
} from "react-native-webrtc";
import styles from "./styles";
import { Colors } from "helper/index";
import firebase from "firebase";
import { Stopwatch, Timer } from "react-native-stopwatch-timer";
import IncallManager from "react-native-incall-manager";
import { callHistoryRequest } from "actions/callActions";
import { updateAmount, loginSuccess } from "actions/userActions";
import EndCall from "../Call/EndCall";
import NoteScreen from "../Call/NoteScreen";

import { ServiceHandle } from "helper";
import { numberToCurrency } from "helper/convertLang";

const { width: DEVICE_WIDTH, height: DEVICE_HEIGHT } = Dimensions.get("window");

const moment = require("moment");

const pcPeers = {};

const configuration = {
    configuration: {
        offerToReceiveAudio: true,
        offerToReceiveVideo: true
    },
    iceServers: [
        // {
        //     url: "turn:turn.thanhdiepivn.com",
        //     credential: "hUcgRy59MyX4DZSK",
        //     username: "thanhdiep"
        // }
        {
            url: "turn:112.213.94.138:2233",
            credential: "admin1234",
            username: "admin"
            // password: "admin1234"
        }
    ]
};

const options = {
    container: {
        backgroundColor: "transparent",
        marginTop: 10,
        alignSelf: "center",
        marginBottom: 5
    },
    text: {
        fontSize: 16,
        color: "#000"
        // marginLeft: 7
    }
};

// let peerConnection = new RTCPeerConnection(configuration);

class VideoCall extends Component {
    // Initial state
    constructor(props) {
        super(props);
        const { params = {} } = props.navigation.state;
        const { isSpeaker = false, isMute = false } = params;

        console.log("1321111111111111", isSpeaker);
        this.state = {
            videoURL: "",
            isFront: true,
            friendVideo: "",
            pc: new RTCPeerConnection(configuration),
            localStream: null,
            clockStart: false,
            isMute: isMute,
            isVideo: true,
            active: false,
            call: false,
            note: "",
            price: 0,
            isSpeaker: isSpeaker
        };
    }
    isDisconnect = false;
    isSendIce = false;
    isIceCandidateAdded = false;
    isUpdateAmount = false;
    isDisconnectFrom = false;
    isHasMedia = false;
    mediaInfo = { width: DEVICE_WIDTH, height: DEVICE_HEIGHT, isVideo: false };
    yourId = this.props.navigation.state.params.userId;
    isOffer = true;
    timer = 0;
    isAddCallLog = false;
    iceArray = [];

    sendMessage = (senderId, data) => {
        var msg = firebase
            .database()
            .ref(`/video-call/${this.props.navigation.state.params.roomId}`)
            .push({ sender: senderId, message: data });
        msg.remove();
    };

    async componentWillMount() {
        this.backHandler = BackHandler.addEventListener("hardwareBackPress", () => {
            return true;
        });
        const { params = {} } = this.props.navigation.state;
        const { isFrom, roomId, consultant_fee } = params;
        console.log("111111111111111111111", consultant_fee);
        this.PRICE_PER_MINUTE = consultant_fee || 1000;
    }

    getMiliSecondFromAmount = () => {
        const { userReducer } = this.props;
        const { data = {} } = userReducer;
        const { amount = 0 } = data;
        totalMili = Math.abs(amount * 60);
        return totalMili;
    };

    addToCallLog = id => {
        const { params = {} } = this.props.navigation.state;
        const { isFrom, roomId } = params;
        if (isFrom) {
            this.amountListen = firebase
                .database()
                .ref(`/call-log-id/${roomId}`)
                .push({
                    call_log: id,
                    price: this.state.price
                })
                .then(data => {
                    this.amountListen = null;
                });
            return;
        }
    };

    pressEndCall = value => {
        const { balance } = this.state;
        const { params = {} } = this.props.navigation.state;
        const { callerId } = params;
        const { userId, roomId } = params;
        const paramsAdd = {
            user_call_id: userId,
            user_receive_id: roomId,
            start_time:
                this.startTime ||
                moment()
                    .utc()
                    .format("YYYY-MM-DD HH:mm:ss.SSSSSS"),
            end_time: this.endTime,
            duration: this.timer,
            review_point: value,
            note_called_user: this.note
        };
        this.toggleModal();
        this.props.navigation.goBack();
        updateAmount({
            id: callerId,
            money: balance
        }).then(res => {
            if (!res.error) {
                let userUpdate = this.props.userReducer.data;
                userUpdate.amount = balance;
                this.props.dispatch(loginSuccess(userUpdate));
            }
        });
        // ServiceHandle.post(`call_log/`, paramsAdd)
        //     .then(res => {
        //         console.log("error post", res);
        //         this.afterCreateCallLog(res);
        //     })
        //     .catch(e => {
        //         this.props.dispatch(callHistoryRequest(userId));
        //         // this.props.dispatch(getTeacherRequest({ type: 1 }));
        //     });
    };

    renderEndCall() {
        const { active, duration, startTime, price, balance } = this.state;
        const { params = {} } = this.props.navigation.state;
        return (
            <EndCall
                duration={duration}
                startTime={startTime}
                price={price}
                balance={numberToCurrency(balance)}
                isModalVisible={active}
                onBackdropPress={() => console.log("")}
                onPress={this.pressEndCall}
            />
        );
    }

    afterCreateCallLog(res) {
        const { params = {} } = this.props.navigation.state;
        const { userId } = params;
        if (res.error === true) {
            alert(res.errorMessage);
        } else {
            this.addToCallLog(res.response.id);
            this.setState({
                callLogId: res.response.id
            });
        }
        this.props.dispatch(callHistoryRequest(userId));
        // this.props.dispatch(getTeacherRequest({ type: 1 }));
    }

    componentDidMount() {
        if (Platform.OS !== "ios") {
            IncallManager.turnScreenOn();
        }
        const { params = {} } = this.props.navigation.state;
        const { isFrom, userId, roomId, note = "", callerId } = params;
        const { userReducer } = this.props;
        const { data = {} } = userReducer;
        const { amount = 0, id = 0 } = data;

        firebase
            .database()
            .ref(`/video-call/${userId}`)
            .limitToLast(1)
            .on("child_added", childSnapshot => {
                const item = childSnapshot.toJSON();
                const { media, status } = item;
                if (status === "connected" && !this.isHasMedia) {
                    const { isVideo = false } = item;
                    IncallManager.start({
                        media: isVideo ? "video" : "audio",
                        auto: true
                    });
                    if (this.state.isSpeaker || isVideo) {
                        IncallManager.setForceSpeakerphoneOn(true);
                    } else {
                        IncallManager.setForceSpeakerphoneOn(false);
                    }

                    IncallManager.setKeepScreenOn(true);

                    this.isHasMedia = true;
                    console.log("tesst media user", this.localStream);
                    if (!this.localStream) {
                        console.log("tesst media user", media);

                        mediaDevices
                            .getUserMedia({
                                audio: {
                                    volume: 1.0,
                                    echoCancellation: true
                                    // noiseSuppression: true
                                },
                                video: isVideo
                                    ? {
                                          mandatory: {
                                              width: media.width, // Provide your own width, height and frame rate here
                                              height: media.height,
                                              minFrameRate: 30
                                          },
                                          facingMode: "user",
                                          optional: []
                                      }
                                    : false
                            })
                            .then(stream => {
                                this.localStream = stream;
                                this.setState({
                                    videoURL: stream.toURL(),
                                    localStream: stream,
                                    isVideo: isVideo,
                                    note: note
                                });
                                this.createPC();
                                if (this.isOffer) {
                                    return this.createOffer(this.state.pc);
                                }
                            })

                            .catch(e => {
                                console.log("ttttttttttttttt", e);
                            });
                    }
                }
                if (status === "finished") {
                    // this.isDisconnect = true;
                    console.log("qqssssssssssssssssssssssssss", status);
                    this.backHandler.remove();
                    if (!this.isAddCallLog) {
                        if (isFrom) {
                            setTimeout(() => {
                                firebase
                                    .database()
                                    .ref(`/video-call/${callerId}`)
                                    .remove();
                                firebase
                                    .database()
                                    .ref(`/video-call/${roomId}`)
                                    .remove();
                            }, 500);
                            this.setState({
                                active: true,
                                myId: id,
                                price: Math.round((this.PRICE_PER_MINUTE / 60) * this.timer),
                                clockStart: false,
                                balance: Math.round(amount) - (this.PRICE_PER_MINUTE / 60) * this.timer,
                                startTime: moment
                                    .utc(this.startTime)
                                    .local()
                                    .format("YYYY-MM-DD HH:mm"),
                                duration: moment(this.timer * 1000)
                                    .utc()
                                    .format("HH:mm:ss")
                            });
                        } else {
                            this.isIceCandidateAdded = false;
                            setTimeout(() => {
                                firebase
                                    .database()
                                    .ref(`/video-call/${callerId}`)
                                    .remove();
                                firebase
                                    .database()
                                    .ref(`/video-call/${roomId}`)
                                    .remove();
                            }, 500);
                            firebase
                                .database()
                                .ref(`/call-log-id/${id}`)
                                .limitToLast(1)
                                .on("child_added", childSnapshot => {
                                    const lastItem = childSnapshot.toJSON();
                                    const { call_log, price } = lastItem;
                                    let userUpdate = this.props.userReducer.data || {};
                                    // if (!this.isUpdateAmount) {
                                    //     updateAmount({
                                    //         id: id,
                                    //         money: userUpdate.amount + price
                                    //     })
                                    //         .then(res => {
                                    //             this.isUpdateAmount = true;
                                    //             if (!res.error) {
                                    //                 userUpdate.amount = userUpdate.amount + price;
                                    //                 this.props.dispatch(loginSuccess(userUpdate));
                                    //                 this.props.dispatch(callHistoryRequest(userId));
                                    //                 // this.props.dispatch(getTeacherRequest({ type: 1 }));
                                    //             }
                                    //             ServiceHandle.patch(`/call_log/${call_log}/`, {
                                    //                 note_received_user: this.note
                                    //             })
                                    //                 .then(res => {
                                    //                     firebase
                                    //                         .database()
                                    //                         .ref(`/call-log-id/${id}`)
                                    //                         .remove();
                                    //                 })
                                    //                 .catch(e => {
                                    //                     console.log("error patch note", e);
                                    //                     firebase
                                    //                         .database()
                                    //                         .ref(`/call-log-id/${id}`)
                                    //                         .remove();
                                    //                 });
                                    //         })
                                    //         .catch(e => {});
                                    // }
                                });
                        }
                        this.isAddCallLog = true;
                        IncallManager.stop();
                    }
                    if (!isFrom) {
                        IncallManager.setForceSpeakerphoneOn(false);
                        IncallManager.setSpeakerphoneOn(false);
                        IncallManager.setKeepScreenOn(false);
                        // this.props.navigation.goBack();
                    }
                    if (!!this.state.pc) {
                        this.state.pc.close();
                        this.setState({ pc: null });
                    }
                    return;
                }
            });

        firebase
            .database()
            .ref(`/video-call/${roomId}`)
            .on("child_added", childSnapshot => {
                if (!!childSnapshot.val().message) {
                    this.readMessage(childSnapshot);
                }
            });
    }

    componentWillUnmount() {
        if (!this.isDisconnect) {
            this.backHandler.remove();
            const { params = {} } = this.props.navigation.state;
            const { roomId, callerId } = params;
            const { localStream } = this.state;
            if (!!this.state.pc) {
                this.state.pc.close();
                pc.remo;
                this.setState({
                    pc: null
                });
            }
            this.setState({
                isVideo: true,
                note: ""
            });
            if (!!localStream && !!localStream.release()) {
                localStream.release();
            }
            this.isIceCandidateAdded = false;
            console.log("tesstttttttttttttttttttttttt disconnected");
            firebase
                .database()
                .ref(`/video-call/${callerId}`)
                .push({
                    caller: callerId,
                    to: roomId,
                    isCanReceive: true,
                    status: "finished"
                })
                .then(() => {
                    setTimeout(() => {
                        firebase
                            .database()
                            .ref(`/video-call/${callerId}`)
                            .remove();
                    }, 500);
                });
            firebase
                .database()
                .ref(`/video-call/${roomId}`)
                .push({
                    caller: callerId,
                    to: roomId,
                    isCanReceive: true,
                    status: "finished"
                })
                .then(() => {
                    setTimeout(() => {
                        firebase
                            .database()
                            .ref(`/video-call/${roomId}`)
                            .remove();
                    }, 500);
                });
        }
    }
    iceReceives = [];

    readMessage(data) {
        const { pc } = this.state;
        var msg = JSON.parse(data.val().message);
        var sender = data.val().sender;
        // console.log("test mssg receive", msg);
        if (sender != this.yourId && !!pc && !!msg) {
            if (!!msg.ice) {
                console.log("fffffsss", msg);
                pc.addIceCandidate(new RTCIceCandidate(msg.ice))
                    .then(() => {
                        console.log("add success");
                    })
                    .catch(e => {
                        console.log("add error", e, msg.ice, pc.localDescription, pc.remoteDescription);
                    });
            } else if (msg.sdp.type === "offer") {
                pc.setRemoteDescription(new RTCSessionDescription(msg.sdp))
                    .then(() => {
                        if (pc.remoteDescription.type == "offer") {
                            pc.createAnswer()
                                .then(desc => {
                                    pc.setLocalDescription(desc)
                                        .then(() => {
                                            this.sendMessage(this.yourId, JSON.stringify({ sdp: pc.localDescription }));
                                        })
                                        .catch(e => console.log("set Local Description error", e));
                                })
                                .catch(e => console.log("errror create answer", e));
                        }
                    })
                    .catch(e => console.log("set remote error", e));
            } else if (msg.sdp.type == "answer") {
                pc.setRemoteDescription(new RTCSessionDescription(msg.sdp)).then(() => {
                    console.log("sucess set remote answerrrrrrrrrrrrrrrrrrrrrrrrrrrrrr");
                });
            }
        }
    }

    getStats = () => {
        const { pc } = this.state;
        if (!!pc && pc.getRemoteStreams()[0] && pc.getRemoteStreams()[0].getAudioTracks()[0]) {
            const track = pc.getRemoteStreams()[0].getAudioTracks()[0];
            pc.getStats(track)
                .then(report => {
                    console.log("getStats report", report, JSON.stringify(configuration));
                })
                .catch(e => console.log(e));
        }
    };

    createOffer(pc) {
        if (this.props.navigation.state.params.isFrom) {
            pc.createOffer({
                offerToReceiveAudio: true,
                offerToReceiveVideo: true
            }).then(desc => {
                pc.setLocalDescription(desc)
                    .then(() => {
                        console.log("test set local offer", pc.localDescription);
                        this.isOffer = false;
                        this.sendMessage(this.yourId, JSON.stringify({ sdp: pc.localDescription }));
                        // }
                    })
                    .catch(e => {
                        console.log("aaaaaaaaaaaaaaaaaaassss", e);
                    });
            });
        } else {
            this.isOffer = false;
        }
    }

    createPC = async () => {
        const { pc } = this.state;
        console.log("================", pc);

        pc.onicegatheringstatechange = event => {
            console.log("============ gather", event.target.iceGatheringState);
            if (event.target.iceGatheringState === "complete") {
            }
        };

        pc.onicecandidate = event => {
            console.log("============ onicecandidate", event.candidate);

            if (event.candidate === null) {
            }
            if (!!event.candidate) {
                this.sendMessage(this.yourId, JSON.stringify({ ice: event.candidate }));
            }
        };

        pc.onsignalingstatechange = event => {
            console.log("============ sinalingState", event.target.signalingState);
        };

        pc.oniceconnectionstatechange = event => {
            console.log("============ iceConnectionState", event.target.iceConnectionState);
            if (event.target.iceConnectionState === "connected") {
                this.setState({ clockStart: true });
                this.startTime = moment()
                    .utc()
                    .format("YYYY-MM-DD HH:mm:ss.SSSSSS");
            }
            if (event.target.iceConnectionState === "disconnected" || event.target.iceConnectionState === "closed") {
                console.log(
                    "============ iceConnectionState disconnect",
                    event.target.iceConnectionState,
                    this.isDisconnect
                );
                if (!this.isDisconnect) {
                    this.setState({ clockStart: false });
                    this.endTime = moment()
                        .utc()
                        .format("YYYY-MM-DD HH:mm:ss.SSSSSS");
                    this.disconnectCall();
                }
            }
            if (event.target.iceConnectionState === "completed") {
                setTimeout(() => {
                    this.getStats();
                }, 1000);
            }
        };

        // pc.createDataChannel("");

        pc.onnegotiationneeded = () => {
            console.log("============ onnegotiationneeded", this.isOffer);
            if (this.isOffer) {
                // this.createOffer(pc);
            }
        };

        pc.onremovestream = event => {
            console.log("=========== onremovestream", event.stream);
        };

        pc.onaddstream = event => {
            console.log("============ on stream add", event.stream, pc);
            this.setState({
                friendVideo: event.stream.toURL()
            });
        };
        if (!!this.localStream) {
            await pc.addStream(this.localStream);
        }
    };

    switchCameraButton = () => {
        const { pc } = this.state;
        console.log("132132311231311", pc.getLocalStreams()[0].getVideoTracks()[0]);
        pc.getLocalStreams()[0]
            .getVideoTracks()[0]
            ._switchCamera();
    };

    mute = () => {
        console.log("131231232111", this.state.isMute);
        const { pc } = this.state;
        pc.getLocalStreams()[0].getAudioTracks()[0].enabled = this.state.isMute;
        this.setState({ isMute: !this.state.isMute });
    };

    changeSpeaker = () => {
        // IncallManager.setSpeakerphoneOn(!this.state.isSpeaker);
        console.log("123111111111", this.state.isSpeaker);
        IncallManager.setForceSpeakerphoneOn(!this.state.isSpeaker);
        this.setState({ isSpeaker: !this.state.isSpeaker });
    };

    disconnectCall() {
        if (!this.isDisconnect) {
            this.isDisconnect = true;
            const { pc, localStream } = this.state;
            const { params = {} } = this.props.navigation.state;
            const { roomId, callerId, isFrom } = params;
            this.isOffer = false;

            this.isIceCandidateAdded = false;
            if (!!pc) {
                pc.close();
                pc.onicecandidate = null;
                pc.onaddstream = null;
                this.setState({
                    pc: null
                });
            }
            this.setState({ call: false });
            this.isDisconnectFrom = true;
            firebase
                .database()
                .ref(`/video-call/${callerId}`)
                .push({
                    caller: callerId,
                    to: roomId,
                    isCanReceive: true,
                    status: "finished"
                })
                .then(() => {
                    setTimeout(() => {
                        firebase
                            .database()
                            .ref(`/video-call/${callerId}`)
                            .remove();
                    }, 1000);
                });
            firebase
                .database()
                .ref(`/video-call/${roomId}`)
                .push({
                    caller: callerId,
                    to: roomId,
                    isCanReceive: true,
                    status: "finished"
                })
                .then(() => {
                    setTimeout(() => {
                        firebase
                            .database()
                            .ref(`/video-call/${roomId}`)
                            .remove();
                    }, 1000);
                });

            console.log("1111111222233333444444", isFrom);
            if (isFrom) {
                this.endTime = moment()
                    .utc()
                    .format("YYYY-MM-DD HH:mm:ss.SSSSSS");
            } else {
                this.props.navigation.goBack();
            }
        }
    }

    getMsecs = time => {
        // const { params = {} } = this.props.navigation.state;
        // const { isFrom } = params;
        // console;
        // if (time >= this.getMiliSecondFromAmount() && isFrom) {
        //     // console.log("13231313131311111111 test time", time, this.getMiliSecondFromAmount());
        //     this.disconnectCall();
        // } else {
        //     this.timer = Math.floor(time / 1000);
        // }
    };

    toggleModal = () => {
        this.setState({ active: false });
    };

    renderButton = (source, title, onPress, color) => {
        return (
            <View>
                <TouchableOpacity
                    onPress={onPress}
                    style={[styles.btnNoteDisable, !!color ? { backgroundColor: color } : {}]}
                >
                    <AppImage source={source} style={{ width: 30, height: 30 }} />
                </TouchableOpacity>
            </View>
        );
    };

    renderNote(avatar) {
        return (
            <NoteScreen
                onEndCall={() => {
                    this.disconnectCall();
                    if (!this.props.navigation.state.params.isFrom) {
                        this.toggleModal();
                    }
                    this.setState({ call: false });
                }}
                onChangeNote={text => (this.note = text)}
                onMute={this.mute}
                onSpeaker={this.changeSpeaker}
                isMute={this.state.isMute}
                isSpeaker={this.state.isSpeaker}
                text={this.state.note}
                onSave={value => this.setState({ note: value, call: false })}
                onPress={() => {
                    this.setState({ call: false });
                    this.note = this.state.note;
                }}
                inputRef={input => (this.inputNote = input)}
                source={{ uri: avatar }}
            />
        );
    }

    render() {
        const { active, call } = this.state;
        const { params = {} } = this.props.navigation.state;
        const { callData = {}, isVideo = false, callerId } = params;
        const { userId, roomId } = params;
        const { userReducer } = this.props;
        const { data = {} } = userReducer;
        const { amount = 0, id = 0 } = data;
        // const { active } = this.state;
        const { callerName = "", avatar = "" } = callData;
        if (isVideo) {
            return (
                <View style={{ width: DEVICE_WIDTH, height: DEVICE_HEIGHT, backgroundColor: Colors.SKY_BLUE }}>
                    {call ? this.renderNote(avatar) : null}
                    <View style={{ display: call ? "none" : "flex" }}>
                        <View style={[styles.myVideo, { width: DEVICE_WIDTH / 3, height: DEVICE_HEIGHT / 3 }]}>
                            <RTCView
                                zOrder={1}
                                streamURL={this.state.videoURL}
                                style={{
                                    width: DEVICE_WIDTH / 3,
                                    height: DEVICE_HEIGHT / 3
                                }}
                            />
                            <TouchableOpacity
                                style={{
                                    width: 20,
                                    height: 20,
                                    borderRadius: 10,
                                    backgroundColor: "#ccc",
                                    alignItems: "center",
                                    justifyContent: "center",
                                    alignSelf: "center",
                                    bottom: 10,
                                    position: "absolute"
                                }}
                                onPress={this.switchCameraButton}
                            >
                                <AppImage
                                    source={require("../../assets/icon/switch-camera.png")}
                                    style={{ width: 10, height: 10 }}
                                />
                            </TouchableOpacity>
                        </View>
                        <View style={{ width: DEVICE_WIDTH, height: DEVICE_HEIGHT }}>
                            <RTCView
                                streamURL={this.state.friendVideo || "test"}
                                style={[{ width: DEVICE_WIDTH, height: DEVICE_HEIGHT }]}
                            />
                        </View>
                        <View
                            style={{
                                width: "100%",
                                position: "absolute",
                                bottom: 50,
                                zIndex: 990
                            }}
                        >
                            <View
                                style={{
                                    flexDirection: "row",
                                    width: "100%",
                                    paddingHorizontal: 20,
                                    justifyContent: "space-between"
                                }}
                            >
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
                                    require("../../assets/icon/call-active.png"),
                                    I18n.t("CallScreen.externalSpeaker"),
                                    () => this.disconnectCall(),
                                    "red"
                                )}
                                {this.renderButton(
                                    this.state.isMute
                                        ? require("../../assets/icon/ic-mute-active.png")
                                        : require("../../assets/icon/ic-mute.png"),
                                    I18n.t("CallScreen.mute"),
                                    this.mute
                                )}
                            </View>
                            <Stopwatch
                                start={this.state.clockStart}
                                reset={false}
                                options={options}
                                getMsecs={this.getMsecs}
                            />
                        </View>
                        {this.renderEndCall()}
                    </View>
                </View>
            );
        }
        return (
            <Container scrollEnabled={false}>
                <StatusBar backgroundColor="transparent" barStyle="light-content" translucent={true} />

                {call ? this.renderNote() : null}
                <ImageBackground
                    style={{
                        width: "100%",
                        height: "100%",
                        alignItems: "center",
                        display: call ? "none" : "flex"
                    }}
                    source={{ uri: avatar }}
                >
                    <LinearGradient colors={Colors.GRADIENT} style={styles.gradient} />
                    <AppImage source={{ uri: avatar }} style={styles.avatar} resizeMode="cover" />
                    <AppText text={callerName} style={styles.txtCallName} />
                    <Stopwatch
                        start={this.state.clockStart}
                        reset={false}
                        options={styles.txtCalling}
                        getMsecs={this.getMsecs}
                    />
                    <View style={styles.viewBtn}>
                        {this.renderButton(require("../../assets/icon/ic-note.png"), I18n.t("CallScreen.note"), () => {
                            this.setState({ call: true }, () => {
                                this.inputNote.focus();
                            });
                        })}
                        {this.renderButton(
                            !this.state.isSpeaker
                                ? require("../../assets/icon/ic-externalSpeaker.png")
                                : require("../../assets/icon/ic-externalSpeaker-active.png"),
                            I18n.t("CallScreen.externalSpeaker"),
                            this.changeSpeaker
                        )}
                        {this.renderButton(
                            this.state.isMute
                                ? require("../../assets/icon/ic-mute-active.png")
                                : require("../../assets/icon/ic-mute.png"),
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
                                source={require("../../assets/icon/ic-horizontalCall.png")}
                                style={{ width: 25, height: 10 }}
                            />
                        }
                        onPress={() => this.disconnectCall()}
                    />
                </ImageBackground>
                {this.renderEndCall()}
            </Container>
        );
    }
}

function mapStateToProps(state) {
    return {
        userReducer: state.userReducer
    };
}
VideoCall = connect(mapStateToProps)(VideoCall);

export default VideoCall;
