import React, { Component } from 'react'
import { Link } from 'react-router-dom';

import HouseItem from '../../components/HouseItem';
import NoHouse from '../../components/NoHouse';
import NavHeader from '../../components/NavHeader';

import { API, getToken } from '../../utils/index';

import styles from './index.module.css';
import { Button, Modal, Toast } from 'antd-mobile';

const operation = Modal.operation;
const alert = Modal.alert

class Rent extends Component {
  state = {
    list: [],
    isLoading: false
  }
  async getHouseList() {
    this.setState({
      isLoading: true
    })
    // 加载中
    Toast.loading('加载中...', 0, null, false)
    const res = await API.get('/user/houses')
    // console.log(res);
    // 关闭加载中
    Toast.hide()
    this.setState({
      isLoading: false
    })

    const { status, body } = res.data
    if (status === 200) {
      this.setState({
        list: body
      })
    } else {
      const { history, location } = this.props
      history.replace('/login', {
        from: location
      })
    }
  }
  async deletetHouse(id) {
    alert('提示', '是否确定删除？', [
      { text: '取消' },
      {
        text: '确定', onPress: async () => {
          const token = getToken()
          // console.log(token);
          await API.patch(`http://localhost:8080/user/houses/${id}`, {
            "shelf": true
          }, { headers: { 'Authorization': token } })
          Toast.info('删除成功！', 1, () => {
            this.props.history.go(0)
          }, false)
        }
      }
    ])
  }
  componentDidMount() {
    this.getHouseList()
  }
  renderHouseItem() {
    const { list } = this.state
    const { history } = this.props
    return list.map(item => {
      // console.log(item);
      return (
        <Button
          key={item.houseCode}
          className={styles.HouseItem}
          onClick={() => operation([
            { text: '查看详情', onPress: () => history.push(`/detail/${item.houseCode}`) },
            { text: '删除该房源', onPress: () => this.deletetHouse(item.houseCode) },
          ])}
        >
          <HouseItem
            // onclick={() => history.push(`/detail/${item.houseCode}`)}
            houseImg={item.houseImg}
            title={item.title}
            desc={item.desc}
            tags={item.tags}
            price={item.price}
          />
        </Button>
      )
    })
  }
  renderRentList() {
    const { list } = this.state
    const hasHouse = list.length > 0
    if (!hasHouse) {
      return (
        <NoHouse>
          您还没有房源，
          <Link to='rent/add' className={styles.link}>
            去发布房源
          </Link>
          吧~
        </NoHouse>
      )
    }

    return <div className={styles.houses}>
      {
        this.renderHouseItem()
      }
      <Link to='rent/add' className={styles.link2}>
        继续发布
      </Link>
    </div>
  }
  render() {
    const { history } = this.props
    const { isLoading } = this.state
    return (
      <div className={styles.root}>
        <NavHeader onLeftClick={() => history.go(-1)}>房屋管理</NavHeader>
        {
          !isLoading ? this.renderRentList() : ''
        }
      </div>
    )
  }
}

export default Rent