import { useNavigate, Outlet, useLocation } from 'react-router-dom'
import SongPlayer from '../components/SongPlayer/SongPlayer'
import HomeRoundedIcon from '@mui/icons-material/HomeRounded'
import SearchRoundedIcon from '@mui/icons-material/SearchRounded'
import styles from './Pages.module.scss'
import logoImage from '../assets/christify-logo.png'
import { useLazyGetAccessTokenQuery } from '../store/apiServices'
import { useEffect } from 'react'

const Root = () => {
  const navigate = useNavigate()
  const location = useLocation()
  const { pathname } = location
  const [triggerAccessToken, accessToken] = useLazyGetAccessTokenQuery()

  var timer = 0

  useEffect(() => {
    console.log('token')
    triggerAccessToken()
  }, [])

  useEffect(() => {
    if (accessToken.isSuccess) {
      fetchAccessToken()
    } else if (accessToken.isError) {
      console.error("Spotify API isn't functioning. Please try later.")
    }
    return () => {
      clearTimeout(timer)
    }
  }, [accessToken])

  const fetchAccessToken = () => {
    try {
      const expirationTime = accessToken.data
      timer = setTimeout(() => {
        triggerAccessToken()
      }, +expirationTime * 1000) //10/4 = 9'
    } catch (error) {
      console.log(error)
    }
  }

  const goToHomePage = () => {
    navigate('/')
  }

  const goToSearchHandler = () => {
    navigate('/search')
  }

  return (
    <>
      {!accessToken?.isError ? (
        <div>
          <div className={styles.article}>
            <div className={styles.sidebar}>
              <div className={styles.logo} onClick={goToHomePage} role='button'>
                <img
                  className={styles.logo__image}
                  onClick={goToHomePage}
                  src={logoImage}
                  alt='Christify logo'
                />
                <div className={styles.logo__text}>Christify</div>
              </div>
              <div className={styles.sidebar__links}>
                <div
                  className={`${pathname === '/' && styles.active} ${
                    styles.sidebar__link
                  }`}
                  onClick={goToHomePage}
                  role='button'
                >
                  <HomeRoundedIcon />{' '}
                  <span className={styles.sidebar__linkText}>Home</span>
                </div>

                <div
                  className={`${pathname === '/search' && styles.active} ${
                    styles.sidebar__link
                  }`}
                  onClick={goToSearchHandler}
                  role='button'
                >
                  <SearchRoundedIcon />{' '}
                  <span className={styles.sidebar__linkText}>Search</span>
                </div>
              </div>
            </div>

            <div className={styles.body}>
              <Outlet />
              <div className={styles.playerPlaceholder}></div>
              <div className={styles.footer}>
                <p className={styles.footer__text}>
                  © 2024 Christify. All rights reserved.
                </p>
              </div>
            </div>
          </div>
          <SongPlayer />
        </div>
      ) : (
        <div className={styles.modal}>
          <div className={styles.modal__text}>
            The content is unavailable for the moment. Sorry for the
            inconvenience :&#x28;
          </div>
        </div>
      )}
    </>
  )
}

export default Root
