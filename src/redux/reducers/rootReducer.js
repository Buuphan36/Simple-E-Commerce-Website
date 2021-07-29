/* eslint-disable import/no-anonymous-default-export */
import { combineReducers } from 'redux';
import { persistStore, persistReducer } from 'redux-persist';
// import { createStore, applyMiddleware } from 'redux';
// import { createLogger } from 'redux-logger';
import storage from 'redux-persist/lib/storage';
import userReducer from './userReducer';
import postReducer from './postReducer';
const persistConfig = {
  key: 'root',
  storage,
}

const rootReducer = combineReducers({
  userReducer,
  postReducer,
});

export default persistReducer(persistConfig, rootReducer);
