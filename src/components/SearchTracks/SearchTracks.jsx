import PropTypes from 'prop-types'

import SearchResults from '../SearchResults/SearchResults'

const SearchTracks = ({ query, resultsFound }) => {
  const areResultsFound = (data) => resultsFound(data)

  return (
    <SearchResults
      query={query}
      title='Songs'
      type='tracks'
      areResultsFound={areResultsFound}
    />
  )
}

SearchTracks.propTypes = {
  query: PropTypes.string,
  resultsFound: PropTypes.func,
}

export default SearchTracks
