import {
  SET_SCREAM,
  SET_SCREAMS,
  LIKE_SCREAM,
  UNLIKE_SCREAM,
  LOADING_DATA,
  DELETE_SCREAM,
  POST_SCREAM,
  SUBMIT_COMMENT,
} from "../types";
const initialState = {
  screams: [],
  scream: {},
  loading: false,
};

export default function (state = initialState, action) {
  switch (action.type) {
    case LOADING_DATA:
      return {
        ...state,
        loading: true,
      };
    case SET_SCREAMS:
      return {
        ...state,
        screams: action.payload,
        loading: false,
      };
    case SET_SCREAM:
      return {
        ...state,
        scream: action.payload,
        loading: false,
      };
    case LIKE_SCREAM:
    case UNLIKE_SCREAM:
      let idx = state.screams.findIndex(
        (scream) => scream.screamId === action.payload.screamId
      );
      state.screams[idx] = action.payload;
      if (state.scream.screamId === action.payload.screamId) {
        state.scream = action.payload;
      }
      return {
        ...state,
      };
    case SUBMIT_COMMENT:
      return {
        ...state,
        scream: {
          ...state.scream,
          comments: [action.payload, ...state.scream.comments],
        },
      };

    case DELETE_SCREAM:
      state.screams.splice(
        state.screams.findIndex((scream) => scream.screamId === action.payload),
        1
      );
      return { ...state };
    case POST_SCREAM:
      return {
        ...state,
        scream: [action.payload, ...state.screams],
      };

    default:
      return state;
  }
}
