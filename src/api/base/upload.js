import request from '@/utils/request'

export function uploadSingleImage(data, func = progressEvent => {}) {
  return request({
    url: '/upload/signle-image',
    method: 'post',
    data,
    onUploadProgress: progressEvent => {
      func(progressEvent)
    }
  })
}

export const uploadAddress = {
  configUpload: process.env.VUE_APP_BASE_API + '/upload/up-config'
}
