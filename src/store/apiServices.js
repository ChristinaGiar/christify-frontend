import { createSlice } from '@reduxjs/toolkit'
import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react'

const initialState = {
  browsableSongs: { album: {} },
}
export const apiServicesSlice = createSlice({
  name: 'apiServices',
  initialState,
  reducers: {
    setBrowsableSongs: (state, action) => {
      if (action.payload.endpoint === 'album') {
        state.browsableSongs.album = action.payload.result
      }
    },
  },
})

export const { setBrowsableSongs } = apiServicesSlice.actions
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
      //   console.log('album anser', album)
      //   // dispatch(setBrowsableSongs({ endpoint: 'album', result: album }))
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
