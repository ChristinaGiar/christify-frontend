import { PropTypes } from 'prop-types'

import styles from './Range.module.scss'

const Range = ({ rangeRef, audioRef, duration, timeProgress }) => {
  const rangeChangeHandler = () => {
    audioRef.current.currentTime = rangeRef.current.value
  }

  const formatTime = (time) => {
    if (time) {
      const seconds = Math.floor(time % 60)
      const formattedSeconds = seconds.toString().padStart(2, '0')
      const minutes = Math.floor(time / 60)
      const formattedMinutes = minutes.toString().padStart(2, '0')

      return `${formattedMinutes}:${formattedSeconds}`
    }
    return `00:00`
  }
  return (
    <div className={styles.range}>
      <span className={styles.range__time}> {formatTime(timeProgress)}</span>
      <input
        type='range'
        ref={rangeRef}
        defaultValue='0'
        onChange={rangeChangeHandler}
        className={styles.range__bar}
      />
      <span className={styles.range__time}>{formatTime(duration)}</span>
    </div>
  )
}

Range.propTypes = {
  rangeRef: PropTypes.object,
  audioRef: PropTypes.object,
  duration: PropTypes.number,
  timeProgress: PropTypes.number,
}

export default Range
