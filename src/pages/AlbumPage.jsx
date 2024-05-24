import { useLoaderData } from 'react-router-dom'
import Track from '../components/Track'
import { useGetAlbumQuery } from '../store/apiServices'

function AlbumPage() {
  const albumID = useLoaderData()
  console.log('albumID', albumID)
  const {
    data: album,
    error,
    isLoading,
    isSuccess,
  } = useGetAlbumQuery({ albumID })
  isSuccess && console.log(albumID, album)

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
            />
          ))}
        </>
      )}
    </>
  )
}

export default AlbumPage
