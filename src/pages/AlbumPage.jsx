import { useLoaderData } from 'react-router-dom'
import { useDispatch } from 'react-redux'

import Track from '../components/Track/Track'
import { setBrowsedType } from '../store/controllers'
import { useGetAlbumQuery } from '../store/apiServices'
import { useEffect } from 'react'
import styles from './Pages.module.scss'

function AlbumPage() {
  const albumID = useLoaderData()
  const { data: album, isSuccess } = useGetAlbumQuery({ albumID })
  const dispatch = useDispatch()
  useEffect(() => {
    // check type of track for next, prev controllers & autoplay
    isSuccess &&
      dispatch(
        setBrowsedType({
          type: 'album',
          album: { ...album, albumID, artists: album.artists },
        })
      )
  })

  return (
    <>
      {isSuccess && (
        <div className={styles.albumPage}>
          <div
            className={styles.albumPage__background}
            style={{ backgroundImage: 'url(' + album.image.url + ')' }}
          ></div>
          <div className={styles.intro}>
            <h2 className={styles.intro__title}>{album.name}</h2>
            <img
              className={styles.intro__image}
              src={album.image.url}
              alt={album.name}
            />
          </div>
          <div className={styles.tableTitles}>
            <h5 className={styles.tableTitle__number}>#</h5>
            <h5 className={styles.tableTitle__title}>Title</h5>
            <h5 className={styles.tableTitle__album}>Album</h5>
            <h5 className={styles.tableTitle__details}></h5>
          </div>
          {album.tracks.map((track, index) => (
            <Track
              key={track.trackID}
              name={track.name}
              trackID={track.trackID}
              song={track.song}
              artists={album.artists}
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
