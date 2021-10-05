import React, { Component } from 'react'

import { SearchBar } from 'antd-mobile';

import styles from './index.module.css';
import { getCity, API } from '../../../utils';

class RentSearch extends Component {
  // 当前城市id
  cityId = getCity().value
  // 定时器id
  timerId = null
  state = {
    searchTxt: '',
    tipsList: []
  }
  componentDidMount() {
    this.autoFocusInst.focus();
  }
  onChange = (value) => {
    this.setState({ searchTxt: value })
    if (!value) {
      return this.setState({
        tipsList: []
      })
    }
    // 清除定时器
    clearTimeout(this.timerId)
    // 开启定时器
    this.timerId = setTimeout(async () => {
      const res = await API.get('/area/community', {
        params: {
          name: value,
          id: this.cityId
        }
      })
      console.log(res);
      this.setState({
        tipsList: res.data.body
      })
    }, 500);
  }
  tipClick = (item) => {
    const {history} = this.props
    history.replace('/rent/add', {
      id: item.community,
      name: item.communityName
    })
  }
  // 渲染搜索列表
  renderTips = () => {
    const { tipsList } = this.state
    return tipsList.map(item => (
        <li key={item.community} className={styles.tip} onClick={() => { this.tipClick(item) }}>
          {item.communityName}
        </li>
      )
    )
  }
  render() {
    const { history } = this.props
    const { searchTxt } = this.state
    return (
      <div className={styles.root}>
        <SearchBar
          // value={'111'}
          ref={ref => this.autoFocusInst = ref}
          placeholder="请输入小区关键词"
          value={searchTxt}
          onCancel={() => { history.go(-1) }}
          showCancelButton
          onChange={this.onChange}
        />
        <ul className={styles.tipsList}>
          {this.renderTips()}
        </ul>
      </div>
    )
  }
}

export default RentSearch