import { SET_ERRORS, CLEAR_ERRORS, LOADING_UI, SET_USER } from "../types";
import { CardActions } from "@material-ui/core";

const initialState = {
  loading: false,
  error: null,
};

export default function (state = initialState, action) {
  switch (action.type) {
    case SET_ERRORS:
      return {
        ...state,
        loading: false,
        errors: action.payload,
      };
    case CLEAR_ERRORS:
      return {
        ...state,
        loading: false,
        errors: null,
      };
    case LOADING_UI:
      return {
        ...state,
        loading: true,
      };
    default:
      return state;
  }
}
