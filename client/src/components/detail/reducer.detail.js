import {
    FETCH_DAY_DETAIL,
    FETCH_DAY_DETAIL_SUCCESS,
    FETCH_DAY_DETAIL_ERROR
} from './actions.detail';

export function detailReducer (state = {}, action) {
    switch (action.type) {
        case FETCH_DAY_DETAIL:
            console.log(state, action);
            return state;
        default:
            return state;
    }
};
