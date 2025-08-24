// src/store.js
import { configureStore } from '@reduxjs/toolkit';
import popupReducer  from './features/popupSlice';
import userReducer from './features/userSlice';
import currencyReducer from "./features/currencySlice"


export const store = configureStore({
  reducer: {
    popup : popupReducer,
    user : userReducer,
    currency : currencyReducer
  },
});