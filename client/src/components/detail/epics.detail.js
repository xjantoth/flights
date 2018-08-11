import { combineEpics } from "redux-observable";
import * as actions from "./actions.detail";
import "rxjs/add/operator/switchMap";
import api from "api";

// fetch list of all available days
const allDaysRequest = action$ =>
  action$.ofType(actions.ALL_DAYS_REQUEST).switchMap(action =>
    fetch(api.DAYS_LIST)
      .then(response => response.json())
      .then(actions.allDaysSuccess)
      .catch(actions.allDaysError)
  );

// fetch detail for selected day or first day in store
const detailRequest = (action$, store) =>
  action$
    .ofType(actions.ALL_DAYS_SUCCESS, actions.DETAIL_REQUEST)
    .switchMap(action => {
      const selectedDay = action.payload && action.payload.url;
      const day = selectedDay || store.getState().detail.days[0].url;
      return fetch(`${api.DAY}${day}`)
        .then(data => data.text())
        .then(data => data.replace(/NaN/g, "null"))
        .then(data => JSON.parse(data))
        .then(actions.detailSuccess)
        .catch(actions.detailError);
    });

export default combineEpics(allDaysRequest, detailRequest);
