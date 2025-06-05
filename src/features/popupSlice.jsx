import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  isOpen: false,
  component : <></>
};

export const popupSlice = createSlice({
  name: 'Popup',
  initialState,
  reducers: {
    changePopup: (state, action) => {
      state.isOpen = action.payload.isOpen;
      state.component = action.payload.component || <></>;
    },
  },
});

export const { changePopup } = popupSlice.actions;

export default popupSlice.reducer;