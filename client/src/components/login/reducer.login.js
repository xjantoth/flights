import * as actions from "./actions.login";

const initState = {
  isAuthenticated: false,
  isLoading: false,
  isError: false,
  error: null
};

function reducer(state = initState, action) {
  console.log(action);
  switch (action.type) {
    case actions.LOGIN_REQUEST:
      return {
        ...state,
        isLoading: true,
        isError: false,
        error: null
      };

    case actions.LOGIN_REQUEST_SUCCESS:
      return {
        ...state,
        isLoading: false,
        isError: false,
        error: null
      };

    case actions.LOGIN_REQUEST_ERROR:
      return {
        ...state,
        isLoading: false,
        isError: true,
        error: action.payload
      };

    default:
      return state;
  }
}

export default reducer;
