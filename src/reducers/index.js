import { combineReducers } from 'redux';
import { reducer as formReducer } from 'redux-form';
import authReducer from './auth';
import userReducer from './user';
import reposReducer from './repos';
import repoReducer from './repo';

const rootReducer = combineReducers({
  authenticated: authReducer,
  user: userReducer,
  repos: reposReducer,
  repo: repoReducer,
  form: formReducer,
});

export default rootReducer;
