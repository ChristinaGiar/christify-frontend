import VolumeDownRoundedIcon from '@mui/icons-material/VolumeDownRounded'
import VolumeMuteRoundedIcon from '@mui/icons-material/VolumeMuteRounded'
import VolumeUpRoundedIcon from '@mui/icons-material/VolumeUpRounded'
import PropTypes from 'prop-types'
import { useEffect, useState } from 'react'

import styles from './Volume.module.scss'

const Volume = ({ audioRef }) => {
  const [volume, setVolume] = useState(30)

  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.volume = volume / 100
    }
  }, [volume, audioRef])

  const volumeIcon = () => {
    if (volume >= 50) {
      return <VolumeUpRoundedIcon />
    } else if (volume > 0 && volume < 50) {
      return <VolumeDownRoundedIcon />
    }
    return <VolumeMuteRoundedIcon />
  }

  return (
    <div className={styles.volume}>
      {volumeIcon()}
      <input
        type='range'
        min={0}
        max={100}
        value={volume}
        onChange={(e) => setVolume(e.target.value)}
        style={{
          background: `linear-gradient(to right, #4fc1ff ${volume}%, #ccc ${volume}%)`,
        }}
      />
    </div>
  )
}

export default Volume

Volume.propTypes = {
  audioRef: PropTypes.object,
}
