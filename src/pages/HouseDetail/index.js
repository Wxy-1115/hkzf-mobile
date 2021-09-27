import React, {Component} from 'react'

import { Carousel, Flex, Toast } from "antd-mobile";

import NavHeader from "../../components/NavHeader";
import HouseItem from "../../components/HouseItem";

import { BASE_URL } from '../../utils/url';

import styles from './index.module.css'
import HousePackage from '../../components/HousePackage';
import { API } from '../../utils/api';

const BMap = window.BMap
const labelStyle = {

}
class HouseDetail extends Component {
  state={
    isLoading: false,
    // 房屋信息
    houseInfo: {}
  }

  componentDidMount() {
    console.log(this.props.match.params);
    this.getHouseDetail()
    // this.renderMap('天山星城', {

    // })
  }
  async getHouseDetail() {

    // 开启loading
    this.setState({
      isLoading: true
    })
    const { id } = this.props.match.params
    const res = await API.get(`/houses/${id}`)
    // console.log(res.data.body);
    this.setState({
      houseInfo: res.data.body,
      isLoading: false
    })
  }
  // 渲染轮播图结构
  renderSwipers() {
    const { houseInfo: {houseImg}} = this.state
    if (!houseImg) return null
    return houseImg.map(item =>(
      <a 
        href="###" 
        key={item}
      >
        <img src={BASE_URL+item} alt="" />
      </a>
    ))
  }
  // 渲染地图
  renderMap(community, coord) {
    const { latitude, longitude } = coord

    const map = new BMap.Map('map')
    const point = new BMap.Point(longitude, latitude)
    map.centerAndZoom(point, 17)
    const label = new BMap.Label('', {
      position: point,
      offset: new BMap.Size(0, -36)
    })

    label.setStyle(labelStyle)
    label.setContent(`
    <span>${community}</span>
    <div className="${styles.mapArrow}"></div>
    `)
    map.addOverlay(label)
  }
  render(){
    const { isLoading, houseInfo: { community, title, tags, price, roomType, size, floor, oriented} } = this.state
    // 判断是否请求到房屋信息,没有就返回null
    if (Object.keys(this.state.houseInfo).length === 0 ) return null
    return (
      <div className={styles.root}>
        {/* 顶部导航栏 */}
        <NavHeader className={styles.nav} rightContent={[<i key="share" className="iconfont icon-share" />]}>{community}</NavHeader>
        {/* 轮播图 */}
        <div className={styles.slides}>
          {!isLoading ? (
            <Carousel autoplay infinite autoplayInterval={5000}>
              {this.renderSwipers()}
            </Carousel>
          ): ''} 
        </div>
            
        {/* 房屋基础信息 */}
        <div className={styles.info}>
          <h3 className={styles.infoTitle}>
            {title}
          </h3>
          <Flex className={styles.tags}>
            <Flex.Item>
              {
                tags.map((item, index) => (
                  <span key={item} className={[styles.tag, styles['tag' + (index%3 + 1)]].join(' ')}>
                    {item}
                  </span>
                ))
              }
            </Flex.Item>
          </Flex>
          <Flex className={styles.infoPrice} justify='between'>
            <Flex.Item className={styles.infoPriceItem}>
              <div className={styles.value}>
                {price}
                <span className={styles.month}>/月</span>
              </div>
              <div>租金</div>
            </Flex.Item>
            <Flex.Item className={styles.infoPriceItem}>
              <div className={styles.value}>{roomType}</div>
              <div>房型</div>
            </Flex.Item>
            <Flex.Item className={styles.infoPriceItem}>
              <div className={styles.value}>{size}平米</div>
              <div>面积</div>
            </Flex.Item>
          </Flex>
          <Flex className={styles.infoBasic} align='start'>
            <Flex.Item>
              <div>
                <span className={styles.title}>装修：</span>
                精装
              </div>
              <div>
                <span className={styles.title}>楼层：</span>
                {floor}
              </div>
            </Flex.Item>
            <Flex.Item>
              <div>
                <span className={styles.title}>朝向：</span>
                {oriented.join('、')}
              </div>
              <div>
                <span className={styles.title}>类型：</span>
                普通住宅
              </div>
            </Flex.Item>
          </Flex>
        </div>
        
        {/* 地图位置 */}
        <div className={styles.map}>
          <div>
            小区：
            <span className={styles.mapTitle}>{community}</span>
          </div>
          <div className={styles.mapContainer} id='map'>
            地图
          </div>
        </div>
        {/* 房屋配套 */}
        <div className={styles.about}>
          <div className={styles.houseTitle}>房屋配套</div>
          <HousePackage 
            list = {[
              '电视',
              '冰箱',
              '洗衣机',
              '空调',
              '热水器',
              '沙发',
              '衣柜',
              '天然气'
            ]}
          />
        </div>
      </div>
    )
  }
}

export default HouseDetail