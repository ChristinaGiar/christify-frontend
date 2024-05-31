import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';

const Album = (props) => {
  return (
    <Link to={`/album/${props.albumID}`}>
    <div>
      <img width="30" height="30" src={props.image} />
      <div>{props.name}</div>
      <div>{props.artists.reduce(
        (acc, artist) => {
          if (props.artists[0] == artist) {
            return artist.name;
          }
          return acc + ", " + artist.name
        }
        , "")}
      </div>

    </div>
    </Link>
  )
}

Album.propTypes = {
  name: PropTypes.string,
    albumID: PropTypes.string,
    artists: PropTypes.array,
    image: PropTypes.string,
    type: PropTypes.string

}
export default Album