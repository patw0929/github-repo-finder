import { combineReducers } from 'redux';
import loginReducer from './login';
import userReducer from './user';

const rootReducer = combineReducers({
  token: loginReducer,
  user: userReducer,
});

export default rootReducer;
