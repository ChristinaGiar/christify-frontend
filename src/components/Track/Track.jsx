import PlayCircleFilledRoundedIcon from '@mui/icons-material/PlayCircleFilledRounded'
import PropTypes from 'prop-types'
import { useDispatch, useSelector } from 'react-redux'
import { Link } from 'react-router-dom'

import { activeSongActions } from '../../store/activeSong'
import { usePostLatestSongMutation } from '../../store/apiServices'
import { setBrowsedType } from '../../store/controllers'
import { artistsArrayToString } from '../../utils/functions'
import styles from './Track.module.scss'

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

    if (activeSong.schema.song?.song && props.type !== 'history') {
      if (props.song !== activeSong.schema.song.song) {
        console.log('IS PLAYING')
        triggerLatestSong(props)
      } else if (props.type === 'track' || props.type === 'album') {
        // and same song replayed
        console.log('IS REPLAYING')

        dispatch(
          activeSongActions.setReplayed({
            replayed: true,
          })
        )
      }
    }
  }
  return (
    <div>
      <Link
        onClick={() => props.song && handleClick()}
        className={`${!props.song && styles.disabled} ${styles.track}`}
      >
        {(props.type === 'track' || props.type === 'album') && (
          <div className={styles.track__number}>{props?.number}</div>
        )}
        {props.image && (
          <img
            className={`${styles.track__image} ${
              props.type === 'history' ? styles.square : styles.circle
            }`}
            src={props.image}
            alt={props.name}
          />
        )}
        <div
          className={`${isActive && styles.active} ${styles.track__mainTitle}`}
        >
          <h5 className={styles.track__title}>{props.name}</h5>
          <p className={styles.track__artists}>
            {props.artists ? artistsArrayToString(props.artists) : '-'}
          </p>
        </div>
        <PlayCircleFilledRoundedIcon
          className={`${isActive && styles.active} ${styles.track__playIcon}`}
        />
        <p className={styles.track__album}>{props.album.albumName}</p>
        <div className={styles.track__noAudio}>{!props.song && 'No audio'}</div>
      </Link>
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
  number: PropTypes.number,
  browsedType: PropTypes.string,
}
export default Track
