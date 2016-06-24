import { browserHistory } from 'react-router';
import axios from 'axios';
import { AUTH_USER, UNAUTH_USER, GET_USER, FETCH_STARRED_REPOS } from './types';
import config from '../config';
import { parsePage } from '../utils';

const GITHUB_API_URL = 'https://api.github.com';

export function signinUser() {
  return {
    type: AUTH_USER,
  };
}

export function signoutUser() {
  return {
    type: UNAUTH_USER,
  };
}

export function loginUser(code) {
  const url = `${config.gatekeeper}/authenticate/${code}`;

  return dispatch => {
    axios.get(url).then(response => {
      const token = response.data.token;
      dispatch(signinUser());
      window.localStorage.setItem('token', token);
      browserHistory.push('/');
    }).catch(error => {
      browserHistory.push('/');
    });
  };
}

export function logoutUser() {
  return dispatch => {
    dispatch(signoutUser());
    window.localStorage.removeItem('token');
    browserHistory.push('/');
  };
}

export function getUser(callback) {
  return dispatch => {
    axios.get(`${GITHUB_API_URL}/user`, {
      headers: {
        authorization: `token ${window.localStorage.getItem('token')}`,
      },
    }).then(response => {
      dispatch({
        type: GET_USER,
        payload: response.data,
      });

      if (typeof callback === 'function') {
        callback(response.data.login);
      }
    }).catch(error => {
      // console.log('error:', error);
    });
  }
}

export function fetchStarredRepos(page = 1) {
  return dispatch => {
    axios.get(`${GITHUB_API_URL}/user/starred?page=${page}`, {
      headers: {
        authorization: `token ${window.localStorage.getItem('token')}`,
      },
    }).then(response => {
      dispatch({
        type: FETCH_STARRED_REPOS,
        payload: {
          repos: response.data,
          pages: parsePage(response.headers.link),
        },
      });
    }).catch(error => {
      console.log('error:', error);
    });
  };
}
