import { combineReducers } from 'redux';
import { reducer as formReducer } from 'redux-form';
import authReducer from './auth';
import userReducer from './user';
import reposReducer from './repos';
import repoReducer from './repo';
import tagsReducer from './tags';

const rootReducer = combineReducers({
  authenticated: authReducer,
  user: userReducer,
  repos: reposReducer,
  repo: repoReducer,
  tags: tagsReducer,
  form: formReducer,
});

export default rootReducer;
