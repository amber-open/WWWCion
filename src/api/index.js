import axios from 'axios'
const api_url = 'http://122.115.54.25:9001'

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
    if (error.response.data.code == 401) {
      localStorage.clear()
      location.href = '/login'
    }
    return Promise.reject(error.response.data)
  })


export function xhr_login(data) {
  return axios({
    url: api_url + '/user?action=login',
    method: 'post',
    data
  })
}

export function xhr_getQuestions() {
  return axios({
    url: api_url + '/questions',
    method: 'get'
  })
}

export function xhr_addUser(data) {
  return axios({
    url: api_url + '/user?action=register',
    method: 'post',
    data
  })
}

export function xhr_changePassword(data) {
  return axios({
    url: api_url + '/user?action=change_password',
    method: 'post',
    data
  })
}

export function xhr_resetPassword(data) {
  return axios({
    url: api_url + '/user?action=forget_password',
    method: 'post',
    data
  })
}

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


export function xhr_getTransfers(s,l) {
  return axios({
    url: api_url + '/transfer?start='+s+'&length='+l,
    method: 'get',
    headers: {
      'X-Auth-Token': localStorage.getItem('token')
    }
  })
}


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

export function xhr_getUserlist(s,l) {
  return axios({
    url: api_url + '/user?action=listuser&start='+s+'&length='+l,
    method: 'post',
    headers: {
      'X-Auth-Token': localStorage.getItem('token')
    }
  })
}

export function xhr_getRoles() {
  return axios({
    url: api_url + '/roles',
    method: 'get',
    headers: {
      'X-Auth-Token': localStorage.getItem('token')
    }
  })
}

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
