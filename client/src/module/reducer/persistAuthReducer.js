import storage from 'redux-persist/lib/storage';
import {
  LOGIN_SUCCESS,
  UPDATE_USER,
  LOGOUT,
  DELETE_SUCCESS,
} from '../action/authActions';
import { persistReducer } from 'redux-persist';

const initialState = {
  isLoggedIn: false,
  memberId: null,
  id: '',
  nickname: '',
  email: '',
  redCard: 0,
};

const authReducer = (state = initialState, action) => {
  switch (action.type) {
    case LOGIN_SUCCESS: {
      const { memberId, id, nickname, email } = action.payload;
      return {
        ...state,
        isLoggedIn: true,
        memberId,
        id,
        nickname,
        email,
      };
    }
    case UPDATE_USER: {
      const { nickname, email } = action.payload;
      return {
        ...state,
        isLoggedIn: true,
        nickname: nickname !== undefined ? nickname : state.nickname,
        email: email !== undefined ? email : state.email,
      };
    }

    case LOGOUT:
      return initialState;
    case DELETE_SUCCESS:
      return initialState;
    default:
      return state;
  }
};

const persistConfig = {
  key: 'root',
  storage,
  whitelist: ['auth'],
};

const persistedAuthReducer = persistReducer(persistConfig, authReducer);

export default persistedAuthReducer;
