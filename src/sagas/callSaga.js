import { put, call } from "redux-saga/effects";
import { ServiceHandle } from "helper";
import { callActions } from "actions";

const _ = require("lodash");

export function* callerAsync(action) {
    let url = "call_log_user/" + action.params + "/";
    console.log("url ===> ", url);

    try {
        const response = yield call(ServiceHandle.get, url);

        if (response.error) {
            _.includes(action.params, "/")
                ? yield put(callActions.callDetailsFailed(response.errorMessage))
                : yield put(callActions.callHistoryFailed(response.errorMessage));
        } else {
            _.includes(action.params, "/")
                ? yield put(callActions.callDetailsSuccess(response.response))
                : yield put(callActions.callHistorySuccess(response.response));
        }
    } catch (error) {
        console.log("ERRRORR", error);
    }
}
