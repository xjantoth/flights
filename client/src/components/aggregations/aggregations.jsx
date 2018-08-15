import React, { Component } from "react";
import Paper from "@material-ui/core/Paper";
import {
  BarChart,
  Bar,
  XAxis,
  // YAxis,
  // CartesianGrid,
  Tooltip,
  Legend
} from "recharts";

// https://jsfiddle.net/9hjfkp73/1308/
const data = [
  { name: "Page A", uv: 4000, female: 2400, male: 2400 },
  { name: "Page B", uv: 3000, female: 1398, male: 2210 },
  { name: "Page C", uv: 2000, female: 9800, male: 2290 },
  { name: "Page D", uv: 2780, female: 3908, male: 2000 },
  { name: "Page E", uv: 1890, female: 4800, male: 2181 },
  { name: "Page F", uv: 2390, female: 3800, male: 2500 },
  { name: "Page G", uv: 3490, female: 4300, male: 2100 }
];

class StackedBarChart extends Component {
  render() {
    return (
      <Paper>
        <BarChart
          width={600}
          height={350}
          data={data}
          margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
        >
          {/* <CartesianGrid strokeDasharray="3 3" /> */}
          <XAxis dataKey="name" stroke="white" />
          {/* <YAxis stroke="white" /> */}
          <Tooltip />
          <Legend wrapperStyle={{ color: "white" }} />
          <Bar dataKey="female" stackId="a" fill="#fc1" />
          <Bar dataKey="male" stackId="a" fill="#39a" />
          <Bar dataKey="uv" fill="#a33" />
        </BarChart>
      </Paper>
    );
  }
}

export default StackedBarChart;
