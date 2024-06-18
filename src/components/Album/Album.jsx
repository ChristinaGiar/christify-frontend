import PlayCircleFilledRoundedIcon from '@mui/icons-material/PlayCircleFilledRounded'
import PropTypes from 'prop-types'
import { Link } from 'react-router-dom'

import { BASE_DIR } from '../../utils/constants'
import { artistsArrayToString } from '../../utils/functions'
import styles from './Album.module.scss'

const Album = (props) => {
  return (
    <Link to={`/${BASE_DIR}/album/${props.albumID}`}>
      <div className={styles.album}>
        <div className={styles.album__imageWrapper}>
          <img className={styles.album__image} src={props.image} />
          <PlayCircleFilledRoundedIcon
            sx={{ fontSize: '1.8rem' }}
            className={styles.album__playIcon}
          />
        </div>
        <h5 className={styles.album__title}>{props.name}</h5>
        <p className={styles.album__artists}>
          {props.artists ? artistsArrayToString(props.artists) : '-'}
        </p>
      </div>
    </Link>
  )
}

Album.propTypes = {
  name: PropTypes.string,
  albumID: PropTypes.string,
  artists: PropTypes.array,
  image: PropTypes.string,
  type: PropTypes.string,
}
export default Album
