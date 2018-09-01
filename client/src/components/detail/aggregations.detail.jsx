import React, { Fragment } from "react";
import Paper from "@material-ui/core/Paper";
import PropTypes from "prop-types";
import Table from "@material-ui/core/Table";
import TableBody from "@material-ui/core/TableBody";
import TableCell from "@material-ui/core/TableCell";
import TableHead from "@material-ui/core/TableHead";
import TableRow from "@material-ui/core/TableRow";
import { withStyles } from "@material-ui/core/styles";

const styles = theme => ({
  statsStyles: {
    height: "auto",
    overflowY: "auto",
    width: "calc(100vw / 5)",
    minWidth: 300,
    marginRight: theme.spacing.unit * 2,
    zIndex: 1,
    paddingTop: theme.spacing.unit * 2,
    paddingRight: theme.spacing.unit * 2
  },
  noteStyles: {
    color: theme.palette.text.primary,
    paddingLeft: theme.spacing.unit * 3,
    marginTop: theme.spacing.unit * 3,
    fontFamily: "monospace",
    textAlign: "justify",
    fontSize: "1.1em",
    whiteSpace: "pre-wrap"
  }
});

const headers = [
  "Aircraft",
  "Reg",
  "Route",
  "Meal",
  "Production",
  "Extra Catering"
  // "Note"
];

const Aggregations = ({ data, classes }) => (
  <Paper className={classes.statsStyles}>
    <Table className={classes.table} fullWidth>
      <TableHead>
        <TableRow>
          <TableCell>Meal</TableCell>
          <TableCell numeric>Spat</TableCell>
          <TableCell numeric>Tam</TableCell>
        </TableRow>
      </TableHead>
      <TableBody>
        {Object.keys(data).map((key, index) => {
          return (
            <TableRow key={index}>
              <TableCell>{key}</TableCell>
              <TableCell>{data[key].SPAT}</TableCell>
              <TableCell>{data[key].TAM}</TableCell>
            </TableRow>
          );
        })}
      </TableBody>
    </Table>
  </Paper>
);

Aggregations.propTypes = {
  classes: PropTypes.object.isRequired,
  data: PropTypes.object
};

export default withStyles(styles, { withTheme: true })(Aggregations);
