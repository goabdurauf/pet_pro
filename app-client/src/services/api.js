import {request} from 'utils'

export function userMe(data) {
  return request({
    url: '/api/user/me',
    data,
  })
}

export function signIn(data) {
  return request({
    url: '/api/auth/login',
    method: 'post',
    data,
  });
}

export function getRoleList() {
  return request({
    url: '/api/user/role',
    method: 'get',
  })
}

