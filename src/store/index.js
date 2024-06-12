import { configureStore } from '@reduxjs/toolkit'
import { setupListeners } from '@reduxjs/toolkit/query'

import activeSongReducer from './activeSong.js'
import { apiServicesApi } from './apiServices.js'
import controllersReducer from './controllers.js'

const store = configureStore({
  reducer: {
    [apiServicesApi.reducerPath]: apiServicesApi.reducer,
    activeSong: activeSongReducer,
    controllers: controllersReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({ serializableCheck: false }).concat(
      apiServicesApi.middleware
    ),
})

setupListeners(store.dispatch)

export default store
