import { SEARCH_REPOS, ENTER_KEYWORD } from '../actions/types';

const initialState = {
  keyword: '',
  items: [],
  pages: {},
};

export default (state = initialState, action) => {
  switch (action.type) {
    case SEARCH_REPOS:
      return action.payload;

    case ENTER_KEYWORD:
      return Object.assign({}, state, {
        keyword: action.payload,
      });
  }

  return state;
}
