import React from "react";
import ReactDOM from "react-dom";
import "./index.css";
import "typeface-roboto";
import App from "./App";
import registerServiceWorker from "./registerServiceWorker";
import { Provider } from "react-redux";
import store, { history } from "./store";
import { ConnectedRouter } from "connected-react-router";
import { MuiThemeProvider, createMuiTheme } from "@material-ui/core/styles";

// https://material-ui.com/customization/default-theme/

const theme = createMuiTheme({
  palette: {
    type: "dark",
    primary: {
      // main: "#ca1"
      main: "#37a"
      // main: "#a33"
    },
    secondary: {
      main: "#1cf"
    }
  }
});

ReactDOM.render(
  <Provider store={store}>
    <ConnectedRouter history={history}>
      <MuiThemeProvider theme={theme}>
        <App />
      </MuiThemeProvider>
    </ConnectedRouter>
  </Provider>,
  document.getElementById("root")
);

registerServiceWorker();
