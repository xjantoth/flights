import { createAction } from "utils";

// define actions
export const DETAIL_REQUEST = "DETAIL_REQUEST";
export const detailRequest = createAction(DETAIL_REQUEST);

export const DETAIL_SUCCESS = "DETAIL_SUCCESS";
export const detailSuccess = createAction(DETAIL_SUCCESS);

export const DETAIL_ERROR = "DETAIL_ERROR";
export const detailError = createAction(DETAIL_ERROR);

export const ALL_DAYS_REQUEST = "ALL_DAYS_REQUEST";
export const allDaysRequest = createAction(ALL_DAYS_REQUEST);

export const ALL_DAYS_SUCCESS = "ALL_DAYS_SUCCESS";
export const allDaysSuccess = createAction(ALL_DAYS_SUCCESS);

export const ALL_DAYS_ERROR = "ALL_DAYS_ERROR";
export const allDaysError = createAction(ALL_DAYS_ERROR);

export const CACHED_ACTION = "CACHED_ACTION";
export const cachedAction = createAction(CACHED_ACTION);
