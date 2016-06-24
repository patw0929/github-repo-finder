import { combineReducers } from 'redux';
import authReducer from './auth';
import userReducer from './user';
import reposReducer from './repos';

const rootReducer = combineReducers({
  authenticated: authReducer,
  user: userReducer,
  repos: reposReducer,
});

export default rootReducer;
