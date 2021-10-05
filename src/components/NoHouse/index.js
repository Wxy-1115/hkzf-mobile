import React from 'react'
import PropTypes from 'prop-types';

import { BASE_URL } from '../../utils/url';
import styles from './index.module.css';

export const NoHouse = (props) => {
  return(
    <div className={styles.root}>
      <img className={styles.img} src={`${BASE_URL}/img/not-found.png`} alt="暂无数据" />
      <p className={styles.msg}>
        {props.children}
      </p>
    </div>
  )
}

NoHouse.propTypes = {
  children: PropTypes.node.isRequired
}

export default NoHouse