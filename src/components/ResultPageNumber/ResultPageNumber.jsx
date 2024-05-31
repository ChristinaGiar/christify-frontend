import PropTypes from 'prop-types'
import classes from './ResultPageNumber.module.scss'

const ResultPageNumber = (props) => {
  const isActive = props.page.active ? classes.active : ''
  const isShown = props.page.shown ? classes.shown : ''
  return (
    <span
      className={`${classes.pageNumber} ${isActive} ${isShown}`}
      onClick={props.clickHandler}
    >
      {' '}
      {+props.pageNumber + 1}{' '}
    </span>
  )
}

ResultPageNumber.propTypes = {
  page: PropTypes.object,
  clickHandler: PropTypes.func,
  pageNumber: PropTypes.number,
}

export default ResultPageNumber
