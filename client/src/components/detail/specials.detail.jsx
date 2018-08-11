import React from "react";
import Paper from "@material-ui/core/Paper";
import Table from "@material-ui/core/Table";
import TableBody from "@material-ui/core/TableBody";
import TableCell from "@material-ui/core/TableCell";
import TableHead from "@material-ui/core/TableHead";
import TableRow from "@material-ui/core/TableRow";

const statsStyles = {};

const Specials = ({ data }) => (
  <Paper style={statsStyles}>
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
  </Paper>
);

export default Specials;
