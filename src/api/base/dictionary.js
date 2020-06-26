import request from '@/utils/request'

export function getDictionary(query) {
  return request({
    url: '/dictionary',
    method: 'get',
    params: query
  })
}

export function getDictionaryDetail(id) {
  return request({
    url: `/dictionary/${id}`,
    method: 'get'
  })
}

export function deleteDictionary(id) {
  return request({
    url: `/dictionary/${id}`,
    method: 'delete'
  })
}

export function addDictionary(data) {
  return request({
    url: '/dictionary',
    method: 'post',
    data
  })
}

export function updateDictionary(data) {
  return request({
    url: '/dictionary',
    method: 'put',
    data
  })
}

export function saveDictionary(data) {
  return request({
    url: '/dictionary/save',
    method: 'put',
    data
  })
}
