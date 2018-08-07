import { successSuffix, errorSuffix, creator } from '../../utils/actions';

// define actions
export const FETCH_DAY_DETAIL = 'FETCH_DAY_DETAIL';
export const FETCH_DAY_DETAIL_SUCCESS = successSuffix(FETCH_DAY_DETAIL);
export const FETCH_DAY_DETAIL_ERROR = errorSuffix(FETCH_DAY_DETAIL);

// create action creator from action
export const fetchDayDetail = creator(FETCH_DAY_DETAIL);
