import React, { PureComponent } from "react";
import PropTypes from "prop-types";
import { withStyles } from "@material-ui/core/styles";
import Paper from "@material-ui/core/Paper";
import Table from "@material-ui/core/Table";
import TableBody from "@material-ui/core/TableBody";
import TableCell from "@material-ui/core/TableCell";
import TableRow from "@material-ui/core/TableRow";
import EnhancedTableHead from "./header.detail";
import ArrowForward from "@material-ui/icons/ArrowForward";
import ArrowBack from "@material-ui/icons/ArrowBack";
import { timeFormatter, getSorting } from "../../utils";

const styles = theme => ({
  root: {
    width: "100%",
    marginTop: theme.spacing.unit * 3
  },
  table: {
    minWidth: 900
  },
  head: {
    backgroundColor: theme.palette.background.default,
    position: "sticky",
    zIndex: 9,
    top: 0
  },
  tableWrapper: {
    height: "calc(100vh - 200px)",
    overflowY: "auto",
    zIndex: 1,
    flexGrow: 1
  },
  highlighted: {
    backgroundColor: `${theme.palette.primary.main}5`
  },
  faded: {
    opacity: 0.33
  },
  focused: {
    backgroundColor: theme.palette.primary.main
  }
});

class EnhancedTable extends PureComponent {
  state = {
    order: "asc",
    hovered: null,
    hoverActive: false,
    orderBy: "Route"
  };

  handleRequestSort = (event, property) => {
    const orderBy = property;
    let order = "desc";

    if (this.state.orderBy === property && this.state.order === "desc") {
      order = "asc";
    }
    this.setState({
      order,
      orderBy,
      data: this.props.data.sort(getSorting(order, orderBy))
    });
  };

  handleMouseHover = item => {
    if (this.state.hoverActive) {
      return;
    }
    this.props.handleOnHover(item);
    this.setState(prev => {
      return { ...prev, hovered: item };
    });
  };

  handleOnClick = () =>
    this.setState(prev => {
      return { ...prev, hoverActive: !prev.hoverActive };
    });

  cellRender = (header, cell) => {
    switch (header) {
      case "Direction":
        return cell[header] === "TAM" ? <ArrowForward /> : <ArrowBack />;
      case "Arrival":
      case "Depart":
        return timeFormatter(cell[header]);
      default:
        return cell[header];
    }
  };
  render() {
    const { classes, data, header } = this.props;
    const { order, orderBy, hovered } = this.state;

    return (
      <Paper className={classes.tableWrapper}>
        <Table className={classes.table} aria-labelledby="tableTitle">
          <EnhancedTableHead
            columnData={header}
            order={order}
            orderBy={orderBy}
            onRequestSort={this.handleRequestSort}
            classes={classes}
          />
          <TableBody>
            {data.map((item, index) => {
              let cls =
                hovered && item.Route === hovered.Route
                  ? classes.highlighted
                  : classes.faded;
              if (item === hovered) {
                cls = classes.focused;
              }
              return (
                <TableRow
                  className={cls}
                  onMouseEnter={() => this.handleMouseHover(item)}
                  onClick={this.handleOnClick}
                  tabIndex={-1}
                  key={index}
                  hover={this.state.hoverActive && cls === classes.faded}
                >
                  {header.map(h => (
                    <TableCell padding={"dense"} key={h}>
                      {this.cellRender(h, item)}
                    </TableCell>
                  ))}
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      </Paper>
    );
  }
}

EnhancedTable.propTypes = {
  classes: PropTypes.object.isRequired,
  // TODO: add objet shape
  data: PropTypes.array.isRequired,
  header: PropTypes.arrayOf(PropTypes.string).isRequired,
  handleOnHover: PropTypes.func
};

export default withStyles(styles)(EnhancedTable);
