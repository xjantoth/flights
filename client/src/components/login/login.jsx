import React, { PureComponent } from "react";
import { bindActionCreators } from "redux";
import { connect } from "react-redux";
import "./styles.login.sass";
import Grid from "@material-ui/core/Grid";
import Button from "@material-ui/core/Button";
import TextField from "@material-ui/core/TextField";
import Typography from "@material-ui/core/Typography";
import * as actions from "./actions.login";

class Login extends PureComponent {
  state = {
    username: null,
    password: null
  };

  handleSubmit = event => this.props.loginRequest(this.state);

  handlePasswordRecovery = event => this.props.recoveryRequest(this.state);

  render() {
    return (
      <Grid className={"Grid"} container direction="column" alignItems="center">
        <div className={"Backdrop"} />
        <div className={"Modal"}>
          <div className={"Subheader"}>
            <Typography variant="title" gutterBottom>
              Sign In
            </Typography>
          </div>

          <form className={"Form"} onSubmit={this.handleSubmit}>
            <TextField
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
              className={"Submit"}
              fullWidth
            >
              Submit
            </Button>
            <Typography
              variant="caption"
              gutterBottom
              onClick={this.handlePasswordRecovery}
              className={"Recovery"}
            >
              Forgot your password?
            </Typography>
          </form>
        </div>
      </Grid>
    );
  }
}

const mapStateToProps = (state, ownProps) => ({
  active: false
});

export default connect(
  mapStateToProps,
  dispatch => bindActionCreators({ ...actions }, dispatch)
)(Login);
