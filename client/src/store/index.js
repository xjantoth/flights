import { createEpicMiddleware } from "redux-observable";
import { compose, createStore, combineReducers, applyMiddleware } from "redux";
import { connectRouter, routerMiddleware } from "connected-react-router";
import createHistory from "history/createBrowserHistory";

import reducers from "./reducers";
import epics from "./epics";

export const history = createHistory();

const epicMiddleware = createEpicMiddleware(epics);

const composeEnhancers = window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose;

const enhanceMiddleware = middleware =>
  process.env.NODE_ENV === "development"
    ? composeEnhancers(middleware)
    : middleware;

export default createStore(
  connectRouter(history)(combineReducers(reducers)),
  enhanceMiddleware(applyMiddleware(epicMiddleware, routerMiddleware(history)))
);
