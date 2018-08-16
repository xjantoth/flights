import { combineEpics } from "redux-observable";
import * as actions from "./actions.detail";
import "rxjs/add/operator/switchMap";
import api from "api";

const cacheMap = {
  [actions.DETAIL_REQUEST]: {},
  [actions.ALL_DAYS_REQUEST]: {}
};

const ttl = 10;

const isValidCache = cachedValue => (new Date() - cachedValue.at) / 1000 < ttl;

const cached = action => {
  if (action.payload && action.payload.url) {
    const value = cacheMap[action.type][action.payload.url];
    if (value && isValidCache(value)) {
      return value.data;
    }
  }
  return false;
};

const setCache = (action, data) => {
  if (action.payload && action.payload.url) {
    if (cacheMap[action.type]) {
      cacheMap[action.type][action.payload.url] = {
        data,
        at: new Date()
      };
    }
  }
  return data;
};

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
      // const cache = cached(action);
      // if (cache) {
      //   return [actions.detailSuccess(cache)];
      // }

      const selectedDay = action.payload && action.payload.url;
      const day = selectedDay || store.getState().detail.days[0].url;
      return (
        fetch(`${api.DAY}${day}`)
          .then(data => data.text())
          .then(data => data.replace(/NaN/g, "null"))
          .then(data => JSON.parse(data))
          // .then(data => setCache(action, data))
          .then(actions.detailSuccess)
          .catch(actions.detailError)
      );
    });

export default combineEpics(allDaysRequest, detailRequest);
