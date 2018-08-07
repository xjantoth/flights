import moment from "moment";

export const timeFormatter = item => moment(item).format("MMM Do, H:mm");

export function getSorting(order, orderBy) {
  return order === "desc"
    ? (a, b) => (b[orderBy] < a[orderBy] ? -1 : 1)
    : (a, b) => (a[orderBy] < b[orderBy] ? -1 : 1);
}
