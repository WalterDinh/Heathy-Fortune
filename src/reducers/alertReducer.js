/* eslint-disable import/prefer-default-export */
import * as types from "actions/types";
import { Const, I18n } from "helper/index";
import _ from "lodash";

const initialState = {
    content: "",
    title: "",
    type: "",
    showAlert: false
};

function convertMessage(messages) {
    let message = messages;
    console.log("message =>>>>>", message);
    !_.isUndefined(message.detail) ? (message = message.detail) : null;
    !_.isString(message) ? (message = JSON.stringify(message)) : null;
    console.log("message2 =>>>>>", message);
    let errorMessage = "";
    if (message.includes("t used") && message.includes("Phone number")) {
        let a = message.split(" ");
        return I18n.t("Alert.phoneNumber") + " " + a[2] + " " + I18n.t("Alert.hasntUsed");
    }
    if (message.includes("!DOCTYPE")) {
        return "ERROR <!DOCTYPE html>";
    }
    if (message.includes("TIMEOUT")) {
        return I18n.t("Alert.createChatGroupError");
    }
    switch (message) {
        case "Phone number already added in your contact":
            errorMessage = I18n.t("Alert.phoneAdded");
            break;
        case "Wrong phone number or password":
            errorMessage = I18n.t("Alert.wrong");
            break;
        case "Email not exist":
            errorMessage = I18n.t("Alert.emailNotExist");
            break;
        case "NETWORK_ERROR":
            errorMessage = I18n.t("Alert.networkErr");
            break;
        case "Not found.":
            errorMessage = I18n.t("Alert.clientErr");
            break;
        case "Invalid token.":
            errorMessage = I18n.t("Alert.unAuth");
            break;
        case "authentication error":
            errorMessage = I18n.t("Alert.loginError");
            break;
        default:
            errorMessage = message;
            break;
    }
    return errorMessage;
}

export function alertReducer(state = initialState, action) {
    console.log("actionactionaction", action);
    state.type = action.type;
    if (action.type.includes("FAILED")) {
        let message = action.error;
        return {
            content: convertMessage(message),
            title: I18n.t("error"),
            type: Const.ALERT_TYPE.ERROR,
            showAlert: true
        };
    }
    if (action.type === types.ALERT_OPEN) {
        return {
            ...action.params,
            showAlert: true
        };
    }
    if (action.type === types.ALERT_CLOSE) {
        return {
            showAlert: false
        };
    }
    return state;
}
