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

  timeFormatter = time => time.replace(/[ |:]/g, "_");

  handleOnHover = hovered => this.setState({ hovered });

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
          header: Object.keys(data.list_view[0])
        })
      );
  }

  render() {
    const { hovered } = this.state;
    return (
      <Grid container>
        <Grid item xs={2}>
          <Stats item={hovered} />
        </Grid>
        <Grid item xs={10}>
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
