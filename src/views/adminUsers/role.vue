<template>
  <div class="app-container">
    <div class="filter-container">
      <el-input v-model="listQuery.name" :placeholder="$t('permission.rolename')" style="width: 200px;" class="filter-item" @keyup.enter.native="getRoles" />
      <el-button v-waves class="filter-item" type="primary" icon="el-icon-search" @click="getRoles">{{ $t('table.search') }}</el-button>
      <el-button v-if="checkPermission('adminUsers.role.addRole')" v-waves class="filter-item" icon="el-icon-plus" type="primary" @click="handleAddRole">{{ $t('permission.addRole') }}</el-button>
    </div>
    <el-table
      :key="tableKey"
      v-loading="listLoading"
      :data="rolesList"
      style="width: 100%;margin-top:30px;"
      border
      class="roles-table"
    >
      <el-table-column align="center" label="ID" width="220">
        <template slot-scope="scope">{{ scope.row.id }}</template>
      </el-table-column>
      <el-table-column align="center" :label=" $t('permission.rolename') " width="220">
        <template slot-scope="scope">{{ scope.row.name }}</template>
      </el-table-column>
      <el-table-column align="center" :label=" $t('table.operator') " width="220">
        <template slot-scope="scope">{{ scope.row.create_nickname }}</template>
      </el-table-column>
      <el-table-column align="header-center" :label="$t('table.date')">
        <template slot-scope="scope">{{ scope.row.created_at }}</template>
      </el-table-column>
      <el-table-column align="center" :label="$t('table.actions')">
        <template slot-scope="scope">
          <el-button v-if="checkPermission('adminUsers.role.editRole')" v-waves icon="el-icon-edit" type="primary" size="small" @click="handleEdit(scope)">{{ $t('table.edit') }}</el-button>
          <el-button v-if="checkPermission('adminUsers.role.deleteRole')" v-waves icon="el-icon-delete" type="danger" size="small" @click="handleDelete(scope)">{{ $t('table.delete') }}</el-button>
        </template>
      </el-table-column>
    </el-table>

    <pagination v-show="total>0" :total="total" :page.sync="listQuery.page" :limit.sync="listQuery.limit" @pagination="getRoles" />

    <el-dialog
      v-loading="dialogLoading"
      :visible.sync="dialogVisible"
      :title="dialogType==='edit'?$t('table.edit'):$t('table.add')"
      width="30%"
      @closed="hiddenDialog"
    >
      <el-form
        ref="roleForm"
        :model="role"
        :rules="rules"
        label-width="80px"
        label-position="right"
      >
        <el-form-item :label="$t('permission.rolename')" prop="name">
          <el-input v-model="role.name" :placeholder="$t('permission.rolename')" />
        </el-form-item>
        <el-form-item :label="$t('permission.permission')" prop="tree">
          <el-tree
            v-if="ifReset"
            ref="tree"
            :check-strictly="checkStrictly"
            :data="routesData"
            :props="defaultProps"
            show-checkbox
            node-key="path"
            class="permission-tree"
            prop="tree"
            :default-expanded-keys="expandedKeys"
            @check-change="checkChange"
            @check="checkTree"
          />
        </el-form-item>
      </el-form>
      <div style="text-align:right;">
        <el-button type="danger" @click="dialogVisible=false">{{ $t('table.cancel') }}</el-button>
        <el-button type="primary" :loading="submitLoading" @click="confirmRole">{{ $t('table.confirm') }}</el-button>
      </div>
    </el-dialog>
  </div>

</template>

<script>
import path from 'path'
import { deepClone } from '@/utils'
import { resetRoutes } from '@/utils/permission'
import { getRoutes, getRoles, addRole, deleteRole, updateRole } from '@/api/base/role'
import checkPermission from '@/utils/permission'
import i18n from '@/lang'
import Pagination from '@/components/Pagination' // Secondary package based on el-pagination
import waves from '@/directive/waves' // Waves directive

const defaultRole = {
  id: 0,
  name: '',
  routers: [],
  checkedKeys: [],
  guard_name: 'admin'

}

export default {
  // eslint-disable-next-line vue/name-property-casing
  name: 'adminUsers_role',
  components: { Pagination },
  directives: { waves }, // 按钮点击波浪形插件
  data() {
    const validateTree = (rule, value, callback) => {
      const checkedKeys = this.$refs.tree.getCheckedKeys()
      if (Array.isArray(checkedKeys) && checkedKeys.length === 0) {
        callback(new Error(i18n.t('rules.RoleTreeRequired')))
      } else {
        callback()
      }
    }
    return {
      role: Object.assign({}, defaultRole),
      routes: [],
      rolesList: [],
      dialogVisible: false,
      dialogType: 'new',
      checkStrictly: false,
      defaultProps: {
        children: 'children',
        label: 'title'
      },
      tableKey: 0,
      listLoading: false,
      dialogLoading: true,
      total: 0,
      listQuery: {
        page: 1,
        limit: 20,
        name: ''
      },
      list: null,
      rules: {
        name: [{ required: true, message: i18n.t('rules.RoleNameRequired'), trigger: 'blur' }],
        tree: [{ required: true, validator: validateTree }]
      },
      expandedKeys: [],
      ifReset: true,
      submitLoading: false
    }
  },
  computed: {
    routesData() {
      return this.routes
    }
  },
  created() {
    this.getRoutes()
    this.getRoles(this.listQuery)
  },
  methods: {
    checkPermission,
    hiddenDialog() {
      this.$refs.roleForm.resetFields()
      this.submitLoading = false
    },
    async getRoutes() {
      this.dialogLoading = true
      const data = await getRoutes(1)
      this.serviceRoutes = resetRoutes(data.menu, 1, true)
      const routes = this.generateRoutes(this.serviceRoutes)
      this.routes = this.i18n(routes)
      this.dialogLoading = false
    },
    async getRoles() {
      this.listLoading = true
      const res = await getRoles(this.listQuery)
      this.rolesList = this.resetRoutesArr(res.data)
      this.total = res.meta.total
      this.listLoading = false
    },
    i18n(routes) {
      const app = routes.map(route => {
        const t = i18n.t(`route.${route.title}`)
        if (t === 'route.' + route.title) {
          route.title = route.introduction
        } else {
          route.title = t
        }

        if (route.children) {
          route.children = this.i18n(route.children)
        }
        return route
      })
      return app
    },
    resetRoutesArr(routes) {
      const data = []
      routes.forEach(route => {
        route.routers = resetRoutes(route.routers, 1, true)
        data.push(route)
      })
      return data
    },
    checkChange(obj, checked, childrenChecked) {
      this.$nextTick(() => {
        const checkedKeys = this.$refs.tree.getCheckedKeys()
        this.expandedKeys = checkedKeys
      })
    },
    checkTree(obj, checkObj) {
      if (obj.hidden) {
        const { checkedKeys, halfCheckedKeys } = checkObj
        if (checkedKeys.indexOf(obj.parent) === -1 && halfCheckedKeys.indexOf(obj.parent) === -1) {
          this.checkStrictly = true
          this.$nextTick(() => {
            const check = checkedKeys.concat(halfCheckedKeys).concat(obj.parents)
            this.$refs.tree.setCheckedKeys(check)
            this.checkStrictly = false
          })
        }
      }
    },
    // Reshape the routes structure so that it looks the same as the sidebar
    generateRoutes(routes, basePath = '/', onlyOneShowingChildIsIng = true, parent = '', parents = []) {
      const res = []
      for (const route of routes) {
        // skip some route
        // if (route.onlyOneMenu) { continue }
        /**
          下级只有一个时归档到单个  编辑时不执行
         */
        /*  暂时取消
        if (onlyOneShowingChildIsIng && !route.hidden) {

          const onlyOneShowingChild = this.onlyOneShowingChild(route.children, route)

          if (route.children && onlyOneShowingChild && !route.alwaysShow) {
            route = onlyOneShowingChild
          }

        }
        */
        const data = {
          path: path.resolve(basePath, route.path),
          title: route.meta && route.meta.title,
          introduction: route.meta && route.meta.introduction,
          hidden: !!route.hidden,
          parents: []
        }
        const newParents = deepClone(parents)
        if (parent !== '') {
          data.parent = parent
          if (Array.isArray(newParents) && newParents.indexOf(parent) === -1) {
            newParents.push(parent)
          }
          data.parents = newParents
        } else {
          parents = []
        }
        // recursive child routes
        if (route.children) {
          data.children = this.generateRoutes(route.children, data.path, onlyOneShowingChildIsIng, data.path, newParents)
        }
        res.push(data)
      }
      return res
    },
    generateArr(routes) {
      let data = []
      routes.forEach(route => {
        data.push(route)
        if (route.children) {
          const temp = this.generateArr(route.children)
          if (temp.length > 0) {
            data = [...data, ...temp]
          }
        }
      })
      return data
    },
    handleAddRole() {
      this.role = Object.assign({}, defaultRole)
      if (this.$refs.tree) {
        this.$refs.tree.setCheckedNodes([])
      }
      this.dialogType = 'new'
      this.dialogVisible = true
      this.expandedKeys = []
      this.ifReset = false
      this.$nextTick(() => {
        this.ifReset = true
      })
    },
    handleEdit(scope) {
      this.dialogType = 'edit'
      this.dialogVisible = true
      this.checkStrictly = true
      this.role = deepClone(scope.row)
      // 为了解决重载tree结构
      this.expandedKeys = []
      this.ifReset = false
      this.$nextTick(() => {
        this.ifReset = true // 重新渲染以后等待渲染完成并设置选中
        this.$nextTick(() => {
          const routes = this.generateRoutes(this.role.routers, '/', false)
          this.$refs.tree.setCheckedNodes(this.generateArr(routes))
          this.checkStrictly = false
        })
      })
    },
    handleDelete({ $index, row }) {
      this.$confirm(this.$i18n.t('permission.deleteConfirm'), this.$i18n.t('table.tips'), {
        confirmButtonText: this.$i18n.t('table.confirm'),
        cancelButtonText: this.$i18n.t('table.cancel'),
        type: 'warning'
      }).then(async() => {
        await deleteRole(row.id)
        this.getRoles(this.listQuery)
        this.$notify({
          title: 'Success',
          dangerouslyUseHTMLString: true,
          message: this.$i18n.t('form.deleteSuccess'),
          type: 'success'
        })
      }).catch(() => {
        console.log('catch')
      })
    },
    generateTree(routes, basePath = '/', checkedKeys) {
      const res = []

      for (const route of routes) {
        const routePath = path.resolve(basePath, route.path)

        // recursive child routes
        if (route.children) {
          route.children = this.generateTree(route.children, routePath, checkedKeys)
        }

        if (checkedKeys.includes(routePath) || (route.children && route.children.length >= 1)) {
          res.push(route)
        }
      }
      return res
    },
    confirmRole() {
      this.submitLoading = true
      this.$refs.roleForm.validate(async(valid) => {
        if (valid) {
          try {
            const isEdit = this.dialogType === 'edit'
            this.role.checkedKeys = [...this.$refs.tree.getHalfCheckedKeys(), ...this.$refs.tree.getCheckedKeys()]
            delete this.role.routers // 清除view菜单
            if (isEdit) {
              await updateRole(this.role)
              this.role.routers = this.generateTree(deepClone(this.serviceRoutes), '/', this.role.checkedKeys)
              for (let index = 0; index < this.rolesList.length; index++) {
                if (this.rolesList[index].id === this.role.id) {
                  this.rolesList.splice(index, 1, Object.assign({}, this.role))
                  break
                }
              }
            } else {
              delete this.role.id // 清除id
              const data = await addRole(this.role)
              this.total = this.total + 1 // 总数量+1
              this.rolesList.push(data)
            }
            this.dialogVisible = false
            this.$notify({
              title: 'Success',
              dangerouslyUseHTMLString: true,
              message: this.$i18n.t('form.actionSuccess'),
              type: 'success'
            })
          } catch (error) {
            console.log(error)
            this.submitLoading = false
          }
        }
        this.submitLoading = false
      })
    },
    // reference: src/view/layout/components/Sidebar/SidebarItem.vue
    onlyOneShowingChild(children = [], parent) {
      let onlyOneChild = null
      const showingChildren = children.filter(item => !item.hidden)

      // When there is only one child route, the child route is displayed by default
      if (showingChildren.length === 1) {
        onlyOneChild = showingChildren[0]
        onlyOneChild.path = path.resolve(parent.path, onlyOneChild.path)
        return onlyOneChild
      }

      // Show parent if there are no child route to display
      if (showingChildren.length === 0) {
        onlyOneChild = { ... parent, path: '', noShowingChildren: true }
        return onlyOneChild
      }

      return false
    }
  }
}
</script>

<style lang="scss" scoped>
.app-container {
  .roles-table {
    margin-top: 30px;
  }
  .permission-tree {
    margin-bottom: 30px;
  }
}
</style>
