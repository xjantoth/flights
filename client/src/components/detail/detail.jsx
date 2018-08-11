import React, { Component } from "react";
import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import Table from "./table.detail";
import Stats from "./stats.detail";
import Grid from "@material-ui/core/Grid";
import AppBar from "@material-ui/core/AppBar";
import Toolbar from "@material-ui/core/Toolbar";
import moment from "moment";
import classNames from "classnames";
import Specials from "./specials.detail";
import * as actions from "./actions.detail";
import Selector from "./selector.detail";
import Quick from "./quick.detail";
import api from "api";

class Detail extends Component {
  state = {
    data: [],
    header: [],
    quantities: [],
    specials: [],
    days: [],
    hovered: null
  };

  excludedHeaders = [
    "Aircraft",
    "Route",
    "Extra Catering",
    "Note",
    "Meal",
    "Production",
    "Reg"
  ];

  headerOrder = [
    "Crew",
    "Quantity",
    "Direction",
    "To",
    "From",
    "Flight",
    "Arrival",
    "Depart"
  ];

  timeFormatter = time => time.replace(/[ |:]/g, "_");

  dayLabelFormatter = day =>
    day
      .split("___")
      .map(item => moment(item).format("MMM D"))
      .join(" - ");

  handleOnHover = hovered => this.setState({ hovered });

  handleDayChange = day => {
    const days = [...this.state.days];
    days.map(d => (d.active = d.url === day.url));
    this.setState({ days });
    this.loadData(day.url);
  };

  headerProcessor = items => {
    return items
      .slice()
      .filter(i => !this.excludedHeaders.includes(i))
      .sort(
        (a, b) => this.headerOrder.indexOf(b) - this.headerOrder.indexOf(a)
      );
  };

  componentDidMount() {
    // this.props.allDaysRequest();
    this.loadAllData();
    // this.props.fetchDay();
  }

  loadAllData = day =>
    fetch(api.DAYS_LIST)
      .then(data => data.json())
      .then(data => {
        this.setState({
          days: data.map((day, index) => {
            return {
              raw: day,
              url: this.timeFormatter(day),
              display: this.dayLabelFormatter(day),
              active: !!!index
            };
          })
        });
        return data;
      })
      .then(days => this.loadData(this.timeFormatter(days[0])));

  loadData = day =>
    fetch(`${api.DAY}${day}`)
      .then(data => data.text())
      .then(data => data.replace(/NaN/g, "null"))
      .then(data => JSON.parse(data))
      .then(data =>
        this.setState({
          data: data.list_view,
          header: this.headerProcessor(Object.keys(data.list_view[0])),
          quantities: data.aggregated,
          specials: data.special_quantity
        })
      );

  render() {
    const { hovered } = this.state;

    return (
      <div>
        {/* <AppBar position="static" color="default" style={{ height: 36 }}>
          <Toolbar
            style={{
              minHeight: 36,
              display: "flex",
              justifyContent: "space-evenly"
            }}
          >
            {this.state.days.map((item, index) => (
              <span
                key={`item-no-${index}`}
                onClick={() => this.handleDayChange(item)}
                className={classNames({
                  "nav-item": true,
                  active: item.active
                })}
              >
                {item.display}
              </span>
            ))}
          </Toolbar>
        </AppBar> */}
        {/* <Grid container> */}
        {/* <Grid item xs={5}>
            {/* <Stats item={hovered} /> */}
        {/* <Specials data={this.state.specials} /> */}
        {/* </Grid> */}
        {/* <Grid item xs={7}> */}
        <span style={{ display: "flex" }}>
          <Selector
            options={this.state.days}
            onItemSelected={this.handleDayChange}
          />
          <Quick />
        </span>
        <Table
          data={this.state.data}
          header={this.state.header}
          handleOnHover={this.handleOnHover}
        />
        {/* </Grid> */}
        {/* </Grid> */}
      </div>
    );
  }
}

export default connect(
  (state, ownProps) => ({
    active: false
  }),
  dispatch => bindActionCreators({ ...actions }, dispatch)
)(Detail);
