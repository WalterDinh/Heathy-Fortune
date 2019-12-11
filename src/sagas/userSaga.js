import { put, call } from "redux-saga/effects";
import { userActions } from "actions/index";
import { convertToQuery } from "helper/helper";
import { ServiceHandle } from "helper";
import { TAG_URL, LOGIN_URL, USER_URL, TRANSACTION_URL } from "helper/Consts";
const _ = require("lodash");
// selector Function used to access reducer states
export function* loginAsync(action) {
    try {
        const response = yield call(ServiceHandle.post, LOGIN_URL, action.params);

        if (response.error && !_.isEmpty(response.errorMessage)) {
            yield put(userActions.loginFailed(response.errorMessage));
        } else {
            yield put(userActions.loginSuccess(response.response));
        }
    } catch (error) {
        console.log("ERRRORR", error);
    }
}

export function* profileEditAsync(action) {
    const url = USER_URL + action.params.id + "/";

    try {
        const response = yield call(ServiceHandle.patch, url, action.params);

        if (response.error && !_.isEmpty(response.errorMessage)) {
            yield put(userActions.profileEditFailed(response.errorMessage));
        } else {
            yield put(userActions.profileEditSuccess(response.response));
        }
    } catch (error) {
        console.log("ERRRORR", error);
    }
}

export function* searchAsync(action) {
    const url = USER_URL + convertToQuery(action.params);
    try {
        const response = yield call(ServiceHandle.get, url);

        if (response.error && !_.isEmpty(response.errorMessage)) {
            yield put(userActions.searchFailed(response.errorMessage));
        } else {
            yield put(userActions.searchSuccess(response.response));
        }
    } catch (error) {
        console.log("ERRRORR", error);
    }
}

export function* transactionAsync(action) {
    const url = TRANSACTION_URL + convertToQuery(action.params);
    console.log("====================================");
    console.log(url, "transactions");
    console.log("====================================");
    try {
        const response = yield call(ServiceHandle.get, url);

        if (response.error && !_.isEmpty(response.errorMessage)) {
            yield put(userActions.transactionFailed(response.errorMessage));
        } else {
            yield put(userActions.transactionSuccess(response.response));
        }
    } catch (error) {
        console.log("ERRRORR", error);
    }
}

export function* transactionFullAsync(action) {
    const url = TRANSACTION_URL + convertToQuery(action.params);
    console.log("====================================");
    console.log(url, "transactions");
    console.log("====================================");
    try {
        const response = yield call(ServiceHandle.get, url);

        if (response.error && !_.isEmpty(response.errorMessage)) {
            yield put(userActions.transactionFullFailed(response.errorMessage));
        } else {
            yield put(userActions.transactionFullSuccess(response.response));
        }
    } catch (error) {
        console.log("ERRRORR", error);
    }
}

//TODO: NEW
export function* requestTagAsync() {
    const url = TAG_URL;
    console.log("urllll===>>>", url);

    try {
        const response = yield call(ServiceHandle.get, url);
        console.log("response requestTagAsync", response);

        if (response.error && !_.isEmpty(response.errorMessage)) {
            yield put(userActions.tagFailed(response.errorMessage));
        } else {
            yield put(userActions.tagSuccess(response.response));
        }
    } catch (error) {
        console.log("ERRRORR", error);
    }
}
// GET USER
export function* requestUserAsync(action) {
    const url = "user/" + action.params + "/";
    console.log("userrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrr", url);

    try {
        const response = yield call(ServiceHandle.get, url);
        console.log("response", response);

        if (response.error && !_.isEmpty(response.errorMessage)) {
            yield put(userActions.getUserFailed(response.errorMessage));
        } else {
            yield put(userActions.getUserSuccess(response.response));
        }
    } catch (error) {
        console.log("ERRRORR", error);
    }
}
export function* forgotPasswordAsync(action) {
    const url = "resetPassword/";
    console.log("resetPassword", url);

    try {
        const response = yield call(ServiceHandle.post, url, action.params);
        console.log("response", response);

        if (response.error && !_.isEmpty(response.errorMessage)) {
            yield put(userActions.forgotFailed(response.errorMessage));
        } else {
            yield put(userActions.forgotSuccess(response.response));
        }
    } catch (error) {
        console.log("ERRRORR", error);
    }
}
