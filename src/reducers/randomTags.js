import { GET_RANDOM_TAGS } from '../actions/types';

export default (state = [], action) => {
  switch (action.type) {
    case GET_RANDOM_TAGS:
      return action.payload;
  }

  return state;
}
