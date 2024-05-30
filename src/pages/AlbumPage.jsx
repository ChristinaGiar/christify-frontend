import { useLoaderData } from 'react-router-dom'
import { useDispatch } from 'react-redux'

import Track from '../components/Track'
import { setBrowsedType, useGetAlbumQuery } from '../store/apiServices'
import { useEffect } from 'react'

function AlbumPage() {
  const albumID = useLoaderData()
  const { data: album, isSuccess } = useGetAlbumQuery({ albumID })
  const dispatch = useDispatch()
  useEffect(() => {
    // check type of track for next, prev controllers & autoplay
    console.log(albumID, album)
    isSuccess &&
      dispatch(
        setBrowsedType({
          type: 'album',
          album: { albumID: albumID, tracks: album.tracks },
        })
      )
  })

  // isSuccess && console.log('album', albumID, album)

  return (
    <>
      {isSuccess && (
        <>
          <h2>{album.name}</h2>
          <img src={album.image.url} alt={album.name} />
          {album.tracks.map((track) => (
            <Track
              key={track.trackID}
              name={track.name}
              trackID={track.trackID}
              song={track.song}
              album={track.album}
              image={track.image?.url}
              type='album'
            />
          ))}
        </>
      )}
    </>
  )
}

export default AlbumPage
