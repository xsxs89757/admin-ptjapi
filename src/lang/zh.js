import { routeZh } from '@/lang/route'
import { tableZh } from '@/lang/table'
import { rulesZh } from '@/lang/rules'
import { commonZh } from '@/lang/common'
export default {
  route: routeZh,
  rules: rulesZh,
  common: commonZh,
  navbar: {
    dashboard: '首页',
    logOut: '退出登录',
    profile: '个人中心',
    theme: '换肤',
    size: '布局大小'
  },
  login: {
    title: '系统登录',
    logIn: '登录',
    username: '账号',
    password: '密码',
    emptyName: '请输入帐号',
    confirmPassword: '确认密码',
    errorPassword: '密码必须大于6位',
    capsLock: '大写锁定',
    any: '随便填',
    errorEmptyUserName: '请输入正确的用户名(用户名为字母与数字组合)',
    errorEmptyPassWord: '密码不能少于6位数',
    expireLoginOut: '你已被登出，可以取消继续留在该页面，或者重新登录',
    expireLoginOutTitle: '确定登出',
    refreshLogin: '重新登录',
    oldPassword: '旧密码'
  },
  permission: {
    addRole: '新增角色',
    editPermission: '编辑权限',
    rolename: '角色名称',
    rolekey: '角色别名',
    permission: '权限',
    deleteConfirm: '确认删除该权限吗?',
    isCheckStrictly: '子父关联'
  },
  status: {
    success: '成功',
    error: '错误',
    switchLanguage: '切换语言成功',
    switchSize: '切换布局大小成功'
  },
  form: {
    deleteConfirm: '确认删除?',
    deleteSuccess: '删除成功',
    actionSuccess: '操作成功',
    addSuccess: '添加成功'

  },
  table: tableZh,
  tagsView: {
    refresh: '刷新',
    close: '关闭',
    closeOthers: '关闭其它',
    closeAll: '关闭所有'
  },
  settings: {
    title: '系统布局配置',
    theme: '主题色',
    tagsView: '开启 Tags-View',
    fixedHeader: '固定 Header',
    sidebarLogo: '侧边栏 Logo'
  }
}
