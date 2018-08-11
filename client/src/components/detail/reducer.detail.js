import * as actions from "./actions.detail";
import { createReducer } from "utils";

const initState = {};

export default createReducer(initState, {
  [actions.ALL_DAYS_REQUEST]: (state, payload) => ({
    ...state
  }),
  [actions.ALL_DAYS_SUCCESS]: (state, payload) => ({
    ...state
  }),
  [actions.ALL_DAYS_ERROR]: (state, payload) => ({
    ...state
  }),
  [actions.DETAIL_REQUEST]: (state, payload) => ({
    ...state
  }),
  [actions.DETAIL_SUCCESS]: (state, payload) => ({
    ...state
  }),
  [actions.DETAIL_ERROR]: (state, payload) => ({
    ...state
  })
});
