import React from "react";
import PropTypes from "prop-types";
import { withStyles } from "@material-ui/core/styles";
import List from "@material-ui/core/List";
import ListItem from "@material-ui/core/ListItem";
import ListItemText from "@material-ui/core/ListItemText";
import Paper from "@material-ui/core/Paper";
import Chip from "@material-ui/core/Chip";
import Avatar from "@material-ui/core/Avatar";

const styles = theme => ({
  root: {
    backgroundColor: theme.palette.background.paper,
    marginBottom: 16,
    flexGrow: 1
  },
  list: {
    marginTop: theme.spacing.unit
  },
  avatar: {
    color: theme.palette.text.primary,
    fontSize: 13
  },
  chip: {
    marginRight: theme.spacing.unit * 2
  }
});

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

  get summary() {
    const { rotation, classes } = this.props;

    const data = {
      crew: 0,
      quantity: 0,
      flights: 0,
      id: null
    };

    rotation.map(r => {
      data.crew += r.Crew;
      data.quantity += r.Quantity;
      data.flights += 1;
      data.id = r.Route;
      return 1;
    });

    return (
      <span>
        <Chip
          avatar={<Avatar className={classes.avatar}>ID</Avatar>}
          label={data.id}
          className={classes.chip}
        />
        <Chip
          avatar={
            <Avatar className={classes.avatar}>{data.flights || "0"}</Avatar>
          }
          label="Flights"
          className={classes.chip}
        />
        <Chip
          avatar={
            <Avatar className={classes.avatar}>{data.crew || "0"}</Avatar>
          }
          label="Crew"
          className={classes.chip}
        />
        <Chip
          avatar={
            <Avatar className={classes.avatar}>{data.quantity || "0"}</Avatar>
          }
          label="Quantity"
          className={classes.chip}
        />
      </span>
    );
  }

  render() {
    const { classes } = this.props;

    return (
      <Paper className={classes.root}>
        <List component="nav" className={classes.list}>
          <ListItem
            button
            aria-haspopup="true"
            aria-controls="lock-menu"
            aria-label="Rotation summary"
            onClick={this.handleClickListItem}
          >
            <ListItemText secondary="Rotation summary" />
            {this.summary}
          </ListItem>
        </List>
      </Paper>
    );
  }
}

SimpleListMenu.propTypes = {
  classes: PropTypes.object.isRequired,
  rotation: PropTypes.arrayOf(PropTypes.object)
};

export default withStyles(styles)(SimpleListMenu);
