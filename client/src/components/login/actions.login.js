import { creator } from "../../utils/actions";

// define actions
export const LOGIN_REQUEST = "LOGIN_REQUEST";
export const loginRequest = creator(LOGIN_REQUEST);

export const LOGIN_REQUEST_SUCCESS = "LOGIN_REQUEST_SUCCESS";
export const loginRequestSuccess = creator(LOGIN_REQUEST_SUCCESS);

export const LOGIN_REQUEST_ERROR = "LOGIN_REQUEST_ERROR";
export const loginRequestError = creator(LOGIN_REQUEST_ERROR);

export const RECOVERY_REQUEST = "RECOVERY_REQUEST";
export const recoveryRequest = creator(RECOVERY_REQUEST);

export const RECOVERY_REQUEST_SUCCESS = "RECOVERY_REQUEST_SUCCESS";
export const recoveryRequestSuccess = creator(RECOVERY_REQUEST_SUCCESS);

export const RECOVERY_REQUEST_ERROR = "RECOVERY_REQUEST_ERROR";
export const recoveryRequestError = creator(RECOVERY_REQUEST_ERROR);
