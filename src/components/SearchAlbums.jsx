import SearchResults from './SearchResults'
import PropTypes from 'prop-types'

const SearchAlbums = ({ query }) => {
  return (
    <>
      <div>SearchAlbums</div>
      <SearchResults query={query} title='Albums' type='albums' />
    </>
  )
}

SearchAlbums.propTypes = {
  query: PropTypes.string,
}

export default SearchAlbums
