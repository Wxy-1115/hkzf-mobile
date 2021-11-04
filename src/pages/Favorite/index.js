import React , { Component } from 'react'
import HouseItem from '../../components/HouseItem';
import NavHeader from '../../components/NavHeader';
import { API } from '../../utils';
import { Button, Modal, Toast } from 'antd-mobile';

import styles from './index.module.css';

const operation = Modal.operation;

class Favorite extends Component {
  state = {
    houstList: []
  }

  componentDidMount() {
    this.getFavorites()
  }
  // ​/user​/favorites
  // 查看收藏列表

  getFavorites = async () => {
    const res = await API.get(`/user/favorites/`)
    // console.log(res);
    this.setState({
      houstList: res.data.body
    })
  }
  deletetHouse = async (id) => {
    // 已收藏 取消收藏
    const res = await API.delete(`/user/favorites/${id}`)
    const { status } = res.data
    if (status === 200) {
      Toast.info('已取消收藏', 1, () => {
        this.props.history.go(0)
      }, false)
    } else {
      // token过期
      Toast.info('登录超时，请重新登录！', 1, null, false)
    }
  }
  // houseImg, title, desc, tags, price, onclick, style
  renderHouseList() {
    const { history } = this.props
    return this.state.houstList.map(item => {
      // console.log(item);
      const { houseImg, title, desc, tags, price, houseCode } = item
      return (
        <Button
          key={item.houseCode}
          className={styles.HouseItem}
          onClick={() => operation([
            { text: '查看详情', onPress: () => history.push(`/detail/${item.houseCode}`) },
            { text: '取消收藏', onPress: () => this.deletetHouse(item.houseCode) },
          ])}
        >
          <HouseItem
            key={houseCode}
            houseImg={houseImg}
            title={title}
            desc={desc}
            tags={tags}
            price={price}
            // onclick={() => {
            //   this.props.history.push(`/detail/${houseCode}`)
            // }}
          />
        </Button>
        
      )
    })
  }
  render() {
    return (
      <div className={styles.root}>
        <NavHeader>我的收藏</NavHeader>
        {
          this.renderHouseList()
        }
      </div>
    )
  }
}

export default Favorite