import PropTypes from 'prop-types'
import { useDispatch, useSelector } from 'react-redux'
import { activeSongActions } from '../../store/activeSong'
import Square from '../../layout/Square/Square'
import { setBrowsedType } from '../../store/controllers'
// NOT USED
const HistoryTrack = (props) => {
  const activeSong = useSelector((state) => state.activeSong)
  const dispatch = useDispatch()

  const handleClick = () => {
    const { album, ...track } = props
    if (
      activeSong.schema.song?.song &&
      props.song === activeSong.schema.song.song
    ) {
      dispatch(
        activeSongActions.setReplayed({
          replayed: true,
        })
      )
    } else {
      dispatch(
        activeSongActions.setActiveSong({
          album: album,
          song: track,
        })
      )
      dispatch(
        setBrowsedType({
          type: 'history-track',
          track: props,
        })
      )
    }
  }
  return (
    <div onClick={handleClick} className=''>
      <Square
        name={props.name}
        trackID={props.trackID}
        artists={props.artists}
        image={props?.image}
        song={props.song}
        album={props.album}
        isActive={activeSong.schema.song.song == props.song}
      />
      ----------------------------------------------------------------------------------------------------------
    </div>
  )
}

HistoryTrack.propTypes = {
  name: PropTypes.string,
  album: PropTypes.object,
  trackID: PropTypes.string,
  artists: PropTypes.array,
  image: PropTypes.string,
  type: PropTypes.string,
  song: PropTypes.string,
}

export default HistoryTrack
