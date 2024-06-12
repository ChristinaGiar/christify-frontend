import PropTypes from 'prop-types'

import styles from './ResultPageNumber.module.scss'

const ResultPageNumber = (props) => {
  const isActive = props.page.active ? styles.active : ''
  const isShown = props.page.shown ? styles.shown : ''

  return (
    <div
      className={`${styles.pageNumber} ${isActive} ${isShown}`}
      onClick={props.clickHandler}
    >
      {' '}
      {+props.pageNumber + 1}{' '}
    </div>
  )
}

ResultPageNumber.propTypes = {
  page: PropTypes.object,
  clickHandler: PropTypes.func,
  pageNumber: PropTypes.number,
}

export default ResultPageNumber
