import SearchResults from '../SearchResults/SearchResults'
import PropTypes from 'prop-types'

const SearchAlbums = ({ query, resultsFound }) => {
  const areResultsFound = (data) => resultsFound(data)

  return (
    <SearchResults
      query={query}
      title='Albums'
      type='albums'
      areResultsFound={areResultsFound}
    />
  )
}

SearchAlbums.propTypes = {
  query: PropTypes.string,
  resultsFound: PropTypes.func,
}

export default SearchAlbums
