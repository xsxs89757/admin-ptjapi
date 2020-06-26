import store from '@/store'
import Layout from '@/layout'
/**
 * 检查权限指令
 * @param value <String>
 * @return <Boolean>
 */
export default function checkPermission(value) {
  if (value) {
    const routes = store.getters && store.getters.permission_check_routes
    const permissionRoute = value
    const hasPermission = routes.some(route => {
      return route.indexOf(permissionRoute) !== -1
    })

    if (!hasPermission) {
      return false
    }
    return true
  } else {
    console.error(`need roles! Like v-permission="xxxxxx')"`)
    return false
  }
}

/**
 * 把异步传输的json转换成菜单json
 * @param routes
 * @param roles
 */
export function resetRoutes(routes, index = 1, onlyOneMenu = false) {
  const res = []
  routes.forEach(route => {
    if (onlyOneMenu) {
      if (route.hasOwnProperty('onlyOneMenu')) { // 控制单个菜单赋权
        return false
      }
    }
    const tmp = {}
    const ComponentName = route.view_template
    if (index === 1) {
      tmp.path = '/' + route.path
      tmp.component = Layout
    } else {
      tmp.path = route.path
      if (route.is_external_link !== 1) {
        tmp.component = resolve => require([`@/views/${ComponentName}`], resolve)
        // tmp.component = () => import(`@/views/${ComponentName}`)
      }
    }
    tmp.name = route.name
    if (route.redirect !== '')tmp.redirect = route.redirect
    if (route.always_show !== 0)tmp.alwaysShow = true
    if (route.hidden !== 0)tmp.hidden = true
    tmp.meta = {}
    tmp.meta.title = route.name
    tmp.meta.icon = route.icon
    tmp.meta.introduction = route.introduction
    if (route.breadcrumb !== 0)tmp.meta.breadcrumb = false
    if (route.affix !== 0)tmp.meta.affix = true
    if (route.no_cache !== 0)tmp.meta.noCache = true
    if (route.hasOwnProperty('children')) {
      tmp.children = resetRoutes(route.children, 0, onlyOneMenu)
    }
    res.push(tmp)
  })

  return res
}
