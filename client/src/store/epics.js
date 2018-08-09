import { combineEpics } from "redux-observable";

import login from "../components/login/epics.login";

export default combineEpics(login);
