import { createSlice } from '@reduxjs/toolkit';

const initialState = {
    name: "",
    email: "",
    phone: "",
    whatsapp: "",
    telegram: "",
    website: "",
    photo : "",
    id: "",
    balance: 0,
};

export const userSlice = createSlice({
  name: 'User-Info',
  initialState,
  reducers: {
    userInfo: (state, action) => {
    state.name = action.payload.name,
    state.email = action.payload.email,
    state.phone = action.payload.phone,
    state.whatsapp = action.payload.whatsapp,
    state.telegram = action.payload.telegram,
    state.website = action.payload.website,
    state.photo = action.payload.photo,
    state.id = action.payload.id,
    state.balance = action.payload.balance
    },
  },
});

export const { userInfo } = userSlice.actions;

export default userSlice.reducer;