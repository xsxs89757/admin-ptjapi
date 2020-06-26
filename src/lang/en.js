import { routeEn } from '@/lang/route'
import { tableEn } from '@/lang/table'
import { rulesEn } from '@/lang/rules'
import { commonEn } from '@/lang/common'
export default {
  route: routeEn,
  rules: rulesEn,
  common: commonEn,
  navbar: {
    dashboard: 'Dashboard',
    github: 'Github',
    logOut: 'Log Out',
    profile: 'Profile',
    theme: 'Theme',
    size: 'Global Size'
  },
  login: {
    title: 'Login Form',
    logIn: 'Login',
    username: 'Username',
    password: 'Password',
    emptyName: 'empty name',
    errorPassword: 'password is must be 6',
    capsLock: 'caps is lock',
    any: 'any',
    errorEmptyUserName: 'Please enter the correct user name',
    errorEmptyPassWord: 'The password can not be less than 6 digits',
    expireLoginOut: 'You have been logged out, you can cancel to stay on the page, or re-login',
    expireLoginOutTitle: 'Make sure to log out',
    refreshLogin: 'Re login',
    oldPassword: 'Old Password'
  },
  permission: {
    addRole: 'New Role',
    editPermission: 'Edit Permission',
    rolename: 'RoleName',
    rolekey: 'RoleKey',
    permission: 'Permission',
    deleteConfirm: 'Confirm to remove the role?',
    isCheckStrictly: 'CheckStrictly'
  },
  status: {
    success: 'Success',
    error: 'Error',
    switchLanguage: 'Switch Language Success',
    switchSize: 'switch size successs'
  },
  form: {
    deleteConfirm: 'Confirm to remove?',
    deleteSuccess: 'Delete Success',
    actionSuccess: 'Action Success',
    addSuccess: 'Add Success'

  },
  table: tableEn,
  tagsView: {
    refresh: 'Refresh',
    close: 'Close',
    closeOthers: 'Close Others',
    closeAll: 'Close All'
  },
  settings: {
    title: 'Page style setting',
    theme: 'Theme Color',
    tagsView: 'Open Tags-View',
    fixedHeader: 'Fixed Header',
    sidebarLogo: 'Sidebar Logo'
  }
}
