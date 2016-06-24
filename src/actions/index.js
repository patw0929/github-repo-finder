import { browserHistory } from 'react-router';
import axios from 'axios';
import {
  AUTH_USER,
  UNAUTH_USER,
  GET_USER,
  SEARCH_REPOS,
  ENTER_KEYWORD,
  GET_STAR_STATUS,
  TOGGLE_STAR,
} from './types';
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
      console.log('getUser error:', error);
    });
  }
}

export function enterKeyword(keyword) {
  return {
    type: ENTER_KEYWORD,
    payload: keyword,
  };
}

export function searchRepos(keyword, page = 1) {
  return dispatch => {
    // axios.get(`${GITHUB_API_URL}/user/starred?page=${page}`, {
    axios.get(`${GITHUB_API_URL}/search/repositories?q=${keyword}&page=${page}`, {
      headers: {
        authorization: `token ${window.localStorage.getItem('token')}`,
      },
    }).then(response => {
      dispatch({
        type: SEARCH_REPOS,
        payload: {
          repos: response.data.items,
          pages: parsePage(response.headers.link),
          keyword,
        },
      });
    }).catch(error => {
      console.log('searchRepos error:', error);
    });
  };
}

export function getRepo(onwer, repo) {
  return dispatch => {
    axios.get(`${GITHUB_API_URL}/${owner}/${repo}`, {
      headers: {
        authorization: `token ${window.localStorage.getItem('token')}`,
      },
    }).then(response => {
      dispatch({
        type: GET_REPO,
        payload: response.data,
      });
    }).catch(error => {
      console.log('getRepo error', error);
    });
  }
}

export function getStarStatus(owner, repo) {
  return dispatch => {
    axios.get(`${GITHUB_API_URL}/user/starred/${owner}/${repo}`, {
      headers: {
        authorization: `token ${window.localStorage.getItem('token')}`,
      },
    }).then(response => {
      dispatch({
        type: GET_STAR_STATUS,
        payload: true,
      });
    }).catch(error => {
      if (error.status !== 404) {
        console.log('getStarStatus error', error);
      } else {
        dispatch({
          type: GET_STAR_STATUS,
          payload: false,
        });
      }
    });
  };
}

export function toggleStar(owner, repo, bool) {
  return dispatch => {
    const action = bool ? 'put' : 'delete';

    axios({
      url: `${GITHUB_API_URL}/user/starred/${owner}/${repo}`,
      method: action,
      headers: {
        authorization: `token ${window.localStorage.getItem('token')}`,
      },
      data: '',
    }).then(response => {
      dispatch({
        type: TOGGLE_STAR,
      });
    }).catch(error => {
      console.log('toggleStar error', error);
    });
  };
}
