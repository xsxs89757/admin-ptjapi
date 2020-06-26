import request from '@/utils/request'

export function getMapsOptions() {
  return request({
    url: '/system-maps-options',
    method: 'get'
  })
}

export function getMapsGroup() {
  return request({
    url: '/system-maps-group',
    method: 'get'
  })
}

export function getSystemConfig(query) {
  return request({
    url: '/system-config',
    method: 'get',
    params: query
  })
}

export function getConfigGroup(query) {
  return request({
    url: '/system-group',
    method: 'get',
    params: query
  })
}

export function getConfigList(query) {
  return request({
    url: '/system',
    method: 'get',
    params: query
  })
}

export function addConfig(data) {
  return request({
    url: '/system',
    method: 'post',
    data
  })
}

export function updateConfig(data) {
  return request({
    url: '/system',
    method: 'put',
    data
  })
}

export function deleteConfig(id) {
  return request({
    url: `/system/${id}`,
    method: 'delete'
  })
}

export function updateSortConfig(data) {
  return request({
    url: '/system/sort',
    method: 'put',
    data
  })
}

export function updateConfigGroup(data) {
  return request({
    url: '/system-batch',
    method: 'put',
    data
  })
}
