import React from 'react'
import { Spring, animated } from 'react-spring';

import { API } from '../../../../utils/api';

import FilterTitle from '../FilterTitle';
import FilterPicker from '../FilterPicker';
import FilterMore from '../FilterMore';
import style from './index.module.css'

const titleSelectedStatus = {
  area: false,
  mode: false,
  price: false,
  more: false
}
const selectedValues = {
  area: ['area', 'null'],
  mode: ['null'],
  price: ['null'],
  more: []
}

class Filter extends React.Component {
  state = {
    // 筛选条件选中状态
    titleSelectedStatus,
    // 筛选条件的选中值
    selectedValues,
    // 当前选中标题
    openType: '',
    // 筛选条件列表
    filtersData: {},
    value: 0
  }
  componentDidMount() {
    // 获取body
    this.htmlBody = document.body
    this.getFiltersData()
  }
  // 发送请求获取区域数据
  async getFiltersData() {
    const { value } = JSON.parse(localStorage.getItem('hkzf_city'))
    // console.log(value);
    const res = await API.get(`http://${window.location.hostname}:8080/houses/condition`, {
      params: {
        id: value
      }
    })
    this.setState({
      filtersData: res.data.body
    })
  }
  // 筛选条件点击高亮
  onTitleClick = (type) => {
    // 给body添加样式
    this.htmlBody.className = 'body-fixed'

    const { titleSelectedStatus, selectedValues } = this.state
    const newTitleSelectedStatus = { ...titleSelectedStatus }
    Object.keys(titleSelectedStatus).forEach(key => {
      if (key === type) {
        // 当前标题
        newTitleSelectedStatus[key] = true
        return
      }
      const selectVal = selectedValues[key]
      if (key === 'area' && (selectVal.length !== 2 || selectVal[0] !== 'area')) {
        // 高亮
        newTitleSelectedStatus[key] = true
      } else if (key === 'mode' && selectVal[0] !== 'null') {
        // 高亮
        newTitleSelectedStatus[key] = true
      } else if (key === 'price' && selectVal[0] !== 'null') {
        // 高亮
        newTitleSelectedStatus[key] = true
      } else if (key === 'more' && selectVal.length !== 0) {
        // more 
        newTitleSelectedStatus[key] = true
      } else {
        // 其他选项
        newTitleSelectedStatus[key] = false
      }
    })
    // console.log(newTitleSelectedStatus);
    this.setState((prevState) => {
      return {
        titleSelectedStatus: newTitleSelectedStatus,
        openType: type,
      }
    })
  }
  // 取消(隐藏对话框)
  onCancel = (type) => {
    this.htmlBody.className = ''

    // console.log(type);
    const { titleSelectedStatus, selectedValues } = this.state
    const selectVal = selectedValues[type]
    const newTitleSelectedStatus = { ...titleSelectedStatus }

    if (type === 'area' && (selectVal.length !== 2 || selectVal[0] !== 'area')) {
      // 高亮
      newTitleSelectedStatus[type] = true
    } else if (type === 'mode' && selectVal[0] !== 'null') {
      // 高亮
      newTitleSelectedStatus[type] = true
    } else if (type === 'price' && selectVal[0] !== 'null') {
      // 高亮
      newTitleSelectedStatus[type] = true
    } else if (type === 'more' && selectVal.length !== 0) {
      // more 
      newTitleSelectedStatus[type] = true
    } else {
      // 其他选项
      newTitleSelectedStatus[type] = false
    }
    this.setState({
      openType: '',
      titleSelectedStatus: newTitleSelectedStatus
    })
  }
  // 确定(隐藏对话框)
  onSave = (value, type) => {
    this.htmlBody.className = ''

    // console.log(value, type);
    const { titleSelectedStatus, selectedValues } = this.state
    const selectVal = value
    const newTitleSelectedStatus = { ...titleSelectedStatus }

    if (type === 'area' && (selectVal.length !== 2 || selectVal[0] !== 'area')) {
      // 高亮
      newTitleSelectedStatus[type] = true
    } else if (type === 'mode' && selectVal[0] !== 'null') {
      // 高亮
      newTitleSelectedStatus[type] = true
    } else if (type === 'price' && selectVal[0] !== 'null') {
      // 高亮
      newTitleSelectedStatus[type] = true
    } else if (type === 'more' && selectVal.length !== 0) {
      // more 
      newTitleSelectedStatus[type] = true
    } else {
      // 其他选项
      newTitleSelectedStatus[type] = false
    }

    const newSelectedValues = {
      ...selectedValues,
      [type]: value
    }
    const { area, mode, price, more } = newSelectedValues

    // 筛选条件的数据
    const filters = {}

    // 区域
    let areaValue = 'null'
    // console.log(area);
    const areaKey = area[0]
    if (area.length === 3) {
      areaValue = area[2] !== 'null' ? area[2] : area[1]
    }
    filters[areaKey] = areaValue

    // 方式和租金
    filters.mode = mode[0]
    filters.price = price[0]

    // 更多
    filters.more = more.join(',')
    this.props.onFilter(filters)

    this.setState((prevState) => {
      // console.log(prevState.titleSelectedStatus, newTitleSelectedStatus);
      return {
        openType: '',
        titleSelectedStatus: newTitleSelectedStatus,
        selectedValues: newSelectedValues
      }
    })

  }
  // 渲染 FilterPicker 组件的方法
  renderFilterPicker() {
    if (Object.keys(this.state.filtersData).length === 0) return
    const { openType, filtersData: { area, subway, rentType, price } } = this.state
    if (openType !== 'area' && openType !== 'mode' && openType !== 'price') {
      return null
    }
    // console.log(area, subway, rentType, price);
    // 根据 openType 拿到当前筛选条件的数据
    let data = [], cols = 3
    switch (openType) {
      case 'area':
        data = [area, subway]
        break;
      case 'mode':
        data = rentType
        cols = 1
        break;
      case 'price':
        data = price
        cols = 1
        break;
      default:
        break;
    }
    const defaultValue = this.state.selectedValues[openType]
    // console.log(defaultValue);
    return (<FilterPicker
      onCancel={this.onCancel}
      onSave={this.onSave}
      data={data}
      cols={cols}
      type={openType}
      defaultValue={defaultValue}
      key={openType}
    />)
  }

  renderFilterMore() {
    const { openType, filtersData: { roomType, oriented, floor, characteristic }, selectedValues } = this.state
    if (openType !== 'more') return null
    const data = {
      roomType, oriented, floor, characteristic
    }
    const defaultValue = selectedValues.more
    return <FilterMore
      data={data}
      type={openType}
      onSave={this.onSave}
      defaultValue={defaultValue}
      onCancel={this.onCancel}
    />
  }
  // 渲染遮罩层
  renderMask() {
    const { openType } = this.state
    const isHide = openType === 'more' || openType === ''
    return (
      <Spring from={{ opacity: 0 }} to={{ opacity: isHide ? 0 : 1 }} onChange={(x)=>{
        this.setState({
          value: x.value.opacity
        })
      }}>
        {props => {
          if(this.state.value === 0) return null
          return (
            <animated.div style={props} className={style.mask} onClick={() => this.onCancel(openType)}></animated.div>
          )
        }}
      </Spring>
    )
  }
  render() {
    const { titleSelectedStatus } = this.state
    return (
      <div className={style.root}>
        {/* 遮罩层 */}
        {
          this.renderMask()
        }
        <div className={style.content}>
          <FilterTitle titleSelectedStatus={titleSelectedStatus} onClick={this.onTitleClick} />
          {
          // 渲染 FilterPicker 组件的方法
            this.renderFilterPicker()
          }
          {/* <FilterMore/> */}
          {
            this.renderFilterMore()
          }

        </div>
      </div>
    )
  }
}

export default Filter