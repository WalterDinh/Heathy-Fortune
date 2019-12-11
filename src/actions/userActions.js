/*
 * Reducer actions related with login
 */
import * as types from "./types";
import { ServiceHandle } from "helper";
import { TRANSACTION, NEWPASSWORD } from "helper/Consts";

export function requestLogin(params) {
    return {
        type: types.LOGIN_REQUEST,
        params
    };
}

export function loginFailed(error) {
    return {
        type: types.LOGIN_FAILED,
        error
    };
}

export function loginSuccess(response) {
    return {
        type: types.LOGIN_SUCCESS,
        response
    };
}

export function logoutRequest() {
    return {
        type: types.LOGOUT_REQUEST
    };
}

export function updateNotificationId(params) {
    const url = `user/${params.id}/`;
    const response = ServiceHandle.patch(url, JSON.stringify({ device_id: params.deviceToken }));
    return response;
}

export function profileEditRequest(params) {
    return {
        type: types.PROFILE_EDIT_REQUEST,
        params
    };
}

export function profileEditFailed(error) {
    return {
        type: types.PROFILE_EDIT_FAILED,
        error
    };
}

export function profileEditSuccess(response) {
    return {
        type: types.PROFILE_EDIT_SUCCESS,
        response
    };
}

export function searchRequest(params) {
    return {
        type: types.SEARCH_REQUEST,
        params
    };
}

export function searchFailed(error) {
    return {
        type: types.SEARCH_FAILED,
        error
    };
}

export function searchSuccess(response) {
    return {
        type: types.SEARCH_SUCCESS,
        response
    };
}

export function transactionRequest(params) {
    return {
        type: types.TRANSACTION_REQUEST,
        params
    };
}

export function transactionFailed(error) {
    return {
        type: types.TRANSACTION_FAILED,
        error
    };
}

export function transactionSuccess(response) {
    return {
        type: types.TRANSACTION_SUCCESS,
        response
    };
}

export function transactionFullRequest(params) {
    return {
        type: types.TRANSACTION_FULL_REQUEST,
        params
    };
}

export function transactionFullFailed(error) {
    return {
        type: types.TRANSACTION_FULL_FAILED,
        error
    };
}

export function transactionFullSuccess(response) {
    return {
        type: types.TRANSACTION_FULL_SUCCESS,
        response
    };
}

export function updateAmount(params) {
    const url = `user/${params.id}/`;
    const response = ServiceHandle.patch(url, JSON.stringify({ amount: params.money }));
    return response;
}

export async function topUpTransaction(params) {
    const param = {
        type: 0,
        title: "NAP TIEN",
        description: "null",
        amount: params.money,
        user_id: params.userId
    };
    const url = `${TRANSACTION}`;
    const response = await ServiceHandle.post(url, JSON.stringify(param));
    return response;
}

export async function getUserData(params) {
    const url = `user/${params.id}`;
    const response = await ServiceHandle.get(url);
    return response;
}

// TODO: UPDATE NEw

export function updateUserProfile(params) {
    const url = `user/${params.id}/`;
    const response = ServiceHandle.patch(url, JSON.stringify(params.body));
    return response;
}

export function updateUserPassword(params) {
    const url = NEWPASSWORD;
    const response = ServiceHandle.post(url, JSON.stringify(params));
    return response;
}

export function requestTag() {
    return {
        type: types.GET_LIST_TAG_REQUEST
    };
}

export function tagFailed(error) {
    return {
        type: types.GET_LIST_TAG_FAILED,
        error
    };
}

export function tagSuccess(response) {
    return {
        type: types.GET_LIST_TAG_SUCCESS,
        response
    };
}
// get user
export function requestUser(params) {
    return {
        type: types.GET_USER_REQUEST,
        params
    };
}

export function getUserFailed(error) {
    return {
        type: types.GET_USER_FAILED,
        error
    };
}

export function getUserSuccess(response) {
    return {
        type: types.GET_USER_SUCCESS,
        response
    };
}
export function removeUser() {
    return {
        type: types.REMOVE_USER
    };
}

export function getPassword(password) {
    return {
        type: types.GET_PASSWORD,
        password
    };
}
//
export function forgotRequest(params) {
    return {
        type: types.FORGOT_PASSWORD_REQUEST,
        params
    };
}
export function forgotFailed(error) {
    return {
        type: types.FORGOT_PASSWORD_FAILED,
        error
    };
}
export function forgotSuccess(response) {
    return {
        type: types.FORGOT_PASSWORD_SUCCESS,
        response
    };
}
