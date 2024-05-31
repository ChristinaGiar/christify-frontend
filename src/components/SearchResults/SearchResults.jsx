import { useState } from 'react'
import ResultPageNumber from '../ResultPageNumber/ResultPageNumber'
import PropTypes from 'prop-types'
import classes from './SearchResults.module.scss'
import { useEffect } from 'react'
import Track from '../Track/Track'
import Album from '../Album/Album'

const SearchResults = ({ query, title, type }) => {
  const [results, setResults] = useState([])
  const [pagination, setPagination] = useState([0]) // offset
  const [activeOffset, setActiveOffset] = useState(-1)

  useEffect(() => {
    const typingTimer = setTimeout(() => {
      if (query.length >= 3) {
        setActiveOffset(-1)
        searchInit(query)
      } else {
        setResults([])
      }
    }, 500)
    return () => clearTimeout(typingTimer)
  }, [query]) //inputRef.current?.value

  useEffect(() => {
    if (activeOffset !== -1) {
      setPagination((prevPagination) =>
        prevPagination.map((offset, pageNumber) => {
          if (
            activeOffset / 10 <= pageNumber &&
            activeOffset / 10 + 5 > pageNumber
          ) {
            return { ...offset, shown: true }
          }
          return { ...offset, shown: false }
        })
      )
    }
  }, [activeOffset, query])

  const getUrlPath = () => {
    switch (type) {
      case 'albums':
        return 'searchAlbums'
      case 'tracks':
        return 'searchTracks'
      default:
        return ''
    }
  }

  const searchInit = async (value, offset = 0) => {
    const urlPath = getUrlPath()
    const searchOutput = await fetch(
      `http://localhost:3000/${urlPath}?q=${value}&offset=${offset}&limit=10`,
      {
        method: 'GET',
        headers: { 'Content-Type': 'application/json' },
      }
    )
    const { total, ...output } = await searchOutput.json()
    setResults(() => {
      return output.foundAlbums || output.foundTracks
    })
    setActiveOffset(offset)

    setPagination(() => {
      let pages = []
      const totalPages = Math.ceil(total / 10)
      for (let page = 0; page < totalPages; page++) {
        const newOffset = page * 10
        let active = false

        if (newOffset === offset) {
          active = true
        }
        pages.push({ pageOffset: newOffset, active })
      }
      return pages
    })
  }

  const changePageHandler = (offset) => {
    searchInit(query, offset)
  }

  const nextHandler = () => {
    if (pagination.length > activeOffset / 10 + 1) {
      searchInit(query, activeOffset + 10)
    }
  }

  const previousHandler = () => {
    if (activeOffset / 10 - 1 >= 0) {
      searchInit(query, activeOffset - 10)
    }
  }
  const searchItems = () => {
    switch (type) {
      case 'albums':
        return results.map((item) => (
          <Album
            key={item.albumID}
            name={item.name}
            albumID={item.albumID}
            artists={item.artists}
            image={item.image?.url}
            type='album'
          />
        ))
      case 'tracks':
        return results.map((item) => (
          <Track
            key={item.trackID}
            name={item.name}
            trackID={item.trackID}
            artists={item.artists}
            image={item.image?.url}
            song={item.song}
            album={item.album}
            type='track'
          />
        ))
      default:
        return ''
    }
  }

  const resultsFound = () => {
    return (
      <>
        <h3>{title}</h3>
        {searchItems()}
        <button className='' onClick={previousHandler}>
          &larr;
        </button>
        <div className={classes.pagination}>
          {pagination.map((page, index) => {
            return (
              <ResultPageNumber
                key={index}
                pageNumber={index}
                page={page}
                clickHandler={() => changePageHandler(page.pageOffset)}
              />
            )
          })}
        </div>
        <button className='' onClick={nextHandler}>
          &rarr;
        </button>
      </>
    )
  }

  const resultsNotFound = () => {
    return (
      <h3>
        No results found for &quot;{query}&quot; Please check your search again.{' '}
      </h3>
    )
  }

  return (
    <>
      <div className='classes.searchBox'></div>
      {results.length > 0 && resultsFound()}
      {results.length === 0 &&
        query.length > 5 &&
        activeOffset !== -1 &&
        resultsNotFound()}
    </>
  )
}

SearchResults.propTypes = {
  title: PropTypes.string,
  query: PropTypes.string,
  type: PropTypes.string,
}
export default SearchResults
