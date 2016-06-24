import { combineReducers } from 'redux';
import authReducer from './auth';
import userReducer from './user';
import reposReducer from './repos';
import repoReducer from './repo';

const rootReducer = combineReducers({
  authenticated: authReducer,
  user: userReducer,
  repos: reposReducer,
  repo: repoReducer,
});

export default rootReducer;
