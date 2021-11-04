
const TOKEN_NAME = "hkzf_token"
const USER_INFO = "user_info"

//获取token
const getToken = () => localStorage.getItem(TOKEN_NAME)

//设置 token
const setToken = value => localStorage.setItem(TOKEN_NAME, value)

//删除token
const removeToken = () => localStorage.removeItem(TOKEN_NAME)

///是否登录（有权限) I
const isAuth = () => !!getToken()

// 获取用户信息
const getUserInfo = () => localStorage.getItem(USER_INFO)

// 设置用户信息
const setUserInfo = (obj) => localStorage.setItem(USER_INFO, JSON.stringify(obj))

export { getToken, setToken, removeToken, isAuth, getUserInfo, setUserInfo }
