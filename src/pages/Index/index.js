import React from 'react'
// 导入antd-mobile插件库
import { Carousel, WingBlank, Flex, Grid } from 'antd-mobile';
import { getCurrentCity } from '../../utils'

//导入导航图标
import Nav1 from '../../assets/images/nav-1.png';
import Nav2 from '../../assets/images/nav-2.png';
import Nav3 from '../../assets/images/nav-3.png';
import Nav4 from '../../assets/images/nav-4.png';

import axios from 'axios';

import './index.scss';
import SearchHeader from '../../components/SearchHeader';

const navs = [
  {
    id: 1,
    img: Nav1,
    title: '整租',
    path: '/home/list'
  },
  {
    id: 2,
    img: Nav2,
    title: '合租',
    path: '/home/list'
  },
  {
    id: 3,
    img: Nav3,
    title: '地图找房',
    path: '/map'
  },
  {
    id: 4,
    img: Nav4,
    title: '去出租',
    path: '/home/list'
  },
]

class Index extends React.Component {
  state = {
    // 轮播图数据
    swipers: [],
    isSwipersLoaded: false,

    // 当前城市
    cityName: '',
    id: '',
    // 租房小组数据
    groups: [],
    // 最新资讯数据
    news: [],
    
  }
  
  async getSwipers(){
    const res = await axios.get(`http://${window.location.hostname}:8080/home/swiper`)
    this.setState({
      swipers: res.data.body,
      isSwipersLoaded: true
    });
  }
  async getGroups() {
    const res = await axios.get(`http://${window.location.hostname}:8080/home/groups`, {
      params: {
        area: this.state.id
      }
    })
    // console.log(res.data.body);
    this.setState({
      groups: res.data.body,
    });
  }
  async getNews() {
    const res = await axios.get(`http://${window.location.hostname}:8080/home/news`, {
      params: {
        area: 'AREA%7C88cff55c-aaa4-e2e0'
      }
    })
    this.setState({
      news: res.data.body,
    });
  }
  async componentDidMount() {
    this.getSwipers()
    this.getGroups()
    this.getNews()
    const {label, value} = await getCurrentCity()
    this.setState({
      cityName: label,
      id: value
    })
  }
  // 轮播图函数
  renderSwipers(){
    return this.state.swipers.map(item => (
      <a key={item.id}
        href="http://itcast.cn"
        style={{ display: 'inline-block', width: '100%', height: 212 }}>
        <img src={`http://${window.location.hostname}:8080${item.imgSrc}`}
          alt=""
          style={{ width: '100%', verticalAlign: 'top' }}
        />
      </a>
    ))
  }
  // 首页导航条函数
  renderNavs(){
    return (
      navs.map(item => 
        <Flex.Item key={item.id} onClick={()=>{this.props.history.push(item.path)}}>
          <img src={item.img} alt="" />
          <h2>{item.title}</h2>
        </Flex.Item>
      )
    )
  }
  // 租房小组
  renderGroups(){
    return (
      <Grid data={this.state.groups} columnNum={2} square={false} hasLine={false} renderItem={(item) => (
        <Flex className='group-item' justify='around' key={item.id}>
          <div className="desc">
            <p className="desc-title">{item.title}</p>
            <span className="info">{item.desc}</span>
          </div>
          <img src={`http://${window.location.hostname}:8080${item.imgSrc}`} alt="" />
        </Flex>
      )}
      />
    )
  }
  // 最新资讯
  renderNews(){
    return (
      this.state.news.map(item => 
        (
          <div className="news-item" key={item.id}>
            <div className="imgwrap">
              <img src={`http://${window.location.hostname}:8080${item.imgSrc}`} alt="" className="img" />
            </div>
            <Flex className='content' direction='column' justify='between'>
              <h3 className='news-title'>{item.title}</h3>
              <Flex className='info' justify='between'>
                <span>{item.from}</span>
                <span>{item.date}</span>
              </Flex>
            </Flex>
          </div>
        ))
    )
  }
  
  render() {
    return (
      <div className='index'>
          <div className="swiper">
            {
              // 轮播图
              this.state.isSwipersLoaded === true ? (
              <Carousel autoplay infinite >
                {this.renderSwipers()}
              </Carousel>
              ) : ('')
            }
            {/* 顶部搜索框 */}
            <SearchHeader cityName={this.state.cityName}/>
          </div>
        {/* 分类 */}
        <Flex className='nav'>{this.renderNavs()}</Flex>
        {/* 租房小组 */}
        <div className="group">
          <h3 className="title">
            租房小组 <span className="more">更多</span>
          </h3>
          <div>
            {this.renderGroups()}
          </div>
        </div>
        {/* 最新资讯 */}
        <div className="news">
          <WingBlank size='md'>
            <h3 className="group-title">
              最新资讯
            </h3>
            {this.renderNews()}
          </WingBlank>
          
        </div>
      </div>
    );
  }
}


export default Index