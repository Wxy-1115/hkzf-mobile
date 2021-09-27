import React, { Component }from 'react'

import styles from './index.module.css';

// 所有房屋配置项
const HOUSE_PACKAGE = [
  {
    id: 1,
    name: '衣柜',
    icon: 'icon-wardrobe'
  },
  {
    id: 2,
    name: '洗衣机',
    icon: 'icon-wash'
  },
  {
    id: 3,
    name: '空调',
    icon: 'icon-air'
  },
  {
    id: 4,
    name: '天然气',
    icon: 'icon-gas'
  },
  {
    id: 5,
    name: '冰箱',
    icon: 'icon-ref'
  },
  {
    id: 6,
    name: '暖气',
    icon: 'icon-Heat'
  },
  {
    id: 7,
    name: '电视',
    icon: 'icon-vid'
  },
  {
    id: 8,
    name: '热水器',
    icon: 'icon-heater'
  },
  {
    id: 9,
    name: '宽带',
    icon: 'icon-broadband'
  },
  {
    id: 10,
    name: '沙发',
    icon: 'icon-sofa'
  },
]

class HousePackage extends Component {

  state = {
    selectedNames: []
  }
  // 根据id切换选中状态
  toggleSelect = name => {
    const { selectedNames} = this.state
    let newSelectedNames
    if (selectedNames.indexOf(name) > -1) {
      // 选中: 从数组中删除选中项，也就是保留未选中项
      newSelectedNames = selectedNames.filter(item => item !== name)
    } else {
      newSelectedNames = [...selectedNames, name]
    }

    this.props.onSelect(newSelectedNames)

    this.setState({
      selectedNames: newSelectedNames
    })
  }

  // 渲染列表项
  renderItems() {
    
    return HOUSE_PACKAGE.map(item => {
      if(this.props.list.indexOf(item.name) === -1) return null
      return(
        <li key={item.id} className={styles.item}>
          <i className={[styles.icon, item.icon, 'iconfont'].join(' ')}></i>
          <p>{item.name}</p>
        </li>)
    }
      
      )
  }
  render() {
    return <ul className={styles.root}>{this.renderItems()}</ul>
  }
}

export default HousePackage