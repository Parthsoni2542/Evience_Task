// store.js

import { createStore, applyMiddleware } from 'redux';
import thunkMiddleware from 'redux-thunk';
import rootReducer from './reducer/reducer';

const store = createStore(rootReducer);

export default store;
