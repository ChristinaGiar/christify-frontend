import { useEffect, useState } from 'react'
import PropTypes from 'prop-types'
import VolumeUpRoundedIcon from '@mui/icons-material/VolumeUpRounded'

const Volume = ({ audioRef }) => {
  const [volume, setVolume] = useState(70)

  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.volume = volume / 100
    }
  }, [volume, audioRef])
  return (
    <>
      <VolumeUpRoundedIcon />
      <input
        type='range'
        min={0}
        max={100}
        value={volume}
        onChange={(e) => setVolume(e.target.value)}
        style={{
          background: `linear-gradient(to right, #f50 ${volume}%, #ccc ${volume}%)`,
        }}
      />
    </>
  )
}

export default Volume

Volume.propTypes = {
  audioRef: PropTypes.object,
}
