import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  isOpen: false,
  type : ""
};

export const popupBalanceSlice = createSlice({
  name: 'Popup-Balance',
  initialState,
  reducers: {
    changePopupBalance: (state, action) => {
      state.isOpen = action.payload.isOpen;
      state.type = action.payload.type
    },
  },
});

export const { changePopupBalance } = popupBalanceSlice.actions;

export default popupBalanceSlice.reducer;