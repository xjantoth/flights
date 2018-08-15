import React, { Component } from "react";
import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import PropTypes from "prop-types";
import Selector from "./selector.detail";
import Quick from "./quick.detail";
import Table from "./table.detail";
import Stats from "./stats.detail";
import * as actions from "./actions.detail";

class Detail extends Component {
  state = {
    hovered: null
  };

  handleOnHover = hovered => this.setState({ hovered });

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
    return (
      <div>
        <span style={{ display: "flex" }}>
          <Selector
            options={this.props.days}
            onItemSelected={this.handleDayChange}
          />
          <Quick rotation={this.rotation} />
        </span>
        <span style={{ display: "flex" }}>
          <Stats item={this.state.hovered} />
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
    header: state.detail.header
  }),
  dispatch => bindActionCreators({ ...actions }, dispatch)
)(Detail);
