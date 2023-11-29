import { createSlice, configureStore } from "@reduxjs/toolkit";
import listenedSongsReducer from "./listenedList";

const initialSongState = {
  schema: {
    album: {}, // album
    song: {}, // played song's details
    isPlaying: false,
  },
};

const activeSongSlice = createSlice({
  name: "activeSong",
  initialState: initialSongState,
  reducers: {
    setActiveSong(state, action) {
      state.schema.song = action.payload.song;
      state.schema.album = action.payload.album;
      state.schema.isPlaying = true;
    },
    setPlayingMode(state, action) {
      state.schema.isPlaying = action.payload;
      console.log("state.schema.isPlaying", state.schema.isPlaying);
    },
  },
});

const store = configureStore({
  reducer: {
    activeSong: activeSongSlice.reducer,
    listenedSongs: listenedSongsReducer,
  },
});

export const activeSongActions = activeSongSlice.actions;
export default store;
