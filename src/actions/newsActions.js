import * as types from "./types";
import { ServiceHandle } from "helper";
import { EVENT } from "helper/Consts";

// get event
export function getNewsRequest(params) {
    return {
        type: types.GET_NEWS_REQUEST,
        params
    };
}
export function getNewsFailed(error) {
    return {
        type: types.GET_NEWS_FAILED,
        error
    };
}
export function getNewsSuccess(response) {
    return {
        type: types.GET_NEWS_SUCCESS,
        response
    };
}

// get event detail
export function getDetailNewsRequest(params) {
    return {
        type: types.GET_NEWS_DETAIL_REQUEST,
        params
    };
}

export function getDetailNewsFailed(error) {
    return {
        type: types.GET_NEWS_DETAIL_FAILED,
        error
    };
}

export function getDetailNewsSuccess(response) {
    return {
        type: types.GET_NEWS_DETAIL_SUCCESS,
        response
    };
}
//
export async function getData(params) {
    console.log("paramssssssssssssssssssssss", params);
    const url = `news/`;
    const response = await ServiceHandle.get(url);
    return response;
}
