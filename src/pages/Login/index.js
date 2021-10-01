import React,{Component} from 'react'
import { Flex, WingBlank, WhiteSpace, Toast } from 'antd-mobile';

import { Link } from 'react-router-dom';
// 导入
import { withFormik, Form, Field, ErrorMessage } from 'formik';
import * as Yup from 'yup';

import NavHeader from '../../components/NavHeader';

import { API } from '../../utils';

import styles from './index.module.css';

// 验证规则
const REG_UNAME = /^[a-zA-Z_\d]{5,8}$/
const REG_PWD = /^[a-zA-Z_\d]{5,12}$/


class Login extends Component {
  // state = {
  //   username: '',
  //   password: ''
  // }

  // 表单提交的处理
  // handleSubmit = async (e) => {
  //   e.preventDefault();
  //   const { username, password } = this.state
  //   const res = await API.post('user/login', {
  //     username,
  //     password
  //   })
  //   console.log(res);
  //   const { status, description, body } = res.data
  //   if(status === 200) {
  //     // 登录成功
  //     localStorage.setItem('hkzf_token', body.token)
  //     this.props.history.go(-1)
  //   } else {
  //     // 登录失败
  //     Toast.info(description, 2, null, false)
  //   }
  // }
  render() {
    return (
      <div className={styles.root}>
        {/* 顶部导航 */}
        <NavHeader className={styles.navHeader}>账号登录</NavHeader>
        <WhiteSpace size='xl' />
        {/* 登陆表单 */}
        <WingBlank>
          <Form>
            <div className={styles.formItem}>
              <Field
                className={styles.input}
                name="username"
                placeholder="请输入账号"
              />
            </div>
            {/* 长度为5到8位，只能出现数字、字母、下划线 */}
            <ErrorMessage className={styles.error} name="username" component="div" />
            
            <div className={styles.formItem}>
              <Field
                className={styles.input}
                name="password"
                type="password"
                placeholder="请输入密码"
              />
            </div>
            {/* 长度为5到12位，只能出现数字、字母、下划线 */}
            <ErrorMessage className={styles.error} name="password" component="div" />

            <div className={styles.formSubmit}>
              <button className={styles.submit} type="submit">
                登 录
              </button>
            </div>
          </Form>
          <Flex className={styles.backHome}>
            <Flex.Item>
              <Link to='/registe' className={styles.link}>还没有账号，去注册~</Link>
            </Flex.Item>
          </Flex>
        </WingBlank>
      
      </div>
    )
  }
}

// 使用withFormik包装Login组件
Login = withFormik({
  mapPropsToValues: () => ({username: '', password: ''}),

  handleSubmit: async (values, {props}) => {
    const { username, password } = values
    const res = await API.post('user/login', {
      username,
      password
    })
    console.log(res);
    const { status, description, body } = res.data
    if (status === 200) {
      // 登录成功
      localStorage.setItem('hkzf_token', body.token)
      // props.history.go(-1)
      if(!props.location.state) {
        props.history.go(-1)
      }else {
        props.history.replace(props.location.state.from.pathname)
      }
    } else {
      // 登录失败
      Toast.info(description, 2, null, false)
    }
  },
  // 表单校验规则
  validationSchema: Yup.object().shape({
    username: Yup.string().required('账号为必填项').matches(REG_UNAME, '长度为5到8位，只能出现数字、字母、下划线'),
    password: Yup.string().required('密码为必填项').matches(REG_PWD, '长度为5到12位，只能出现数字、字母、下划线')
  }),
  displayName: 'BasicForm',
})(Login)

export default Login