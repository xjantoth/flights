import React from "react";
import PropTypes from "prop-types";
import { withStyles } from "@material-ui/core/styles";
import List from "@material-ui/core/List";
import ListItem from "@material-ui/core/ListItem";
import ListItemText from "@material-ui/core/ListItemText";
import MenuItem from "@material-ui/core/MenuItem";
import Menu from "@material-ui/core/Menu";
import Paper from "@material-ui/core/Paper";

const styles = theme => ({
  root: {
    width: "calc((100vw /4) * 2.6)",
    backgroundColor: "#eee", //theme.palette.background.paper,
    marginBottom: 16
  }
});

const options = [
  "Monday - Tuesday",
  "Tuesday - Wednesday",
  "Wednesday - Thursday",
  "Thursday - Friday"
];

class SimpleListMenu extends React.Component {
  button = null;

  state = {
    anchorEl: null,
    selectedIndex: 1
  };

  handleClickListItem = event => {
    this.setState({ anchorEl: event.currentTarget });
  };

  handleMenuItemClick = (event, index) => {
    this.setState({ selectedIndex: index, anchorEl: null });
  };

  handleClose = () => {
    this.setState({ anchorEl: null });
  };

  render() {
    const { classes } = this.props;
    const { anchorEl } = this.state;

    return (
      <Paper className={classes.root}>
        <List component="nav">
          <ListItem
            button
            aria-haspopup="true"
            aria-controls="lock-menu"
            aria-label="When device is locked"
            onClick={this.handleClickListItem}
          >
            <ListItemText
              primary="Rotation summary"
              secondary="Crew: 6 | Quantity: 254 | Special: 37 | Stops: 4"
            />
          </ListItem>
        </List>
        <Menu
          id="lock-menu"
          anchorEl={anchorEl}
          open={Boolean(anchorEl)}
          onClose={this.handleClose}
        >
          {options.map((option, index) => (
            <MenuItem
              key={option}
              disabled={index === 0}
              selected={index === this.state.selectedIndex}
              onClick={event => this.handleMenuItemClick(event, index)}
            >
              {option}
            </MenuItem>
          ))}
        </Menu>
      </Paper>
    );
  }
}

SimpleListMenu.propTypes = {
  classes: PropTypes.object.isRequired
};

export default withStyles(styles)(SimpleListMenu);
