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
    width: "calc(100vw / 5)",
    minWidth: 300,
    marginRight: theme.spacing.unit * 2,
    backgroundColor: theme.palette.background.paper,
    marginBottom: theme.spacing.unit * 2
  },
  day: {
    textAlign: "center"
  }
});

class SimpleListMenu extends React.Component {
  button = null;

  state = {
    anchorEl: null,
    selectedIndex: 0
  };

  handleClickListItem = event => {
    this.setState({ anchorEl: event.currentTarget });
  };

  handleMenuItemClick = (event, index) => {
    this.setState({ selectedIndex: index, anchorEl: null });
    this.props.onItemSelected(this.props.options[index]);
  };

  handleClose = () => {
    this.setState({ anchorEl: null });
  };

  render() {
    const { classes, options } = this.props;
    const { selectedIndex, anchorEl } = this.state;

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
              className={classes.day}
              secondary="Day selected"
              primary={
                options[selectedIndex] ? (
                  <b>{options[selectedIndex].display}</b>
                ) : (
                  ""
                )
              }
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
              key={option.url}
              selected={index === selectedIndex}
              onClick={event => this.handleMenuItemClick(event, index)}
            >
              {option.display}
            </MenuItem>
          ))}
        </Menu>
      </Paper>
    );
  }
}

SimpleListMenu.propTypes = {
  classes: PropTypes.object.isRequired,
  onItemSelected: PropTypes.func.isRequired,
  options: PropTypes.arrayOf(PropTypes.object).isRequired
};

export default withStyles(styles)(SimpleListMenu);
