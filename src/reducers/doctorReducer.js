import * as types from "actions/types";
const initialState = {
    dataDoctor: {},
    searchDoctor: {},
    type: "",
    errorMessage: "",
    error: false
};

export function doctorReducer(state = initialState, action) {
    state.type = action.type;
    //
    if (action.type === types.GET_LIST_DOCTOR_FAILED) {
        return {
            ...state,
            errorMessage: action.error,
            dataDoctor: null,
            error: true
        };
    }
    if (action.type === types.GET_LIST_DOCTOR_SUCCESS) {
        return {
            ...state,
            dataDoctor: action.response,
            errorMessage: "",
            error: false
        };
    }
    if (action.type === types.SEARCH_DOCTOR_FAILED) {
        return {
            ...state,
            errorMessage: action.error,
            searchDoctor: null,
            error: true
        };
    }
    if (action.type === types.SEARCH_DOCTOR_SUCCESS) {
        return {
            ...state,
            searchDoctor: action.response,
            errorMessage: "",
            error: false
        };
    }
    return state;
}
