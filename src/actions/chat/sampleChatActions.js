import * as types from "../types";

export function requestSampleChat(params) {
    return {
        type: types.SAMPLE_CHAT_REQUEST,
        params
    };
}

export function getSampleChatFailed(error) {
    return {
        type: types.GET_SAMPLE_CHAT_FAILED,
        error
    };
}

export function getSampleChatSuccess(response) {
    return {
        type: types.GET_SAMPLE_CHAT_SUCCESS,
        response
    };
}
// create
export function createSampleChat(params) {
    return {
        type: types.CREATE_SAMPLE_CHAT_REQUEST,
        params
    };
}

export function createSampleChatFailed(error) {
    return {
        type: types.CREATE_SAMPLE_CHAT_FAILED,
        error
    };
}

export function createSampleChatSuccess(response) {
    return {
        type: types.CREATE_SAMPLE_CHAT_SUCCESS,
        response
    };
}
