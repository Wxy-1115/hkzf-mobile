import axios from 'axios';
import { getToken, removeToken } from '.';
import {BASE_URL} from './url';

const API = axios.create({
  baseURL: BASE_URL
})

// 添加请求拦截器
API.interceptors.request.use(config => {
  const url = config.url
  if (url.startsWith('/user') && !url.startsWith('/user/login') && !url.startsWith('/user/registered')) {
    // 添加请求头
    config.headers.Authorization = getToken()
  }
  return config
})

// 添加响应拦截器
API.interceptors.response.use(response => {
  const { status } = response.data
  if (status === 400) {
    // token失效 删除 token
    removeToken()
  }
  return response
})

export {API}