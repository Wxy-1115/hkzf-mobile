import React from 'react'
import { Flex } from 'antd-mobile';
import PropTypes from 'prop-types';

import { BASE_URL } from '../../utils/url'
import styles from './index.module.css';


export const HouseItem = ({ houseImg, title, desc, tags, price, onclick, style }) => {
  return (
    <Flex className={styles.content} align='start' onClick={onclick} style={style}>
      <img src={BASE_URL + houseImg} alt="" className={styles.image} />
      <Flex className={styles.houseInfo} direction='column' align='start'>
        <h3 className={styles.houseTitle}>{title}</h3>
        <span className={styles.desc}>{desc}</span>
        <div className={styles.tags}>
          {
            tags.map((tag, index) => (
              <span className={[styles.tag, styles.tag1].join(' ')} key={index}>{tag}</span>
            ))
          }
        </div>
        <span className={styles.price}>
          {price}
          <span className={styles.month}>元/月</span>
        </span>
      </Flex>
    </Flex>
  )
}

HouseItem.propTypes = {
  houseImg: PropTypes.string,
  title: PropTypes.string,
  desc: PropTypes.string,
  tags: PropTypes.array.isRequired,
  price: PropTypes.number,
  onclick: PropTypes.func
}

export default HouseItem