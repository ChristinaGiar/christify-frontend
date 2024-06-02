import { useState } from 'react'
import ResultPageNumber from '../ResultPageNumber/ResultPageNumber'
import PropTypes from 'prop-types'
import styles from './SearchResults.module.scss'
import { useEffect } from 'react'
import Track from '../Track/Track'
import Album from '../Album/Album'
import { Grid } from '@mui/material'
import { RESULTS_LENGTH, CLICKABLE_PAGES_NUMBER } from '../../utils/constants'
import ArrowBackIosNewRoundedIcon from '@mui/icons-material/ArrowBackIosNewRounded'
import ArrowForwardIosRoundedIcon from '@mui/icons-material/ArrowForwardIosRounded'

const SearchResults = ({ query, title, type, areResultsFound }) => {
  const [results, setResults] = useState([])
  const [pagination, setPagination] = useState([0]) // offset
  const [activeOffset, setActiveOffset] = useState(-1)

  useEffect(() => {
    const typingTimer = setTimeout(() => {
      if (results.length > 0) {
        areResultsFound({ type: type, found: true })
      } else if (
        results.length === 0 &&
        query.length >= 3 &&
        activeOffset !== -1
      ) {
        areResultsFound({ type: type, found: false })
      }
    }, 500)
    return () => clearTimeout(typingTimer)
  }, [results, query])

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
  }, [query])

  useEffect(() => {
    if (activeOffset !== -1) {
      setPagination((prevPagination) =>
        prevPagination.map((offset, pageNumber) => {
          if (
            activeOffset / RESULTS_LENGTH <= pageNumber &&
            activeOffset / RESULTS_LENGTH + CLICKABLE_PAGES_NUMBER > pageNumber
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
      `http://localhost:3000/${urlPath}?q=${value}&offset=${offset}&limit=${RESULTS_LENGTH}`,
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
      const totalPages = Math.ceil(total / RESULTS_LENGTH)
      for (let page = 0; page < totalPages; page++) {
        const newOffset = page * RESULTS_LENGTH
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
    if (pagination.length > activeOffset / RESULTS_LENGTH + 1) {
      searchInit(query, activeOffset + RESULTS_LENGTH)
    }
  }

  const previousHandler = () => {
    if (activeOffset / RESULTS_LENGTH - 1 >= 0) {
      searchInit(query, activeOffset - RESULTS_LENGTH)
    }
  }

  const searchItems = () => {
    switch (type) {
      case 'albums':
        return (
          <Grid
            container
            rowSpacing={{ xs: 1 }}
            columnSpacing={{ xs: 1, sm: 0.5 }}
          >
            {results.map((item) => (
              <Grid item xs={6} md={3} key={item.albumID}>
                <Album
                  name={item.name}
                  albumID={item.albumID}
                  artists={item.artists}
                  image={item.image?.url}
                  type='album'
                />
              </Grid>
            ))}
          </Grid>
        )

      case 'tracks':
        return (
          <>
            <div className={styles.tableTitles}>
              <h5 className={styles.tableTitle__number}>#</h5>
              <h5 className={styles.tableTitle__title}>Title</h5>
              <h5 className={styles.tableTitle__album}>Album</h5>
              <h5 className={styles.tableTitle__details}></h5>
            </div>
            {results.map((item, index) => (
              <Track
                key={item.trackID}
                name={item.name}
                trackID={item.trackID}
                artists={item.artists}
                image={item.image?.url}
                song={item.song}
                album={item.album}
                number={+activeOffset + index + 1}
                type='track'
              />
            ))}
          </>
        )
      default:
        return ''
    }
  }

  const resultsFound = () => {
    return (
      <>
        <h3 className='categoryTitle'>{title}</h3>
        {searchItems()}
        <div className={styles.pagination}>
          <button
            className={styles.pagination__button}
            onClick={previousHandler}
          >
            <ArrowBackIosNewRoundedIcon sx={{ fontSize: '.8rem' }} />
          </button>
          <div>
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
          <button className={styles.pagination__button} onClick={nextHandler}>
            <ArrowForwardIosRoundedIcon sx={{ fontSize: '.8rem' }} />
          </button>
        </div>
      </>
    )
  }

  return <>{results.length > 0 && resultsFound()}</>
}

SearchResults.propTypes = {
  title: PropTypes.string,
  query: PropTypes.string,
  type: PropTypes.string,
  areResultsFound: PropTypes.func,
}
export default SearchResults
