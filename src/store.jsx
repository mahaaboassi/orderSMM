// src/store.js
import { configureStore } from '@reduxjs/toolkit';
import popupReducer  from './features/popupSlice';
import userReducer from './features/userSlice';

export const store = configureStore({
  reducer: {
    popup : popupReducer,
    user : userReducer
  },
});