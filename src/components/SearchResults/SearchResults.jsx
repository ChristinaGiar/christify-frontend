import { useState } from 'react'
import ResultPageNumber from '../ResultPageNumber/ResultPageNumber'
import PropTypes from 'prop-types'
import styles from './SearchResults.module.scss'
import { useEffect } from 'react'
import Track from '../Track/Track'
import Album from '../Album/Album'
import { Grid, Skeleton } from '@mui/material'
import { RESULTS_LENGTH, CLICKABLE_PAGES_NUMBER } from '../../utils/constants'
import ArrowBackIosNewRoundedIcon from '@mui/icons-material/ArrowBackIosNewRounded'
import ArrowForwardIosRoundedIcon from '@mui/icons-material/ArrowForwardIosRounded'
import {
  useLazyGetAlbumResultsQuery,
  useLazyGetSongResultsQuery,
} from '../../store/apiServices'

const SearchResults = ({ query, title, type, areResultsFound }) => {
  const [results, setResults] = useState([])
  const [pagination, setPagination] = useState([]) // pages' offset. Structure: {pageOffset: 0, active: true, shown: false}
  const [activeOffset, setActiveOffset] = useState(-1)
  const [triggerSongResults, songResults] = useLazyGetSongResultsQuery()
  const [triggerAlbumResults, albumResults] = useLazyGetAlbumResultsQuery()

  useEffect(() => {
    const typingTimer = setTimeout(() => {
      if (query.length >= 3) {
        setActiveOffset(-1)
        // searchInit(query)
        initSearchMethod(query)
      } else {
        setResults([])
      }
    }, 500)
    return () => clearTimeout(typingTimer)
  }, [query])

  /* 
  useEffect(() => {
     if (activeOffset !== -1) {
      setPagination((prevPagination) =>
        prevPagination.map((offset, pageNumber) => {
          // activeOffset / RESULTS_LENGTH <= pageNumber &&
          //   activeOffset / RESULTS_LENGTH + CLICKABLE_PAGES_NUMBER > pageNumber
          if (
            activeOffset <= offset &&
            activeOffset + CLICKABLE_PAGES_NUMBER * RESULTS_LENGTH > offset
          ) {
            return { ...offset, shown: true }
          }
          return { ...offset, shown: false }
        })
      )
    } 
  }, [activeOffset, query]) */

  useEffect(() => {
    if (songResults.isSuccess || albumResults.isSuccess) {
      const { total, offset, ...output } = songResults.data || albumResults.data
      setResults(() => {
        return output.foundAlbums || output.foundTracks
      })
      setActiveOffset(+offset)
      setPagination(() => {
        // add all page offsets for all pages
        let pages = []
        const totalPages = Math.ceil(total / RESULTS_LENGTH)
        for (let page = 0; page < totalPages; page++) {
          const newOffset = page * RESULTS_LENGTH
          let active = false,
            shown = false
          if (newOffset === +offset) {
            active = true
          }
          if (
            offset <= newOffset &&
            offset / RESULTS_LENGTH + CLICKABLE_PAGES_NUMBER >
              newOffset / RESULTS_LENGTH
          ) {
            shown = true
          }
          pages.push({ pageOffset: newOffset, active, shown })
        }
        return pages
      })
    }
  }, [songResults, albumResults])

  useEffect(() => {
    const typingTimer = setTimeout(() => {
      if (query.length >= 3) {
        if (results.length > 0) {
          areResultsFound({ type: type, found: true })
        } else if (
          results.length === 0 &&
          query.length >= 3 &&
          activeOffset !== -1 // check AFTER the search service is completed
        ) {
          areResultsFound({ type: type, found: false })
        }
      }
      console.log(query)
    }, 500)
    return () => clearTimeout(typingTimer)
  }, [results]) //, query

  const initSearchMethod = (value, offset = 0) => {
    switch (type) {
      case 'albums':
        triggerAlbumResults({
          value,
          offset,
          resultsLimit: RESULTS_LENGTH,
        })
        break
      case 'tracks':
        triggerSongResults({
          value,
          offset,
          resultsLimit: RESULTS_LENGTH,
        })
        break

      default:
        return null
    }
  }

  /*   
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

   const getSearchResult = () => {
    switch (type) {
      case 'albums':
        return albumResults
      case 'tracks':
        return songResults
      default:
        return null
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
 */

  const changePageHandler = (offset) => {
    // searchInit(query, offset)
    initSearchMethod(query, offset)
  }

  const nextHandler = () => {
    if (pagination.length > activeOffset / RESULTS_LENGTH + 1) {
      // searchInit(query, activeOffset + RESULTS_LENGTH)
      initSearchMethod(query, activeOffset + RESULTS_LENGTH)
    }
  }

  const previousHandler = () => {
    if (activeOffset / RESULTS_LENGTH - 1 >= 0) {
      // searchInit(query, activeOffset - RESULTS_LENGTH)
      initSearchMethod(query, activeOffset - RESULTS_LENGTH)
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
            {albumResults.isFetching
              ? [...Array(8)].map((_, index) => (
                  // Skeleton
                  <Grid item xs={6} md={3} key={index}>
                    <div className={styles.albumSkeleton}>
                      <Skeleton
                        className={styles.albumSkeleton__image}
                        variant='rectangular'
                        sx={{
                          bgcolor: 'grey.900',
                        }}
                      />
                      <div className={styles.albumSkeleton__texts}>
                        <Skeleton
                          className={styles.albumSkeleton__text}
                          variant='text'
                          sx={{
                            fontSize: '1rem',
                            bgcolor: 'grey.900',
                            display: 'inline-block',
                          }}
                        />
                        <Skeleton
                          className={styles.albumSkeleton__text}
                          variant='text'
                          sx={{
                            fontSize: '.9rem',
                            bgcolor: 'grey.900',
                            display: 'inline-block',
                          }}
                        />
                      </div>
                    </div>
                  </Grid>
                ))
              : albumResults.isSuccess &&
                albumResults.data.foundAlbums.length > 0 &&
                results.map((item) => (
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
            {songResults.isSuccess &&
            songResults.data.foundTracks.length > 0 ? (
              <>
                {songResults.data.foundTracks.map((item, index) => (
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
            ) : (
              [...Array(8)].map((_, index) => (
                // Skeleton
                <div key={index} className={styles.songSkeleton}>
                  <div className={styles.songSkeleton__texts}>
                    <Skeleton
                      className={styles.songSkeleton__text}
                      variant='text'
                      sx={{
                        fontSize: '1.2rem',
                        bgcolor: 'grey.900',
                        display: 'inline-block',
                      }}
                    />
                    <Skeleton
                      className={styles.songSkeleton__text}
                      variant='text'
                      sx={{
                        fontSize: '.9rem',
                        bgcolor: 'grey.900',
                        display: 'inline-block',
                      }}
                    />
                  </div>
                </div>
              ))
            )}
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
        {(songResults.isSuccess || albumResults.isSuccess) &&
          pagination.length > 1 && (
            <div className={styles.pagination}>
              <button
                className={styles.pagination__button}
                onClick={previousHandler}
              >
                <ArrowBackIosNewRoundedIcon sx={{ fontSize: '.8rem' }} />
              </button>
              <div className={styles.pagination__pages}>
                {pagination.map((page) => {
                  return (
                    <ResultPageNumber
                      key={page.pageOffset / RESULTS_LENGTH}
                      pageNumber={page.pageOffset / RESULTS_LENGTH}
                      page={page}
                      clickHandler={() => changePageHandler(page.pageOffset)}
                    />
                  )
                })}
              </div>
              <button
                className={styles.pagination__button}
                onClick={nextHandler}
              >
                <ArrowForwardIosRoundedIcon sx={{ fontSize: '.8rem' }} />
              </button>
            </div>
          )}
      </>
    )
  }

  return <>{query.length >= 3 && resultsFound()}</>
}

SearchResults.propTypes = {
  title: PropTypes.string,
  query: PropTypes.string,
  type: PropTypes.string,
  areResultsFound: PropTypes.func,
}
export default SearchResults
