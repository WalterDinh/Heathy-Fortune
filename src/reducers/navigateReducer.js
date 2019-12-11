/* eslint-disable import/prefer-default-export */
import * as types from "actions/types";
import { Const, I18n } from "helper/index";

const initialState = {
    screen: "",
    type: ""
};

export function navigateReducer(state = initialState, action) {
    state.type = action.type;
    if (action.type === types.ON_NAVIGATE) {
        return {
            ...state,
            screen: action.screen,
            roomId: action.roomId
        };
    }
    if (action.type === types.ON_NAVIGATE) {
        return {
            ...state,
            screen: "",
            roomId: -1
        };
    }
    return state;
}
