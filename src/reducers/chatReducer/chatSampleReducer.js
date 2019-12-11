import * as types from "actions/types";
const _ = require("lodash");
const PAGE_LIMIT = 10;

const initialState = {
    dataSample: {},
    dataCreate: {},
    type: "",
    errorMessage: "",
    success: false
};
export function chatSampleReducer(state = initialState, action) {
    state.type = action.type;
    if (action.type === types.GET_SAMPLE_CHAT_FAILED) {
        return {
            ...state,
            errorMessage: action.error,
            dataSample: null,
            error: true
        };
    }
    if (action.type === types.GET_SAMPLE_CHAT_SUCCESS) {
        return {
            ...state,
            dataSample: action.response,
            errorMessage: "",
            error: false
        };
    }
    // Create
    if (action.type === types.CREATE_SAMPLE_CHAT_FAILED) {
        return {
            ...state,
            errorMessage: action.error,
            dataCreate: null,
            error: true
        };
    }
    if (action.type === types.CREATE_SAMPLE_CHAT_SUCCESS) {
        return {
            ...state,
            dataCreate: action.response,
            errorMessage: "",
            error: false
        };
    }
    return state;
}
