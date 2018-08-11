import { combineEpics } from "redux-observable";

import login from "components/login/epics.login";
import detail from "components/detail/epics.detail";

export default combineEpics(login, detail);
