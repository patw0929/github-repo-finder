import { combineReducers } from 'redux';
import loginReducer from './login';

const rootReducer = combineReducers({
  token: loginReducer,
});

export default rootReducer;
