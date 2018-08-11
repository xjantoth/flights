import { combineEpics } from "redux-observable";
import { objectToForm } from "utils";
import * as actions from "./actions.detail";
import "rxjs/add/operator/switchMap";
import api from "api";

export const allDaysRequest = action$ =>
  action$.ofType(actions.ALL_DAYS_REQUEST).switchMap(action =>
    fetch(api.DAYS_LIST)
      .then(response => response.json())
      .then(actions.allDaysSuccess)
      .catch(actions.allDaysError)
  );

// export const detailRequest = (action$, store) =>
//   action$.ofType(actions.ALL_DAYS_SUCCESS).switchMap(action =>
//     fetch(`${api.DAY}, objectToForm(action.payload))
//       .then(response => response.json())
//       .then(actions.recoverySuccess)
//       .catch(actions.recoveryError)
//   );

// export const

export default combineEpics(allDaysRequest);
