import React from "react";
import Table from "@material-ui/core/Table";
import TableBody from "@material-ui/core/TableBody";
import TableCell from "@material-ui/core/TableCell";
import TableHead from "@material-ui/core/TableHead";
import TableRow from "@material-ui/core/TableRow";

const statsStyles = {
  height: "auto",
  overflowY: "auto",
  margin: 16,
  marginRight: 0,
  zIndex: 1,
  boxShadow: "0 0 4px #777",
  backgroundColor: "#eee"
};

const Specials = ({ data }) => (
  <div style={statsStyles}>
    <Table>
      <TableHead>
        <TableRow>
          <TableCell>Meal</TableCell>
          <TableCell numeric>Quantity</TableCell>
          <TableCell numeric>Quantity (189)</TableCell>
        </TableRow>
      </TableHead>
      <TableBody>
        {Object.keys(data).map(h => {
          console.log(h);
          return (
            <TableRow key={h}>
              <TableCell>{h}</TableCell>
              <TableCell numeric>{data[h][0]}</TableCell>
              <TableCell numeric>{data[h][1]}</TableCell>
            </TableRow>
          );
        })}
      </TableBody>
    </Table>
  </div>
);

export default Specials;
