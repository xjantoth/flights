import React, { Component } from "react";
import Table from "./DetailTable";
import Stats from "./DetailStats";
import Grid from "@material-ui/core/Grid";

const baseUrl = "http://scaleway.linuxinuse.com:5000/api";

export default class Detail extends Component {
  state = {
    data: [],
    header: [],
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
    'Crew',
    'Quantity',
    'Direction',
    'To',
    'From',
    'Flight',
    'Arrival',
    'Depart',
  ]

  timeFormatter = time => time.replace(/[ |:]/g, "_");

  handleOnHover = hovered => this.setState({ hovered });

  headerProcessor = items => {
    return items
      .slice()
      .filter(i => !this.excludedHeaders.includes(i))
      .sort((a, b) => this.headerOrder.indexOf(b) - this.headerOrder.indexOf(a));
  }

  componentDidMount() {
    fetch(`${baseUrl}/allud`)
      .then(data => data.json())
      .then(data => {
        this.setState({ days: data });
        return data;
      })
      .then(data => fetch(`${baseUrl}/detail/${this.timeFormatter(data[0])}`))
      .then(data => data.text())
      .then(data => data.replace(/NaN/g, "null"))
      .then(data => JSON.parse(data))
      .then(data =>
        this.setState({
          data: data.list_view,
          header: this.headerProcessor(Object.keys(data.list_view[0]))
        })
      );
  }

  render() {
    const { hovered } = this.state;
    return (
      <Grid container>
        <Grid container direction="column" xs={4}>
          {/* <Grid item xs={6}>
            <Stats item={hovered} />
          </Grid> */}
          <Grid item>
            <Stats item={hovered} />
          </Grid>
        </Grid>
        <Grid item xs={8}>
          <Table
            data={this.state.data}
            header={this.state.header}
            handleOnHover={this.handleOnHover}
          />
        </Grid>
      </Grid>
    );
  }
}
