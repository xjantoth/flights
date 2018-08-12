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
    backgroundColor: "#eee",
    marginBottom: 16,
    flexGrow: 1
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
    const data = {
      crew: 0,
      quantity: 0,
      flights: 0,
      id: null
    };
    this.props.rotation.map(r => {
      data.crew += r.Crew;
      data.quantity += r.Quantity;
      data.flights += 1;
      data.id = r.Route;
    });
    return (
      <span>
        <Chip
          avatar={<Avatar style={{ fontSize: 13 }}>ID</Avatar>}
          label={data.id}
          style={{ marginRight: 16 }}
        />
        <Chip
          avatar={
            <Avatar style={{ fontSize: 13 }}>{data.flights || "0"}</Avatar>
          }
          label="Flights"
          style={{ marginRight: 16 }}
        />
        <Chip
          avatar={<Avatar style={{ fontSize: 13 }}>{data.crew || "0"}</Avatar>}
          label="Crew"
          style={{ marginRight: 16 }}
        />
        <Chip
          avatar={
            <Avatar style={{ fontSize: 13 }}>{data.quantity || "0"}</Avatar>
          }
          label="Quantity"
          style={{ marginRight: 16 }}
        />
      </span>
    );
  }

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
            aria-label="Rotation summary"
            onClick={this.handleClickListItem}
          >
            <ListItemText primary="Rotation summary" />
            {this.summary}
          </ListItem>
        </List>
      </Paper>
    );
  }
}

SimpleListMenu.propTypes = {
  classes: PropTypes.object.isRequired
};

export default withStyles(styles)(SimpleListMenu);
