import React from 'react'
import {  Toast } from 'antd-mobile';
import { List, AutoSizer } from 'react-virtualized';

import { getCurrentCity } from '../../utils';
import NavHeader from '../../components/NavHeader';

import './index.scss'
import axios from 'axios';

const HOUSE_CITY = ['北京','上海','广州','深圳']
// 格式化城市数据函数
const formatCityData = (list) => {
  const cityList = {}

  list.forEach(item => {
    const first = item.short.substr(0, 1)
    if (cityList[first] !== undefined) {
      cityList[first].push(item)
    } else {
      cityList[first] = [item]
    }
  })
  const cityIndex = Object.keys(cityList).sort()
  return {
    cityList, cityIndex
  }
}
// 处理字母索引
const formatCityIndex = (letter) => {
  switch (letter) {
    case '#':
      return '当前定位'
    case 'hot':
      return '热门城市'
    default:
      return letter.toUpperCase()
  }
}

class CityList extends React.Component {
  constructor(props){
    super(props)
    this.state = {
      cityList: {},
      cityIndex: [],
      activeIndex: 0
    }
    // 创建ref对象
    this.cityListComponent = React.createRef()
  }
  
  async getCityList() {
    const res = await axios.get('http://'+window.location.hostname+':8080/area/city', {
      params: {
        level: 1
      }
    })
    const { cityList, cityIndex } = formatCityData(res.data.body)
    const hotCity = await axios.get('http://'+window.location.hostname+':8080/area/hot')
    cityList['hot'] = hotCity.data.body
    cityIndex.unshift('hot')
    // console.log(cityList, cityIndex);
    const curCity = await getCurrentCity()
    // console.log(curCity);
    cityList['#'] = new Array(curCity)
    // console.log(cityList);
    cityIndex.unshift('#')
    this.setState({
      cityList,
      cityIndex
    })
  }
  async componentDidMount() {
    await this.getCityList()
    this.cityListComponent.current.measureAllRows()
  }
  changeCity = ({ label, value })=>{
    // console.log(curCity);
    if(HOUSE_CITY.indexOf(label) > -1){
      localStorage.setItem('hkzf_city', JSON.stringify({ label, value }))
      this.props.history.go(-1)
    }else{
      Toast.info('暂无该城市房源信息', 1, null, false);
    }
  }
  rowRenderer = ({
    key, // Unique key within array of rows
    index, // 索引
    isScrolling, // 当前项是否在滚动
    isVisible, // 当前项在list中是可见的
    style, // Style object to be applied to row (to position it)
  }) => {
    const { cityIndex, cityList } = this.state
    const letter = cityIndex[index]
    return (
      <div key={key} style={style} className='city'>
        <div className="title">{formatCityIndex(letter)}</div>
        {
          cityList[letter].map(item => <div className="name" key={item.value} onClick={()=>{this.changeCity(item)}}>{item.label}</div>)
        }
      </div>
    );
  }
  handleClick = (index) => {
    this.cityListComponent.current.scrollToRow(index)
  }
  renderCityIndex() {
    return this.state.cityIndex.map((item, index) => {
      item === 'hot' ? item = '热' : item = item.toUpperCase()
      // console.log(item);
      return <li className="city-index-item" key={item} onClick={()=>{this.handleClick(index)}}>
        <span className={this.state.activeIndex === index ? "index-active": ''}>{item}</span>
      </li>
    })
  }
  onRowsRendered = ({ startIndex }) => {
    // console.log(startIndex);
    if(this.state.activeIndex !== startIndex){
      this.setState({
        activeIndex: startIndex
      })
    }
  }
  render() {
    return (
      <div className='city-list'>
        {/* 顶部导航栏 */}
        <NavHeader>城市选择</NavHeader>
        {/* 城市列表 */}
        <AutoSizer>
          {({ height, width }) => (
            <List
              ref={this.cityListComponent}
              width={width}
              height={height}
              rowCount={this.state.cityIndex.length}
              rowHeight={({ index }) => {
                const length = this.state.cityList[this.state.cityIndex[index]].length
                return (50 * length + 36)
              }}
              rowRenderer={this.rowRenderer}
              onRowsRendered={this.onRowsRendered}
              scrollToAlignment={'start'}
            />
          )}
        </AutoSizer>
        {/* 右侧城市索引列表 */}
        <ul className="city-index">
          {this.renderCityIndex()}
        </ul>
      </div>
    )
  }

}

export default CityList