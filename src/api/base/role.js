import request from '@/utils/request'

export function getRoutes(setting = 0) {
  return request({
    url: '/routers',
    method: 'get',
    params: { setting: setting }
  })
}

export function getRolesList() {
  return request({
    url: '/roles-list',
    method: 'get'
  })
}

export function getAllRoutes() {
  return request({
    url: '/routers/all',
    method: 'get'
  })
}

export function getRoles(query) {
  return request({
    url: '/roles',
    method: 'get',
    params: query
  })
}

export function deleteRole(id) {
  return request({
    url: `/roles/${id}`,
    method: 'delete'
  })
}

export function addRole(data) {
  return request({
    url: '/roles',
    method: 'post',
    data
  })
}

export function updateRole(data) {
  return request({
    url: '/roles',
    method: 'put',
    data
  })
}

