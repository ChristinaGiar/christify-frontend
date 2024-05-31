import SearchResults from '../SearchResults/SearchResults'
import PropTypes from 'prop-types'

const SearchTracks = ({ query }) => {
  return (
    <>
      <SearchResults query={query} title='Songs' type='tracks' />
    </>
  )
}

SearchTracks.propTypes = {
  query: PropTypes.string,
}

export default SearchTracks
