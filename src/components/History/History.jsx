import { PropTypes } from 'prop-types'
import Track from '../Track/Track'
import styles from './History.module.scss'
import { Skeleton } from '@mui/material'

const History = ({ lastSongs }) => {
  return (
    <>
      <h3 className='categoryTitle'>You listened lately</h3>
      <div className={styles.tableTitles}>
        <h5 className={styles.tableTitle__name}>Title</h5>
        <h5 className={styles.tableTitle__album}>Album</h5>
        <h5 className={styles.tableTitle__details}></h5>
      </div>
      <div className={styles.table}>
        {lastSongs
          ? lastSongs.map((track) => (
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
            ))
          : [...Array(4)].map((_, index) => (
              <div className={styles.skeleton} key={index}>
                <Skeleton
                  variant='rectangular'
                  className={`${styles.skeleton__image}`}
                  height={40}
                  sx={{ bgcolor: 'grey.900', display: 'inline-block' }}
                />
                <div className={styles.skeleton__texts}>
                  <Skeleton
                    className={styles.skeleton__text}
                    variant='text'
                    sx={{
                      fontSize: '1.2rem',
                      bgcolor: 'grey.900',
                      display: 'inline-block',
                    }}
                  />
                  <Skeleton
                    className={styles.skeleton__text}
                    variant='text'
                    sx={{
                      fontSize: '.9rem',
                      bgcolor: 'grey.900',
                      display: 'inline-block',
                    }}
                  />
                </div>
              </div>
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
