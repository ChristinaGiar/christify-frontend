import { useState } from 'react';
import SearchAlbums from './SearchAlbums';
import SearchTracks from './SearchTracks';

const SearchInput = () => {
  const [query, setQuery] = useState("")

  const inputHandler = (e) => {
    setQuery(e.target.value)
    // if (inputRef.current.value.length >= 3) {
    //   setActiveOffset(() => -1);
    //   searchInit(e.target.value);
    // } else {
    //   setResults([])
    // }
  }
  return (
    <>
    <input type="text" value={query} onChange={event => inputHandler(event)} />
    <SearchAlbums query={query}/>
    <SearchTracks query={query}/>
    </>
  )
}

export default SearchInput