import { useEffect } from 'react'

import History from '../components/History/History'
import NewReleaseBanner from '../components/NewReleaseBanner/NewReleaseBanner'
import {
  useGetAccessTokenQuery,
  useLazyGetLatestSongsQuery,
} from '../store/apiServices'
import { LATEST_SONGS_LENGTH } from '../utils/constants'

const Homepage = () => {
  const [triggerLatestSongs, latestSongs] = useLazyGetLatestSongsQuery()
  const { data: accessToken } = useGetAccessTokenQuery()

  useEffect(() => {
    if (accessToken) {
      triggerLatestSongs()
    }
  }, [accessToken])

  return (
    <>
      <div>
        <NewReleaseBanner accessToken={accessToken} />
      </div>
      <History lastSongs={latestSongs.data?.slice(0, LATEST_SONGS_LENGTH)} />
    </>
  )
}

export default Homepage
