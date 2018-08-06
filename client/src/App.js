import React, { Component } from "react";
import AppBar from "./components/appbar/AppBar";
import Detail from './components/detail/Detail';


class App extends Component {
  render() {
    return (
      <div>
        <AppBar />
        <Detail />
      </div>
    );
  }
}

export default App;
