import * as types from "actions/types";
const initialState = {
    dataEventActive: {},
    dataEventInactive: {},
    eventActive: {},
    eventInactive: {},
    eventCancel: {},
    eventHistory: {},
    dataDetailEvent: {},
    type: "",
    errorMessage: "",
    error: false
};

export function eventReducer(state = initialState, action) {
    state.type = action.type;
    //
    if (action.type === types.GET_EVENT_FAILED) {
        return {
            ...state,
            errorMessage: action.error,
            dataEvent: null,
            error: true
        };
    }
    if (action.type === types.GET_EVENT_SUCCESS) {
        return {
            ...state,
            eventActive: action.response.eventActive,
            eventInactive: action.response.eventInactive,
            eventHistory: action.response.eventHistory,
            errorMessage: "",
            error: false
        };
    }
    if (action.type === types.GET_EVENT_UNCOMFIRMATION_SUCCESS) {
        return {
            ...state,
            dataEventInactive: action.response,
            errorMessage: "",
            error: false
        };
    }
    // if (action.type === types.GET_HISTORY_SUCCESS) {
    //     return {
    //         ...state,
    //         eventHistory: action.response,
    //         errorMessage: "",
    //         error: false
    //     };
    // }
    if (action.type === types.GET_EVENT_ACTIVE_SUCCESS) {
        return {
            ...state,
            dataEventActive: action.response,
            errorMessage: "",
            error: false
        };
    }
    if (action.type === types.GET_HISTORY_SUCCESS) {
        return {
            ...state,
            dataEvent: action.response,
            errorMessage: "",
            error: false
        };
    }
    if (action.type === types.CREATE_EVENT_FAILED) {
        return {
            ...state,
            errorMessage: action.error,
            error: true
        };
    }
    if (action.type === types.CREATE_EVENT_SUCCESS) {
        return {
            ...state,
            errorMessage: "",
            error: false
        };
    }
    if (action.type === types.GET_EVENT_DETAIL_FAILED) {
        return {
            ...state,
            errorMessage: action.error,
            dataDetailEvent: null,
            error: true
        };
    }
    if (action.type === types.GET_EVENT_DETAIL_SUCCESS) {
        return {
            ...state,
            dataDetailEvent: action.response,
            errorMessage: "",
            error: false
        };
    }
    if (action.type === types.ACTIVE_EVENT_SUCCESS) {
        return {
            ...state
        };
    }
    if (action.type === types.CANCEL_EVENT_SUCCESS) {
        return {
            ...state
        };
    }
    return state;
}
