import React from 'react';
import ReactDOM from 'react-dom';
import { Provider } from 'react-redux';
import { createStore, applyMiddleware } from 'redux';
import { Router, hashHistory, browserHistory } from 'react-router';
import reduxThunk from 'redux-thunk';
import routes from './routes';
import { SAVE_ACCESS_TOKEN } from './actions/types';
import reducers from './reducers';

const createStoreWithMiddleware = applyMiddleware(reduxThunk)(createStore);
const store = createStoreWithMiddleware(reducers);

// Use hash location for Github Pages
// but switch to HTML5 history locally.
const history = process.env.NODE_ENV === 'production' ?
  hashHistory : browserHistory;

const token = window.localStorage.getItem('token');
// if token, we need update application state
if (token) {
  store.dispatch({ type: SAVE_ACCESS_TOKEN, payload: token });
}

ReactDOM.render(
  <Provider store={store}>
    <Router history={history} routes={routes} />
  </Provider>
  , document.querySelector('.app'));
