import { createSlice } from '@reduxjs/toolkit';

const initialState = {
    id: "",
    name: "",
    code: "",
    default: "",
    exchange_factor: ""
};

export const currencySlice = createSlice({
  name: 'Currency-Info',
  initialState,
  reducers: {
    currencyStatus: (state, action) => {
    state.name = action.payload.name,
    state.id = action.payload.id,
    state.code = action.payload.code,
    state.default = action.payload.default,
    state.exchange_factor = action.payload.exchange_factor
    },
  },
});

export const { currencyStatus } = currencySlice.actions;

export default currencySlice.reducer;