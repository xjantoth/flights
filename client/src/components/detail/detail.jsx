import React, { Component } from "react";
import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import { withStyles } from "@material-ui/core/styles";
import PropTypes from "prop-types";
import Selector from "./selector.detail";
import Quick from "./quick.detail";
import Table from "./table.detail";
import Stats from "./stats.detail";
import Aggregations from "./aggregations.detail";
import Paper from "@material-ui/core/Paper";
import * as actions from "./actions.detail";
import DetailIcon from "@material-ui/icons/Details";
import InsertChartIcon from "@material-ui/icons/InsertChart";
import IconButton from "@material-ui/core/IconButton";

const styles = theme => ({
  activeIcon: {
    width: "calc(100vw / 10 - 8px)",
    minWidth: 142,
    marginRight: theme.spacing.unit * 2,
    backgroundColor: theme.palette.primary.dark,
    marginBottom: theme.spacing.unit * 2,
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    color: "white"
  },
  defaultIcon: {
    width: "calc(100vw / 10 - 8px)",
    minWidth: 142,
    marginRight: theme.spacing.unit * 2,
    backgroundColor: theme.palette.background.paper,
    borderWidth: 1,
    borderColor: theme.palette.secondary.main,
    marginBottom: theme.spacing.unit * 2,
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    color: "white"
  },
  icon: {
    width: "100%",
    height: "100%"
  }
});

class Detail extends Component {
  state = {
    hovered: null,
    show: 'agg',
    // showDetail: false,
  };

  handleOnHover = hovered => this.setState({ hovered });

  handleSubNavClick = value => {
    this.setState({
      show: value
    });
  };

  handleDayChange = day => {
    this.props.detailRequest(day);
  };

  componentDidMount() {
    this.props.allDaysRequest();
  }

  get rotation() {
    if (!this.state.hovered) {
      return [];
    }
    return this.props.data.filter(
      d => d["Route"] === this.state.hovered["Route"]
    );
  }

  render() {
    const { classes } = this.props;
    const { show } = this.state;

    return (
      <div>
        <span style={{ display: "flex" }}>
          <Paper
            className={
              show === 'detail' ? classes.activeIcon : classes.defaultIcon
            }
          >
            <IconButton
              className={classes.icon}
              disableRipple={true}
              onClick={() => this.handleSubNavClick(show === 'detail' ? null : 'detail')}
            >
              <DetailIcon />
            </IconButton>
          </Paper>
          <Paper
            className={
              show === 'agg' ? classes.activeIcon : classes.defaultIcon
            }
          >
            <IconButton
              className={classes.icon}
              disableRipple={true}
              onClick={() => this.handleSubNavClick(show === 'agg' ? null : 'agg')}
            >
              <InsertChartIcon />
            </IconButton>
          </Paper>
          <Selector
            options={this.props.days}
            onItemSelected={this.handleDayChange}
          />
          <Quick rotation={this.rotation} />
        </span>
        <span style={{ display: "flex" }}>
          {show === 'agg' && <Aggregations data={this.props.aggregated} />}
          {show === 'detail' && <Stats item={this.state.hovered} />}
          <Table
            data={this.props.data}
            header={this.props.header}
            handleOnHover={this.handleOnHover}
          />
        </span>
      </div>
    );
  }
}

Detail.propTypes = {
  // TODO: add day and daya shapes
  days: PropTypes.arrayOf(PropTypes.object).isRequired,
  data: PropTypes.arrayOf(PropTypes.object).isRequired,
  header: PropTypes.arrayOf(PropTypes.string).isRequired,
  detailRequest: PropTypes.func.isRequired,
  allDaysRequest: PropTypes.func.isRequired
};

export default connect(
  (state, ownProps) => ({
    days: state.detail.days,
    data: state.detail.data,
    aggregated: state.detail.aggregated,
    header: state.detail.header
  }),
  dispatch => bindActionCreators({ ...actions }, dispatch)
)(withStyles(styles)(Detail));
