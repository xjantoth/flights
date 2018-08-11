import React, { Component, Fragment } from "react";
import { Route, Redirect, Link, Switch } from "react-router-dom";
import AppBar from "./components/appbar/appbar";
import Detail from "./components/detail/detail";
import Login from "./components/login/login";
import Main from "./components/main/main";
import store from "./store";

export const isAuthenticated = () => store.getState().login.isAuthenticated;

class App extends Component {
  render() {
    return (
      <Fragment>
        <Route component={AppBar} />
        <Switch>
          <Route exact path="/login" component={Login} />
          <Route exact path="/main" component={Main} />
          <Route exact path="/detail" component={Detail} />
          <Route
            render={() => {
              return isAuthenticated() ? (
                <Redirect to="/detail" />
              ) : (
                <Redirect to="/login" />
              );
            }}
          />
        </Switch>
      </Fragment>
    );
  }
}

export default App;
