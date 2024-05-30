import { configureStore } from '@reduxjs/toolkit'
import { setupListeners } from '@reduxjs/toolkit/query'
import { songsApi } from './apiServices.js'
import activeSongReducer from './activeSong.js'
import apiServicesReducer from './apiServices.js'

const store = configureStore({
  reducer: {
    [songsApi.reducerPath]: songsApi.reducer,
    activeSong: activeSongReducer,
    apiServices: apiServicesReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({ serializableCheck: false }).concat(
      songsApi.middleware
    ),
})

setupListeners(store.dispatch)

export default store
