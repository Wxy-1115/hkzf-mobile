import { Flex } from 'antd-mobile';
import React from 'react'

import style from './index.module.css';

export const FilterFooter = ({
  onCancel,
  onOk,
  className,
  cancelText = '取消',
  okText = '确定'
}) => {
  return(
    <div className={[style.selectBar, className].join(' ')}>
      <Flex>
        <span className={style.off} onClick={onCancel}>{cancelText}</span>
        <span className={style.define} onClick={onOk}>{okText}</span>
      </Flex>
    </div>
  )
}

export default FilterFooter