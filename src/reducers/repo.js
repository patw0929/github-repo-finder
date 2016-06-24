import { GET_REPO, GET_STAR_STATUS, TOGGLE_STAR } from '../actions/types';

const initialStatus = {
  data: {},
  starred: false,
};

export default (state = initialStatus, action) => {
  switch (action.type) {
    case GET_REPO:
      return Object.assign({},
        state,
        { data: action.payload });

    case GET_STAR_STATUS:
      return Object.assign({},
        state,
        { starred: action.payload });

    case TOGGLE_STAR:
      return Object.assign({},
        state,
        { starred: !state.starred })
  }

  return state;
}
