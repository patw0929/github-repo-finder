import { browserHistory } from 'react-router';
import axios from 'axios';
import {
  AUTH_USER,
  UNAUTH_USER,
  GET_USER,
  SEARCH_REPOS,
  SEARCH_REPOS_BY_TAG,
  ENTER_KEYWORD,
  GET_REPO,
  GET_STAR_STATUS,
  TOGGLE_STAR,
  FETCH_TAGS,
  CLEAN_REPO,
  GET_RANDOM_TAGS,
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
    axios.get(`${config.api_uri}/repos?q=${keyword}&page=${page}`, {
      headers: {
        authorization: `token ${window.localStorage.getItem('token')}`,
      },
    }).then(response => {
      const items = response.data.items;
      let parsedItems = [];
      items.map(item => {
        parsedItems.push({
          id: item.id,
          full_name: item.full_name,
          owner: item.owner,
          name: item.name,
          description: item.description,
          stargazers_count: item.stargazers_count,
          html_url: item.html_url,
          tags: item.tags,
        });
      });

      dispatch({
        type: SEARCH_REPOS,
        payload: {
          items: parsedItems,
          pages: parsePage(response.data.pages),
          keyword,
        },
      });
    }).catch(error => {
      console.log('searchRepos error:', error);
    });
  };
}

export function searchReposByTag(tag, page = 1) {
  return dispatch => {
    axios.get(`${config.api_uri}/repos/${tag}/${page}`)
      .then(response => {
        dispatch({
          type: SEARCH_REPOS_BY_TAG,
          payload: {
            repos: response.data.data,
            pages: response.data.pageData,
            tag,
          },
        });
      })
      .catch(error => {
        console.log('searchReposByTag error:', error);
      })
  }
}

function getRepoInfo(owner, repo) {
  return axios.get(`${GITHUB_API_URL}/repos/${owner}/${repo}`, {
    headers: {
      authorization: `token ${window.localStorage.getItem('token')}`,
    },
  });
}

function getRepoTags(repoFullName) {
  return axios.get(`${config.api_uri}/tags/${repoFullName}`, {
    headers: {
      authorization: `token ${window.localStorage.getItem('token')}`,
    },
  });
}

export function removeTag(repo, id) {
  return dispatch => {
    return axios.delete(`${config.api_uri}/tags/${id}`, {
      headers: {
        authorization: `token ${window.localStorage.getItem('token')}`,
      },
    }).then(response => {
      dispatch(fetchTags(repo));
    }).catch(error => {
      console.log('removeTag error:', error);
    });
  };
}

export function getRandomTags() {
  return dispatch => {
    return axios.get(`${config.api_uri}/tags/random`)
      .then(response => {
        dispatch({
          type: GET_RANDOM_TAGS,
          payload: response.data.data,
        });
      })
      .catch(error => {
        console.log('getRandomTags error:', error);
      });
  };
}

export function getRepo(owner, repo) {
  return dispatch => {
    axios.all([getRepoInfo(owner, repo), getRepoTags(`${owner}/${repo}`)])
    .then(axios.spread((info, tags) => {
      dispatch({
        type: GET_REPO,
        payload: {
          info: info.data,
          tags: tags.data.data,
        },
      });
    })).catch(error => {
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

function fetchTags(repo) {
  return dispatch => {
    getRepoTags(repo).then(response => {
      dispatch({
        type: FETCH_TAGS,
        payload: response.data.data,
      });
    }).catch(error => {
      console.log('fetchTags error', error);
    });
  };
}

export function postTags(repo, tag, isPublic) {
  return dispatch => {
    axios.post(`${config.api_uri}/tags`, {
      headers: {
        authorization: `token ${window.localStorage.getItem('token')}`,
      },
      data: {
        repo,
        tag,
        isPublic,
      },
    }).then(response => {
      dispatch(fetchTags(repo));
    }).catch(error => {
      if (error.status === 409) {
        alert('You had already sent this tag.');
      }

      console.log('postTags error', error);
    });
  };
}

export function cleanRepo() {
  return {
    type: CLEAN_REPO,
  };
}
