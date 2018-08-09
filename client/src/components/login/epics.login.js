import { combineEpics } from "redux-observable";
import * as actions from "./actions.login";
import "rxjs/add/operator/switchMap";
import "rxjs/add/operator/mergeMap";
import "rxjs/add/operator/map";
import "rxjs/add/operator/do";
import api from "../../api";

const buildRequestBody = payload => {
  const formData = new FormData();
  formData.append("username", payload.username);
  formData.append("password", payload.password);
  return {
    method: "POST",
    body: formData
  };
};

export const loginRequest = action$ =>
  action$
    .ofType(actions.LOGIN_REQUEST)
    .switchMap(action =>
      fetch(api.LOGIN, buildRequestBody(action.payload)).then(
        actions.loginRequestSuccess
      )
    );

export const recoveryRequest = (action$, store) =>
  action$.ofType(actions.RECOVERY_REQUEST).mergeMap(action =>
    fetch(api.RECOVERY)
      .then(actions.recoveryRequestSuccess)
      .catch(console.warn)
  );

export default combineEpics(loginRequest, recoveryRequest);
