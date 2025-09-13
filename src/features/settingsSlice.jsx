import { createSlice } from '@reduxjs/toolkit';

const initialState = {
    platforms: "",
    panels: "",
    services: "",
    skybe: "",
    telegram: "",
    instagram: "",
    tiktok: "",
    whatsapp: "",
    facebook: "",
    name: ""
};

export const settingsSlice = createSlice({
  name: 'Setting_Info',
  initialState,
  reducers: {
    settingsStatus: (state, action) => {
    state.platforms = action.payload.platforms,
    state.panels = action.payload.panels,
    state.services = action.payload.services,
    state.skybe = action.payload.skybe,
    state.telegram = action.payload.telegram,
    state.instagram = action.payload.instagram,
    state.tiktok = action.payload.tiktok,
    state.whatsapp = action.payload.whatsapp,
    state.facebook = action.payload.facebook,
    state.name = action.payload.name
    },
  },
});

export const { settingsStatus } = settingsSlice.actions;

export default settingsSlice.reducer;