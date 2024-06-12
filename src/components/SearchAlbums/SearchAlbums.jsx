import PropTypes from 'prop-types'

import SearchResults from '../SearchResults/SearchResults'

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
