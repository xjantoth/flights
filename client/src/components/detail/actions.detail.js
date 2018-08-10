import { createAction } from "../../utils";

// define actions
export const FETCH_DAY_DETAIL = "FETCH_DAY_DETAIL";
// export const FETCH_DAY_DETAIL_SUCCESS = successSuffix(FETCH_DAY_DETAIL);
// export const FETCH_DAY_DETAIL_ERROR = errorSuffix(FETCH_DAY_DETAIL);

// create action createAction from action
export const fetchDayDetail = createAction(FETCH_DAY_DETAIL);
