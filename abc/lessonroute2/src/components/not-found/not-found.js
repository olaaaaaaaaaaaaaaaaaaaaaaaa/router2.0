import React from 'react'
import styles from './not-found.module.css'
import { Link } from 'react-router-dom'

const NotFound = () => {
  return (
    <div className={styles.notfound}>
      <h3>404</h3>
      <Link to="/">Вернуться на главную</Link>

    </div>
  )
}

export default NotFound
