import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react'

export const apiServicesApi = createApi({
  reducerPath: 'apiServices',
  baseQuery: fetchBaseQuery({
    baseUrl: 'http://localhost:3000/',
    prepareHeaders: (headers) => {
      headers.set('Content-Type', 'application/json')
    },
  }),
  tagTypes: ['Songs', 'SongResults', 'AlbumResults'],
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
    getAlbumResults: builder.query({
      query: ({ value, offset, resultsLimit }) => ({
        url: `searchAlbums?q=${value}&offset=${offset}&limit=${resultsLimit}`,
        method: 'GET',
      }),
      providesTags: ['AlbumResults'],
    }),
    getSongResults: builder.query({
      query: ({ value, offset, resultsLimit }) => ({
        url: `searchTracks?q=${value}&offset=${offset}&limit=${resultsLimit}`,
        method: 'GET',
      }),
      providesTags: ['SongResults'],
    }),
  }),
})

export const {
  useLazyGetLatestSongsQuery,
  usePostLatestSongMutation,
  useLazyGetAlbumQuery,
  useGetAccessTokenQuery,
  useLazyGetAccessTokenQuery,
  useLazyGetSongResultsQuery,
  useLazyGetAlbumResultsQuery,
} = apiServicesApi
