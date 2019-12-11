import { put, call } from "redux-saga/effects";
import { chatHistoriesAction, chatActions, sampleChatActions } from "actions/index";
import { ServiceHandle, Const } from "helper";
import { convertToQuery } from "helper/helper";
const _ = require("lodash");

export function* sampleChatAsync(action) {
    let url = `chat_template/`;
    console.log("url chattemplate =======>", url);
    try {
        const response = yield call(ServiceHandle.get, url, action.params);
        console.log("response", response);
        if (response.error) {
            yield put(sampleChatActions.getSampleChatFailed(response.errorMessage));
        } else {
            yield put(sampleChatActions.getSampleChatSuccess({ response: response.response }));
        }
    } catch (error) {
        console.log("ERRRORR", error);
    }
}
export function* createSampleChatAsync(action) {
    let url = `chat_template/`;
    console.log("url chattemplate post =======>", url);
    try {
        const response = yield call(ServiceHandle.post, url, action.params);
        console.log("response", response);
        if (response.error) {
            yield put(sampleChatActions.createSampleChatFailed(response.errorMessage));
        } else {
            yield put(sampleChatActions.createSampleChatSuccess({ response: response.response }));
        }
    } catch (error) {
        console.log("ERRRORR", error);
    }
}
