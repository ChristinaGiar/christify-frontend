import { Provider } from 'react-redux'
import { createHashRouter, RouterProvider } from 'react-router-dom'

import SearchInput from './components/SearchInput/SearchInput'
import AlbumPage from './pages/AlbumPage'
import ErrorPage from './pages/ErrorPage'
import Homepage from './pages/Homepage'
import Root from './pages/Root'
import store from './store/index'

const routesConfig = [
  {
    path: '/',
    element: <Root />,
    errorElement: <ErrorPage />,
    id: 'root',
    children: [
      {
        index: true,
        element: (
          <>
            <Homepage />
          </>
        ),
      },
      {
        path: `search`,
        element: (
          <>
            <SearchInput />
          </>
        ),
      },
      {
        path: 'album/:albumID',
        element: (
          <>
            <AlbumPage />
          </>
        ),
        loader: ({ params }) => {
          return params.albumID
        },
      },
    ],
  },
]

const router = createHashRouter(routesConfig) // createBrowserRouter NOT supported by gh-pages

const App = () => {
  return (
    <Provider store={store}>
      <RouterProvider router={router} />
    </Provider>
  )
}

export default App
