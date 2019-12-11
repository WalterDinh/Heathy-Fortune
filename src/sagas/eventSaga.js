import { put, call } from "redux-saga/effects";
import { ServiceHandle } from "helper";
import { convertToQuery } from "helper/helper";
import { eventActions } from "actions";
const _ = require("lodash");
const moment = require("moment");
// selector Function used to access reducer states

export function* eventDetailAsync(action) {
    const url = "event/" + action.params + "/";
    console.log("====================================");
    console.log("eventAsync", url);
    try {
        const response = yield call(ServiceHandle.get, url);

        if (response.error && !_.isEmpty(response.errorMessage)) {
            yield put(eventActions.getEventFailed(response.errorMessage));
        } else {
            yield put(eventActions.getEventSuccess(response.response));
        }
    } catch (error) {
        console.log("ERRRORR", error);
    }
}

export function* createEventAsync(action) {
    const url = `event/`;
    console.log("====================================");
    console.log("eventAsync", url);
    try {
        const response = yield call(ServiceHandle.post, url, action.params);

        if (response.error && !_.isEmpty(response.errorMessage)) {
            yield put(eventActions.createEventFailed(response.errorMessage));
        } else {
            yield put(eventActions.createEventSuccess(response.response));
        }
    } catch (error) {
        console.log("ERRRORR", error);
    }
}

export function* getHistoryEventAsync(action) {
    const url = `event/?appointment_timestamp__gte=${action.params.appointment_timestamp__gte}`;
    console.log("====================================");
    console.log("eventAsync", url);
    try {
        const response = yield call(ServiceHandle.get, url);

        if (response.error && !_.isEmpty(response.errorMessage)) {
            yield put(eventActions.getEventFailed(response.errorMessage));
        } else {
            console.log("eventAsync", response.response);

            yield put(eventActions.getHistoryEventSuccess(response.response));
        }
    } catch (error) {
        console.log("ERRRORR", error);
    }
}

export function* getEventAsync(action) {
    const urlActive1 = action.params.page1
        ? `/event/?appointment_timestamp__gte=${moment().unix()}&page=${action.params.page1}&status=1`
        : `/event/?appointment_timestamp__gte=${moment().unix()}&status=1`;
    const urlActive0 = action.params.page0
        ? `/event/?appointment_timestamp_active__gte=${moment().unix()}&page=${action.params.page0}&status=0`
        : `/event/?appointment_timestamp_active__gte=${moment().unix()}&status=0`;
    const urlActive2 = action.params.page2
        ? `/event/?appointment_timestamp__lte=${moment().unix()}&status__gte=0&appointment_end_time__lte:${moment().unix()}&page=${
              action.params.page2
          }&status__gte=0&appointment_end_time__lte:${moment().unix()}`
        : `/event/?appointment_timestamp__lte=${moment().unix()}&status__gte=0&appointment_end_time__lte:${moment().unix()}'`;

    console.log("urlActive0", urlActive0);
    console.log("urlActive1", urlActive1);
    console.log("urlActive2", urlActive2);
    try {
        const responseActive0 = yield call(ServiceHandle.get, urlActive0);
        const responseActive1 = yield call(ServiceHandle.get, urlActive1);
        const responseActive2 = yield call(ServiceHandle.get, urlActive2);

        if (
            (responseActive0.error && !_.isEmpty(responseActive0.errorMessage)) ||
            (responseActive1.error && !_.isEmpty(responseActive1.errorMessage)) ||
            (responseActive2.error && !_.isEmpty(responseActive2.errorMessage))
        ) {
            yield put(
                eventActions.eventFailed(
                    responseActive0.errorMessage
                        ? responseActive0.errorMessage
                        : responseActive1.errorMessage
                        ? responseActive1.errorMessage
                        : responseActive2.errorMessage
                )
            );
        } else if (action.params.page1 != 1 && action.params.page1) {
            yield put(eventActions.eventActiveSuccess(responseActive1.response));
        } else if (action.params.page2 != 1 && action.params.page2) {
            yield put(eventActions.getHistorySuccess(responseActive2.response));
        } else {
            const dataEvent = {
                eventActive: responseActive1.response,
                eventInactive: responseActive0.response,
                eventHistory: responseActive2.response
            };
            yield put(eventActions.eventSuccess(dataEvent));
        }
    } catch (error) {
        console.log("ERRRORR", error);
    }
}
