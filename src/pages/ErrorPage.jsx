import { Link } from 'react-router-dom'

import styles from './Pages.module.scss'

const ErrorPage = () => {
  return (
    <>
      <div className={styles.error}>
        <h1 className={styles.error__number}>404</h1>
        <h3 className={styles.error__text}>
          Oops...! It seems that the requested page doesn&#39;t exist.
        </h3>
        <Link to='/'>
          <button className={styles.error__button}>Back to Home</button>
        </Link>
      </div>
    </>
  )
}

export default ErrorPage
