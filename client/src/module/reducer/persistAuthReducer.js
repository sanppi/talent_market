import storage from 'redux-persist/lib/storage';
import { persistReducer } from 'redux-persist';

const initialState = {
  isLoggedIn: false,
  memberId: null,
  id: '',
  nickname: '',
  redCard: 0,
  //  bankName: '',
  //  accountNum: null
};

const authReducer = (state = initialState, action) => {
  switch (action.type) {
    case 'LOGIN_SUCCESS':
      const { memberId, id, nickname, redCard } = action.payload;
      return {
        ...state,
        isLoggedIn: true,
        memberId,
        id,
        nickname,
        redCard,
        //  bankName: '',
        //  accountNum: null
      };
    case 'LOGOUT':
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
