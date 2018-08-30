import * as actions from "./actions.login";
import { createReducer } from "utils";

const initState = {
  isAuthenticated: false,
  isLoading: false,
  isError: false,
  error: null
};

export default createReducer(initState, {
  [actions.LOGIN_REQUEST]: (state, payload) => ({
    ...state,
    isLoading: true,
    isAuthenticated: false
  }),
  [actions.LOGIN_SUCCESS]: (state, payload) => ({
    ...state,
    isLoading: false,
    isAuthenticated: true
  }),
  [actions.LOGIN_ERROR]: (state, payload) => ({
    ...state,
    isLoading: false,
    isAuthenticated: true,
    isError: true
  })
});
