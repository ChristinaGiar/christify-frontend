import { configureStore } from '@reduxjs/toolkit'
import activeSongReducer from './activeSong.js'
import { setupListeners } from '@reduxjs/toolkit/query'
import { songsApi } from './apiServices.js'

const store = configureStore({
  reducer: {
    [songsApi.reducerPath]: songsApi.reducer,
    activeSong: activeSongReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(songsApi.middleware),
})

setupListeners(store.dispatch)

export default store
