import { createAction } from "utils";

// define actions
export const LOGIN_REQUEST = "LOGIN_REQUEST";
export const loginRequest = createAction(LOGIN_REQUEST);

export const LOGIN_SUCCESS = "LOGIN_SUCCESS";
export const loginSuccess = createAction(LOGIN_SUCCESS);

export const LOGIN_ERROR = "LOGIN_ERROR";
export const loginError = createAction(LOGIN_ERROR);

export const LOGOUT_REQUEST = "LOGOUT_REQUEST";
export const logoutRequest = createAction(LOGOUT_REQUEST);

export const LOGOUT_SUCCESS = "LOGOUT_SUCCESS";
export const logoutSuccess = createAction(LOGOUT_SUCCESS);

export const LOGOUT_ERROR = "LOGOUT_ERROR";
export const logoutError = createAction(LOGOUT_ERROR);

export const RECOVERY_REQUEST = "RECOVERY_REQUEST";
export const recoveryRequest = createAction(RECOVERY_REQUEST);

export const RECOVERY_SUCCESS = "RECOVERY_SUCCESS";
export const recoverySuccess = createAction(RECOVERY_SUCCESS);

export const RECOVERY_ERROR = "RECOVERY_ERROR";
export const recoveryError = createAction(RECOVERY_ERROR);
