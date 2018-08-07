import React, { Component } from "react";
import Table from "./Table";
import Stats from "./Stats";
import Grid from "@material-ui/core/Grid";
import AppBar from "@material-ui/core/AppBar";
import Toolbar from "@material-ui/core/Toolbar";
import moment from "moment";
import classNames from "classnames";
import Specials from "./Specials";

const baseUrl = "http://scaleway.linuxinuse.com:5000/api";
//: "/api";

export default class Detail extends Component {
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
    this.loadAllData();
  }

  loadAllData = day =>
    fetch(`${baseUrl}/allud`)
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
    fetch(`${baseUrl}/detail/${day}`)
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
        <AppBar
          position="static"
          color="default"
          style={{ backgroundColor: "#da1", height: 36 }}
        >
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
        </AppBar>
        <Grid container>
          <Grid item xs={5}>
            {/* <Stats item={hovered} /> */}
            <Specials data={this.state.specials} />
          </Grid>
          <Grid item xs={7}>
            <Table
              data={this.state.data}
              header={this.state.header}
              handleOnHover={this.handleOnHover}
            />
          </Grid>
        </Grid>
      </div>
    );
  }
}
