import { useSelector } from 'react-redux'
import { useEffect, useRef } from 'react'
import Controls from '../Controls/Controls'
import Range from '../Range/Range'
import { useState } from 'react'
import { artistsArrayToString, isEmptyObject } from '../../utils/functions'
import Volume from '../Volume/Volume'
import styles from './SongPlayer.module.scss'

const SongPlayer = () => {
  const audioRef = useRef()
  const rangeRef = useRef()
  const [duration, setDuration] = useState(0)
  const [timeProgress, setTimeProgress] = useState(0)
  const activeSong = useSelector((state) => state.activeSong)
  const loadRangeData = () => {
    const seconds = audioRef.current.duration
    setDuration(seconds)
    rangeRef.current.max = seconds
  }

  return (
    !isEmptyObject(activeSong.schema.song) && (
      <div className={styles.songPlayer}>
        <div className={styles.details}>
          <img
            className={styles.details__image}
            src={activeSong.schema.song.image}
          />
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
    )
  )
}

export default SongPlayer
