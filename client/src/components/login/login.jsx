import React, { PureComponent } from "react";
import Button from "@material-ui/core/Button";
import TextField from "@material-ui/core/TextField";
import Grid from "@material-ui/core/Grid";
import Typography from "@material-ui/core/Typography";

export default class Login extends PureComponent {
  render() {
    return (
      <Grid
        style={{ backgroundColor: "#eee", height: "calc(100vh)" }}
        container
        direction="column"
        justify="center"
        alignItems="center"
      >
        <form
          style={{
            width: 350,
            padding: "24px 24px",
            paddingBottom: "24px",
            backgroundColor: "#fff",
            border: "1px solid #aaa",
            boxShadow: "0 0 8px #aaa"
          }}
        >
          <div>
            <Typography variant="title" gutterBottom>
              Two Wings
            </Typography>
          </div>
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
            // color="secondary"
            variant="contained"
            style={{ marginTop: 16, backgroundColor: "#eee" }}
            fullWidth={true}
          >
            Login
          </Button>
        </form>
      </Grid>
    );
  }
}
