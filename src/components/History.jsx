import HistoryTrack from './HistoryTrack'
import { PropTypes } from 'prop-types'

const History = ({ lastSongs }) => {
  return (
    <>
      <h3 className='categoryTitle'>You listened lately</h3>
      <div>
        {lastSongs.map((track) => (
          <HistoryTrack
            key={track.trackID}
            name={track.name}
            trackID={track.trackID}
            artists={track.artists}
            image={track.image}
            song={track.song}
            album={track.album}
          />
        ))}
      </div>
    </>
  )
}

History.propTypes = {
  lastSongs: PropTypes.array,
  songs: PropTypes.array,
}
export default History
