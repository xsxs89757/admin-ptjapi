const getters = {
  sidebar: state => state.app.sidebar,
  language: state => state.app.language,
  size: state => state.app.size,
  device: state => state.app.device,
  visitedViews: state => state.tagsView.visitedViews,
  cachedViews: state => state.tagsView.cachedViews,
  token: state => state.user.token,
  avatar: state => state.user.avatar,
  name: state => state.user.name,
  config: state => state.user.config,
  dictionary: state => state.user.dictionary,
  introduction: state => state.user.introduction,
  status: state => state.user.status,
  roles: state => state.user.roles,
  setting: state => state.user.setting,
  permission_routes: state => state.permission.routes,
  permission_check_routes: state => state.permission.permissionRouters,
  addRoutes: state => state.permission.addRoutes,
  errorLogs: state => state.errorLog.logs,
  is_admin: state => state.user.is_admin
}
export default getters
