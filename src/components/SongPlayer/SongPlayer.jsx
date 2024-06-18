import KeyboardArrowDownRoundedIcon from '@mui/icons-material/KeyboardArrowDownRounded'
import { useRef } from 'react'
import { useState } from 'react'
import { useSelector } from 'react-redux'

import { artistsArrayToString, isEmptyObject } from '../../utils/functions'
import { useWindowDimensions } from '../../utils/hooks'
import Controls from '../Controls/Controls'
import Range from '../Range/Range'
import SongSummary from '../SongSummary/SongSummary'
import Volume from '../Volume/Volume'
import styles from './SongPlayer.module.scss'

const SongPlayer = () => {
  const audioRef = useRef()
  const rangeRef = useRef()
  const [duration, setDuration] = useState(0)
  const [timeProgress, setTimeProgress] = useState(0)
  const [isPlayerPageOpen, setIsPlayerPageOpen] = useState(false)
  const activeSong = useSelector((state) => state.activeSong)
  const { width } = useWindowDimensions()

  const loadRangeData = () => {
    const seconds = Math.floor(audioRef.current.duration)
    setDuration(seconds)
    rangeRef.current.max = seconds
  }

  const handleArrowDownClick = () => {
    isMobile() && setIsPlayerPageOpen(false)
  }

  const isMobile = () => width <= 600

  return (
    !isEmptyObject(activeSong.schema.song) && (
      <>
        <div
          className={`${isPlayerPageOpen && styles.show} ${
            isMobile() && styles.mobile
          } ${styles.songPlayer}`}
        >
          <KeyboardArrowDownRoundedIcon
            className={styles.closeIcon}
            onClick={handleArrowDownClick}
          />
          <div className={styles.details}>
            <img
              className={styles.details__image}
              src={activeSong.schema.song.image}
            />
            {isMobile() && <div className={styles.details__imagePlaceholder} />}
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
          <div className={styles.audio}>
            <audio
              src={activeSong.schema.song.song}
              ref={audioRef}
              onLoadedMetadata={loadRangeData}
            />
            <Controls
              audioRef={audioRef}
              timeProgress={timeProgress}
              setTimeProgress={setTimeProgress}
              rangeRef={rangeRef}
              duration={duration}
              playingMode={activeSong.schema.isPlaying}
            />
            <Range
              audioRef={audioRef}
              rangeRef={rangeRef}
              duration={duration}
              timeProgress={timeProgress}
            />
          </div>
          <div className={styles.volume}>
            <Volume audioRef={audioRef} />
          </div>
        </div>
        {isMobile() && (
          <SongSummary
            isPlayerPageOpen={isPlayerPageOpen}
            setIsPlayerPageOpen={setIsPlayerPageOpen}
          />
        )}
      </>
    )
  )
}

export default SongPlayer
