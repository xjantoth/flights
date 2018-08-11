import React, { Component } from "react";
import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import * as actions from "./actions.detail";
import Selector from "./selector.detail";
import Quick from "./quick.detail";
import Table from "./table.detail";

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
    const { hovered } = this.state;

    return (
      <div>
        <span style={{ display: "flex" }}>
          <Selector
            options={this.props.days}
            onItemSelected={this.handleDayChange}
          />
          <Quick rotation={this.rotation} />
        </span>
        <Table
          data={this.props.data}
          header={this.props.header}
          handleOnHover={this.handleOnHover}
        />
      </div>
    );
  }
}

export default connect(
  (state, ownProps) => ({
    days: state.detail.days,
    data: state.detail.data,
    header: state.detail.header
  }),
  dispatch => bindActionCreators({ ...actions }, dispatch)
)(Detail);
