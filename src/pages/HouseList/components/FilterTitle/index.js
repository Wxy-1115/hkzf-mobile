import React from 'react'

import { Flex } from 'antd-mobile';


import style from './index.module.css'

const titles = [{
  type: 'area',
  title: '区域'
}, {
  type: 'mode',
  title: '方式'
}, {
  type: 'price',
  title: '租金'
}, {
  type: 'more',
  title: '筛选'
}]

export default function FilterTitle({ titleSelectedStatus, onClick}) {

  function renderTitle(){
    return titles.map(item => (
      <div className={[style.title, titleSelectedStatus[item.type] ? style.active : ''].join(' ')} key={item.type} onClick={() => onClick(item.type)}>
        {item.title}
        <i className='iconfont icon-arrow'></i>
      </div>
    ))
  }
  return (
    <Flex className={style.content} justify='around' align='center'>
      {renderTitle()}
    </Flex>
  )
}