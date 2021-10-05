import React, {lazy} from 'react'
import { TabBar } from 'antd-mobile';
import { Route } from 'react-router-dom';

import './index.css'

import Index from '../Index';
// import Profile from '../Profile';
// import HouesList from '../HouseList';
// import News from '../News';

const Profile = lazy(() => import('../Profile'));
const HouesList = lazy(() => import('../HouseList'));
const News = lazy(() => import('../News'));

// 底部导航条相关数据
const tabItems = [
  {
    title: '首页',
    icon: 'icon-ind',
    path: '/home'
  },
  {
    title: '找房',
    icon: 'icon-findHouse',
    path: '/home/list'
  },
  {
    title: '资讯',
    icon: 'icon-infom',
    path: '/home/news'
  },
  {
    title: '我的',
    icon: 'icon-my',
    path: '/home/profile'
  }]


class Home extends React.Component {
  state = {
    // 默认选中
    selectedTab: this.props.location.pathname,
  };

  // 菜单高亮处理
  componentDidUpdate(prevProps) {
    // 判断路由是否发生切换
    if (prevProps.location.pathname !== this.props.location.pathname){
      // console.log(prevProps, this.props);
      this.setState({
        selectedTab: this.props.location.pathname,
      })
    }
  }

  renderTabBarItem(){
    return tabItems.map(item=>{
      return (
        <TabBar.Item
          title={item.title}
          key={item.title}
          icon={<i className = {`iconfont ${item.icon}`} />}
          selectedIcon={<i className = {`iconfont ${item.icon}`} />}
          selected={this.state.selectedTab === item.path}
          onPress={() => {
            this.setState({
              selectedTab: item.path,
            });
            this.props.history.push(item.path)
          }}
        />
      )
    })
  }

  render() {
    return (
      <div className='home'>
        <Route exact path='/home' component={Index}></Route>
        <Route path='/home/list' component={HouesList}></Route>
        <Route path='/home/news' component={News}></Route>
        <Route path='/home/profile' component={Profile}></Route>
        <TabBar tintColor="#21b97a" barTintColor="white" noRenderContent={true}>
          {this.renderTabBarItem()}
        </TabBar>
      </div>
    );
  }

}

export default Home