import { put, call } from "redux-saga/effects";
import { ServiceHandle } from "helper";
import { convertToQuery } from "helper/helper";
import { doctorActions } from "actions";
import { TAG_URL, LOGIN_URL, USER_URL, TRANSACTION_URL } from "helper/Consts";

const _ = require("lodash");
// selector Function used to access reducer states

export function* listDoctorAsync(action) {
    const url = `/user/?tag=${!_.isEmpty(action.params.tag) ? `${action.params.tag}` : ""}&type=0`;
    const urlTag = TAG_URL;
    console.log("====================================");
    console.log("eventAsync", url);
    try {
        const response = yield call(ServiceHandle.get, url);
        const responseTag = yield call(ServiceHandle.get, urlTag);
        if (
            (response.error && !_.isEmpty(response.errorMessage)) ||
            (responseTag.error && !_.isEmpty(responseTag.errorMessage))
        ) {
            yield put(doctorActions.getListDoctorFailed("Errors"));
        } else {
            const doctorData = {
                listDoctor: response.response,
                listTag: responseTag.response
            };
            yield put(doctorActions.getListDoctorSuccess(doctorData));
        }
    } catch (error) {
        console.log("ERRRORR", error);
    }
}

export function* searchDoctorAsync(action) {
    let listTag = _.join(action.params.listTagSelected, "&tag_id=");
    console.log("listTag", listTag);
    const url = `/user/?tag_id=${!_.isEmpty(action.params.listTagSelected) ? `${listTag}` : ""}&search=${
        !_.isEmpty(action.params.name) ? action.params.name : ""
    }`;
    console.log("====================================");
    console.log("eventAsync", url);
    try {
        const response = yield call(ServiceHandle.get, url);
        if (response.error && !_.isEmpty(response.errorMessage)) {
            yield put(doctorActions.searchDoctorFailed("Errors"));
        } else {
            yield put(doctorActions.searchDoctorSuccess(response.response));
        }
    } catch (error) {
        console.log("ERRRORR", error);
    }
}
