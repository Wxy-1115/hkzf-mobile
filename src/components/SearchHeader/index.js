import React from 'react'
import {Flex} from 'antd-mobile';

import { withRouter } from 'react-router-dom'
import PropTypes from 'prop-types';

import './index.scss';

function SearchHeader({ history, cityName, className}) {
  return (
    // {/* 顶部搜索框 */ }
    < Flex className={["search-box", className || ''].join(' ')}>
      <Flex className="search">
        {/* 位置 */}
        <div className="location" onClick={() => { history.push('/citylist') }}>
          <span className="name">{cityName}</span>
          <i className="iconfont icon-arrow"></i>
        </div>
        {/* 搜索表单 */}
        <div className="form" onClick={() => { history.push('/search') }}>
          <i className="iconfont icon-seach"></i>
          <span className="text">请输入小区或地址</span>
        </div>
      </Flex>
      <i className="iconfont icon-map" onClick={() => { history.push('/map') }}></i>
    </Flex>
  )
}
SearchHeader.propTypes = {
  cityName: PropTypes.string.isRequired
}

export default withRouter(SearchHeader)