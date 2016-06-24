import { FETCH_STARRED_REPOS } from '../actions/types';

const initialState = {
  repos: [],
  pages: {},
};

export default (state = initialState, action) => {
  switch (action.type) {
    case FETCH_STARRED_REPOS:
      return action.payload;
  }

  return state;
}
