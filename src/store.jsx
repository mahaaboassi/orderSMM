// src/store.js
import { configureStore } from '@reduxjs/toolkit';
import popupReducer  from './features/popupSlice';
import userReducer from './features/userSlice';
import currencyReducer from "./features/currencySlice"
import settingsReducer from "./features/settingsSlice"
import callNotificationReducer from "./features/callNotification"
import socialReducer from "./features/social"
import servicesReducer from "./features/servicesInfo"
import popupBalanceSlice from "./features/popupBalanceSlice"

export const store = configureStore({
  reducer: {
    popup: popupReducer,
    user: userReducer,
    currency: currencyReducer,
    settings: settingsReducer,
    isCall: callNotificationReducer,
    social: socialReducer,
    services: servicesReducer,
    openBalance: popupBalanceSlice 
  },
});