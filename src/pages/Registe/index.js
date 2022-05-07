import React, { Component } from 'react'
import {  WingBlank, WhiteSpace, Toast } from 'antd-mobile';

import NavHeader from '../../components/NavHeader';

import { API } from '../../utils';

import styles from './index.module.css';

class Registe extends Component {
  state = {
    username: '',
    password: ''
  }

  // 表单提交事件的事件处理程序
  handleSubmit = async e => {
    // 阻止表单提交时的默认行为
    e.preventDefault()
    // 获取账号和密码
    const { username, password } = this.state
    // 发送请求
    const res = await API.post('user/registered', {
      username,
      password
    })
    // console.log(res);
    const { status, description } = res.data
    if (status === 200) {
      // 注册成功
      if (!this.props.location.state) {
        this.props.history.go(-1)
      } else {
        this.props.history.replace(this.props.location.state.from.pathname)
      }
    } else {
      // 注册失败
      Toast.info(description, 2, null, false)
    }
  }

  getUserName = e => {
    // console.log(e.target.value);
    this.setState({
      username: e.target.value
    })
  }

  getPassword = e => {
    // console.log(e.target.value);
    this.setState({
      password: e.target.value
    })
  }
  render() {
    const { username, password } = this.state
    return (
      <div className={styles.root}>
        {/* 顶部导航 */}
        <NavHeader className={styles.navHeader}>账号注册</NavHeader>
        <WhiteSpace size="xl" />

        {/* 注册表单 */}
        <WingBlank>
          <form autoComplete='off'>
            <div className={styles.formItem}>
              <input
                className={styles.input}
                value={username}
                onChange={this.getUserName}
                name="username"
                placeholder="请输入账号"
              />
            </div> <div className={styles.formItem}>
              <input
                className={styles.input}
                value={password}
                onChange={this.getPassword}
                name="password"
                type="password"
                placeholder="请输入密码"
                autocomplete="new-password"
              />
            </div>
            <div className={styles.formSubmit}>
              <button className={styles.submit} type="button" onClick={this.handleSubmit}>
                注 册
              </button>
            </div>
          </form>
        </WingBlank>
      </div>
    )
  }
}

export default Registe