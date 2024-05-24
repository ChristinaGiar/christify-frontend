import PropTypes from 'prop-types'
import { useSelector, useDispatch } from 'react-redux'
import { activeSongActions } from '../store/activeSong'
import { usePostLatestSongMutation } from '../store/apiServices'
import { useEffect, useState } from 'react'

const Track = (props) => {
  const [triggerLatestSong, latestSong] = usePostLatestSongMutation()
  const [isActive, setIsActive] = useState(false)
  const activeSong = useSelector((state) => state.activeSong)

  const dispatch = useDispatch()
  console.log('latestSong', latestSong)
  useEffect(() => {
    if (activeSong.song === props.song) {
      setIsActive(true)
    }
  }, [activeSong])

  const clickHandler = async () => {
    const { album, ...track } = props
    dispatch(activeSongActions.setActiveSong({ album: album, song: track }))
    triggerLatestSong(props)
  }
  return (
    <div
      style={{ border: isActive && '1px solid white' }}
      onClick={props.song && clickHandler}
    >
      -------------------------------------------------------------------------
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
      -------------------------------------------------------------------------
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
  song: PropTypes.string,
}
export default Track
