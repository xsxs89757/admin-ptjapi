import request from '@/utils/request'

export function getMenu() {
  return request({
    url: '/menu',
    method: 'get'
  })
}

export function deleteMenu(id) {
  return request({
    url: `/menu/${id}`,
    method: 'delete'
  })
}

export function addMenu(data) {
  return request({
    url: '/menu',
    method: 'post',
    data
  })
}

export function updateMenu(data) {
  return request({
    url: `/menu`,
    method: 'put',
    data
  })
}

export function updateMenuSort(data) {
  return request({
    url: `/menu/sort`,
    method: 'put',
    data
  })
}

export function getChannel() {
  return request({
    url: '/menu/channel',
    method: 'get'
  })
}
