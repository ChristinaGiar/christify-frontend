import { createSlice } from '@reduxjs/toolkit'

const initialSongState = {
  schema: {
    album: {}, // album
    song: {}, // played song's details
    isPlaying: false,
    isAlbum: false, // song playing is from an album collection
    isHistory: false, // song playing is from the latest songs collection
    isSearch: false, // song playing is from the song search
    replayed: false,
  },
}

const activeSongSlice = createSlice({
  name: 'activeSong',
  initialState: initialSongState,
  reducers: {
    setActiveSong(state, action) {
      state.schema.song = action.payload.song
      state.schema.album = action.payload.album
      state.schema.isPlaying = true
      state.schema.replayed = false
    },
    setPlayingMode(state, action) {
      state.schema.isPlaying = action.payload
    },
    setReplayed(state, action) {
      state.schema.replayed = action.payload.replayed
      console.log('replayed', action.payload.replayed)
    },
  },
})

export const activeSongActions = activeSongSlice.actions
export default activeSongSlice.reducer
