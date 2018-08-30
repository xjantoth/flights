import React, { Component, Fragment } from "react";
import { Route, Redirect, Switch } from "react-router-dom";
// import Detail from "./components/detail/detail";
import Login from "./components/login/login";
import Main from "./components/main/main";
import auth from "./services/auth";

class App extends Component {
  render() {
    return (
      <Fragment>
        <Switch>
          <Route path="/app" component={Main} />
          <Route exact path="/login" component={Login} />
          <Route
            render={() => {
              return auth.isAuthenticated ? (
                <Redirect to="/app/detail" />
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
