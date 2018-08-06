import React, { PureComponent } from "react";
import PropTypes from "prop-types";
import TableCell from "@material-ui/core/TableCell";
import TableHead from "@material-ui/core/TableHead";
import TableRow from "@material-ui/core/TableRow";
import TableSortLabel from "@material-ui/core/TableSortLabel";
import Tooltip from "@material-ui/core/Tooltip";

export default class EnhancedTableHead extends PureComponent {
  createSortHandler = property => event => {
    this.props.onRequestSort(event, property);
  };

  render() {
    const { columnData, order, orderBy, classes } = this.props;

    return (
      <TableHead>
        <TableRow>
          {columnData.filter(c => !!c).map((column, index) => {
            return (
              <TableCell
                key={`column-${index}`}
                numeric={true}
                padding={"default"}
                className={classes.head}
                sortDirection={orderBy === column ? order : false}
              >
                <Tooltip
                  title="Sort"
                  placement={column.numeric ? "bottom-end" : "bottom-start"}
                  enterDelay={300}
                >
                  <TableSortLabel
                    active={orderBy === column}
                    direction={order}
                    onClick={this.createSortHandler(column)}
                  >
                    {column}
                  </TableSortLabel>
                </Tooltip>
              </TableCell>
            );
          }, this)}
        </TableRow>
      </TableHead>
    );
  }
}

EnhancedTableHead.propTypes = {
  onRequestSort: PropTypes.func.isRequired,
  order: PropTypes.string.isRequired,
  orderBy: PropTypes.string.isRequired
};
