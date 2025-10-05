import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  best_providers: { slug: "", id: "" },
  ads: { slug: "", id: "" },
  bumps: { slug: "", id: "" },
  pin_in: { slug: "", id: "" },
  pin_down: { slug: "", id: "" },
  search_results: { slug: "", id: "" },
  api_emails: { slug: "", id: "" },
  promotion: { slug: "", id: "" }
};

export const servicesSlice = createSlice({
  name: 'Services_Info',
  initialState,
  reducers: {
    updateService: (state, action) => {
      const { key, value } = action.payload;
      if (state.hasOwnProperty(key)) {
        state[key] = value;
      }
    },
  },
});

export const { updateService } = servicesSlice.actions;
export default servicesSlice.reducer;