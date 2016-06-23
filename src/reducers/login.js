import { SAVE_ACCESS_TOKEN } from '../actions/types';

export default (state = '', action) => {
  switch(action.type) {
    case SAVE_ACCESS_TOKEN:
      return action.payload;
  }

  return state;
}
