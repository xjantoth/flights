import { createEpicMiddleware } from "redux-observable";
import { compose, createStore, combineReducers, applyMiddleware } from "redux";
import reducers from "./reducers";
import epics from "./epics";

const epicMiddleware = createEpicMiddleware(epics);
const composeEnhancers = window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose;

export default createStore(
  combineReducers(reducers),
  composeEnhancers(applyMiddleware(epicMiddleware))
);
