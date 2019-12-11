import * as types from "actions/types";
const _ = require("lodash");
const PAGE_LIMIT = 10;

const initialState = {
    data: {},
    type: "",
    errorMessage: "",
    success: false,
    currentRoom: {},
    dataGroup: [],
    messageRoom: []
};
export function chatReducer(state = initialState, action) {
    state.type = action.type;
    if (action.type === types.GET_LIST_CHAT_FAILED) {
        return {
            ...state,
            errorMessage: action.error,
            dataGroup: null,
            error: true
        };
    }
    if (action.type === types.GET_LIST_CHAT_SUCCESS) {
        return {
            ...state,
            dataGroup: action.response.response,
            errorMessage: "",
            error: false
        };
    }
    if (action.type === types.CREATE_GROUP_CHAT_FAILED) {
        return {
            ...state,
            errorMessage: action.error,
            data: null,
            error: true
        };
    }
    if (action.type === types.ON_NAVIGATE) {
        return {
            ...state,
            errorMessage: action.error,
            data: null,
            error: true
        };
    }
    if (action.type === types.CREATE_GROUP_CHAT_SUCCESS) {
        return {
            ...state,
            data: action.response,
            errorMessage: "",
            error: false
        };
    }
    return state;
}
