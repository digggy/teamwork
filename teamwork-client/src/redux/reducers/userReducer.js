import {
  SET_USER,
  SET_UNAUTHENTICATED,
  SET_AUTHENTICATED,
  LOADING_USER,
} from "../types";

const intiialState = {
  authenticated: false,
  loading: false,
  credentials: {},
  likes: [],
  notification: [],
};

export default function (state = intiialState, action) {
  switch (action.type) {
    case SET_AUTHENTICATED:
      return {
        ...state,
        authenticated: true,
      };
    case SET_UNAUTHENTICATED:
      return intiialState;

    case SET_USER:
      return {
        authenticated: true,
        loading: false,
        ...action.payload,
      };
    case LOADING_USER:
      return {
        ...state,
        loading: true,
      };
    default:
      return state;
  }
}
