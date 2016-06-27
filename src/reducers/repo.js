import {
  GET_REPO,
  GET_STAR_STATUS,
  TOGGLE_STAR,
  FETCH_TAGS,
  CLEAN_REPO
} from '../actions/types';

const initialStatus = {
  data: {},
  tags: {},
  starred: false,
};

export default (state = initialStatus, action) => {
  switch (action.type) {
    case GET_REPO:
      return Object.assign({},
        state,
        {
          data: action.payload.info,
          tags: action.payload.tags,
        });

    case FETCH_TAGS:
      return Object.assign({},
        state,
        {
          tags: action.payload,
        });

    case GET_STAR_STATUS:
      return Object.assign({},
        state,
        { starred: action.payload });

    case TOGGLE_STAR:
      return Object.assign({},
        state,
        { starred: !state.starred })

    case CLEAN_REPO:
      return initialStatus;
  }

  return state;
}
