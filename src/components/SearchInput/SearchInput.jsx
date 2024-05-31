import { useState } from 'react'
import SearchAlbums from '../SearchAlbums/SearchAlbums'
import SearchTracks from '../SearchTracks/SearchTracks'

const SearchInput = () => {
  const [query, setQuery] = useState('')

  const inputHandler = (e) => {
    setQuery(e.target.value)
  }
  return (
    <>
      <input
        type='text'
        value={query}
        onChange={(event) => inputHandler(event)}
      />
      <SearchAlbums query={query} />
      <SearchTracks query={query} />
    </>
  )
}

export default SearchInput
