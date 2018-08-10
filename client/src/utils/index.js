import moment from "moment";

export const createAction = action => payload => {
  return { type: action, payload };
};

export const createReducer = (initialState, reducerMap) => (
  state = initialState,
  action
) => {
  const reducer = reducerMap[action.type];
  return reducer ? reducer(state, action.payload) : state;
};

export const timeFormatter = item => moment(item).format("MMM Do, H:mm");

export const getSorting = (order, orderBy) => {
  return order === "desc"
    ? (a, b) => (b[orderBy] < a[orderBy] ? -1 : 1)
    : (a, b) => (a[orderBy] < b[orderBy] ? -1 : 1);
};

export const objectToForm = payload => {
  const formData = new FormData();
  for (let key in payload) {
    formData.append(key, payload[key]);
  }
  return {
    method: "POST",
    body: formData
  };
};
