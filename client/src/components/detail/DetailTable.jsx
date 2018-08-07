import React, { PureComponent } from "react";
import PropTypes from "prop-types";
import { withStyles } from "@material-ui/core/styles";
import Table from "@material-ui/core/Table";
import TableBody from "@material-ui/core/TableBody";
import TableCell from "@material-ui/core/TableCell";
import TableRow from "@material-ui/core/TableRow";
import EnhancedTableHead from "./DetailTableHeader";
import ArrowForward from "@material-ui/icons/ArrowForward";
import ArrowBack from "@material-ui/icons/ArrowBack";
import moment from 'moment';


function getSorting(order, orderBy) {
  return order === "desc"
    ? (a, b) => (b[orderBy] < a[orderBy] ? -1 : 1)
    : (a, b) => (a[orderBy] < b[orderBy] ? -1 : 1);
}

const styles = theme => ({
  root: {
    width: "100%",
    marginTop: theme.spacing.unit * 3,
    backgroundColor: '#eee'
  },
  table: {
    minWidth: 1020
  },
  head: {
    backgroundColor: "#ccc",
    position: "sticky",
    zIndex: 9,
    top: 0
  },
  tableWrapper: {
    backgroundColor: '#eee',
    height: "calc(100vh - 132px)",
    overflowY: "auto",
    margin: 16,
    zIndex: 1,
    boxShadow: "0 0 4px #777"
  }
});

class EnhancedTable extends PureComponent {
  state = {
    order: "asc",
    hovered: null,
    hoverActive: false,
    orderBy: "name"
  };

  handleRequestSort = (event, property) => {
    const orderBy = property;
    let order = "desc";

    if (this.state.orderBy === property && this.state.order === "desc") {
      order = "asc";
    }
    this.setState(prev => {
      return {
        order,
        orderBy,
        data: this.props.data.sort(getSorting(order, orderBy))
      };
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

  timeFormatter = item => moment(item).format('MMM Do, H:mm');

  render() {
    const { classes, data, header } = this.props;
    const { order, orderBy, hovered } = this.state;

    return (
      <div className={classes.tableWrapper}>
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
              let cls = hovered
                ? item.Route === hovered.Route
                  ? "highlighted"
                  : "faded"
                : "";
              if (item === hovered) {
                cls = "focused";
              }
              return (
                <TableRow
                  className={cls}
                  onMouseEnter={() => this.handleMouseHover(item)}
                  onClick={() =>
                    this.setState(prev => {
                      return { ...prev, hoverActive: !prev.hoverActive };
                    })
                  }
                  hover
                  tabIndex={-1}
                  key={index}
                >
                  {header.map(h => (
                    <TableCell padding={"dense"} key={h}>
                      {h === "Direction" ? (
                        item[h] === "TAM" ? (
                          <ArrowForward />
                        ) : (
                          <ArrowBack />
                        )
                      ) : h === "Arrival"  || h === "Depart" ? (
                        this.timeFormatter(item[h])
                      ) : (
                        item[h]
                      )}
                    </TableCell>
                  ))}
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      </div>
    );
  }
}

EnhancedTable.propTypes = {
  classes: PropTypes.object.isRequired
};

export default withStyles(styles)(EnhancedTable);
