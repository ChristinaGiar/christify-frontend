import Forward10RoundedIcon from '@mui/icons-material/Forward10Rounded'
import PauseCircleOutlineRoundedIcon from '@mui/icons-material/PauseCircleOutlineRounded'
import PlayCircleOutlineRoundedIcon from '@mui/icons-material/PlayCircleOutlineRounded'
import Replay10RoundedIcon from '@mui/icons-material/Replay10Rounded'
import SkipNextRoundedIcon from '@mui/icons-material/SkipNextRounded'
import SkipPreviousRoundedIcon from '@mui/icons-material/SkipPreviousRounded'
import PropTypes from 'prop-types'
import { useCallback, useEffect, useRef } from 'react'
import { useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'

import { activeSongActions } from '../../store/activeSong'
import {
  useLazyGetLatestSongsQuery,
  usePostLatestSongMutation,
} from '../../store/apiServices'
import { setBrowsedType } from '../../store/controllers'
import { LATEST_SONGS_LENGTH } from '../../utils/constants'
import { isEmptyObject } from '../../utils/functions'
import { useEnter } from '../../utils/hooks'
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
  const playRef = useRef(null)
  const [triggerLatestSongs, latestSongs] = useLazyGetLatestSongsQuery()
  const [triggerLatestSong] = usePostLatestSongMutation() //, latestSong

  const repeat = useCallback(() => {
    const currentTime = audioRef?.current?.currentTime
    // if (currentTime) {
    setTimeProgress(currentTime)
    rangeRef.current.value = currentTime
    rangeRef.current.style.setProperty(
      '--range-progress',
      `${(rangeRef.current.value / duration) * 100}%`
    )

    playAnimationRef.current = requestAnimationFrame(repeat) // trigger current range point
    // }
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
    // album on autoplay / button clicked "Next" button

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
            image: album.tracks[nextSongIdxAdapted].image.url,
            artists: album.artists,
          },
          album,
          isPlaying: activeSong.schema.isPlaying,
        })
      ) */
      triggerLatestSong({
        ...album.tracks[nextSongIdxAdapted],
        artists: album.artists,
        image: album.tracks[nextSongIdxAdapted].image.url,
      })
      setIsNextPressed(false)
    }
  }, [isNextPressed, browsedType.type])

  useEffect(() => {
    // tracks, history tracks on autoplay / button clicked "Prev", "Next" button
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
            const prevSongIdx = currentSongIdx - 1
            setActiveSongAction(browsedType.browsedTracks, prevSongIdx)
            /* dispatch(
              activeSongActions.setActiveSong({
                song: {
                  name: browsedType.browsedTracks[prevSongIdx].name,
                  trackID: browsedType.browsedTracks[prevSongIdx].trackID,
                  song: browsedType.browsedTracks[prevSongIdx].song,
                  image: browsedType.browsedTracks[prevSongIdx].image,
                  artists: browsedType.browsedTracks[prevSongIdx].artists,
                },
                album: browsedType.browsedTracks[prevSongIdx].album,
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
            /* dispatch(
              activeSongActions.setActiveSong({
                song: {
                  name: browsedType.browsedTracks[nextSongIdx].name,
                  trackID: browsedType.browsedTracks[nextSongIdx].trackID,
                  song: browsedType.browsedTracks[nextSongIdx].song,
                  image: browsedType.browsedTracks[nextSongIdx].image,
                  artists: browsedType.browsedTracks[nextSongIdx].artists,
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
                    image: latestSongs.data[nextSongIdx].image,
                    artists: latestSongs.data[nextSongIdx].artists,
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
            const prevSongIdx = currentSongIdx - 1
            setActiveSongAction(latestSongs.data, prevSongIdx)
            /* dispatch(
              activeSongActions.setActiveSong({
                song: {
                  name: latestSongs.data[prevSongIdx].name,
                  trackID: latestSongs.data[prevSongIdx].trackID,
                  song: latestSongs.data[prevSongIdx].song,
                  image: latestSongs.data[prevSongIdx].image,
                  artists: latestSongs.data[prevSongIdx].artists,
                },
                album: latestSongs.data[prevSongIdx].album,
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
                  image: latestSongs.data[nextSongIdx].image,
                  artists: latestSongs.data[nextSongIdx].artists,
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

  const handleEnterKey = (event) => {
    if (
      event.keyCode === 32 &&
      event.target.tagName.trim().toLowerCase() !== 'button' &&
      event.target.tagName.trim().toLowerCase() !== 'input' // don't affect button's and input's behavior
    ) {
      event.preventDefault()
      playRef.current.click()
    }
  }
  useEnter((e) => handleEnterKey(e))

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
        /* dispatch(
          activeSongActions.setActiveSong({
            song: {
              name: album.tracks[prevSongIdxAdapted].name,
              trackID: album.tracks[prevSongIdxAdapted].trackID,
              song: album.tracks[prevSongIdxAdapted].song,
              image: album.tracks[prevSongIdxAdapted].image.url,
              artists: album.artists,
            },
            album,
            isPlaying: activeSong.schema.isPlaying,
          })
        ) */

        triggerLatestSong({
          ...album.tracks[prevSongIdxAdapted],
          artists: album.artists,
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
          image: songs[index].image?.url || songs[index].image,
          artists: isEmptyObject(album) ? songs[index].artists : album.artists,
        },
        album: isEmptyObject(album) ? songs[index].album : album,
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
    <div className={styles.controls}>
      <button onClick={handlePrevious}>
        <SkipPreviousRoundedIcon sx={{ fontSize: '1.8rem' }} />
      </button>
      <button onClick={handleSkipBackward}>
        <Replay10RoundedIcon sx={{ fontSize: '1.8rem' }} />
      </button>
      <div ref={playRef} onClick={handleTogglePlay}>
        {activeSong.schema.isPlaying ? (
          <button>
            <PauseCircleOutlineRoundedIcon
              sx={{ fontSize: '2.3rem', color: '#4fc1ff' }}
            />
          </button>
        ) : (
          <button>
            <PlayCircleOutlineRoundedIcon sx={{ fontSize: '2.3rem' }} />
          </button>
        )}
      </div>
      <button onClick={handleSkipForward}>
        <Forward10RoundedIcon sx={{ fontSize: '1.8rem' }} />
      </button>
      <button ref={nextRef} onClick={handleNext}>
        <SkipNextRoundedIcon sx={{ fontSize: '1.8rem' }} />
      </button>
    </div>
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
