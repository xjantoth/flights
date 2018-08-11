import { createAction } from "utils";

// define actions
export const LOGIN_REQUEST = "LOGIN_REQUEST";
export const loginRequest = createAction(LOGIN_REQUEST);

export const LOGIN_SUCCESS = "LOGIN_SUCCESS";
export const loginSuccess = createAction(LOGIN_SUCCESS);

export const LOGIN_ERROR = "LOGIN_ERROR";
export const loginError = createAction(LOGIN_ERROR);

export const RECOVERY_REQUEST = "RECOVERY_REQUEST";
export const recoveryRequest = createAction(RECOVERY_REQUEST);

export const RECOVERY_SUCCESS = "RECOVERY_SUCCESS";
export const recoverySuccess = createAction(RECOVERY_SUCCESS);

export const RECOVERY_ERROR = "RECOVERY_ERROR";
export const recoveryError = createAction(RECOVERY_ERROR);
