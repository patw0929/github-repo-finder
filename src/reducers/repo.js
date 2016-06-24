import { GET_REPO } from '../actions/types';

export default (state = {}, action) => {
  switch (action.type) {
    case GET_REPO:
      return action.payload;
  }

  return state;
}
