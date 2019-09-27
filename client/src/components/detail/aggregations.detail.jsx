import React from "react";
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
    zIndex: 1
  },
  head: {
    backgroundColor: theme.palette.background.default,
    position: "sticky",
    zIndex: 9,
    top: 0
  },
  cell: {
    borderBottom: '1px solid transparent'
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

const Aggregations = ({ data, classes }) => (
  <Paper className={classes.statsStyles}>
    <Table className={classes.table} fullWidth>
      <TableHead className={classes.head}>
        <TableRow>
          <TableCell className={classes.cell}><b>Meal</b></TableCell>
          <TableCell className={classes.cell}>Spat</TableCell>
          <TableCell className={classes.cell}>Tam</TableCell>
        </TableRow>
      </TableHead>
      <TableBody>
        {data && Object.keys(data).map((key, index) => {
          return (
            <TableRow key={index}>
              <TableCell className={classes.cell}><b>{key}</b></TableCell>
              <TableCell className={classes.cell}>{data[key].SPAT}</TableCell>
              <TableCell className={classes.cell}>{data[key].TAM}</TableCell>
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
