import React from 'react'
import propTypes from 'prop-types';

import { NavBar } from 'antd-mobile';

import {withRouter} from 'react-router-dom';
// import './index.scss';
import styles from './index.module.css';


function NavHeader({ children, history, onLeftClick, className, rightContent}) {
  const defalutClick = () => history.go(-1)
  return(
    <NavBar
      className={[styles.navBar, className || ''].join(' ')}
      mode="light"
      icon={<i className='iconfont icon-back' />}
      onLeftClick={onLeftClick || defalutClick}
      rightContent={rightContent}
    >{children}</NavBar>
  )
}
NavHeader.propTypes = {
  children: propTypes.string.isRequired,
  onLeftClick: propTypes.func,
  className: propTypes.string,
  rightContent: propTypes.array
}
export default withRouter(NavHeader)
