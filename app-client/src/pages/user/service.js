import {request} from 'utils'

export function saveUser(data) {
  return request({
    url: '/api/user/save',
    method: 'post',
    data
  })
}

export function getUserList() {
  return request({
    url: '/api/user/list',
    method: 'get',
  })
}

export function getRoleList() {
  return request({
    url: '/api/user/role',
    method: 'get',
  })
}

export function getUserById(id) {
  return request({
    url: '/api/user/' + id,
    method: 'get',
  })
}

export function deleteUserById(id) {
  return request({
    url: '/api/user/delete/' + id,
    method: 'delete',
  })
}
