import React from "react";
import { View, Keyboard, TouchableWithoutFeedback, ScrollView } from "react-native";
import { connect } from "react-redux";
import { AppText, Button, Input } from "components";
import styles from "./styles";
import { PD, DEVICE, ALERT_TYPE } from "helper/Consts";
import { Colors } from "helper";
import I18n from "helper/locales";
import _ from "lodash";
import moment from "moment";
import { HeaderTransparent } from "components";
import { Container } from "components";
import { sampleChatActions, types, alertActions } from "actions";
import { thisExpression } from "@babel/types";

class NewSampleQuestion extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            content: props.navigation.getParam("message") ? props.navigation.getParam("message") : "",
            title: "",
            keyboardHeight: 0
        };

        this.keyboardDidShowListener = Keyboard.addListener("keyboardDidShow", this._keyboardDidShow);
        this.keyboardDidHideListener = Keyboard.addListener("keyboardDidHide", this._keyboardDidHide);
    }

    componentDidUpdate(prevProps) {
        const { userReducer, chatSampleReducer, dispatch } = this.props;
        if (prevProps !== this.props) {
            if (chatSampleReducer.type === types.CREATE_SAMPLE_CHAT_SUCCESS) {
                console.log("vào đây");
                this._onPressBack();
                dispatch(sampleChatActions.requestSampleChat());
            } else if (chatSampleReducer.type === types.CREATE_SAMPLE_CHAT_FAILED) {
                const params = {
                    content: "error",
                    title: "ERROR",
                    type: ALERT_TYPE.ERROR
                };
                dispatch(alertActions.openAlert(params));
            }
        }
    }
    _onPressBack() {
        this.props.navigation.goBack();
    }

    renderHead() {
        const { navigation } = this.props;
        return (
            <HeaderTransparent
                navigation={navigation}
                title={I18n.t("newSampleQuest.title")}
                containerStyle={{ backgroundColor: Colors.Deluge }}
            />
        );
    }

    _keyboardDidShow = e => {
        this.setState({ keyboardHeight: e.endCoordinates.height });
    };

    _keyboardDidHide = () => {
        this.setState({ keyboardHeight: 0 });
    };

    renderBody() {
        const { title, content, keyboardHeight } = this.state;
        return (
            <View style={{ flex: 1, width: "100%", marginTop: PD.PADDING_2, paddingBottom: keyboardHeight }}>
                <AppText text={I18n.t("newSampleQuest.titleA")} style={styles.titleText} />
                <View style={{ height: 45, marginVertical: PD.PADDING_2 }}>
                    <Input
                        value={title}
                        onChangeText={e => this.setState({ title: e })}
                        inputStyle={{ textAlign: "left" }}
                        containerStyles={{ width: "100%", textAlign: "left" }}
                        placeholderTextColor={Colors.Deluge}
                        placeholder={I18n.t("newSampleQuest.pTitleA")}
                        leftIconName="subtitles-outline"
                    />
                </View>
                <AppText text={I18n.t("newSampleQuest.contentA")} style={styles.titleText} />
                <View style={{ flex: 1, marginVertical: PD.PADDING_2 }}>
                    <Input
                        value={content}
                        onChangeText={e => this.setState({ content: e })}
                        inputStyle={styles.contentInput}
                        containerStyles={{ width: "100%" }}
                        placeholderTextColor={Colors.Deluge}
                        placeholder={I18n.t("newSampleQuest.pContentA")}
                        multiline
                    />
                </View>
                {this.renderFooter()}
            </View>
        );
    }

    _saveNewSampleQuest() {
        const { dispatch } = this.props;
        const { content, title } = this.state;
        const param = { title: title.trim(), description: content.trim() };
        dispatch(sampleChatActions.createSampleChat(param));
    }

    renderFooter() {
        return (
            <View style={styles.footerWrap}>
                <Button
                    style={{ width: DEVICE.DEVICE_WIDTH * 0.4 }}
                    title={I18n.t("newSampleQuest.save")}
                    onPress={() => this._saveNewSampleQuest()}
                />
                <Button
                    style={{ width: DEVICE.DEVICE_WIDTH * 0.4, backgroundColor: Colors.Alizarin_Crimson }}
                    title={I18n.t("newSampleQuest.cancel")}
                    onPress={() => this._onPressBack()}
                />
            </View>
        );
    }

    render() {
        return (
            <View style={{ backgroundColor: Colors.Athens_Gray, flex: 1 }}>
                {this.renderHead()}
                <TouchableWithoutFeedback onPress={() => Keyboard.dismiss()}>
                    <ScrollView showsVerticalScrollIndicator={false} style={{ flex: 1, paddingHorizontal: "5%" }}>
                        {this.renderBody()}
                    </ScrollView>
                </TouchableWithoutFeedback>
            </View>
        );
    }
}

function mapStateToProps(state) {
    return {
        newsReducer: state.newsReducer,
        userReducer: state.userReducer,
        chatSampleReducer: state.chatSampleReducer
    };
}
NewSampleQuestion = connect(mapStateToProps)(NewSampleQuestion);

export default NewSampleQuestion;
