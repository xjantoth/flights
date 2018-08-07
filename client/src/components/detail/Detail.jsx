import React, { Component } from "react";
import Table from "./DetailTable";
import Stats from "./DetailStats";
import Grid from "@material-ui/core/Grid";
import AppBar from "@material-ui/core/AppBar";
import Toolbar from "@material-ui/core/Toolbar";
import moment from 'moment';

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

  dayLabelFormatter = day => day.split('___').map(item => moment(item).format('MMM Do, H:mm')).join(' - ');

  handleOnHover = hovered => this.setState({ hovered });

  handleDayChange = day => this.loadData(day);

  headerProcessor = items => {
    return items
      .slice()
      .filter(i => !this.excludedHeaders.includes(i))
      .sort((a, b) => this.headerOrder.indexOf(b) - this.headerOrder.indexOf(a));
  }

  componentDidMount() {
    this.loadAllData();
  }

  loadAllData = day =>
    fetch(`${baseUrl}/allud`)
      .then(data => data.json())
      .then(data => {
        this.setState({ 
          days: data.map(day => { 
            return {
              raw: day, 
              url: this.timeFormatter(day), 
              display: this.dayLabelFormatter(day)
            } 
          }) 
        });
        return data;
      }).then(days => this.loadData(this.timeFormatter(days[0])));

  loadData = day => 
    fetch(`${baseUrl}/detail/${day}`)
    .then(data => data.text())
    .then(data => data.replace(/NaN/g, "null"))
    .then(data => JSON.parse(data))
    .then(data =>
      this.setState({
        data: data.list_view,
        header: this.headerProcessor(Object.keys(data.list_view[0])),
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
          <Toolbar style={{ minHeight: 36, display: 'flex', justifyContent: 'space-evenly' }}>
            {this.state.days.map((item, index) => (
              <p key={`item-no-${index}`} onClick={() => this.handleDayChange(item.url)} style={{ fontFamily: 'monospace', cursor: 'pointer' }}>
                {item.display}
              </p>
            ))}
          </Toolbar>
      </AppBar>
      <Grid container>
        <Grid item xs={4}>
          <Stats item={hovered} />
        </Grid>
        <Grid item xs={8}>
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
