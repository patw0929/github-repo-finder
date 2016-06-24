import { AUTH_USER, UNAUTH_USER } from '../actions/types';

export default (state = false, action) => {
  switch (action.type) {
    case AUTH_USER:
      return true;

    case UNAUTH_USER:
      return false;
  }

  return state;
}
