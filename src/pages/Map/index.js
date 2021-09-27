import React from 'react'
import {Flex, Toast} from 'antd-mobile';

import NavHeader from '../../components/NavHeader';

import style from './index.module.css'

import {API} from '../../utils/api';
import {BASE_URL} from '../../utils/url';
const BMapGL = window.BMapGL

const labelStyle = {
  cursor: 'pointer',
  border: 'none',
  padding: '0',
  whiteSpace: 'nowrap',
  fontSize: '12px',
  color: 'rgb(255, 255, 255)',
  textAlign: 'center'
}, labelStyle2 = {
  cursor: 'pointer',
  border: 'none',
  padding: '0',
  backgroundColor: 'none',
  whiteSpace: 'nowrap',
  fontSize: '12px',
  textAlign: 'center'
}

class Map extends React.Component {
  state = {
    housesList: [],
    isShowList: false,
  }
  initMap() {
    // 获取当前城市
    const { label, value } = JSON.parse(localStorage.getItem('hkzf_city'))
    // console.log(label, value);

    // 创建地图实例
    var map = new BMapGL.Map("container");
    this.map = map
    //创建地址解析器实例
    var myGeo = new BMapGL.Geocoder();
    // 将地址解析结果显示在地图上，并调整地图视野
    myGeo.getPoint(label, async (point) => {
      if (point) {
        // 地图初始化，同时设置地图展示级别
        map.centerAndZoom(point, 11);
        // map.addOverlay(new BMapGL.Marker(point))
        // 开启鼠标滚轮缩放
        map.enableScrollWheelZoom(true);

        var scaleCtrl = new BMapGL.ScaleControl();  // 添加比例尺控件
        map.addControl(scaleCtrl);
        var zoomCtrl = new BMapGL.ZoomControl();  // 添加缩放控件
        map.addControl(zoomCtrl);
        // 调用创建覆盖物方法
        this.renderOverlays(value)
      }
    }, label)
    map.addEventListener('movestart', ()=>{
      if(this.state.isShowList){
        this.setState({
          isShowList: false,
        })
      }
    })
  }
  async renderOverlays(id) {
    try{
      Toast.loading('加载中...', 0, null, false);
      const res = await API.get(`/area/map?id=${id}`)
      Toast.hide()
      const { nextZoom, type } = this.getTypeAndZoom()
      res.data.body.forEach(item => {
        // console.log(item);
        this.createOverlays(item, nextZoom, type)
      })
    } catch(e){
      Toast.hide()
      console.log(e);
    }
  }
  // 获取小区房源数据
  async getHouseList(id) {
    try{
      Toast.loading('加载中...', 0, null, false);
      const res = await API.get(`/houses?cityId=${id}`)
      //关闭loading
      Toast.hide()
      // console.log(res);
      this.setState({
        housesList: res.data.body.list,
        isShowList: true,
      })
    } catch (e){
      // 关闭loading
      Toast.hide()
      console.log(e);
    }
  }
  getTypeAndZoom() {
    const zoom = this.map.getZoom()
    let nextZoom, type
    if (zoom >= 10 && zoom < 12) {
      type = 'circle'
      nextZoom = 13
    } else if (zoom >= 12 && zoom < 14) {
      type = 'circle'
      nextZoom = 15
    } else if (zoom >= 14 && zoom < 16) {
      type = 'rect'
    }
    return { nextZoom, type }
  }
  createOverlays = (item, nextZoom, type) => {
    type === 'circle' ? this.createCircle(item, nextZoom) : this.createRect(item)
  }
  createCircle = (item, nextZoom) => {
    console.log('createCircle');
    const {
      coord: { longitude, latitude },
      label: areaName,
      count,
      value
    } = item
    const areaPoint = new BMapGL.Point(longitude, latitude)
    
    const opts = {
      position: areaPoint, // 指定文本标注所在的地理位置
      offset: new BMapGL.Size(-35, -35) // 设置文本偏移量
    };
    // 创建文本标注对象
    const label = new BMapGL.Label('', opts);
    label.id = value
    label.setContent(
      `<div class='${style.bulle}'>
          <p class='${style.name}'>${areaName}</p>
          <p>${count}</p>
        </div>`)
    // 自定义文本标注样式
    label.setStyle(labelStyle);

    // 单击事件
    label.addEventListener('click', async () => {
      // console.log(value);
      // 放大地图（以当前点击覆盖物为中心）
      this.map.centerAndZoom(areaPoint, nextZoom);
      // 清除当前覆盖物
      this.map.clearOverlays();
      this.renderOverlays(value)
    })
    this.map.addOverlay(label);
  }
  createRect = (item, nextZoom) => {
    console.log('createRect');
    const {
      coord: { longitude, latitude },
      label: areaName,
      count,
      value
    } = item
    const areaPoint = new BMapGL.Point(longitude, latitude)

    const opts = {
      position: areaPoint, // 指定文本标注所在的地理位置
      offset: new BMapGL.Size(-50, -28) // 设置文本偏移量
    };
    // 创建文本标注对象
    const label = new BMapGL.Label('', opts);
    label.id = value
    label.setContent(
      `<div class='${style.rect}'>
          <span class='${style.housename}'>${areaName}</span>
          <span class='${style.housenum}'>${count}套</span>
          <i class='${style.arrow}'></i>
        </div>`)
    // 自定义文本标注样式
    label.setStyle(labelStyle2);

    // 单击事件
    label.addEventListener('click', (e) => {
      // 移动地图
      const clientX = e.clientX ? e.clientX : e.domEvent.changedTouches[0].clientX
      const clientY = e.clientY ? e.clientY : e.domEvent.changedTouches[0].clientY

      const x = window.innerWidth / 2 - clientX
      const y = (window.innerHeight - 340) / 2 - clientY
      this.map.panBy(x, y)
      this.getHouseList(value)
    })
    this.map.addOverlay(label);
  }
  renderHouseList(){
    return (
      <div className={[style.houseList, (this.state.isShowList ? style.show : '')].join(' ')}>
        <div className={style.nav}>
          <h2 className={style.title}>房屋列表</h2>
          <span className={style.more}>更多房源</span>
        </div>
        <div className={style.list}>
          {this.state.housesList.map((item) => (
          <Flex className={style.content} align='start' key={item.houseCode}>
              <img src={BASE_URL+item.houseImg} alt="" className={style.image} />
            <Flex className={style.houseInfo} direction='column' align='start'>
              <h3 className={style.houseTitle}>{item.title}</h3>
              <span className={style.desc}>{item.desc}</span>
                <div className={style.tags}>
                {
                  item.tags.map(tag => (
                    <span className={[style.tag, style.tag1].join(' ')} key={tag}>{tag}</span>
                  ))
                }
              </div>
              <span className={style.price}>{item.price}<span className={style.month}>元/月</span>
              </span>
            </Flex>
          </Flex>)
          )}
        </div>
      </div>
    )
  }
  componentDidMount() {
    this.initMap()
  }
  render() {
    return (
      <div className={style.map}>
        {/* 顶部导航栏 */}
        <NavHeader>
          地图找房
        </NavHeader>
        <div id="container" className={style.container}></div>
        {this.renderHouseList()}
      </div>
    )
  }
}

export default Map