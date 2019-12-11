/* eslint-disable import/prefer-default-export */
import * as types from "actions/types";
const initialState = {
    data: [],
    dataDetails: [],
    dataDelete: [],
    type: "",
    errorMessage: "",
    error: false
};

export function callReducer(state = initialState, action) {
    state.type = action.type;
    if (action.type === types.CALL_HISTORY_FAILED) {
        return {
            ...state,
            errorMessage: action.error,
            data: null,
            error: true
        };
    }
    if (action.type === types.CALL_HISTORY_SUCCESS) {
        return {
            ...state,
            data: action.response,
            errorMessage: "",
            error: false
        };
    }
    if (action.type === types.CALL_DETAILS_FAILED) {
        return {
            ...state,
            errorMessage: action.error,
            dataDetails: null,
            error: true
        };
    }
    if (action.type === types.CALL_DETAILS_SUCCESS) {
        return {
            ...state,
            dataDetails: action.response,
            errorMessage: "",
            error: false
        };
    }
    return state;
}
