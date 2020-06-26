import store from '@/store'

export default {
  inserted(el, binding, vnode) {
    const { value } = binding

    if (value) {
      const routes = store.getters && store.getters.permission_check_routes
      const permissionRoute = value
      const hasPermission = routes.some(route => {
        return route.indexOf(permissionRoute) !== -1
      })

      if (!hasPermission) {
        el.parentNode && el.parentNode.removeChild(el)
      }
    } else {
      console.error(`need roles! Like v-permission="xxx.xxx.xxx"`)
      return false
    }
  }
}
