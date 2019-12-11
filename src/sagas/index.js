/* eslint-disable import/order */
import { takeEvery, all } from "redux-saga/effects";
import * as userSaga from "./userSaga";
import * as registerSaga from "./registerSaga";
import * as types from "actions/types";
import * as chatHistoriesSaga from "./chat/chatHistoriesSaga";
import * as chatSampleSaga from "./chat/chatSampleSaga";

import * as callSaga from "./callSaga";
import * as eventSaga from "./eventSaga";
import * as doctorSaga from "./doctorSaga";
import * as meetingAgendaSaga from "./meetingAgendaSaga";
import * as newsSaga from "./newsSaga";
import * as chatSaga from "./chat/chatSaga";

export default function* watch() {
    yield all([takeEvery(types.LOGIN_REQUEST, userSaga.loginAsync)]);
    yield all([takeEvery(types.CALL_HISTORY_REQUEST, callSaga.callerAsync)]);
    yield all([takeEvery(types.CALL_DETAILS_REQUEST, callSaga.callerAsync)]);
    yield all([takeEvery(types.SEND_REGISTER_REQUEST, registerSaga.registerAsync)]);
    yield all([takeEvery(types.CHAT_HISTORIES_REQUEST, chatHistoriesSaga.chatHistoriesAsync)]);
    yield all([takeEvery(types.CHAT_ROOM_CURRENT_REQUEST, chatHistoriesSaga.chatRoomCurrentAsync)]);
    yield all([takeEvery(types.CHAT_HISTORIES_GROUP_REQUEST, chatHistoriesSaga.chatHistoriesGroupAsync)]);
    yield all([takeEvery(types.PROFILE_EDIT_REQUEST, userSaga.profileEditAsync)]);
    yield all([takeEvery(types.SEARCH_REQUEST, userSaga.searchAsync)]);
    yield all([takeEvery(types.TRANSACTION_REQUEST, userSaga.transactionAsync)]);
    yield all([takeEvery(types.TRANSACTION_FULL_REQUEST, userSaga.transactionFullAsync)]);
    // TODO: NEW
    yield all([takeEvery(types.GET_LIST_TAG_REQUEST, userSaga.requestTagAsync)]);
    // TODO: event
    yield all([takeEvery(types.GET_EVENT_DETAIL_REQUEST, eventSaga.eventDetailAsync)]);
    yield all([takeEvery(types.GET_EVENT_REQUEST, eventSaga.getEventAsync)]);
    yield all([takeEvery(types.CREATE_EVENT_REQUEST, eventSaga.createEventAsync)]);
    // TODO: doctor
    yield all([takeEvery(types.GET_LIST_DOCTOR_REQUEST, doctorSaga.listDoctorAsync)]);
    yield all([takeEvery(types.SEARCH_DOCTOR_REQUEST, doctorSaga.searchDoctorAsync)]);

    yield all([takeEvery(types.GET_METTING_AGENDA_REQUEST, meetingAgendaSaga.meetingAgendaAsync)]);
    // get user
    yield all([takeEvery(types.GET_USER_REQUEST, userSaga.requestUserAsync)]);
    // get news
    yield all([takeEvery(types.GET_HISTORY_REQUEST, eventSaga.getHistoryEventAsync)]);

    yield all([takeEvery(types.GET_NEWS_REQUEST, newsSaga.getNewsAsync)]);
    yield all([takeEvery(types.GET_NEWS_DETAIL_REQUEST, newsSaga.newsDetailAsync)]);
    // chat
    yield all([takeEvery(types.GET_LIST_CHAT_REQUEST, chatSaga.getListChatAsync)]);
    yield all([takeEvery(types.CREATE_GROUP_CHAT_REQUEST, chatSaga.createGroupChatAsync)]);
    // forgot
    yield all([takeEvery(types.FORGOT_PASSWORD_REQUEST, userSaga.forgotPasswordAsync)]);
    // chat sample
    yield all([takeEvery(types.SAMPLE_CHAT_REQUEST, chatSampleSaga.sampleChatAsync)]);
    //
    yield all([takeEvery(types.CREATE_SAMPLE_CHAT_REQUEST, chatSampleSaga.createSampleChatAsync)]);
}
