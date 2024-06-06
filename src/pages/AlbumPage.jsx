import { useLoaderData } from 'react-router-dom'
import { useDispatch } from 'react-redux'

import Track from '../components/Track/Track'
import { setBrowsedType } from '../store/controllers'
import {
  useGetAccessTokenQuery,
  useLazyGetAlbumQuery,
} from '../store/apiServices'
import { useEffect } from 'react'
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
      {album.isSuccess && (
        <div className={styles.albumPage}>
          <div
            className={styles.albumPage__background}
            style={{ backgroundImage: 'url(' + album.data.image.url + ')' }}
          ></div>
          <div className={styles.intro}>
            <h2 className={styles.intro__title}>{album.data.name}</h2>
            <img
              className={styles.intro__image}
              src={album.data.image.url}
              alt={album.data.name}
            />
          </div>
          <div className={styles.tableTitles}>
            <h5 className={styles.tableTitle__number}>#</h5>
            <h5 className={styles.tableTitle__title}>Title</h5>
            <h5 className={styles.tableTitle__album}>Album</h5>
            <h5 className={styles.tableTitle__details}></h5>
          </div>
          {album.data.tracks.map((track, index) => (
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
          ))}
        </div>
      )}
    </>
  )
}

export default AlbumPage
