import { configureStore } from '@reduxjs/toolkit';
import persistedAuthReducer from '../reducer/persistAuthReducer';
import { persistStore } from 'redux-persist';

const store = configureStore({
  reducer: {
    auth: persistedAuthReducer,
  },
  middleware: (DefaultMiddleware) =>
    DefaultMiddleware({
      serializableCheck: false,
    }),
});

const persistor = persistStore(store);

export { store, persistor };
