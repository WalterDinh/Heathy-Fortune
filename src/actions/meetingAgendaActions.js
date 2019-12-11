import * as types from "./types";
import { ServiceHandle } from "helper";

// get favorite teacher
export function getMettingAgendaRequest(params) {
    return {
        type: types.GET_METTING_AGENDA_REQUEST,
        params
    };
}
export function getMettingAgendaFailed(error) {
    return {
        type: types.GET_METTING_AGENDA_FAILED,
        error
    };
}
export function getMettingAgendaSuccess(response, refresh) {
    return {
        type: types.GET_METTING_AGENDA_SUCCESS,
        response,
        refresh
    };
}
