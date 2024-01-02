import { configureStore } from '@reduxjs/toolkit';
import persistedAuthReducer from '../reducer/persistReducer';
import { persistStore } from 'redux-persist';

const store = configureStore({
  reducer: {
    auth: persistedAuthReducer,
  },
});

const persistor = persistStore(store);

export { store, persistor };
