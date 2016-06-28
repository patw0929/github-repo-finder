import React from 'react';
import ReactDOM from 'react-dom';
import { Provider } from 'react-redux';
import { createStore, applyMiddleware } from 'redux';
import { Router, useRouterHistory } from 'react-router';
import { createHistory, createHashHistory } from 'history';
import reduxThunk from 'redux-thunk';
import routes from './routes';
import { AUTH_USER } from './actions/types';
import reducers from './reducers';

const createStoreWithMiddleware = applyMiddleware(reduxThunk)(createStore);
const store = createStoreWithMiddleware(reducers);

const historyType = process.env.NODE_ENV === 'production' ?
  createHashHistory : createHistory;

const history = useRouterHistory(historyType)({ queryKey: false })

const token = window.localStorage.getItem('token');
// if token, we need update application state
if (token) {
  store.dispatch({ type: AUTH_USER });
}

ReactDOM.render(
  <Provider store={store}>
    <Router history={history} routes={routes} />
  </Provider>
  , document.querySelector('.app'));
