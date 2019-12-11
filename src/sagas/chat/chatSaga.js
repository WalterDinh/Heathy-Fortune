import { put, call } from "redux-saga/effects";
import { chatHistoriesAction, chatActions } from "actions/index";
import { ServiceHandle, Const } from "helper";
import { convertToQuery } from "helper/helper";
const _ = require("lodash");

export function* getListChatAsync(action) {
    let { params } = action;
    let url = `/chatRoom/`;
    console.log("url =======>", url);

    try {
        const response = yield call(ServiceHandle.get, url);
        console.log("response", response);
        if (response.error) {
            yield put(chatActions.getListChatFailed(response.errorMessage));
        } else {
            yield put(chatActions.getListChatSuccess({ response: response.response }));
        }
    } catch (error) {
        console.log("ERRRORR", error);
    }
}
export function* createGroupChatAsync(action) {
    let { params } = action;
    let url = `/chatRoom/`;
    console.log("url =======>", url);

    try {
        const response = yield call(ServiceHandle.post, url, action.params);
        console.log("response", response);
        if (response.error) {
            yield put(chatActions.createGroupChatFailed(response.errorMessage));
        } else {
            yield put(chatActions.createGroupChatSuccess({ response: response.response }));
        }
    } catch (error) {
        console.log("ERRRORR", error);
    }
}
