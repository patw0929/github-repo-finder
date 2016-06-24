import { FETCH_STARRED_REPOS } from '../actions/types';

export default (state = [], action) => {
  switch (action.type) {
    case FETCH_STARRED_REPOS:
      return action.payload;
  }

  return state;
}
