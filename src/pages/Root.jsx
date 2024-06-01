import { useNavigate, Outlet, useLocation } from 'react-router-dom'
import SongPlayer from '../components/SongPlayer/SongPlayer'
import HomeRoundedIcon from '@mui/icons-material/HomeRounded'
import SearchRoundedIcon from '@mui/icons-material/SearchRounded'
import styles from './Pages.module.scss'
const Root = () => {
  const navigate = useNavigate()
  const location = useLocation()
  const { pathname } = location

  const goToHomePage = () => {
    navigate('/')
  }

  const goToSearchHandler = () => {
    navigate('/search')
  }

  return (
    <>
      <div className={styles.article}>
        <div className={styles.sidebar}>
          <div className={styles.logo} onClick={goToHomePage} role='button'>
            <img
              className={styles.logo__image}
              onClick={goToHomePage}
              src=''
              alt='Christify logo'
            />
            <div className={styles.logo__text}>Christify</div>
          </div>

          <div
            className={`${pathname === '/' && styles.active} ${
              styles.sidebar__link
            }`}
            onClick={goToHomePage}
            role='button'
          >
            <HomeRoundedIcon /> Home
          </div>

          <div
            className={`${pathname === '/search' && styles.active} ${
              styles.sidebar__link
            }`}
            onClick={goToSearchHandler}
            role='button'
          >
            <SearchRoundedIcon /> Search
          </div>
        </div>

        <div className={styles.body}>
          <Outlet />
        </div>
      </div>
      <SongPlayer />
    </>
  )
}

export default Root
