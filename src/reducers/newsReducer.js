import * as types from "actions/types";
const initialState = {
    listNews: {},
    newsDetail: {},
    type: "",
    errorMessage: "",
    error: false
};

export function newsReducer(state = initialState, action) {
    state.type = action.type;
    //
    if (action.type === types.GET_NEWS_FAILED) {
        return {
            ...state,
            errorMessage: action.error,
            listNews: null,
            error: true
        };
    }
    if (action.type === types.GET_NEWS_SUCCESS) {
        return {
            ...state,
            listNews: action.response,
            errorMessage: "",
            error: false
        };
    }
    if (action.type === types.GET_NEWS_DETAIL_FAILED) {
        return {
            ...state,
            errorMessage: action.error,
            newsDetail: null,
            error: true
        };
    }
    if (action.type === types.GET_NEWS_DETAIL_SUCCESS) {
        return {
            ...state,
            newsDetail: action.response,
            errorMessage: "",
            error: false
        };
    }
    return state;
}
