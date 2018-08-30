import React, { PureComponent } from "react";
import { bindActionCreators } from "redux";
import { connect } from "react-redux";
import { withStyles } from "@material-ui/core/styles";
import PropTypes from "prop-types";
import Grid from "@material-ui/core/Grid";
import Button from "@material-ui/core/Button";
import TextField from "@material-ui/core/TextField";
import Typography from "@material-ui/core/Typography";
import * as actions from "./actions.login";
import auth from "services/auth";

const styles = theme => ({
  Grid: {
    height: "calc(100vh)",
    backgroundColor: theme.palette.background.default
  },

  Modal: {
    position: "absolute",
    top: "30%"
  },

  Black: {
    color: "black"
  },

  Subheader: {
    width: 350,
    textAlign: "center",
    height: theme.spacing.unit * 8,
    padding: `0px ${theme.spacing.unit * 3}px`
  },

  Submit: {
    margin: `${theme.spacing.unit * 3}px 0 ${theme.spacing.unit *
      3}px 0!important`
  },

  Form: {
    width: 350,
    padding: `${theme.spacing.unit * 3}px ${theme.spacing.unit * 4}px`,
    paddingTop: theme.spacing.unit
  },

  Recovery: {
    cursor: "pointer",
    textAlign: "center"
  }
});

class Login extends PureComponent {
  state = {
    username: null,
    password: null
  };

  static propTypes = {
    loginRequest: PropTypes.func.isRequired,
    recoveryRequest: PropTypes.func.isRequired
  };

  handleSubmit = event => this.props.loginRequest(this.state);

  handlePasswordRecovery = event =>
    this.props.recoveryRequest({ username: this.state.username });

  componentWillUpdate = () => {
    if (auth.isAuthenticated) {
      this.props.history.push("/");
    }
  };

  render() {
    const { classes } = this.props;

    return (
      <Grid
        className={classes.Grid}
        container
        direction="column"
        alignItems="center"
      >
        <div className={classes.Modal}>
          <div className={classes.Subheader}>
            <Typography variant="display1">Login</Typography>
          </div>
          <form className={classes.Form} onSubmit={this.handleSubmit}>
            <TextField
              className={classes.Black}
              id="username"
              label="Username"
              type="text"
              margin="normal"
              onChange={event =>
                this.setState({ username: event.target.value })
              }
              autoFocus
              fullWidth
            />
            <TextField
              className={classes.Black}
              id="password"
              label="Password"
              type="password"
              margin="normal"
              onChange={event =>
                this.setState({ password: event.target.value })
              }
              fullWidth
            />
            <br />
            <Button
              color="primary"
              variant="contained"
              onClick={this.handleSubmit}
              className={classes.Submit}
              fullWidth
            >
              Submit
            </Button>
            <Typography
              variant="caption"
              gutterBottom
              onClick={this.handlePasswordRecovery}
              className={classes.Recovery}
            >
              Forgot your password?
            </Typography>
          </form>
        </div>
      </Grid>
    );
  }
}

export default connect(
  (state, ownProps) => ({
    isAuthenticated: state.login.isAuthenticated
  }),
  dispatch => bindActionCreators({ ...actions }, dispatch)
)(withStyles(styles, { withTheme: true })(Login));
