import { createSlice } from '@reduxjs/toolkit';

const initialState = {
    whatsapp: "",
    telegram: ""
};

export const socialSlice = createSlice({
  name: 'Social-Media-Links',
  initialState,
  reducers: {
    socialStatus: (state, action) => {
    state.whatsapp = action.payload.whatsapp,
    state.telegram = action.payload.telegram
    },
  },
});

export const { socialStatus } = socialSlice.actions;

export default socialSlice.reducer;