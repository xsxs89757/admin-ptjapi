<template>
  <div class="app-container">
    <div class="filter-container">
      <el-input v-model="listQuery.id" placeholder="ID" style="width: 200px;" class="filter-item" @keyup.enter.native="getAdminUsers" />
      <el-input v-model="listQuery.username" :placeholder="$t('table.adminUsers.username')" style="width: 200px;" class="filter-item" @keyup.enter.native="getAdminUsers" />
      <el-select v-model="listQuery.sort" style="width: 140px" class="filter-item" @change="getAdminUsers">
        <el-option v-for="item in sortOptions" :key="item.key" :label="item.label" :value="item.key" />
      </el-select>
      <el-button v-waves class="filter-item" type="primary" icon="el-icon-search" @click="getAdminUsers">{{ $t('table.search') }}</el-button>
      <el-button v-permission="'adminUsers.list.addAdminUser'" class="filter-item" style="margin-left: 10px;" type="primary" icon="el-icon-plus" @click="handleAdd">{{ $t('table.add') }}</el-button>
    </div>

    <el-table
      :key="tableKey"
      v-loading="listLoading"
      :data="usersList"
      border
      class="adminUsers-table"
    >
      <el-table-column type="expand">
        <template slot-scope="scope">
          <el-form label-position="left" inline class="table-expand">
            <el-form-item :label="$t('table.date')">
              <span>{{ scope.row.create_time }}</span>
            </el-form-item>
            <el-form-item :label="$t('table.adminUsers.lastLoginTime')">
              <span>{{ scope.row.last_login_time }}</span>
            </el-form-item>
            <el-form-item :label="$t('table.adminUsers.loginIp')">
              <span>{{ scope.row.last_login_ip }}</span>
            </el-form-item>
            <el-form-item :label="$t('table.operator')+'ID'">
              <span>{{ scope.row.create_users.id }}</span>
            </el-form-item>
            <el-form-item :label="$t('table.operator')">
              <span>{{ scope.row.create_users.username }}</span>
            </el-form-item>
          </el-form>
        </template>
      </el-table-column>
      <el-table-column align="center" label="ID">
        <template slot-scope="scope">{{ scope.row.id }}</template>
      </el-table-column>
      <el-table-column align="center" :label=" $t('table.adminUsers.username') ">
        <template slot-scope="scope">{{ scope.row.username }}</template>
      </el-table-column>
      <el-table-column align="center" :label=" $t('table.adminUsers.nickname') ">
        <template slot-scope="scope">{{ scope.row.nickname }}</template>
      </el-table-column>
      <el-table-column align="center" :label=" $t('table.adminUsers.facephoto') ">
        <template slot-scope="scope"><img :src="scope.row.facephoto_url" class="user-avatar"></template>
      </el-table-column>
      <el-table-column align="center" :label=" $t('table.permission') ">
        <template slot-scope="scope"><div v-for="(role,index) in scope.row.roles" :key="index">{{ role }}</div></template>
      </el-table-column>
      <el-table-column align="center" :label=" $t('table.status') ">
        <template slot-scope="scope">
          <el-tag v-if="scope.row.status" type="success">{{ $t('table.enable') }}</el-tag>
          <el-tag v-if="!scope.row.status" type="danger">{{ $t('table.forbidden') }}</el-tag>
        </template>
      </el-table-column>
      <el-table-column align="center" :label="$t('table.actions')">
        <template slot-scope="scope">
          <el-button v-permission="'adminUsers.list.editAdminUser'" v-waves icon="el-icon-edit" type="primary" size="small" @click="handleEdit(scope)">{{ $t('table.edit') }}</el-button>
          <el-button v-permission="'adminUsers.list.deleteAdminUser'" v-waves icon="el-icon-delete" type="danger" :disabled="scope.row.id===1?true:false" size="small" @click="handleDelete(scope)">{{ $t('table.delete') }}</el-button>
        </template>
      </el-table-column>
    </el-table>

    <pagination v-show="total>0" :total="total" :page.sync="listQuery.page" :limit.sync="listQuery.limit" @pagination="getAdminUsers" />

    <el-dialog
      :visible.sync="dialogVisible"
      :title="dialogTitle"
      width="40%"
      @closed="hiddenDialog"
    >
      <el-form
        ref="AdminUsersForm"
        v-loading="formLoading"
        :model="users"
        :rules="rules"
        label-width="80px"
        label-position="right"
      >
        <el-form-item :label="$t('table.adminUsers.username')" prop="username">
          <el-input v-model="users.username" :disabled="usernameDisabled" :placeholder="$t('common.placeholder',{placeholder:$t('table.adminUsers.username')})" />
        </el-form-item>
        <el-form-item :label="$t('table.adminUsers.nickname')" prop="nickname">
          <el-input v-model="users.nickname" :placeholder="$t('common.placeholder',{placeholder:$t('table.adminUsers.nickname')})" />
        </el-form-item>
        <el-form-item :label="$t('table.adminUsers.facephoto')">
          <single-image-upload :image-url="users.facephoto_url" :params="{type:'facephoto'}" :width="80" :height="80" @callbackshowPath="showFacephoto" @callbackRealPath="realFacephoto" />
        </el-form-item>
        <el-form-item :label="$t('login.password')" :prop="password">
          <el-input v-model="users.password" :type="passwordType" autocomplete="off" :placeholder="$t('common.placeholder',{placeholder:$t('login.password')})" />
          <span class="show-pwd" @click="showPwd">
            <svg-icon :icon-class="passwordType === 'password' ? 'eye' : 'eye-open'" />
          </span>
        </el-form-item>
        <el-form-item :label="$t('login.confirmPassword')" :prop="confirmPassword">
          <el-input v-model="users.password_confirmation" :type="confirmPasswordType" autocomplete="off" :placeholder="$t('common.placeholder',{placeholder:$t('login.confirmPassword')})" />
          <span class="show-pwd" @click="showCfmPwd">
            <svg-icon :icon-class="confirmPasswordType === 'password' ? 'eye' : 'eye-open'" />
          </span>
        </el-form-item>
        <el-form-item :label="$t('table.status')">
          <el-switch
            v-model="users.status"
            active-color="#13ce66"
            inactive-color="#ff4949"
            :active-text="$t('table.enable')"
            :inactive-text="$t('table.forbidden')"
          />
        </el-form-item>
        <el-form-item :label="$t('table.permission')" prop="permission">
          <el-select v-model="users.roles" multiple placeholder="请选择">
            <el-option
              v-for="(item,index) in rolesList"
              :key="index"
              :label="item"
              :value="item"
            />
          </el-select>
        </el-form-item>
      </el-form>
      <div style="text-align:right;">
        <el-button v-waves type="danger" @click="dialogVisible=false">{{ $t('table.cancel') }}</el-button>
        <el-button v-waves type="primary" :loading="submitLoading" @click="confirmAdminUsers">{{ $t('table.confirm') }}</el-button>
      </div>
    </el-dialog>
  </div>

</template>

<script>
import { getAdminUsers, deleteAdminUsers, addAdminUsers, updateAdminUsers } from '@/api/base/adminUsers'
import { getRolesList } from '@/api/base/role'
import i18n from '@/lang'
import Pagination from '@/components/Pagination' // Secondary package based on el-pagination
import waves from '@/directive/waves' // Waves directive
import SingleImageUpload from '@/components/Upload/singleImageUpload'
import { checkRate } from '@/utils/validate'
import cloneDeep from 'lodash/cloneDeep'

const defaultAdminUsers = {
  username: '',
  nickname: '',
  roles: [],
  facephoto_url: '',
  facephoto: '',
  status: true,
  password: '',
  password_confirmation: ''

}

export default {
  // eslint-disable-next-line vue/name-property-casing
  name: 'adminUsers_list',
  components: { Pagination, 'single-image-upload': SingleImageUpload },
  directives: { waves }, // 插件
  data() {
    const validateUsername = (rule, value, callback) => {
      if (!checkRate(value) || value === '') {
        callback(new Error(i18n.t('login.errorEmptyUserName')))
      } else {
        callback()
      }
    }
    const validatePermission = (rule, value, callback) => {
      if (Array.isArray(this.users.roles) && this.users.roles.length === 0) {
        callback(new Error(i18n.t('rules.permissionRequired')))
      } else {
        callback()
      }
    }
    const validatePassword = (rule, value, callback) => {
      if (value.length < 6) {
        callback(new Error(this.$i18n.t('login.errorEmptyPassWord')))
      } else {
        callback()
      }
    }
    const validateConfirmPassword = (rule, value, callback) => {
      if (this.users.password !== this.users.password_confirmation && this.users.password !== '') {
        callback(new Error(i18n.t('rules.confirmPasswordError')))
      } else {
        callback()
      }
    }
    return {
      users: Object.assign({}, defaultAdminUsers),
      usersList: [],
      rolesList: [],
      dialogVisible: false,
      dialogTitle: '',
      dialogType: 'add',
      tableKey: 0,
      listLoading: false,
      formLoading: false,
      total: 0,
      listQuery: {
        page: 1,
        limit: 20,
        id: '',
        username: '',
        sortName: 'id',
        sort: 'asc'
      },
      sortOptions: [{ label: 'ID' + i18n.t('table.ascending'), key: 'asc' }, { label: 'ID' + i18n.t('table.descending'), key: 'desc' }],
      rules: {
        username: [{ required: true, validator: validateUsername, trigger: 'blur' }],
        nickname: [{ required: true, message: i18n.t('rules.NickNameRequired'), trigger: 'blur' }],
        password: [{ required: true, validator: validatePassword, trigger: 'blur' }],
        confirmPassword: [{ required: true, validator: validateConfirmPassword, trigger: 'blur' }],
        permission: [{ required: true, validator: validatePermission, trigger: 'blur' }],
        empty: [{}]
      },
      passwordType: 'password',
      confirmPasswordType: 'password',
      password: 'password',
      confirmPassword: 'confirmPassword',
      submitLoading: false,
      usernameDisabled: false
    }
  },
  computed: {

  },
  watch: {
    // 检测密码和确认密码输入框输入  调整规则验证
    'users.password': function(val) {
      if (val !== '') {
        this.password = 'password'
        this.confirmPassword = 'confirmPassword'
      }
    },
    'users.password_confirmation': function(val) {
      if (val !== '') {
        this.password = 'password'
        this.confirmPassword = 'confirmPassword'
      }
    }
  },
  created() {
    this.getAdminUsers() // 初始化加载
  },
  methods: {
    hiddenDialog() {
      this.$refs.AdminUsersForm.resetFields()
      this.submitLoading = false
    },
    showPwd() {
      if (this.passwordType === 'password') {
        this.passwordType = 'text'
      } else {
        this.passwordType = 'password'
      }
    },
    showCfmPwd() {
      if (this.confirmPasswordType === 'password') {
        this.confirmPasswordType = 'text'
      } else {
        this.confirmPasswordType = 'password'
      }
    },
    async getAdminUsers() {
      this.listLoading = true
      const res = await getAdminUsers(this.listQuery)
      this.usersList = res.data
      this.total = res.meta.total
      this.listLoading = false
    },
    showFacephoto(path) {
      console.log(path)
      this.users.facephoto_url = path // 上传回调
    },
    realFacephoto(path) {
      this.users.facephoto = path // 上传回调
    },
    async aysncOtherList() {
      this.formLoading = true
      const res = await getRolesList()
      this.rolesList = res
      this.formLoading = false
    },
    handleAdd() {
      this.aysncOtherList()
      this.users = Object.assign({}, defaultAdminUsers)
      this.dialogTitle = i18n.t('table.addTitle', { title: i18n.t('table.adminUsers.name') })
      this.dialogType = 'add'
      this.password = 'password'
      this.confirmPassword = 'confirmPassword'
      this.auth = 'adminUsers.list.addAdminUser'
      this.usernameDisabled = false
      this.dialogVisible = true
    },
    handleEdit(scope) {
      this.aysncOtherList()
      this.users = cloneDeep(scope.row)
      this.users = Object.assign({ password: '', password_confirmation: '' }, this.users)
      this.dialogTitle = i18n.t('table.editTitle', { title: i18n.t('table.adminUsers.name') })
      // 取消校检密码
      this.password = 'empty'
      this.confirmPassword = 'empty'
      // this.usernameDisabled = true  暂时取消用户名无法修改的功能
      this.dialogType = 'edit'
      this.auth = 'adminUsers.list.editAdminUser'
      this.dialogVisible = true
    },
    handleDelete({ $index, row }) {
      this.$confirm(this.$i18n.t('form.deleteConfirm'), this.$i18n.t('table.tips'), {
        confirmButtonText: this.$i18n.t('table.confirm'),
        cancelButtonText: this.$i18n.t('table.cancel'),
        type: 'warning'
      }).then(async() => {
        await deleteAdminUsers(row.id)
        this.getAdminUsers()
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
    confirmAdminUsers() {
      this.submitLoading = true
      this.$refs.AdminUsersForm.validate(async(valid) => {
        if (valid) {
          try {
            const isEdit = this.dialogType === 'edit'
            if (isEdit) {
              await updateAdminUsers(this.users)
              for (let index = 0; index < this.usersList.length; index++) {
                if (this.usersList[index].id === this.users.id) {
                  this.usersList.splice(index, 1, Object.assign({}, this.users))
                  break
                }
              }
            } else {
              delete this.users.id // 清除id
              const data = await addAdminUsers(this.users)
              this.total = this.total + 1 // 总数量+1
              this.usersList.push(data)
            }
            this.dialogVisible = false
            this.$notify({
              title: 'Success',
              dangerouslyUseHTMLString: true,
              message: this.$i18n.t('form.actionSuccess'),
              type: 'success'
            })
          } catch (error) {
            this.submitLoading = false
          }
        }
        this.submitLoading = false
      })
    }
  }
}
</script>

<style lang="scss" scoped>
$dark_gray:#889aa4;
.app-container {
  .adminUsers-table {
    width: 100%;
    margin-top: 30px;
  }
  .user-avatar {
    cursor: pointer;
    width: 40px;
    height: 40px;
    border-radius: 10px;
  }
  .show-pwd {
    position: absolute;
    right: 10px;
    top: 2px;
    font-size: 16px;
    color: $dark_gray;
    cursor: pointer;
    user-select: none;
  }
  .table-expand {
    font-size: 0;
    label {
        width: 90px;
        color: #99a9bf;
    }
    .el-form-item {
      margin-right: 0;
      margin-bottom: 0;
      width: 50%;
    }
  }
}
</style>
