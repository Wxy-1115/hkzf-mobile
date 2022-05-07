import React from 'react'

import { Flex, Toast } from 'antd-mobile';
import { List, AutoSizer, WindowScroller, InfiniteLoader } from 'react-virtualized';

import Filter from './components/Filter';
import HouseItem from '../../components/HouseItem';
import Sticky from '../../components/Sticky';
import NoHouse from '../../components/NoHouse';
import SearchHeader from '../../components/SearchHeader';

import { API } from '../../utils/api';
import { getCurrentCity } from '../../utils/index';

import styles from './index.module.css';


class HouesList extends React.Component {
  state = {
    // 房屋列表数据
    list: [],
    count: 0,
    isLoading: false
  }
  filters = {}

  cityName = ''
  cityId = ''
  async componentDidMount() {
    if(this.props.location.state){
      var {id} = this.props.location.state
    }
    // 获取当前城市信息
    const { label, value } = await getCurrentCity()
    this.cityName = label
    this.cityId = id ? id : value
    // 渲染房屋列表
    this.searchHouseList()

  }
  // 房屋列表数据
  async searchHouseList() {
    this.setState({
      isLoading: true
    })
    // 加载中
    Toast.loading('加载中...', 0, null, false)
    try {
      const { data: { body: { list, count } } } = await API.get(`/houses`, {
        params: {
          cityId: this.cityId,
          ...this.filters,
          start: 1,
          end: 20
        }
      })
      // 关闭加载中
      Toast.hide()
      if (count !== 0) {
        // 弹窗提示查询到的房源数
        Toast.info(`共找到${count}套房源`, 2, null, false)
      }
      // console.log(list, count);
      // 更新数据
      this.setState({
        list,
        count,
        isLoading: false
      })
    } catch (error) {
      // 关闭加载中
      Toast.hide()
    }
  }
  // 获取子组件传递过来的filters数据
  onFilter = (filters) => {
    //返回页面顶部

    window.scrollTo(0, 0)

    this.filters = filters
    // console.log('houseList', filters);
    this.searchHouseList()
  }
  renderHouseItem = ({ key, index, style, }) => {
    const { list } = this.state
    const house = list[index]
    // console.log(house);
    if (!house) {
      return (
        <div key={key} style={style}>
          <div className={styles.loading}>
            <p className={styles.loadingText}></p>
          </div>
        </div>
      )
    }
    return (
      <HouseItem
        key={key}
        style={style}
        houseImg={house.houseImg}
        title={house.title}
        desc={house.desc}
        tags={house.tags}
        price={house.price}
        onclick={() => {
          this.props.history.push(`/detail/${house.houseCode}`)
        }}
      />
    )
  }
  isRowLoaded = ({ index }) => {
    return !!this.state.list[index]
  }
  loadMoreRows = ({ startIndex, stopIndex }) => {
    // console.log(startIndex, stopIndex);
    const { list } = this.state
    return new Promise(async (resolve) => {
      const res = await API.get(`/houses`, {
        params: {
          cityId: this.cityId,
          ...this.filters,
          start: startIndex,
          end: stopIndex
        }
      })
      // console.log(res);
      this.setState({
        list: [...list, ...res.data.body.list]
      }, () => {
        resolve()
      })
    })
  }

  renderList = () => {
    const { count, isLoading } = this.state
    if (count === 0 && !isLoading) {
      return <NoHouse>没有找到房源，请您换个搜索条件吧</NoHouse>
    }
    return (
      <InfiniteLoader
        isRowLoaded={this.isRowLoaded}
        loadMoreRows={this.loadMoreRows}
        rowCount={count}>
        {({ onRowsRendered, registerChild }) => (
          <WindowScroller>
            {({ height, isScrolling, scrollTop }) => {
              return (
                <AutoSizer disableHeight>
                  {({ width }) => (
                    <List
                      autoHeight
                      height={height}
                      width={width}
                      isScrolling={isScrolling}
                      scrollTop={scrollTop}
                      rowCount={count}
                      rowHeight={120}
                      rowRenderer={this.renderHouseItem}
                      onRowsRendered={onRowsRendered}
                      ref={registerChild}
                    />
                  )}
                </AutoSizer>
              )
            }}
          </WindowScroller>
        )}
      </InfiniteLoader>
    )
  }
  render() {
    return (
      <div className={styles.houseList}>
        {/* 顶部搜索框 */}
        <Flex className={styles.header}>
          <i className="iconfont icon-back" onClick={() => this.props.history.go(-1)}></i>
          <SearchHeader cityName={this.cityName} className={styles.navBar} />
        </Flex>
        {/* 条件筛选 */}
        <Sticky height={40}>
          <Filter onFilter={this.onFilter} />
        </Sticky>

        {/* 房屋列表 */}
        <div className={styles.HouseList}>
          {this.renderList()}
        </div>
      </div>
    )
  }

}

export default HouesList