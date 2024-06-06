import { useEffect } from 'react'
import { createBrowserRouter, RouterProvider } from 'react-router-dom'
import { Provider } from 'react-redux'
import Root from './pages/Root'
import store from './store/index'
import Homepage from './pages/Homepage'
import SearchInput from './components/SearchInput/SearchInput'
import AlbumPage from './pages/AlbumPage'

const routesConfig = [
  {
    path: '/',
    element: <Root />,
    errorElement: <div>Error</div>,
    id: 'root',
    // loader: ()=>{},
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
        path: 'search',
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
        loader: ({ _, params }) => {
          return params.albumID
        },
        /*         
        async ({ _, params }) => {
          return fetch(
            `http://localhost:3000/album?albumID=${params.albumID}`, {
            method: 'GET',
            headers: { 'Content-Type': 'application/json' },
          }
          );
        }, */
      },
    ],
  },
]

const router = createBrowserRouter(routesConfig)

const App = () => {
  /* var timer = 0

  useEffect(() => {
    fetchAccessToken()
    return () => {
      clearTimeout(timer)
    }
  }, [])

  const requestInfo = {
    method: 'GET',
    headers: { 'Content-Type': 'application/json' },
  }

  const fetchAccessToken = async () => {
    try {
      const expiresIn = await fetch('http://localhost:3000/access', requestInfo)

      const expirationTime = await expiresIn.text()
      console.log('expirationTime', expirationTime)
      timer = setTimeout(() => {
        fetchAccessToken()
      }, +expirationTime * 5) //10
    } catch (error) {
      console.log(error)
    }
  } */

  return (
    <Provider store={store}>
      <RouterProvider router={router} />
    </Provider>
  )
}

export default App
