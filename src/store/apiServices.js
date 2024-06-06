import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react'

export const apiServicesApi = createApi({
  reducerPath: 'apiServices',
  baseQuery: fetchBaseQuery({
    baseUrl: 'http://localhost:3000/',
    prepareHeaders: (headers) => {
      headers.set('Content-Type', 'application/json')
    },
  }),
  tagTypes: ['Songs', 'Results'],
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
      /* async onQueryStarted(id, { dispatch, queryFulfilled }) {
        const album = await queryFulfilled
      dispatch(
        setBrowsedType({
          type: 'album',
          result: { albumID: album.data.albumID, tracks: album.data.tracks },
        })
      )
      }, */
    }),
    getAccessToken: builder.query({
      query: () => ({ method: 'GET', url: 'access' }),
    }),
  }),
})

export const {
  useGetLatestSongsQuery,
  useLazyGetLatestSongsQuery,
  usePostLatestSongMutation,
  useGetAlbumQuery,
  useLazyGetAlbumQuery,
  useGetAccessTokenQuery,
  useLazyGetAccessTokenQuery,
} = apiServicesApi
