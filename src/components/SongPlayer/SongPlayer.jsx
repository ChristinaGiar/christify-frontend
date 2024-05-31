import { useSelector } from 'react-redux'
import { useEffect, useRef } from 'react'
import Controls from '../Controls/Controls'
import Range from '../Range/Range'
import { useState } from 'react'
import { isEmptyObject } from '../../utils/functions'
import Volume from '../Volume/Volume'

const SongPlayer = () => {
  const audioRef = useRef()
  const rangeRef = useRef()
  const [duration, setDuration] = useState(0)
  const [timeProgress, setTimeProgress] = useState(0)
  // const [volume, setVolume] = useState(70)
  const activeSong = useSelector((state) => state.activeSong)
  const loadRangeData = () => {
    const seconds = audioRef.current.duration
    setDuration(seconds)
    rangeRef.current.max = seconds
  }
  // useEffect(() => {
  //   if (audioRef.current) {
  //     audioRef.current.volume = volume / 100
  //   }
  // }, [volume, audioRef])

  return (
    !isEmptyObject(activeSong.schema.song) && (
      <>
        <div>Name: {activeSong.schema.song.name}</div>
        <div>SongPlayer {activeSong.schema.song.trackID}</div>
        <audio
          src={activeSong.schema.song.song}
          ref={audioRef}
          onLoadedMetadata={loadRangeData}
        />
        <div>Album: {activeSong.schema.album.albumName}</div>
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
        <Volume audioRef={audioRef} />
      </>
    )
  )
}

export default SongPlayer
