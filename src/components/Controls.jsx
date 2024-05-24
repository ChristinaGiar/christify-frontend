import PropTypes from 'prop-types'
import { useSelector, useDispatch } from 'react-redux'
import { useEffect, useCallback, useRef } from 'react'
import { activeSongActions } from '../store/activeSong'
import {
  useLazyGetLatestSongsQuery,
  usePostLatestSongMutation,
} from '../store/apiServices'
import { useState } from 'react'

const Controls = ({ audioRef, setTimeProgress, duration, rangeRef }) => {
  const dispatch = useDispatch()

  const activeSong = useSelector((state) => state.activeSong)
  const [isPrevNextPressed, setIsPrevNextPressed] = useState({
    prev: false,
    next: false,
  })
  const playAnimationRef = useRef()
  const [triggerLatestSongs, latestSongs] = useLazyGetLatestSongsQuery()
  const [triggerLatestSong, latestSong] = usePostLatestSongMutation()

  const repeat = useCallback(() => {
    // console.log(audioRef.current.currentTime); // CHECK WHY IT KEEPS RUNNING
    const currentTime = audioRef.current.currentTime
    setTimeProgress(currentTime)
    rangeRef.current.value = currentTime
    rangeRef.current.style.setProperty(
      '--range-progress',
      `${(rangeRef.current.value / duration) * 100}%`
    )

    playAnimationRef.current = requestAnimationFrame(repeat) // trigger current range point
  }, [audioRef, duration, rangeRef, setTimeProgress])

  useEffect(() => {
    if (activeSong.schema.isPlaying) {
      console.log('activeSong', activeSong)
      audioRef.current.play()
    } else {
      audioRef.current.pause()
    }

    playAnimationRef.current = requestAnimationFrame(repeat)
  }, [audioRef, repeat, activeSong])

  useEffect(() => {
    // TEST
    latestSongs.isSuccess && console.log('Latest songs', latestSongs)
  }, [latestSongs])

  // songIndex = Math.random(latestSongs.data.length)

  useEffect(() => {
    if (activeSong.schema.replayed) {
      audioRef.current.currentTime = 0
      console.log('REPLAY')
      dispatch(
        activeSongActions.setReplayed({
          replayed: false,
        })
      )
    }
  }, [activeSong, audioRef, dispatch])

  const handleSkipForward = () => {
    audioRef.current.currentTime += 10
  }

  const handleSkipBackward = () => {
    audioRef.current.currentTime -= 10
  }

  const handlePrevious = () => {
    triggerLatestSongs()
    console.log('run 2')
    setIsPrevNextPressed((prevState) => ({ ...prevState, prev: true }))
  }

  const handleNext = () => {
    setIsPrevNextPressed((prevState) => ({ ...prevState, next: true }))
  }
  const handleTogglePlay = () => {
    dispatch(activeSongActions.setPlayingMode(!activeSong.schema.isPlaying))
  }
  return (
    <>
      <div onClick={handlePrevious}>Previous</div>
      <div onClick={handleSkipBackward}>handleSkipForward</div>
      <div onClick={handleTogglePlay}>
        {activeSong.schema.isPlaying ? <div>Pause</div> : <div>Play</div>}
      </div>
      <div onClick={handleSkipForward}>handleSkipForward</div>
      <div onClick={handleNext}>Next</div>
    </>
  )
}

export default Controls

Controls.propTypes = {
  audioRef: PropTypes.object,
  rangeRef: PropTypes.object,
  setTimeProgress: PropTypes.func,
  duration: PropTypes.number,
  playingMode: PropTypes.bool,
}
