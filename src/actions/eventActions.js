import * as types from "./types";
import { ServiceHandle } from "helper";
import { EVENT } from "helper/Consts";

// get favorite teacher
export function getEventRequest(params) {
    return {
        type: types.GET_EVENT_DETAIL_REQUEST,
        params
    };
}
export function getEventFailed(error) {
    return {
        type: types.GET_EVENT_DETAIL_FAILED,
        error
    };
}
export function getEventSuccess(response) {
    console.log("getEventSuccess", response);

    return {
        type: types.GET_EVENT_DETAIL_SUCCESS,
        response
    };
}
export function activeEventSuccess(response) {
    console.log("activeEventSuccess", response);

    return {
        type: types.ACTIVE_EVENT_SUCCESS,
        response
    };
}
export function ratingEventSuccess(response) {
    console.log("activeEventSuccess", response);
    return {
        type: types.RATING_EVENT_SUCCESS,
        response
    };
}
export function completeEventSuccess(response) {
    console.log("activeEventSuccess", response);
    return {
        type: types.COMPLETE_EVENT_SUCCESS,
        response
    };
}
export function cancelEventSuccess(response) {
    console.log("cancelEventSuccess", response);

    return {
        type: types.CANCEL_EVENT_SUCCESS,
        response
    };
}
// DETAIL

export function eventRequest(params) {
    return {
        type: types.GET_EVENT_REQUEST,
        params
    };
}

export function eventFailed(error) {
    return {
        type: types.GET_EVENT_FAILED,
        error
    };
}

export function eventSuccess(response) {
    return {
        type: types.GET_EVENT_SUCCESS,
        response
    };
}

export function eventUnconfirmationSuccess(response) {
    return {
        type: types.GET_EVENT_UNCOMFIRMATION_SUCCESS,
        response
    };
}
export function eventActiveSuccess(response) {
    return {
        type: types.GET_EVENT_ACTIVE_SUCCESS,
        response
    };
}
export function getHistorySuccess(response) {
    return {
        type: types.GET_HISTORY_SUCCESS,
        response
    };
}
// patch event
export function createEventRequest(params) {
    return {
        type: types.CREATE_EVENT_REQUEST,
        params
    };
}

export function createEventFailed(error) {
    return {
        type: types.CREATE_EVENT_FAILED,
        error
    };
}

export function createEventSuccess(response) {
    return {
        type: types.CREATE_EVENT_SUCCESS,
        response
    };
}

export function changeStatusEvent(params) {
    const url = EVENT + params.id + "/";
    return ServiceHandle.patch(url, JSON.stringify(params.body));
}
// history
export function getHistoryEvent(params) {
    return {
        type: types.GET_HISTORY_REQUEST,
        params
    };
}
export function getHistoryEventSuccess(response) {
    return {
        type: types.GET_HISTORY_SUCCESS,
        response
    };
}
export function getHistoryEventFailed(error) {
    return {
        type: types.GET_EVENT_HISTORY_FAILED,
        error
    };
}

export async function reBookEvent(params) {
    const url = EVENT + params.id + "/";
    let result = await ServiceHandle.patch(url, JSON.stringify(params.body));
    console.log("errrorrrrssssss", result);
    return result;
}
