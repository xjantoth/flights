import { combineEpics } from "redux-observable";
import { objectToForm } from "utils";
import * as actions from "./actions.login";
import "rxjs/add/operator/switchMap";
import api from "api";

export const loginRequest = action$ =>
  action$.ofType(actions.LOGIN_REQUEST).switchMap(action =>
    fetch(api.LOGIN, objectToForm(action.payload))
      .then(response => response.json())
      .then(actions.loginSuccess)
      .catch(actions.loginError)
  );

export const recoveryRequest = (action$, store) =>
  action$.ofType(actions.RECOVERY_REQUEST).switchMap(action =>
    fetch(api.RECOVERY, objectToForm(action.payload))
      .then(response => response.json())
      .then(actions.recoverySuccess)
      .catch(actions.recoveryError)
  );

export default combineEpics(loginRequest, recoveryRequest);
