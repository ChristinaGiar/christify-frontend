import { useState } from 'react'
import SearchAlbums from '../SearchAlbums/SearchAlbums'
import SearchTracks from '../SearchTracks/SearchTracks'
import { TextField } from '@mui/material'
import styles from './SearchInput.module.scss'
import SearchRoundedIcon from '@mui/icons-material/SearchRounded'
import NoResults from '../NoResults/NoResults'

const SearchInput = () => {
  const initialResultFound = {
    tracks: { found: true },
    albums: { found: true },
  }

  const [query, setQuery] = useState('')
  const [resultsFound, setResultsFound] = useState(initialResultFound)
  const inputHandler = (e) => {
    setQuery(e.target.value)
    setResultsFound(initialResultFound)
  }

  const handleResultsFound = ({ type, found }) => {
    setResultsFound((prevState) => {
      const newState = { ...prevState }
      newState[type].found = found
      return newState
    })
  }

  return (
    <div className={styles.searchWrapper}>
      <div className={styles.search}>
        <TextField
          hiddenLabel
          className={styles.search__input}
          placeholder='Which song should be played next?'
          variant='outlined'
          value={query}
          onChange={(event) => inputHandler(event)}
          aria-describedby='search-for-a-song-album'
          fullWidth
        />
        <SearchRoundedIcon className={styles.search__icon} />
      </div>
      {resultsFound['albums'].found && (
        <SearchAlbums query={query} resultsFound={handleResultsFound} />
      )}
      {resultsFound.tracks.found && (
        <SearchTracks query={query} resultsFound={handleResultsFound} />
      )}
      {!resultsFound['albums'].found && !resultsFound.tracks.found && (
        <NoResults query={query} />
      )}
    </div>
  )
}

export default SearchInput
