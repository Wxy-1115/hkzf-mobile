import React , { Component } from 'react'
import HouseItem from '../../components/HouseItem';
import NavHeader from '../../components/NavHeader';
import { API } from '../../utils';

import styles from './index.module.css';

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
  // houseImg, title, desc, tags, price, onclick, style
  renderHouseList() {
    return this.state.houstList.map(item => {
      // console.log(item);
      const { houseImg, title, desc, tags, price, houseCode } = item
      return (
        <HouseItem
          key={houseCode}
          houseImg={houseImg}
          title={title}
          desc={desc}
          tags={tags}
          price={price}
          onclick={() => {
            this.props.history.push(`/detail/${houseCode}`)
          }}
        />
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