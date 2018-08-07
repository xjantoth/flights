import React, { PureComponent } from "react";
import Button from "@material-ui/core/Button";
import TextField from "@material-ui/core/TextField";
import Grid from "@material-ui/core/Grid";
import Typography from "@material-ui/core/Typography";
import "./styles.login.css";

const styles = {
  grid: {
    backgroundColor: "#eee",
    height: "calc(100vh)"
  },
  backdrop: {
    width: "calc(100vw)",
    height: "calc(30% + 64px)",
    position: "absolute",
    backgroundColor: "#fc1",
    boxShadow: "inset 0 0 4px #333",
    zIndex: 1
  },
  modal: {
    paddingBottom: 0,
    zIndex: 2,
    position: "absolute",
    top: "30%",
    backgroundColor: "#fff",
    boxShadow: "0 0 4px #555",
    border: "1px solid #aaa"
  },
  subheader: {
    width: 350,
    height: 72,
    backgroundColor: "#ddd",
    padding: 24,
    borderBottom: "0px solid #aaa"
  },
  form: {
    width: 350,
    padding: "24px 32px",
    paddingTop: 8
  },
  help: {
    marginTop: 16,
    width: "100%",
    textAlign: "center",
    cursor: "pointer"
  }
};

export default class Login extends PureComponent {
  handleSubmit = event => console.log(event);

  render() {
    return (
      <Grid
        style={styles.grid}
        container
        direction="column"
        alignItems="center"
      >
        <div style={styles.backdrop} />
        <div style={styles.modal}>
          <div style={styles.subheader}>
            <Typography variant="title" gutterBottom>
              Sign In
            </Typography>
          </div>

          <form style={styles.form} onSubmit={this.handleSubmit}>
            <TextField
              id="username"
              label="Username"
              type="text"
              margin="normal"
              autoFocus
              fullWidth
            />
            <TextField
              id="password"
              label="Password"
              type="password"
              margin="normal"
              fullWidth
            />
            <br />
            <Button
              color="primary"
              variant="contained"
              style={{ marginTop: 24 }}
              fullWidth={true}
            >
              Submit
            </Button>
            <Typography variant="caption" gutterBottom style={styles.help}>
              Forgot your password?
            </Typography>
          </form>
        </div>
      </Grid>
    );
  }
}
