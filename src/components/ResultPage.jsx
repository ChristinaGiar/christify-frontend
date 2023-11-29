import PropTypes from 'prop-types';
import classes from "./ResultPage.module.scss";

const ResultPage = (props) => {
    const isActive = props.page.active ? classes.active : "";
    const isShown = props.page.shown ? classes.shown : "";
  return (
    <span className={`${classes.pageNumber} ${isActive} ${isShown}`} onClick={props.clickHandler}> {+props.pageNumber + 1} </span>
  )
}

ResultPage.propTypes = {
    page: PropTypes.object,
    clickHandler: PropTypes.func,
    pageNumber: PropTypes.number,
  }

export default ResultPage