import styles from './NoResults.module.scss'
import SentimentDissatisfiedRoundedIcon from '@mui/icons-material/SentimentDissatisfiedRounded'
import PropTypes from 'prop-types'

const NoResults = ({ query }) => {
  return (
    <div className={styles.noResults}>
      <SentimentDissatisfiedRoundedIcon sx={{ fontSize: '7rem' }} />
      <h5 className={styles.noResults__title}>
        No results found for &quot;{query}&quot;
      </h5>
      <p className={styles.noResults__text}>Please check your search again.</p>
    </div>
  )
}

NoResults.propTypes = {
  query: PropTypes.string,
}

export default NoResults
