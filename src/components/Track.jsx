import PropTypes from 'prop-types';
import { useSelector, useDispatch } from 'react-redux';
import { listenedSongsActions } from '../store/listenedList';
import { activeSongActions } from '../store/index';

const Track = (props) => {
  const songs = useSelector((state) => state.listenedSongs);
  // const activeSong = useSelector((state) => state.activeSong);
  const dispatch = useDispatch();

  const clickHandler = () => {
    const {album, ...track} = props;
    dispatch(activeSongActions.setActiveSong({album: album, song: track}))
    dispatch(listenedSongsActions.addListenedSong(props));
  }
  return (
    <div onClick={props.song && clickHandler}>
      {props.image && <img width="30" height="30" src={props.image} />}
      <div>{props.name}</div>
      <div>{props.song}</div>
      {props.artists && <div>{props.artists.reduce(
        (acc, artist) => {
          if (props.artists[0] == artist) {
            return artist.name;
          }
          return acc + ", " + artist.name
        }
        , "")}
      </div>
}
      {!props.song && <div>No audio</div>}
    </div>
  )
}

Track.propTypes = {
  name: PropTypes.string,
    album: PropTypes.object,
    trackID: PropTypes.string,
    artists: PropTypes.array,
    image: PropTypes.string,
    type: PropTypes.string,
    song: PropTypes.string

}
export default Track