import { createSlice } from '@reduxjs/toolkit';

const initialState = {
    isCall: false,
};

export const callNotificationSlice = createSlice({
  name: 'Call-Notification',
  initialState,
  reducers: {
    callStatus: (state, action) => {
    state.isCall = action.payload.isCall
    },
  },
});

export const { callStatus } = callNotificationSlice.actions;

export default callNotificationSlice.reducer;