import PropTypes from 'prop-types'
import { useSelector, useDispatch } from 'react-redux'
import { activeSongActions } from '../store/activeSong'
import { setBrowsedType, usePostLatestSongMutation } from '../store/apiServices'
import { useEffect, useState } from 'react'

const Track = (props) => {
  const [triggerLatestSong] = usePostLatestSongMutation() //, latestSong
  const [isActive, setIsActive] = useState(false)
  const activeSong = useSelector((state) => state.activeSong)

  const dispatch = useDispatch()
  useEffect(() => {
    if (activeSong.song === props.song) {
      setIsActive(true)
    }
  }, [activeSong, props.song])

  const handleClick = () => {
    const { album, ...track } = props

    /* if (
      activeSong.schema.song?.song &&
      props.song === activeSong.schema.song.song
    ) {
      dispatch(
        activeSongActions.setReplayed({
          replayed: true,
        })
      )
    } else { */
    dispatch(
      activeSongActions.setActiveSong({
        album: album,
        song: track,
      })
    )
    console.log('props.type', props.type)
    if (props.type === 'track') {
      // add track to browsedTracks
      dispatch(
        setBrowsedType({
          type: 'track-first',
          track: props,
          album: {}, // erase irrevelant data
        })
      )
    } else if (props.type === 'album') {
      dispatch(
        setBrowsedType({
          type: 'album',
          albumTrigger: true,
          browsedTracks: [], // erase irrevelant data
        })
      )
    }
    if (
      activeSong.schema.song?.song &&
      props.song !== activeSong.schema.song.song
    ) {
      triggerLatestSong(props)
    } else {
      dispatch(
        activeSongActions.setReplayed({
          replayed: true,
        })
      )
    }
    /* } */
  }
  return (
    <div
      style={{ border: isActive && '1px solid white' }}
      onClick={props.song && handleClick}
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
  browsedType: PropTypes.string,
}
export default Track
