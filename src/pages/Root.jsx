import { useNavigate, Outlet } from 'react-router-dom';
import SongPlayer from '../components/SongPlayer';
const Root = () => {
  const navigate = useNavigate();

  const goToSearchHandler = () => {
    navigate('/search');
  }
  return (
      <>
      <div>
      <img src="" alt="Christify logo"/>
      <div onClick={goToSearchHandler}>SearchIcon</div>
      </div>
      <Outlet />
      <SongPlayer/>
    </>
  )
}

export default Root