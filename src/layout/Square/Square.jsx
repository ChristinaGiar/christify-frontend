import PropTypes from 'prop-types'
function Square(props) {
  return (
    <div style={{ border: props.isActive && '1px solid white' }}>
      Sqaare!!
      {props.image && <img width='30' height='30' src={props.image} />}
      <div>{props.name}</div>
      <div>{props.song}</div>
      {props.artists && (
        <div>
          {props.artists.reduce((acc, artist) => {
            if (props.artists[0] == artist) {
              return artist.name
            }
            return acc + ', ' + artist.name
          }, '')}
        </div>
      )}
      {!props.song && <div>No audio</div>}
    </div>
  )
}

export default Square

Square.propTypes = {
  name: PropTypes.string,
  album: PropTypes.object,
  trackID: PropTypes.string,
  artists: PropTypes.array,
  image: PropTypes.string,
  type: PropTypes.string,
  song: PropTypes.string,
  isActive: PropTypes.bool,
}
