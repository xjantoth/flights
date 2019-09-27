import React, { Fragment } from "react";
import PropTypes from "prop-types";
import classNames from "classnames";
import { withStyles } from "@material-ui/core/styles";
import Backdrop from "@material-ui/core/Backdrop";
import AppBar from "@material-ui/core/AppBar";
import Toolbar from "@material-ui/core/Toolbar";
import Typography from "@material-ui/core/Typography";
import Detail from "../detail/detail";
import { ClickAwayListener } from "@material-ui/core";
import AirplanemodeActive from "@material-ui/icons/AirplanemodeActive";
import auth from "services/auth";
import { logoutRequest } from "../login/actions.login";
import { bindActionCreators } from "redux";
import { connect } from "react-redux";
import Button from "@material-ui/core/Button";
import LogoutIcon from "@material-ui/icons/ExitToApp";
import RegisterIcon from "@material-ui/icons/PersonAdd";


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
    backgroundColor: theme.palette.grey[900],
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
    // marginLeft: theme.spacing.unit * 8,
    padding: theme.spacing.unit * 3
  },
  logout: {
    position: 'absolute',
    right: theme.spacing.unit * 3,
    background: theme.palette.grey[900],
    color: theme.palette.grey[300]
  },
  register: {
    position: 'absolute',
    right: theme.spacing.unit * 18,
    background: theme.palette.grey[900],
    color: theme.palette.grey[300]
  },
  extendedIcon: {
    marginRight: theme.spacing.unit
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

  handleRegistration = () => {

  }

  render() {
    const { classes } = this.props;
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
                <AirplanemodeActive style={{ marginRight: 16, marginLeft: 36 }} />
                <Typography variant="title" color="inherit" noWrap>
                  {this.title}
                </Typography>
                <Button aria-label="Register" className={classes.register} onClick={this.handleRegistration}>
                  <RegisterIcon className={classes.extendedIcon} />
                  Register
                </Button>
                <Button aria-label="Logout" className={classes.logout} onClick={this.props.logoutRequest}>
                  <LogoutIcon className={classes.extendedIcon} />
                  Logout
                </Button>
              </Toolbar>
            </AppBar>
            <main className={classes.content}>
              <div className={classes.toolbar} />
                <Detail />
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
