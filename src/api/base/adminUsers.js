import request from '@/utils/request'

export function getAdminUsers(query) {
  return request({
    url: '/admin-users',
    method: 'get',
    params: query
  })
}

export function deleteAdminUsers(id) {
  return request({
    url: `/admin-users/${id}`,
    method: 'delete'
  })
}

export function addAdminUsers(data) {
  return request({
    url: '/admin-users',
    method: 'post',
    data
  })
}

export function updateAdminUsers(data) {
  return request({
    url: `/admin-users`,
    method: 'put',
    data
  })
}

export function getAdminControllerLogs(query) {
  return request({
    url: '/admin-logs',
    method: 'get',
    params: query
  })
}

export function clearAdminControllerLogs() {
  return request({
    url: '/clear-admin-logs',
    method: 'delete'
  })
}

export function updatePassoword(data) {
  return request({
    url: '/admin-user/reset-password',
    method: 'put',
    data
  })
}

export function setDev(query) {
  return request({
    url: '/admin-user/dev',
    method: 'get',
    params: query
  })
}
