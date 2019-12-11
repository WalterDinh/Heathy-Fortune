import { put, call } from "redux-saga/effects";
import { ServiceHandle } from "helper";
import { convertToQuery } from "helper/helper";
import { meetingAgendaActions } from "actions";
import { EVENT, CALENDAR_EVENT } from "helper/Consts";
const _ = require("lodash");
// selector Function used to access reducer states

export function* meetingAgendaAsync(action) {
    const url = `${CALENDAR_EVENT}${convertToQuery(action.params)}`;
    try {
        const response = yield call(ServiceHandle.get, url);

        if (response.error) {
            yield put(meetingAgendaActions.getMettingAgendaFailed(response.errorMessage));
        } else {
            yield put(meetingAgendaActions.getMettingAgendaSuccess(response.response, action.params.refresh));
        }
    } catch (error) {
        console.log("ERRRORR", error);
    }
}
