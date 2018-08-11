import * as actions from "./actions.detail";
import { createReducer } from "utils";
import moment from "moment";

const excludedHeaders = [
  "Aircraft",
  "Route",
  "Extra Catering",
  "Note",
  "Meal",
  "Production",
  "Reg"
];

const headerOrder = [
  "Crew",
  "Quantity",
  "Direction",
  "To",
  "From",
  "Flight",
  "Arrival",
  "Depart"
];

const timeFormatter = time => time.replace(/[ |:]/g, "_");

const dayLabelFormatter = day =>
  day
    .split("___")
    .map(item => moment(item).format("MMM Do, H:mm"))
    .join(" - ");

const headerProcessor = items => {
  return items
    .slice()
    .filter(i => !excludedHeaders.includes(i))
    .sort((a, b) => headerOrder.indexOf(b) - headerOrder.indexOf(a));
};

const initState = {
  days: [],
  data: [],
  header: [],
  quantities: [],
  specials: []
};

export default createReducer(initState, {
  [actions.ALL_DAYS_REQUEST]: (state, payload) => ({
    ...state
  }),
  [actions.ALL_DAYS_SUCCESS]: (state, payload) => ({
    ...state,
    days: payload.map((day, index) => {
      return {
        raw: day,
        url: timeFormatter(day),
        display: dayLabelFormatter(day),
        active: !!!index
      };
    })
  }),
  [actions.ALL_DAYS_ERROR]: (state, payload) => ({
    ...state
  }),
  [actions.DETAIL_REQUEST]: (state, payload) => ({
    ...state
  }),
  [actions.DETAIL_SUCCESS]: (state, payload) => ({
    ...state,
    data: payload.list_view,
    header: headerProcessor(Object.keys(payload.list_view[0])),
    quantities: payload.aggregated,
    specials: payload.special_quantity
  }),
  [actions.DETAIL_ERROR]: (state, payload) => ({
    ...state
  })
});
