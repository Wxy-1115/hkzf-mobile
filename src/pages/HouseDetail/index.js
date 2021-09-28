import React, { Component } from 'react'

import { Carousel, Flex, Toast } from "antd-mobile";

import NavHeader from "../../components/NavHeader";
import HouseItem from "../../components/HouseItem";

import { BASE_URL } from '../../utils/url';

import styles from './index.module.css'
import HousePackage from '../../components/HousePackage';
import { API } from '../../utils/api';

const BMap = window.BMapGL
const labelStyle = {
  cursor: 'pointer',
  color: '#fff',
  backgroundColor: '#ee714f',
  fontSize: '12px',
  padding: '3px 5px',
  border: '1px solid #ee714f',
  whiteSpace: 'nowrap',
  textAlign: 'center'
}
const list = [
  {
    desc: "二室/77/西南/绿谷康都",
    houseCode: "5cc44ed41439630e5b3d5f20",
    houseImg: "/newImg/7bi0g5b11.jpg",
    price: 2800,
    tags: ["随时看房"],
    title:"绿谷康都 2室2厅 2800元"
  },
  {
    desc: "一室/115/南/四季华庭",
    houseCode: "5cc450a81439630e5b3dcbff",
    houseImg: "/newImg/7bk978nb6.jpg",
    price: 2500,
    tags: ["近地铁"],
    title: "四季华庭 1室1厅 2500元"
  },
  {
    desc: "三室/117/南/天际花园",
    houseCode: "5cc46b491439630e5b43bf95",
    houseImg: "/newImg/7bil6m73e.jpg",
    price: 11800,
    tags: ["近地铁", "精装", "双卫生间", "随时看房"],
    title: "整租 · 天际花园 3居室 11800"
  },
]
  class HouseDetail extends Component {
    state = {
      isLoading: false,
      // 房屋信息
      houseInfo: {}
    }

    componentDidMount() {
      console.log(this.props.match.params);
      this.getHouseDetail()

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
      const { community, coord } = this.state.houseInfo
      this.renderMap(community, coord)
    }
    // 渲染轮播图结构
    renderSwipers() {
      const { houseInfo: { houseImg } } = this.state
      if (!houseImg) return null
      return houseImg.map(item => (
        <a
          href="###"
          key={item}
        >
          <img src={BASE_URL + item} alt="" />
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
    <i class=${styles.arrow}></i>
    `)
      map.addOverlay(label)
    }
    render() {
      const { isLoading, houseInfo: { community, title, tags, price, roomType, size, floor, oriented, supporting, description } } = this.state
      // 判断是否请求到房屋信息,没有就返回null
      if (Object.keys(this.state.houseInfo).length === 0) return null
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
            ) : ''}
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
                    <span key={item} className={[styles.tag, styles['tag' + (index % 3 + 1)]].join(' ')}>
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
            <div className={styles.mapTitle}>
              小区：
              <span>{community}</span>
            </div>
            {/* 渲染地图 */}
            <div className={styles.mapContainer} id='map'></div>
          </div>
          {/* 房屋配套 */}
          <div className={styles.about}>
            <div className={styles.houseTitle}>房屋配套</div>
            {
              supporting.length !== 0 ? <HousePackage list={supporting} /> : <div className={styles.titleEmpty}>暂无数据</div>
            }
          </div>
          {/* 房源概况 */}
          <div className={styles.set}>
            <div className={styles.houseTitle}>房源概况</div>
            <div>
              <div className={styles.contact}>
                <div className={styles.user}>
                  <img src={BASE_URL + '/img/avatar.png'} alt="头像" className={styles.useImg} />
                  <div className={styles.useInfo}>
                    <div>王女士</div>
                    <div className={styles.userAuth}>
                      <i className="iconfont icon-auth" />
                      已认证房主
                    </div>
                  </div>
                </div>
                <span className={styles.userMsg}>发消息</span>
              </div>
              <div className={styles.descText}>
                {
                  description || '暂无房源数据'
                }
              </div>
            </div>
          </div>
          {/* 猜你喜欢 */}
          <div className={styles.love}>
            {
              list.map(item => <HouseItem 
                houseImg={item.houseImg}
                title={item.title}
                desc={item.desc}
                tags={item.tags}
                price={item.price}
              />)
            }
            
          </div>
          {/* 底部导航栏 */}
          <div className={styles.footer}>
            <div className={styles.collect}><i className="iconfont icon-Collection"></i>收藏</div>
            <div className={styles.consult}>在线咨询</div>
            <div className={styles.sub}>电话预约</div>
          </div>
        </div>
      )
    }
  }

  export default HouseDetail