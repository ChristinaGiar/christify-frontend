import { createSlice } from '@reduxjs/toolkit'

const initialState = {
  browsedType: { album: {}, browsedTracks: [] },
}
export const controllersSlice = createSlice({
  name: 'controllers',
  initialState,
  reducers: {
    setBrowsedType: (state, action) => {
      // check type of track for defining next, prev controllers & autoplay
      if (action.payload.type === 'album') {
        // song's source: album
        state.browsedType.browsedTracks = action.payload.browsedTracks
        state.browsedType.type = action.payload.type
        state.browsedType.album =
          action.payload?.album || state.browsedType.album // album songs
        state.browsedType.albumTrigger = action.payload?.albumTrigger || false // When a song of the album is selected
      } else if (action.payload.type === 'track-first') {
        // 1st song clicked, song's source: songs results
        state.browsedType.type = action.payload.type
        state.browsedType.album = action.payload.album
        state.browsedType.browsedTracks = [action.payload.track] // tracks from search clicked and kept listed to
        state.browsedType.albumTrigger = false
      } else if (action.payload.type === 'track') {
        // song's source: songs results
        state.browsedType.type = action.payload.type
        state.browsedType.albumTrigger = false
        state.browsedType.browsedTracks = [
          ...state.browsedType.browsedTracks,
          action.payload.track,
        ]
      } else if (action.payload.type === 'history-track') {
        // song's source: history
        state.browsedType.type = 'history-track'
        state.browsedType.albumTrigger = false
      }
    },
  },
})

export const { setBrowsedType } = controllersSlice.actions
export default controllersSlice.reducer
