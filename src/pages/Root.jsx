import { useNavigate, Outlet } from 'react-router-dom'
import SongPlayer from '../components/SongPlayer/SongPlayer'
const Root = () => {
  const navigate = useNavigate()

  const goToSearchHandler = () => {
    navigate('/search')
  }
  const goToHomePage = () => {
    navigate('/')
  }
  return (
    <>
      <div>
        <div onClick={goToSearchHandler}>SearchIcon</div>
        <img onClick={goToHomePage} src='' alt='Christify logo' />
      </div>
      <Outlet />
      <SongPlayer />
    </>
  )
}

export default Root
