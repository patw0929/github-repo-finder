import { browserHistory } from 'react-router';
import axios from 'axios';
import { SAVE_ACCESS_TOKEN, GET_USER } from './types';
import config from '../config';

const GITHUB_API_URL = 'https://api.github.com';

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

export function getUser(token) {
  return dispatch => {
    axios.get(`${GITHUB_API_URL}/user`, {
      headers: {
        authorization: `token ${token}`,
      },
    }).then(response => {
      dispatch({
        type: GET_USER,
        payload: response.data,
      });
    }).catch(error => {
      console.log('error:', error);
    });
  }
}
