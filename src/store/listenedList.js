import { createSlice } from "@reduxjs/toolkit";

const initialSongsState = { songs: [] };

const listenedSongsSlice = createSlice({
  name: "listenedSongs",
  initialState: initialSongsState,
  reducers: {
    addListenedSong(state, action) {
      if (
        state.songs.filter((song) => song.trackID === action.payload.trackID)
          .length === 0
      ) {
        state.songs = [...state.songs, action.payload];
      }
    },
  },
});

export const listenedSongsActions = listenedSongsSlice.actions;
export default listenedSongsSlice.reducer;
