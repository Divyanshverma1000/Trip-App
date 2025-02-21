// src/store/store.js
import { createStore, combineReducers } from 'redux';

const initialAuthState = {
  isLoggedIn: false,
};

const authReducer = (state = initialAuthState, action) => {
  switch (action.type) {
    case 'LOGIN':
      return { ...state, isLoggedIn: true };
    case 'LOGOUT':
      return { ...state, isLoggedIn: false };
    default:
      return state;
  }
};

const rootReducer = combineReducers({
  auth: authReducer,
});

const store = createStore(rootReducer);
export default store;
