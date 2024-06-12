import { Skeleton } from '@mui/material'
import { useEffect } from 'react'
import { useDispatch } from 'react-redux'
import { useLoaderData } from 'react-router-dom'

import Track from '../components/Track/Track'
import {
  useGetAccessTokenQuery,
  useLazyGetAlbumQuery,
} from '../store/apiServices'
import { setBrowsedType } from '../store/controllers'
import styles from './Pages.module.scss'

function AlbumPage() {
  const albumID = useLoaderData()
  const { data: accessToken } = useGetAccessTokenQuery()
  const [triggerAlbum, album] = useLazyGetAlbumQuery()
  const dispatch = useDispatch()

  useEffect(() => {
    if (accessToken) {
      triggerAlbum({ albumID })
    }
  }, [accessToken])

  useEffect(() => {
    // check type of track for next, prev controllers & autoplay
    album.isSuccess &&
      dispatch(
        setBrowsedType({
          type: 'album',
          album: { ...album.data, albumID, artists: album.data.artists },
        })
      )
  }, [album])

  return (
    <>
      {
        <div className={styles.albumPage}>
          <div
            className={styles.albumPage__background}
            style={{
              backgroundImage:
                album.data?.image?.url && 'url(' + album.data.image.url + ')',
            }}
          ></div>
          <div className={styles.intro}>
            <h2 className={styles.intro__title}>{album.data?.name}</h2>
            {album.data?.image?.url ? (
              <img
                className={styles.intro__image}
                src={album.data.image.url}
                alt={album.data.name}
              />
            ) : (
              <Skeleton
                className={styles.skeletonImage}
                variant='rectangular'
                sx={{
                  bgcolor: 'grey.900',
                }}
              />
            )}
          </div>
          <div className={styles.tableTitles}>
            <h5 className={styles.tableTitle__number}>#</h5>
            <h5 className={styles.tableTitle__title}>Title</h5>
            <h5 className={styles.tableTitle__album}>Album</h5>
            <h5 className={styles.tableTitle__details}></h5>
          </div>
          {album.data?.tracks
            ? album.data.tracks.map((track, index) => (
                <Track
                  key={track.trackID}
                  name={track.name}
                  trackID={track.trackID}
                  song={track.song}
                  artists={album.data.artists}
                  album={track.album}
                  image={track.image?.url}
                  number={index + 1}
                  type='album'
                />
              ))
            : [...Array(4)].map((_, index) => (
                <div key={index} className={styles.songSkeleton__texts}>
                  <Skeleton
                    className={styles.songSkeleton__text}
                    variant='text'
                    sx={{
                      fontSize: '1.2rem',
                      bgcolor: 'grey.900',
                      display: 'inline-block',
                    }}
                  />
                  <Skeleton
                    className={styles.songSkeleton__text}
                    variant='text'
                    sx={{
                      fontSize: '.9rem',
                      bgcolor: 'grey.900',
                      display: 'inline-block',
                    }}
                  />
                </div>
              ))}
        </div>
      }
    </>
  )
}

export default AlbumPage
