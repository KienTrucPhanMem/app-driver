import { combineReducers, configureStore } from '@reduxjs/toolkit';
import authSlice from './authSlice';
import ExpoFileSystemStorage from 'redux-persist-expo-filesystem';
import { persistStore, persistReducer } from 'redux-persist';

const persistConfig = {
  key: 'root',
  storage: ExpoFileSystemStorage
};

const rootReducer = combineReducers({
  auth: authSlice
});
const persistedReducer = persistReducer(persistConfig, rootReducer);

export const store = configureStore({
  reducer: persistedReducer
});

export const persistor = persistStore(store);
