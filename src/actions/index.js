import { browserHistory } from 'react-router';
import axios from 'axios';
import { SAVE_ACCESS_TOKEN } from './types';
import config from '../config';

export function saveAccessToken(token) {
  return {
    type: SAVE_ACCESS_TOKEN,
    payload: token,
  };
}

export function loginUser(code) {
  const url = `${config.gatekeeper}/authenticate/${code}`;

  return dispatch => {
    const request = axios.get(url).then(response => {
      const token = response.data.token;
      dispatch(saveAccessToken(token));
      window.localStorage.setItem('token', token);
      browserHistory.push('/');
    }).catch((error) => {
      browserHistory.push('/');
    });
  };
}

export function logoutUser() {
  return dispatch => {
    dispatch(saveAccessToken(null));
    window.localStorage.removeItem('token');
    browserHistory.push('/');
  };
}
