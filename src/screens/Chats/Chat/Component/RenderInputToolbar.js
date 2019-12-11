import React, { Component } from "react";
import { View, Input } from "native-base";
import { DEVICE, PD } from "helper/Consts";
import { TouchableOpacity, Platform } from "react-native";
import FastImage from "react-native-fast-image";
import { ICON } from "assets";
import ImagePicker from "react-native-image-picker";
import RNFetchBlob from "rn-fetch-blob";
import chatFn from "../Functions";
import firebase from "firebase";
import I18n from "helper/locales";
import uuid from "uuid";
import ImageResizer from "react-native-image-resizer";
import * as RNfirebase from "react-native-firebase";
import { alertActions } from "actions";
import { Const } from "helper";
import { AppImage } from "components";
import { Icon } from "native-base";
import { responsiveFontSize } from "react-native-responsive-dimensions";
import { Colors } from "helper";

const moment = require("moment");
const _ = require("lodash");

const options = {
    base64: true,
    title: "Select Avatar",
    customButtons: [{ name: "fb", title: "Choose Photo from Facebook" }],
    storageOptions: {
        skipBackup: true,
        path: "images"
    }
};
export default class RenderInputToolbar extends Component {
    constructor(props) {
        super(props);
        this.state = {
            value: "",
            onFocus: false,
            showAddition: false
            // id: null
        };
    }

    onChangeText(e) {
        this.setState({ value: e });
    }

    loadingImage(data, id) {
        let { onLoadingImage = () => {}, user, lastMessage } = this.props;
        let index = lastMessage && lastMessage.index ? lastMessage.index : 0;
        onLoadingImage(chatFn.convertMessImage(data.uri, data, user, index, id));
    }

    onOpenCamera() {
        let { showAddition } = this.props;
        if (showAddition) {
            this.onOpenAddition();
        }
        ImagePicker.launchCamera(options, async response => {
            if (response.data) {
                let id = uuid.v4();
                let { lastMessage } = this.props;
                let index = lastMessage && lastMessage.index ? lastMessage.index : 0;
                this.loadingImage(response, id, index);
                if (response.fileSize > 1500000) {
                    this.compressImage(response, id, index);
                } else {
                    this.toBlob(response, response, id, index);
                }
            }
        });
    }

    onOpenLibrary() {
        let { showAddition } = this.props;
        if (showAddition) {
            this.onOpenAddition();
        }
        // RNfirebase.crashlytics().log("onOpenLibrary");
        ImagePicker.launchImageLibrary(options, response => {
            // RNfirebase.crashlytics().log("ImagePicker.launchImageLibrary");
            if (response.data) {
                // RNfirebase.crashlytics().log("response.data", response);
                try {
                    let id = uuid.v4();
                    let { lastMessage } = this.props;
                    let index = lastMessage && lastMessage.index ? lastMessage.index : 0;
                    this.loadingImage(response, id, index);
                    if (response.fileSize > 1500000) {
                        // RNfirebase.crashlytics().log("response.fileSize > 1500000");
                        this.compressImage(response, id, index);
                    } else {
                        // RNfirebase.crashlytics().log("response.fileSize");

                        this.toBlob(response, response, id, index);
                    }
                } catch (error) {
                    // RNfirebase.crashlytics().log("error", error);
                }
            } else {
                // alert("null");
            }
        });
    }

    compressImage(result, id, index) {
        let width = 0;
        let height = 0;
        if (result.width / result.height > 1) {
            width = 1280;
            height = (result.width / 1280) * result.height;
        } else {
            height = 1280;
            width = (result.height / 1280) * result.width;
        }
        ImageResizer.createResizedImage(
            result.uri,
            width,
            height,
            "JPEG",
            100
            // rotation,
            // outputPath
        ).then(response => {
            // RNfirebase.crashlytics().log("compressImage", response);
            this.toBlob(result, response, id, index);
        });
    }

    async toBlob(result, response, id, index) {
        let { onSendImage = () => {}, user, lastMessage, sendImageError = () => {} } = this.props;
        // const params = {
        //     ...response,
        //     error: "BLOB"
        // };
        // RNfirebase.crashlytics().log(JSON.stringify(params));

        // const fileUP = new FormData();
        // fileUP.append({ name: "file", filename: "vid.mp4", data: RNFetchBlob.wrap(response.uri) });

        // try {
        //     const blob = await new Promise((resolve, reject) => {
        //         const xhr = new XMLHttpRequest();
        //         xhr.onload = () => {
        //             resolve(xhr.response);
        //         };
        //         xhr.onerror = e => {
        //             reject(new TypeError("Network request failed"));
        //         };
        //         xhr.responseType = "blob";
        //         xhr.open("GET", response.uri, true);
        //         xhr.send(null);
        //     });
        //     this.uploadImageToFireBase(blob, result, id, index);
        // } catch (error) {
        //     const params2 = {
        //         ...response,
        //         error: "XHR"
        //     };
        //     RNfirebase.crashlytics().log(JSON.stringify(params2));
        // }

        // const uri = response.uri;
        // fetch(uri)
        //     .then(async response => {
        //         const blob = await response.blob();
        // this.uploadImageToFireBase(blob, result, id, index);
        //         RNfirebase.crashlytics().log(JSON.stringify({ response, er: "fetch success" }));
        //     })
        //     .catch(error => {
        //         RNfirebase.crashlytics().log(JSON.stringify({ error, er: "fetch error" }));
        //     });

        // ANOTHER

        console.log("response", response);

        const fileUP = new FormData();
        fileUP.append("image", {
            uri: response.uri,
            type: response.type,
            name: id
        });
        // fileUP.append({
        //     name: `${id}`,
        //     filename: `${id}.${response.fileType}`,
        //     data: RNFetchBlob.wrap(response.uri)
        // });

        fetch("https://api.imgur.com/3/image", {
            method: "POST",
            headers: {
                Accept: "application/json",
                "Content-Type": "multipart/form-data",
                Authorization: "Client-ID 51308d40671c473"
            },
            body: fileUP
        })
            .then(response => response.json())
            .then(responseJson => {
                if (responseJson.status == 200) {
                    onSendImage(chatFn.convertMessImage(responseJson.data.link, result, user, index, id));
                } else {
                    sendImageError(id);
                }
            })
            .catch(error => {
                console.log(error);
                sendImageError(id);
            });
    }

    // uploadImageToFireBase(file, data, id, index) {
    //     let { onSendImage = () => {}, user, lastMessage } = this.props;
    //     let fileName = _.isEmpty(data.fileName) ? `${id}.jpeg` : data.fileName;
    //     let ref = `chat/${user._id}-${fileName}`;
    //     var metadata = { contentType: "image/jpeg" };
    //     RNfirebase.crashlytics().log(JSON.stringify({ file, er: "uploadImageToFireBase" }));
    //     try {
    //         firebase
    //             .storage()
    //             .ref(ref)
    //             .put(file, metadata)
    //             .then(function(snapshot) {
    //                 firebase
    //                     .storage()
    //                     .ref(ref)
    //                     .getDownloadURL()
    //                     .then(url => {
    //                         RNfirebase.crashlytics().log(JSON.stringify({ url, er: "url" }));
    //                         onSendImage(chatFn.convertMessImage(url, data, user, index, id));
    //                     })
    //                     .catch(error => {
    //                         RNfirebase.crashlytics().log(JSON.stringify({ error, er: "url" }));
    //                     });
    //             })
    //             .catch(error => {
    //                 RNfirebase.crashlytics().log(JSON.stringify({ error, er: "upload" }));
    //             });
    //     } catch (error) {
    //         RNfirebase.crashlytics().log(JSON.stringify({ error, er: "catchError" }));
    //     }
    // }

    onOpenAddition() {
        let { onPressAddition = () => {} } = this.props;
        onPressAddition();
    }

    renderTool() {
        const { onFocus } = this.state;
        const { showAddition } = this.props;
        return (
            <View style={styles.btnWrap}>
                <TouchableOpacity onPress={() => this.onOpenAddition()}>
                    <Icon
                        type="MaterialCommunityIcons"
                        name={showAddition ? "close-circle" : "plus-circle"}
                        style={styles.icon}
                    />
                </TouchableOpacity>
            </View>
        );
    }

    onFocus() {
        let { onFocus = () => {} } = this.props;
        // enable if want input expand width
        // this.setState({ onFocus: true });
        onFocus();
    }

    onBlur() {
        let { onBlur = () => {} } = this.props;
        // enable if want input expand width
        // this.setState({ onFocus: false });
        onBlur();
    }

    onPressSend() {
        let { onPressSend = () => {}, user, lastMessage, messageReplied } = this.props;
        let index = lastMessage && lastMessage.index ? lastMessage.index : 0;
        let { value } = this.state;
        if (value.trim()) {
            if (messageReplied) {
                onPressSend(chatFn.convertMessageReply(messageReplied, value, user, index));
            } else {
                onPressSend(chatFn.convertMessage(value, user, index));
            }
        }
        this.setState({ value: "" });
    }

    renderInput() {
        let { value } = this.state;
        return (
            <View style={styles.inputContainer}>
                <Input
                    {...this.props}
                    textAlignVertical={"center"}
                    placeholder={I18n.t("chat.input")}
                    value={value}
                    onChangeText={e => this.onChangeText(e)}
                    style={styles.input}
                    onFocus={() => this.onFocus()}
                    onBlur={() => this.onBlur()}
                    placeholderTextColor="#b1b1b1"
                    multiline={true}
                />
                <TouchableOpacity onPress={() => this.onPressSend()}>
                    {/* <AppImage local source={ICON.SEND} style={styles.iconSend} resizeMode="contain" /> */}
                    <Icon
                        name="send"
                        type="MaterialCommunityIcons"
                        color="#fff"
                        size={responsiveFontSize(2.5)}
                        style={styles.iconSend}
                    />
                </TouchableOpacity>
            </View>
        );
    }

    render() {
        return (
            <View style={styles.container}>
                {this.renderTool()}
                {this.renderInput()}
            </View>
        );
    }
}

const styles = {
    container: {
        backgroundColor: Colors.WHITE_COLOR,
        height: 60,
        flexDirection: "row",
        width: DEVICE.DEVICE_WIDTH,
        alignContent: "center",
        justifyContent: "center",
        paddingHorizontal: PD.PADDING_2
    },
    icon: {
        color: Colors.Deluge,
        marginRight: PD.PADDING_2
    },
    iconFirst: {
        height: 28,
        width: 28,
        marginLeft: PD.PADDING_4,
        marginRight: PD.PADDING_4 / 2
    },
    iconLast: {
        height: 24,
        width: 24,
        marginRight: PD.PADDING_4
    },
    input: {
        // height: 32,
        width: "100%",
        marginHorizontal: 8,
        paddingTop: 0,
        paddingBottom: 0,
        // alignSelf: "center"
        textAlignVertical: "center",
        justifyContent: "center"
        // bottom: 2,
        // backgroundColor: "red"
    },
    inputContainer: {
        flex: 1,
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "center",
        height: 46,
        marginTop: 7,
        borderColor: Colors.Deluge,
        borderRadius: 25,
        borderWidth: 1
    },
    iconSend: {
        color: Colors.Deluge,
        marginRight: 8
    },
    btnWrap: {
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "center"
    },
    btnCanHidden: {
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "center"
    }
};
