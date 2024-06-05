import { activeSongActions } from '../../store/activeSong'
import { artistsArrayToString } from '../../utils/functions'
import PlayCircleOutlineRoundedIcon from '@mui/icons-material/PlayCircleOutlineRounded'
import PauseCircleOutlineRoundedIcon from '@mui/icons-material/PauseCircleOutlineRounded'
import KeyboardArrowUpRoundedIcon from '@mui/icons-material/KeyboardArrowUpRounded'
import { useDispatch, useSelector } from 'react-redux'
import styles from './SongSummary.module.scss'
import PropTypes from 'prop-types'

/// USED only on mobile
const SongSummary = ({ isPlayerPageOpen, setIsPlayerPageOpen }) => {
  const activeSong = useSelector((state) => state.activeSong)
  const dispatch = useDispatch()

  const handleTogglePlay = () => {
    dispatch(activeSongActions.setPlayingMode(!activeSong.schema.isPlaying))
  }

  const handleArrowUpClick = () => {
    setIsPlayerPageOpen(true)
  }

  return (
    <div className={`${isPlayerPageOpen && styles.show} ${styles.summary}`}>
      <div className={styles.details}>
        <div className={styles.details__imagePlaceholder} />
        <div className={styles.details__texts}>
          <div className={styles.details__title}>
            {activeSong.schema.song.name}
          </div>
          <p className={styles.details__artists}>
            {activeSong.schema.song.artists
              ? artistsArrayToString(activeSong.schema.song.artists)
              : '-'}
          </p>
        </div>
      </div>

      <button onClick={handleTogglePlay} className={styles.summary__icon}>
        {activeSong.schema.isPlaying ? (
          <PauseCircleOutlineRoundedIcon
            sx={{ fontSize: '1.5rem', color: '#4fc1ff' }}
          />
        ) : (
          <PlayCircleOutlineRoundedIcon sx={{ fontSize: '1.5rem' }} />
        )}
      </button>

      <button className={styles.summary__icon} onClick={handleArrowUpClick}>
        <KeyboardArrowUpRoundedIcon
          sx={{ fontSize: '1.5rem', color: 'white' }}
        />
      </button>
    </div>
  )
}

SongSummary.propTypes = {
  isPlayerPageOpen: PropTypes.bool,
  setIsPlayerPageOpen: PropTypes.func,
}

export default SongSummary
