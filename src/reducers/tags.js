import { SEARCH_REPOS_BY_TAG } from '../actions/types';

const initialState = {
  tag: '',
  repos: [],
  pages: {},
};

export default (state = initialState, action) => {
  switch (action.type) {
    case SEARCH_REPOS_BY_TAG:
      return action.payload;
  }

  return state;
}
