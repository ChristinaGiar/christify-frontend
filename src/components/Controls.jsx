import PropTypes from "prop-types";
import { useSelector, useDispatch } from 'react-redux';
import { useEffect, useCallback, useRef } from "react";
import { activeSongActions } from '../store/index';

const Controls = ({ audioRef, setTimeProgress, duration, rangeRef}) => {
    const dispatch = useDispatch();

    // const [isPlaying, setIsPlaying] = useState(false);
    const activeSong = useSelector((state) => state.activeSong);
    
    const playAnimationRef = useRef();

    const repeat = useCallback(() => {
        const currentTime = audioRef.current.currentTime;
        setTimeProgress(currentTime);
        rangeRef.current.value = currentTime;
        rangeRef.current.style.setProperty(
          '--range-progress',
          `${(rangeRef.current.value / duration) * 100}%`
        );
    
        playAnimationRef.current = requestAnimationFrame(repeat); // trigger current range point
      }, [audioRef, duration, rangeRef, setTimeProgress]);
    
    useEffect(() => {
        if(activeSong.schema.isPlaying) {
            audioRef.current.play();
        } else {
            audioRef.current.pause();
        }
        
    playAnimationRef.current = requestAnimationFrame(repeat);
    }, [audioRef, repeat, activeSong]); //isPlaying


    const skipForward = () => {
        audioRef.current.currentTime += 10;
      };
    
      const skipBackward = () => {
        audioRef.current.currentTime -= 10;
      };

    const togglePlay = () => {
        // setIsPlaying(prevState => !prevState);
    dispatch(activeSongActions.setPlayingMode(!activeSong.schema.isPlaying))
    }
    return (
        <>
            <div onClick={skipBackward}>skipForward</div>
            <div onClick={togglePlay}>{activeSong.schema.isPlaying ? <div>Pause</div> : <div>Play</div>}</div>
            <div onClick={skipForward}>skipForward</div>
        </>
    )
}

export default Controls;

Controls.propTypes = {
    audioRef: PropTypes.object,
    rangeRef: PropTypes.object,
    setTimeProgress: PropTypes.func,
    duration: PropTypes.number,
    playingMode: PropTypes.bool
  }
