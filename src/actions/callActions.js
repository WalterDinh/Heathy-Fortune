import * as types from "./types";
import { ServiceHandle } from "helper";

export function callHistoryRequest(params) {
  return {
    type: types.CALL_HISTORY_REQUEST,
    params
  };
}

export function callHistoryFailed(error) {
  return {
    type: types.CALL_HISTORY_FAILED,
    error
  };
}

export function callHistorySuccess(response) {
  return {
    type: types.CALL_HISTORY_SUCCESS,
    response
  };
}

export function callDetailsRequest(params) {
  return {
    type: types.CALL_DETAILS_REQUEST,
    params
  };
}

export function callDetailsFailed(error) {
  return {
    type: types.CALL_DETAILS_FAILED,
    error
  };
}

export function callDetailsSuccess(response) {
  return {
    type: types.CALL_DETAILS_SUCCESS,
    response
  };
}

// delete

export function callDeleteRequest(params) {
  return ServiceHandle.delete(`call_log_user/${params}/`);
  // return {
  //     type: types.CALL_DELETE_REQUEST,
  //     params
  // };
}

export function callDeleteFailed(error) {
  return {
    type: types.CALL_DELETE_FAILED,
    error
  };
}

export function callDeleteSuccess(response) {
  return {
    type: types.CALL_DELETE_SUCCESS,
    response
  };
}

export function callAddRequest(params, paramsHistory) {
  console.log("232wewqqqq", params, paramsHistory);
  ServiceHandle.post(`call_log/`, params)
    .then(res => {
      console.log("3231312132311", res, params);
      callHistoryRequest(paramsHistory);
    })
    .catch(e => {
      console.log("223434445435435", e);
      callHistoryRequest(paramsHistory);
    });
}
