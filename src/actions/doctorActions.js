import * as types from "./types";
import { ServiceHandle } from "helper";

// get favorite teacher
export function getListDoctorRequest(params) {
    return {
        type: types.GET_LIST_DOCTOR_REQUEST,
        params
    };
}
export function getListDoctorFailed(error) {
    return {
        type: types.GET_LIST_DOCTOR_FAILED,
        error
    };
}
export function getListDoctorSuccess(response) {
    return {
        type: types.GET_LIST_DOCTOR_SUCCESS,
        response
    };
}
export function searchDoctorRequest(params) {
    return {
        type: types.SEARCH_DOCTOR_REQUEST,
        params
    };
}
export function searchDoctorFailed(error) {
    return {
        type: types.SEARCH_DOCTOR_FAILED,
        error
    };
}
export function searchDoctorSuccess(response) {
    return {
        type: types.SEARCH_DOCTOR_SUCCESS,
        response
    };
}
