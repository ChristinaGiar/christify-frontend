import { configureStore } from '@reduxjs/toolkit'
import { setupListeners } from '@reduxjs/toolkit/query'
import { songsApi } from './apiServices.js'
import activeSongReducer from './activeSong.js'
import controllersReducer from './controllers.js'

const store = configureStore({
  reducer: {
    [songsApi.reducerPath]: songsApi.reducer,
    activeSong: activeSongReducer,
    controllers: controllersReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({ serializableCheck: false }).concat(
      songsApi.middleware
    ),
})

setupListeners(store.dispatch)

export default store
