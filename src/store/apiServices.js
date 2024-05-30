import { createSlice } from '@reduxjs/toolkit'
import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react'

const initialState = {
  browsedType: { album: {}, browsedTracks: [] },
}
export const apiServicesSlice = createSlice({
  name: 'apiServices',
  initialState,
  reducers: {
    setBrowsedType: (state, action) => {
      // check type of track for defining next, prev controllers & autoplay
      if (action.payload.type === 'album') {
        // song's source: album
        state.browsedType.browsedTracks = action.payload.browsedTracks //[]
        state.browsedType.type = action.payload.type
        state.browsedType.album =
          action.payload?.album || state.browsedType.album // album songs
        state.browsedType.albumTrigger = action.payload?.albumTrigger || false // When a song of the album is selected
      } else if (action.payload.type === 'track-first') {
        // 1st song clicked, song's source: songs results
        state.browsedType.type = action.payload.type
        state.browsedType.album = action.payload.album //{}
        state.browsedType.browsedTracks = [action.payload.track] // tracks from search clicked and kept listed to
        state.browsedType.albumTrigger = false
      } else if (action.payload.type === 'track') {
        // song's source: songs results
        state.browsedType.type = action.payload.type
        // state.browsedType.album = {} // NOT NEEDED
        state.browsedType.albumTrigger = false
        state.browsedType.browsedTracks = [
          ...state.browsedType.browsedTracks,
          action.payload.track,
        ]
      } else if (action.payload.type === 'history-track') {
        // song's source: history
        state.browsedType.type = 'history-track'
        // state.browsedType.album = {} // TO DO LIKE ABOVE, if NOT on the side
        state.browsedType.albumTrigger = false
        // state.browsedType.browsedTracks = [] // TO DO LIKE ABOVE, if NOT on the side
      }
    },
  },
})

export const { setBrowsedType } = apiServicesSlice.actions
export default apiServicesSlice.reducer

export const songsApi = createApi({
  reducerPath: 'songs',
  baseQuery: fetchBaseQuery({ baseUrl: 'http://localhost:3000/songs/' }),
  tagTypes: ['Songs'],
  endpoints: (builder) => ({
    getLatestSongs: builder.query({
      query: () => 'latestSongs',
      providesTags: (result) =>
        result
          ? [
              ...result.map(({ trackID }) => ({ type: 'Songs', id: trackID })),
              { type: 'Songs', id: 'LIST' },
            ]
          : { type: 'Songs', id: 'LIST' },
    }),

    postLatestSong: builder.mutation({
      query: (body) => ({
        url: 'addLatestSong',
        method: 'POST',
        body,
      }),
      invalidatesTags: [{ type: 'Posts', id: 'LIST' }],
    }),
    getAlbum: builder.query({
      query: ({ albumID }) => ({
        url: `album?albumID=${albumID}`,
        method: 'GET',
      }),
      // async onQueryStarted(id, { dispatch, queryFulfilled }) {
      //   const album = await queryFulfilled
      // dispatch(
      //   setBrowsedType({
      //     type: 'album',
      //     result: { albumID: album.data.albumID, tracks: album.data.tracks },
      //   })
      // )
      // },
    }),
  }),
})

export const {
  useGetLatestSongsQuery,
  useLazyGetLatestSongsQuery,
  usePostLatestSongMutation,
  useGetAlbumQuery,
} = songsApi
