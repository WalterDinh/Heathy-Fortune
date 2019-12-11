import * as types from "actions/types";
import _ from "lodash";
const initialState = {
    data: [],
    type: "",
    errorMessage: "",
    error: false
};

export function meetingAgendaReducer(state = initialState, action) {
    state.type = action.type;
    if (action.type === types.GET_METTING_AGENDA_FAILED) {
        return {
            ...state,
            errorMessage: action.error,
            error: true
        };
    }
    if (action.type === types.GET_METTING_AGENDA_SUCCESS) {
        const data = action.refresh ? action.response : _.concat(action.response, state.data);
        return {
            ...state,
            data: _.uniqBy(data, "id"),
            errorMessage: "",
            error: false
        };
    }
    if (action.type === types.LOGOUT_REQUEST) {
        return {
            ...state,
            data: [],
            errorMessage: null
        };
    }
    return state;
}
