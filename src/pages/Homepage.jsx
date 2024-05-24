import { useEffect } from 'react'
import History from '../components/History'
import { useLazyGetLatestSongsQuery } from '../store/apiServices'

const Homepage = () => {
  const [triggerLatestSongs, latestSongs] = useLazyGetLatestSongsQuery()
  // const { data: songs, error, isLoading } = useGetLatestSongsQuery();
  // songs && (latestListenedSongs = songs.slice(0, 8));

  useEffect(() => {
    triggerLatestSongs()
  }, [])
  return (
    <>
      <div>Homepage</div>
      {latestSongs.data?.length !== 0 && latestSongs.isSuccess && (
        <History lastSongs={latestSongs.data.slice(0, 8)} />
      )}
    </>
  )
}

export default Homepage
