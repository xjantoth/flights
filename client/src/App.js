import React, { Component } from "react";
import AppBar from "./components/appbar/appbar";
import Detail from "./components/detail/detail";
import Login from "./components/login/login";

class App extends Component {
  render() {
    return (
      <Login />
      // <div>
      //   <AppBar />
      //   <Detail />
      // </div>
    );
  }
}

export default App;
