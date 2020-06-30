import axios from 'axios'
import { MessageBox, Notification } from 'element-ui'
import store from '@/store'
import { getToken } from '@/utils/auth'
import i18n from '@/lang'

// create an axios instance
const service = axios.create({
  baseURL: process.env.VUE_APP_BASE_API, // url = base url + request url
  // withCredentials: true, // send cookies when cross-domain requests
  timeout: 5000, // request timeout
  validateStatus: function(status) {
    return status >= 100 && status <= 599
  }
})

// request interceptor
service.interceptors.request.use(
  config => {
    // do something before request is sent

    if (store.getters.token) {
      config.headers['Authorization'] = getToken()
    }
    config.headers['x-lang'] = store.getters.language
    return config
  },
  error => {
    // do something with request error
    console.log(error) // for debug
    return Promise.reject(error)
  }
)

// response interceptor
service.interceptors.response.use(
  /**
   * If you want to get http information such as headers or status
   * Please return  response => response
  */

  /**
   * Determine the request status by custom code
   * Here is just an example
   * You can also judge the status by HTTP Status Code
   */
  response => {
    // 判断一下响应中是否有 token，如果有就直接使用此 token 替换掉本地的 token。
    var token = response.headers.authorization
    if (token) {
      // 如果 header 中存在 token，那么触发 RefreshToken 方法，替换本地的 token
      store.dispatch('user/refreshToken', token)
      // location.reload() // 刷新 暂时注销
    }
    const res = response.data
    if (response.status < 200 || response.status > 299) {
      if (res.error_code === 40000 || res.error_code === 40001) {
        // to re-login
        MessageBox.confirm(i18n.t('login.expireLoginOut'), i18n.t('login.expireLoginOutTitle'), {
          confirmButtonText: i18n.t('login.refreshLogin'),
          // cancelButtonText: i18n.t('table.cancel'),
          type: 'warning'
        }).then(() => {
          store.dispatch('user/resetToken').then(() => {
            location.reload()
          })
        })
      } else {
        if (res.message) {
          Notification.error({
            title: i18n.t('status.error'),
            message: res.message
          })
        }
      }

      return Promise.reject(new Error(res.message || 'Error'))
    } else {
      return res
    }
  },
  error => {
    console.log('err' + error) // for debug
    if (error.message) {
      Notification.error({
        title: i18n.t('status.error'),
        message: error.message
      })
    }
    return Promise.reject(error)
  }
)

export default service
