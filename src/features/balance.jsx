import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  count : ""
};

export const TriggerBalanceSlice = createSlice({
  name: 'Trigger-Balance',
  initialState,
  reducers: {
    triggerBalance: (state, action) => {
      state.count = action.payload.count;
    },
  },
});

export const { triggerBalance } = TriggerBalanceSlice.actions;

export default TriggerBalanceSlice.reducer;