import React, { Fragment } from "react";
import PropTypes from "prop-types";
import classNames from "classnames";
import { withStyles } from "@material-ui/core/styles";
import Drawer from "@material-ui/core/Drawer";
import Backdrop from "@material-ui/core/Backdrop";
import AppBar from "@material-ui/core/AppBar";
import Toolbar from "@material-ui/core/Toolbar";
import List from "@material-ui/core/List";
import Typography from "@material-ui/core/Typography";
import Divider from "@material-ui/core/Divider";
import IconButton from "@material-ui/core/IconButton";
import MenuIcon from "@material-ui/icons/Menu";
import ChevronLeftIcon from "@material-ui/icons/ChevronLeft";
import ChevronRightIcon from "@material-ui/icons/ChevronRight";
import { mainItems, otherItems } from "./drawerItems";
import Detail from "../detail/detail";
import { ClickAwayListener } from "@material-ui/core";
import AirplanemodeActive from "@material-ui/icons/AirplanemodeActive";
import { Route, Switch } from "react-router-dom";
import auth from "services/auth";
import Chart from "components/aggregations/aggregations";
import { logoutRequest } from "../login/actions.login";
import { bindActionCreators } from "redux";
import { connect } from "react-redux";
// import auth from "services/auth";

const drawerWidth = 240;

const styles = theme => ({
  root: {
    flexGrow: 1,
    height: "calc(100vh)",
    zIndex: 1,
    overflow: "hidden",
    position: "relative",
    display: "flex"
  },
  appBar: {
    zIndex: theme.zIndex.drawer + 1,
    backgroundColor: "#252525",
    transition: theme.transitions.create(["width", "margin"], {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.leavingScreen
    })
  },
  appBarShift: {
    marginLeft: drawerWidth,
    width: `calc(100% - ${drawerWidth}px)`,
    transition: theme.transitions.create(["width", "margin"], {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.enteringScreen
    })
  },
  menuButton: {
    marginLeft: theme.spacing.unit * 2,
    marginRight: theme.spacing.unit * 4
  },
  hide: {
    display: "none"
  },
  drawerPaper: {
    position: "absolute",
    whiteSpace: "nowrap",
    width: drawerWidth,
    transition: theme.transitions.create("width", {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.enteringScreen
    }),
    boxShadow: `0 0 ${theme.spacing.unit}px ${theme.palette.background.paper}`
  },
  drawerPaperClose: {
    overflowX: "hidden",
    transition: theme.transitions.create("width", {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.leavingScreen
    }),
    width: theme.spacing.unit * 7,
    [theme.breakpoints.up("sm")]: {
      width: theme.spacing.unit * 9
    }
  },
  toolbar: {
    display: "flex",
    alignItems: "center",
    justifyContent: "flex-end",
    padding: `0 ${theme.spacing.unit}px`,
    ...theme.mixins.toolbar
  },
  content: {
    flexGrow: 1,
    backgroundColor: theme.palette.background.default,
    marginLeft: theme.spacing.unit * 8,
    padding: theme.spacing.unit * 3
  }
});

class Main extends React.Component {
  title = "Two Wings";
  state = {
    open: false
  };

  handleDrawerOpen = () => {
    this.setState({ open: true });
  };

  handleDrawerClose = () => {
    this.setState({ open: false });
  };

  componentWillMount = () => {
    if (!this.props.isAuthenticated) {
      auth.logout();
      this.props.history.push("/");
    }
  };

  componentDidUpdate = () => {
    if (!this.props.isAuthenticated) {
      auth.logout();
      this.props.history.push("/");
    }
  };

  render() {
    const { classes, theme } = this.props;
    return (
      <div className={classes.root}>
        <Backdrop
          open={this.state.open}
          style={{
            zIndex: 2,
            pointerEvents: this.state.open ? "auto" : "none"
          }}
        />
        <ClickAwayListener onClickAway={this.handleDrawerClose}>
          <Fragment>
            <AppBar
              position="absolute"
              className={classNames(
                classes.appBar,
                this.state.open && classes.appBarShift
              )}
            >
              <Toolbar disableGutters={!this.state.open}>
                <IconButton
                  color="inherit"
                  aria-label="Open drawer"
                  onClick={this.handleDrawerOpen}
                  className={classNames(
                    classes.menuButton,
                    this.state.open && classes.hide
                  )}
                >
                  <MenuIcon />
                </IconButton>
                <AirplanemodeActive style={{ marginRight: 8 }} />
                <Typography variant="title" color="inherit" noWrap>
                  {this.title}
                </Typography>
              </Toolbar>
            </AppBar>
            <Drawer
              variant="permanent"
              classes={{
                paper: classNames(
                  classes.drawerPaper,
                  !this.state.open && classes.drawerPaperClose
                )
              }}
              open={this.state.open}
            >
              <div className={classes.toolbar}>
                <IconButton onClick={this.handleDrawerClose}>
                  {theme.direction === "rtl" ? (
                    <ChevronRightIcon />
                  ) : (
                    <ChevronLeftIcon />
                  )}
                </IconButton>
              </div>
              <Divider />
              <List>
                {mainItems({ handleLogoutClick: this.props.logoutRequest })}
              </List>
              {/* <Divider /> */}
              <List>{otherItems}</List>
            </Drawer>
            <main className={classes.content}>
              <div className={classes.toolbar} />
              <Switch>
                <Route exact path="/app/detail" component={Detail} />
                <Route exact path="/app/chart" component={Chart} />
              </Switch>
            </main>
          </Fragment>
        </ClickAwayListener>
      </div>
    );
  }
}

Main.propTypes = {
  classes: PropTypes.object.isRequired,
  theme: PropTypes.object.isRequired
};

export default connect(
  (state, ownProps) => ({
    isAuthenticated: state.login.isAuthenticated
  }),
  dispatch => bindActionCreators({ logoutRequest }, dispatch)
)(withStyles(styles, { withTheme: true })(Main));
