import PropTypes from 'prop-types'
import { useDispatch, useSelector } from 'react-redux'
import { useState } from 'react'
import { activeSongActions } from '../store/activeSong'
import Square from '../layout/Square'
import { setBrowsedType } from '../store/apiServices'

const HistoryTrack = (props) => {
  const [isHovering, setIsHovering] = useState(false)
  const activeSong = useSelector((state) => state.activeSong)
  const dispatch = useDispatch()

  const handleMouseOver = () => {
    setIsHovering(true)
  }

  const handleMouseOut = () => {
    setIsHovering(false)
  }

  const handleClick = () => {
    const { album, ...track } = props
    console.log('equal', props.song === activeSong.schema.song.song)
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
      // triggerLatestSong(props)
      dispatch(
        setBrowsedType({
          type: 'history-track',
          track: props,
        })
      )
    }
  }
  return (
    <div
      onClick={handleClick}
      className=''
      //   onMouseOver={handleMouseOver}
      //   onMouseOut={handleMouseOut}
    >
      <Square
        name={props.name}
        trackID={props.trackID}
        artists={props.artists}
        image={props?.image}
        song={props.song}
        album={props.album}
        isActive={activeSong.schema.song.song == props.song}
      />
      {isHovering && 'Play'}
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
