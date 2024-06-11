import { useEffect } from 'react'
import History from '../components/History/History'
import { useLazyGetLatestSongsQuery } from '../store/apiServices'
import { LATEST_SONGS_LENGTH } from '../utils/constants'
const Homepage = () => {
  const [triggerLatestSongs, latestSongs] = useLazyGetLatestSongsQuery()

  useEffect(() => {
    triggerLatestSongs()
  }, [])
  return (
    <>
      <div>
        BANNER: <b>Unlimited</b> music for <b>FREE</b>
      </div>
      {/* TODO: Top Rated lately songs */}
      {/* {!isEmpty(latestSongs.data) && latestSongs.isSuccess && ( */}
      <History lastSongs={latestSongs.data?.slice(0, LATEST_SONGS_LENGTH)} />
      {/* )} */}
    </>
  )
}

export default Homepage
