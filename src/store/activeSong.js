import { createSlice } from '@reduxjs/toolkit'

const initialSongState = {
  schema: {
    album: {}, // album: albumID, albumName
    song: {}, // played song's details: artists, image, name, song, trackID, type
    isPlaying: false,
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
      console.log('action.payload', action.payload)
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
