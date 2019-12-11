import { put, call } from "redux-saga/effects";
import { ServiceHandle } from "helper";
import { convertToQuery } from "helper/helper";
import { newsActions } from "actions";
const _ = require("lodash");
// selector Function used to access reducer states
export function* getNewsAsync(action) {
    const url = "news/";
    console.log("====================================");
    console.log("getNewsAsync", url);
    console.log("====================================");
    try {
        const response = yield call(ServiceHandle.get, url);

        if (response.error && !_.isEmpty(response.errorMessage)) {
            yield put(newsActions.getNewsFailed(response.errorMessage));
        } else {
            yield put(newsActions.getNewsSuccess(response.response));
        }
    } catch (error) {
        console.log("ERRRORR", error);
    }
}
export function* newsDetailAsync(action) {
    const url = "news/" + action.params + "/";
    console.log("====================================");
    console.log("newsDetailAsync", url);
    try {
        const response = yield call(ServiceHandle.get, url);

        if (response.error && !_.isEmpty(response.errorMessage)) {
            yield put(newsActions.getDetailNewsFailed(response.errorMessage));
        } else {
            yield put(newsActions.getDetailNewsSuccess(response.response));
        }
    } catch (error) {
        console.log("ERRRORR", error);
    }
}
