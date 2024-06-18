import { Skeleton } from '@mui/material'
import { PropTypes } from 'prop-types'
import { useEffect } from 'react'
import { Link } from 'react-router-dom'

import { useLazyGetReleaseAlbumQuery } from '../../store/apiServices'
import { artistsArrayToString } from '../../utils/functions'
import styles from './NewReleaseBanner.module.scss'

const NewReleaseBanner = ({ accessToken }) => {
  const [triggerReleaseAlbum, releaseAlbum] = useLazyGetReleaseAlbumQuery()

  useEffect(() => {
    if (accessToken) {
      triggerReleaseAlbum()
    }
  }, [accessToken])

  return releaseAlbum.isSuccess ? (
    <div className={styles.releaseBanner}>
      <div className={styles.releaseBanner__imageWrapper}>
        <img
          className={styles.releaseBanner__image}
          src={releaseAlbum.data.image}
        />
      </div>

      <div className={styles.releaseBanner__texts}>
        <p className={styles.releaseBanner__category}>
          Listen 1<sup>st</sup> the latest album releases! 🎉
        </p>
        <h2 className={styles.releaseBanner__title}>
          {releaseAlbum.data.name}
        </h2>
        <p className={styles.releaseBanner__artists}>
          {releaseAlbum.data.artists
            ? artistsArrayToString(releaseAlbum.data.artists)
            : '-'}
        </p>
        <Link to={`album/${releaseAlbum.data.albumID}`}>
          <button className={styles.releaseBanner__button}>Explore</button>
        </Link>
      </div>
    </div>
  ) : (
    <div className={styles.skeleton}>
      {/* Skeleton */}
      <div className={styles.skeleton__imageWrapper}>
        <Skeleton
          className={styles.skeleton__image}
          variant='text'
          sx={{
            bgcolor: 'grey.900',
          }}
        />
      </div>
      <div className={styles.skeleton__texts}>
        <Skeleton
          className={styles.skeleton__category}
          variant='text'
          sx={{
            bgcolor: 'grey.900',
          }}
        />
        <Skeleton
          className={styles.skeleton__title}
          variant='text'
          sx={{
            bgcolor: 'grey.900',
          }}
        />
        <Skeleton
          className={styles.skeleton__artists}
          variant='text'
          sx={{
            bgcolor: 'grey.900',
          }}
        />
        <Skeleton
          className={styles.skeleton__button}
          variant='text'
          sx={{
            bgcolor: 'grey.900',
          }}
        />
      </div>
    </div>
  )
}

NewReleaseBanner.propTypes = {
  accessToken: PropTypes.number,
}

export default NewReleaseBanner
