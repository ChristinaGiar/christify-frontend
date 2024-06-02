import { PropTypes } from 'prop-types'
import Track from '../Track/Track'
import styles from './History.module.scss'

const History = ({ lastSongs }) => {
  return (
    <>
      <h3 className='categoryTitle'>You listened lately</h3>
      <div className={styles.tableTitles}>
        <h5 className={styles.tableTitle__name}>Title</h5>
        <h5 className={styles.tableTitle__album}>Album</h5>
      </div>
      <div className={styles.table}>
        {lastSongs.map((track) => (
          <Track
            key={track.trackID}
            name={track.name}
            trackID={track.trackID}
            artists={track.artists}
            image={track.image}
            song={track.song}
            album={track.album}
            type='history'
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
