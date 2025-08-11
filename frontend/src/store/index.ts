import { configureStore } from '@reduxjs/toolkit';
import { setupListeners } from '@reduxjs/toolkit/query'
import { api } from './rtkApi';
import authReducer from './slices/authSlice';
import { persistStore, persistReducer } from 'redux-persist';
import storage from 'redux-persist/lib/storage';

const persistConfig = { key: 'root', storage, whitelist: ['auth'] };
import { combineReducers } from 'redux';

const rootReducer = combineReducers({
  auth: authReducer,
  [api.reducerPath]: api.reducer
});

const persisted = persistReducer(persistConfig, rootReducer);

export const store = configureStore({
  reducer: persisted,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({serializableCheck:false}).concat(api.middleware),
});

setupListeners(store.dispatch);
export const persistor = persistStore(store);
export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
