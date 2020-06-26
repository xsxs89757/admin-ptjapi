import { constantRoutes } from '@/router'
import { getRoutes } from '@/api/base/role'
import { resetRoutes } from '@/utils/permission'
/**
 * Use meta.role to determine if the current user has permission
 * @param roles
 * @param route
 */
function hasPermission(roles, route) {
  if (route.meta && route.meta.roles) {
    return roles.some(role => route.meta.roles.includes(role))
  } else {
    return true
  }
}

/**
 * Filter asynchronous routing tables by recursion
 * @param routes asyncRoutes
 * @param roles
 */
export function filterAsyncRoutes(routes, roles) {
  const res = []

  routes.forEach(route => {
    const tmp = { ...route }
    if (hasPermission(roles, tmp)) {
      if (tmp.children) {
        tmp.children = filterAsyncRoutes(tmp.children, roles)
      }
      res.push(tmp)
    }
  })

  return res
}

const state = {
  routes: [],
  permissionRouters: [],
  addRoutes: []
}

const mutations = {
  SET_ROUTES: (state, routes) => {
    state.addRoutes = routes
    state.routes = constantRoutes.concat(routes)
  },
  SET_PERMISSIONROUTERS: (state, routes) => {
    state.permissionRouters = routes
  }
}

const actions = {
  generateRoutes({ commit }, roles) {
    return new Promise((resolve, reject) => {
      getRoutes().then(response => {
        const { menu, permission } = response
        const accessedRoutes = resetRoutes(menu)
        commit('SET_ROUTES', accessedRoutes)
        commit('SET_PERMISSIONROUTERS', permission)
        resolve(accessedRoutes)
      }).catch(error => {
        console.log(error)
        reject('menu get error!')
      })
    })
  }
}

export default {
  namespaced: true,
  state,
  mutations,
  actions
}
