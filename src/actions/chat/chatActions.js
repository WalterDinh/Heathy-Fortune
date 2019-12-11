import * as types from "../types";

export function saveChatMessage(params) {
    return {
        type: types.SAVE_CHAT_MESSAGE,
        params
    };
}
export function requestListChat(params) {
    return {
        type: types.GET_LIST_CHAT_REQUEST,
        params
    };
}

export function getListChatFailed(error) {
    return {
        type: types.GET_LIST_CHAT_FAILED,
        error
    };
}

export function getListChatSuccess(response) {
    return {
        type: types.GET_LIST_CHAT_SUCCESS,
        response
    };
}
export function requestCreateGroupChat(params) {
    return {
        type: types.CREATE_GROUP_CHAT_REQUEST,
        params
    };
}

export function createGroupChatFailed(error) {
    return {
        type: types.CREATE_GROUP_CHAT_FAILED,
        error
    };
}

export function createGroupChatSuccess(response) {
    return {
        type: types.CREATE_GROUP_CHAT_SUCCESS,
        response
    };
}
