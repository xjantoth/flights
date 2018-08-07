import AirplanemodeActive from "@material-ui/icons/AirplanemodeActive";
import AppBar from "@material-ui/core/AppBar";
import Avatar from "@material-ui/core/Avatar";
import Chip from "@material-ui/core/Chip";
import FaceIcon from "@material-ui/icons/Face";
import PropTypes from "prop-types";
import React, { PureComponent } from "react";
import Toolbar from "@material-ui/core/Toolbar";
import Typography from "@material-ui/core/Typography";
import { withStyles } from "@material-ui/core/styles";

const styles = {
  root: {
    flexGrow: 1
  },
  chip: {
    margin: 4,
    backgroundColor: "#da1",
    fontWeight: "bold",
    fontSize: 16
    // color: 'white'
  }
};

class SimpleAppBar extends PureComponent {
  state = {
    data: []
  };

  render() {
    const { classes } = this.props;

    return (
      <div className={classes.root}>
        <AppBar
          position="static"
          color="default"
          style={{ backgroundColor: "#fc1" }}
        >
          <Toolbar>
            <AirplanemodeActive />
            <Typography
              variant="title"
              color="inherit"
              style={{ flexGrow: 1, marginLeft: 8 }}
            >
              Two Wings
            </Typography>
            <Chip
              avatar={
                <Avatar>
                  <FaceIcon />
                </Avatar>
              }
              label="Logged in User"
              // onClick={handleClick}
              // onDelete={handleDelete}
              className={classes.chip}
            />
          </Toolbar>
        </AppBar>
        
      </div>
    );
  }
}

SimpleAppBar.propTypes = {
  classes: PropTypes.object.isRequired
};

export default withStyles(styles)(SimpleAppBar);
