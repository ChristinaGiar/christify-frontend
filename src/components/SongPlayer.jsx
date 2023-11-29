import { useSelector } from 'react-redux';
import { useRef } from 'react';
import Controls from './Controls';
import Range from './Range';
import { useState } from 'react';
import { isEmpty } from '../utils';

const SongPlayer = () => {
  const audioRef = useRef();
  const rangeRef = useRef();
  const [duration, setDuration] = useState(0);
  const [timeProgress, setTimeProgress] = useState(0);

  const activeSong = useSelector((state) => state.activeSong);
  const loadRangeData = () => {
    const seconds = audioRef.current.duration;
    setDuration(seconds);
    rangeRef.current.max = seconds;
  }
    return (
      !isEmpty(activeSong.schema.song) &&
      <>
      <div>Name: {activeSong.schema.song.name}</div>
        <div>SongPlayer {activeSong.schema.song.trackID}</div>
        <audio src={activeSong.schema.song.song} ref={audioRef} onLoadedMetadata={loadRangeData}/>
        <div>Album: {activeSong.schema.album.albumName}</div>
        <Controls audioRef={audioRef} setTimeProgress={setTimeProgress} rangeRef={rangeRef} duration={duration} playingMode={activeSong.schema.isPlaying}/>
        <Range audioRef={audioRef} rangeRef={rangeRef} duration={duration} timeProgress={timeProgress}/>
      </>
    )
  }
  
  export default SongPlayer;