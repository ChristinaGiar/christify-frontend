import PropTypes from 'prop-types'
import { useSelector, useDispatch } from 'react-redux'
import { useEffect, useCallback, useRef } from 'react'
import { activeSongActions } from '../../store/activeSong'
import { isEmptyObject } from '../../utils/functions'
import {
  useLazyGetLatestSongsQuery,
  usePostLatestSongMutation,
} from '../../store/apiServices'
import { setBrowsedType } from '../../store/controllers'
import { useState } from 'react'
import { LATEST_SONGS_LENGTH } from '../../utils/constants'
import PlayCircleOutlineRoundedIcon from '@mui/icons-material/PlayCircleOutlineRounded'
import PauseCircleOutlineRoundedIcon from '@mui/icons-material/PauseCircleOutlineRounded'
import SkipNextRoundedIcon from '@mui/icons-material/SkipNextRounded'
import SkipPreviousRoundedIcon from '@mui/icons-material/SkipPreviousRounded'
import Forward10RoundedIcon from '@mui/icons-material/Forward10Rounded'
import Replay10RoundedIcon from '@mui/icons-material/Replay10Rounded'
import styles from './Control.module.scss'

const Controls = ({
  audioRef,
  timeProgress,
  setTimeProgress,
  duration,
  rangeRef,
}) => {
  const dispatch = useDispatch()

  const activeSong = useSelector((state) => state.activeSong)
  const browsedType = useSelector((state) => state.controllers?.browsedType)
  const [isNextPressed, setIsNextPressed] = useState(false)
  const [isPrevPressed, setIsPrevPressed] = useState(false)
  const playAnimationRef = useRef()
  const nextRef = useRef(null)
  const [triggerLatestSongs, latestSongs] = useLazyGetLatestSongsQuery()
  const [triggerLatestSong] = usePostLatestSongMutation() //, latestSong
  const repeat = useCallback(() => {
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
      audioRef.current.play()
    } else {
      audioRef.current.pause()
    }

    playAnimationRef.current = requestAnimationFrame(repeat)
  }, [audioRef, repeat, activeSong])

  useEffect(() => {
    // restart on replayed track
    if (activeSong.schema.replayed) {
      audioRef.current.currentTime = 0
      dispatch(
        activeSongActions.setReplayed({
          replayed: false,
        })
      )
    }
  }, [activeSong, audioRef, dispatch])

  useEffect(() => {
    // autoplay functionality
    if (timeProgress === duration && duration > 0 && timeProgress > 0) {
      nextRef.current.click()
    }
  }, [timeProgress, duration])

  useEffect(() => {
    // handle album songs on autoplay / button clicked "Next" button
    if (
      isNextPressed &&
      browsedType.type === 'album' &&
      browsedType.albumTrigger
    ) {
      const album = browsedType.album
      nextRef.current.click()
      const nextSongIdx =
        album.tracks.findIndex(
          (track) => track.trackID === activeSong.schema.song.trackID
        ) + 1
      const nextSongIdxAdapted = nextSongIdx % album.tracks.length
      setActiveSongAction(album.tracks, nextSongIdxAdapted, album)
      /* dispatch(
        activeSongActions.setActiveSong({
          song: {
            name: album.tracks[nextSongIdxAdapted].name,
            trackID: album.tracks[nextSongIdxAdapted].trackID,
            song: album.tracks[nextSongIdxAdapted].song,
          },
          album,
          isPlaying: activeSong.schema.isPlaying,
        })
      ) */
      triggerLatestSong({
        ...album.tracks[nextSongIdxAdapted],
        image: album.tracks[nextSongIdxAdapted].image.url,
      })
      setIsNextPressed(false)
    }
  }, [isNextPressed, browsedType.type])

  useEffect(() => {
    if (latestSongs.isSuccess) {
      if (browsedType.type === 'track' || browsedType.type === 'track-first') {
        if (isPrevPressed) {
          // search history
          const currentSongIdx = browsedType.browsedTracks.findIndex(
            (track) => track.song === audioRef.current.src
          )

          if (currentSongIdx === 0) {
            dispatch(
              activeSongActions.setReplayed({
                replayed: true,
              })
            )
          } else {
            const nextSongIdx = currentSongIdx - 1
            setActiveSongAction(browsedType.browsedTracks, nextSongIdx)
            /* dispatch(
              activeSongActions.setActiveSong({
                song: {
                  name: browsedType.browsedTracks[nextSongIdx].name,
                  trackID: browsedType.browsedTracks[nextSongIdx].trackID,
                  song: browsedType.browsedTracks[nextSongIdx].song,
                },
                album: browsedType.browsedTracks[nextSongIdx].album,
                isPlaying: activeSong.schema.isPlaying,
              })
            ) */
          }
          setIsPrevPressed(false)
        } else if (isNextPressed) {
          // pick randomly one from history
          const currentSongIdx = browsedType.browsedTracks.findIndex(
            (track) => track.song === audioRef.current.src
          )
          let nextSongIdx, songReplayedIdx
          if (currentSongIdx < browsedType.browsedTracks.length - 1) {
            // if before last
            nextSongIdx = currentSongIdx + 1
            setActiveSongAction(browsedType.browsedTracks, nextSongIdx)
            /*  dispatch(
              activeSongActions.setActiveSong({
                song: {
                  name: browsedType.browsedTracks[nextSongIdx].name,
                  trackID: browsedType.browsedTracks[nextSongIdx].trackID,
                  song: browsedType.browsedTracks[nextSongIdx].song,
                },
                album: browsedType.browsedTracks[nextSongIdx].album,
                isPlaying: activeSong.schema.isPlaying,
              })
            ) */
            triggerLatestSong(browsedType.browsedTracks[nextSongIdx])
          } else {
            // pick randomly one from history
            let iterations = 0
            do {
              nextSongIdx = Math.floor(
                Math.random() * (latestSongs.data.length - 1)
              )
              songReplayedIdx = browsedType.browsedTracks.findIndex(
                (track) =>
                  track.trackID === latestSongs.data[nextSongIdx].trackID
              )
              iterations++
            } while (songReplayedIdx !== -1)

            if (iterations < 10) {
              dispatch(
                setBrowsedType({
                  type: 'track',
                  track: latestSongs.data[nextSongIdx],
                })
              )
              setActiveSongAction(latestSongs.data, nextSongIdx)
              /* dispatch(
                activeSongActions.setActiveSong({
                  song: {
                    name: latestSongs.data[nextSongIdx].name,
                    trackID: latestSongs.data[nextSongIdx].trackID,
                    song: latestSongs.data[nextSongIdx].song,
                  },
                  album: latestSongs.data[nextSongIdx].album,
                  isPlaying: activeSong.schema.isPlaying,
                })
              ) */
              triggerLatestSong(latestSongs.data[nextSongIdx])
            } else {
              // TODO: CALL another api based on last song
              console.log('add 10 songs to browsedTracks')
            }
          }
          setIsNextPressed(false)
        }
      } else if (browsedType.type === 'history-track') {
        if (isPrevPressed) {
          const currentSongIdx = latestSongs.data.findIndex(
            (track) => track.song === audioRef.current.src
          )

          if (currentSongIdx === 0) {
            dispatch(
              activeSongActions.setReplayed({
                replayed: true,
              })
            )
          } else {
            const nextSongIdx = currentSongIdx - 1
            setActiveSongAction(latestSongs.data, nextSongIdx)
            /* dispatch(
              activeSongActions.setActiveSong({
                song: {
                  name: latestSongs.data[nextSongIdx].name,
                  trackID: latestSongs.data[nextSongIdx].trackID,
                  song: latestSongs.data[nextSongIdx].song,
                },
                album: latestSongs.data[nextSongIdx].album,
                isPlaying: activeSong.schema.isPlaying,
              })
            ) */
          }
          setIsPrevPressed(false)
        } else if (isNextPressed) {
          const currentSongIdx = latestSongs.data.findIndex(
            (track) => track.song === audioRef.current.src
          )

          if (currentSongIdx === LATEST_SONGS_LENGTH - 1) {
            // latestSongs.data.length
            audioRef.current.pause()
            dispatch(activeSongActions.setPlayingMode(false))
          } else {
            const nextSongIdx = currentSongIdx + 1
            setActiveSongAction(latestSongs.data, nextSongIdx)
            /* dispatch(
              activeSongActions.setActiveSong({
                song: {
                  name: latestSongs.data[nextSongIdx].name,
                  trackID: latestSongs.data[nextSongIdx].trackID,
                  song: latestSongs.data[nextSongIdx].song,
                },
                album: latestSongs.data[nextSongIdx].album,
                isPlaying: activeSong.schema.isPlaying,
              })
            ) */
          }
          setIsNextPressed(false)
        }
      }
    }
  }, [latestSongs, isPrevPressed, isNextPressed])

  const handleSkipForward = () => {
    audioRef.current.currentTime += 10
  }

  const handleSkipBackward = () => {
    audioRef.current.currentTime -= 10
  }

  const handlePrevious = () => {
    if (browsedType.type === 'album' && browsedType.albumTrigger) {
      const album = browsedType.album

      const prevSongIdx = album.tracks.findIndex(
        (track) => track.trackID === activeSong.schema.song.trackID
      )

      if (prevSongIdx !== 0) {
        const prevSongIdxAdapted = prevSongIdx - 1
        setActiveSongAction(album.tracks, prevSongIdxAdapted, album)
        /*         dispatch(
          activeSongActions.setActiveSong({
            song: {
              name: album.tracks[prevSongIdxAdapted].name,
              trackID: album.tracks[prevSongIdxAdapted].trackID,
              song: album.tracks[prevSongIdxAdapted].song,
            },
            album,
            isPlaying: activeSong.schema.isPlaying,
          })
        ) */

        triggerLatestSong({
          ...album.tracks[prevSongIdxAdapted],
          image: album.tracks[prevSongIdxAdapted].image.url,
        })
      } else {
        // 1st song is playing
        dispatch(
          activeSongActions.setReplayed({
            replayed: true,
          })
        )
      }
    } else if (browsedType.type === 'track') {
      triggerLatestSongs()
    }
    setIsPrevPressed(true)
  }

  const setActiveSongAction = (songs, index, album = {}) => {
    dispatch(
      activeSongActions.setActiveSong({
        song: {
          name: songs[index].name,
          trackID: songs[index].trackID,
          song: songs[index].song,
        },
        album: isEmptyObject(album) ? album : songs[index].album,
        isPlaying: activeSong.schema.isPlaying,
      })
    )
  }

  const handleNext = () => {
    if (
      browsedType.type === 'track-first' ||
      browsedType.type === 'track' ||
      browsedType.type === 'history-track'
    ) {
      triggerLatestSongs()
    }
    setIsNextPressed(true)
  }

  const handleTogglePlay = () => {
    dispatch(activeSongActions.setPlayingMode(!activeSong.schema.isPlaying))
  }

  return (
    <>
      <button onClick={handlePrevious}>
        <SkipPreviousRoundedIcon sx={{ fontSize: '1.8rem' }} />
      </button>
      <button onClick={handleSkipBackward}>
        <Replay10RoundedIcon sx={{ fontSize: '1.8rem' }} />
      </button>
      <div onClick={handleTogglePlay}>
        {activeSong.schema.isPlaying ? (
          <button>
            <PauseCircleOutlineRoundedIcon
              sx={{ fontSize: '2rem', color: '#4fc1ff' }}
            />
          </button>
        ) : (
          <button>
            <PlayCircleOutlineRoundedIcon sx={{ fontSize: '2rem' }} />
          </button>
        )}
      </div>
      <button onClick={handleSkipForward}>
        <Forward10RoundedIcon sx={{ fontSize: '1.8rem' }} />
      </button>
      <button ref={nextRef} onClick={handleNext}>
        <SkipNextRoundedIcon sx={{ fontSize: '1.8rem' }} />
      </button>
    </>
  )
}

export default Controls

Controls.propTypes = {
  audioRef: PropTypes.object,
  rangeRef: PropTypes.object,
  timeProgress: PropTypes.number,
  setTimeProgress: PropTypes.func,
  duration: PropTypes.number,
  playingMode: PropTypes.bool,
}
