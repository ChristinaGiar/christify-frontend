import PropTypes from 'prop-types'
import { useSelector, useDispatch } from 'react-redux'
import { activeSongActions } from '../../store/activeSong'
import { setBrowsedType } from '../../store/controllers'
import styles from './Track.module.scss'
import { usePostLatestSongMutation } from '../../store/apiServices'
import PlayCircleFilledRoundedIcon from '@mui/icons-material/PlayCircleFilledRounded'

const Track = (props) => {
  const [triggerLatestSong] = usePostLatestSongMutation() //, latestSong
  const activeSong = useSelector((state) => state.activeSong)
  const dispatch = useDispatch()
  const isActive = activeSong.schema.song.trackID === props.trackID

  const handleClick = () => {
    const { album, ...track } = props

    dispatch(
      activeSongActions.setActiveSong({
        album: album,
        song: track,
      })
    )
    switch (props.type) {
      case 'track':
        // add track to browsedTracks
        dispatch(
          setBrowsedType({
            type: 'track-first',
            track: props,
            album: {}, // erase irrevelant data
          })
        )
        break
      case 'album':
        dispatch(
          setBrowsedType({
            type: 'album',
            albumTrigger: true,
            browsedTracks: [], // erase irrevelant data
          })
        )
        break
      case 'history':
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
        break
      default:
        break
    }

    if (
      activeSong.schema.song?.song &&
      props.song !== activeSong.schema.song.song
    ) {
      triggerLatestSong(props)
    } else if (props.type === 'track' || props.type === 'album') {
      // and same song replayed
      dispatch(
        activeSongActions.setReplayed({
          replayed: true,
        })
      )
    }
  }
  return (
    <div className={styles.track} onClick={props.song && handleClick}>
      {props.image && (
        <img
          className={`${styles.track__image} ${
            props.type === 'history' ? styles.square : styles.circle
          }`}
          src={props.image}
        />
      )}
      <div
        className={`${isActive && styles.active} ${styles.track__mainTitle}`}
      >
        <div className={styles.track__name}>{props.name}</div>
        <div className={styles.track__artists}>
          {props.artists
            ? props.artists.reduce((acc, artist) => {
                if (props.artists[0] == artist) {
                  return artist.name
                }
                return acc + ', ' + artist.name
              }, '')
            : '-'}
        </div>
      </div>

      <PlayCircleFilledRoundedIcon
        className={`${isActive && styles.active} ${styles.track__playIcon}`}
      />

      <div className={styles.track__album}>{props.album.albumName}</div>

      {!props.song && <div className={styles.track__noAudio}>No audio</div>}
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
