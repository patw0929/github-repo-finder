import { SEARCH_REPOS_BY_TAG, GET_RANDOM_TAGS } from '../actions/types';

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
