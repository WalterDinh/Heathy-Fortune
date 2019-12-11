/* eslint-disable import/prefer-default-export */
import * as types from "actions/types";
const _ = require("lodash");
const PAGE_LIMIT = 10;

const initialState = {
    data: {},
    dataUser: {},
    tagData: {},
    dataSearch: {},
    dataTransactions: [],
    dataTransactionsFull: [],
    type: "",
    errorMessage: "",
    password: "",
    dataFogot: {}
};

function convertData(state, action) {
    let { count, results } = action.response;
    let numberOfPage = count / PAGE_LIMIT;
    let dataReturn = {};
    if (_.isNull(action.response.previous)) {
        dataReturn = {
            results: results,
            numberOfPage
        };
    } else {
        dataReturn = {
            results: _.concat(...state.dataSearch.results, results),
            numberOfPage
        };
    }
    return dataReturn;
}

export function userReducer(state = initialState, action) {
    state.type = action.type;
    if (action.type === types.LOGIN_FAILED) {
        return {
            ...state,
            errorMessage: action.error,
            data: null
        };
    }
    if (action.type === types.LOGIN_SUCCESS) {
        return {
            ...state,
            data: action.response,
            errorMessage: null
        };
    }
    if (action.type === types.LOGOUT_REQUEST) {
        return {
            ...state,
            data: null,
            errorMessage: null
        };
    }
    if (action.type === types.PROFILE_EDIT_FAILED) {
        return {
            ...state,
            errorMessage: action.error
        };
    }
    if (action.type === types.PROFILE_EDIT_SUCCESS) {
        return {
            ...state,
            data: {
                ...state.data,
                ...action.response
            },
            errorMessage: ""
        };
    }

    if (action.type === types.SEARCH_SUCCESS) {
        return {
            ...state,
            dataSearch: convertData(state, action),
            errorMessage: "",
            error: false
        };
    }
    if (action.type === types.SEARCH_FAILED) {
        return {
            ...state,
            errorMessage: action.error,
            dataSearch: null,
            error: true
        };
    }
    if (action.type === types.TRANSACTION_SUCCESS) {
        let dataTransactions = state.dataTransactions;
        let { count } = action.response;
        let numberOfPage = count / PAGE_LIMIT;
        if (_.includes(action.response.next, "page=2")) {
            dataTransactions = action.response.results;
        } else {
            dataTransactions = _.concat(dataTransactions, action.response.results);
        }
        return {
            ...state,
            numberOfPage,
            dataTransactions,
            errorMessage: "",
            error: false
        };
    }
    if (action.type === types.TRANSACTION_FAILED) {
        return {
            ...state,
            errorMessage: action.error,
            // dataTransactions: null,
            error: true
        };
    }
    if (action.type === types.TRANSACTION_FULL_SUCCESS) {
        let dataTransactionsFull = state.dataTransactionsFull;
        let { count } = action.response;
        let numberOfPage = count / PAGE_LIMIT;
        if (_.includes(action.response.next, "page=2")) {
            dataTransactionsFull = action.response.results;
        } else {
            dataTransactionsFull = _.concat(dataTransactionsFull, action.response.results);
        }
        return {
            ...state,
            numberOfPage,
            dataTransactionsFull,
            errorMessage: "",
            error: false
        };
    }
    if (action.type === types.TRANSACTION_FULL_FAILED) {
        return {
            ...state,
            errorMessage: action.error,
            // dataTransactionsFull: null,
            error: true
        };
    }

    // TODO: NEW
    if (action.type === types.GET_LIST_TAG_FAILED) {
        return {
            ...state,
            errorMessage: action.error
            // tagData: null
        };
    }
    if (action.type === types.GET_LIST_TAG_SUCCESS) {
        return {
            ...state,
            tagData: action.response,
            errorMessage: null
        };
    }

    //GET USER
    if (action.type === types.GET_USER_FAILED) {
        return {
            ...state,
            errorMessage: action.error
            // tagData: null
        };
    }
    if (action.type === types.GET_USER_SUCCESS) {
        return {
            ...state,
            dataUser: action.response,
            errorMessage: null
        };
    }

    if (action.type === types.REMOVE_USER) {
        return {
            ...state,
            dataUser: null,
            errorMessage: null
        };
    }
    //
    if (action.type === types.GET_PASSWORD) {
        return {
            ...state,
            password: action.password,
            errorMessage: "",
            error: false
        };
    }
    // forgot
    if (action.type === types.FORGOT_PASSWORD_FAILED) {
        return {
            ...state,
            errorMessage: action.error,
            dataFogot: null
        };
    }
    if (action.type === types.FORGOT_PASSWORD_SUCCESS) {
        return {
            ...state,
            dataFogot: action.response,
            errorMessage: null
        };
    }

    return state;
}
