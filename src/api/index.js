import axios from 'axios'
const api_url = 'http://122.115.54.25:9001'

// http拦截
axios.interceptors.response.use(
  response => {
    if (response.data.code == 401) {
      localStorage.clear()
      location.href = '/login'
    } else {
      return response;
    }
  },
  error => {
    if (error.response.status == 401) {
      localStorage.clear()
      location.href = '/login'
    }
    return Promise.reject(error.response.data)
  }
)

// 登录
export function xhr_login(data) {
  return axios({
    url: api_url + '/user?action=login',
    method: 'post',
    data
  })
}
// 获取安全问题
export function xhr_getQuestions() {
  return axios({
    url: api_url + '/questions',
    method: 'get'
  })
}
// 注册
export function xhr_addUser(data) {
  return axios({
    url: api_url + '/user?action=register',
    method: 'post',
    data
  })
}
// 修改密码
export function xhr_changePassword(data) {
  return axios({
    url: api_url + '/user?action=change_password',
    method: 'post',
    data
  })
}
// 重置密码
export function xhr_resetPassword(data) {
  return axios({
    url: api_url + '/user?action=forget_password',
    method: 'post',
    data
  })
}
// 退出
export function xhr_logout(data) {
  return axios({
    url: api_url + '/user?action=logout',
    method: 'post',
    headers:{
      'X-Auth-Token': localStorage.getItem('token')
    },
    data
  })
}
// 获取转账记录列表
export function xhr_getTransfers(s,l) {
  return axios({
    url: api_url + '/transfer?start='+s+'&length='+l,
    method: 'get',
    headers: {
      'X-Auth-Token': localStorage.getItem('token')
    }
  })
}
// 转账
export function xhr_postTransfer(data) {
  return axios({
    url: api_url + '/transfer',
    method: 'post',
    data,
    headers: {
      'X-Auth-Token': localStorage.getItem('token')
    }
  })
}
// 获取用户列表
export function xhr_getUserlist(s,l) {
  return axios({
    url: api_url + '/user?action=listuser&start='+s+'&length='+l,
    method: 'post',
    headers: {
      'X-Auth-Token': localStorage.getItem('token')
    }
  })
}
// 获取角色
export function xhr_getRoles() {
  return axios({
    url: api_url + '/roles',
    method: 'get',
    headers: {
      'X-Auth-Token': localStorage.getItem('token')
    }
  })
}
// 修改角色
export function xhr_putRoles(data) {
  return axios({
    url: api_url + '/roles',
    method: 'put',
    data,
    headers: {
      'X-Auth-Token': localStorage.getItem('token')
    }
  })
}
