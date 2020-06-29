<template>
  <div class="navbar">
    <hamburger id="hamburger-container" :is-active="sidebar.opened" class="hamburger-container" @toggleClick="toggleSideBar" />

    <breadcrumb id="breadcrumb-container" class="breadcrumb-container" />

    <div class="right-menu">
      <template v-if="device!=='mobile'">
        <search id="header-search" class="right-menu-item" />

        <error-log class="errLog-container right-menu-item hover-effect" />

        <screenfull id="screenfull" class="right-menu-item hover-effect" />

        <el-tooltip :content="$t('navbar.size')" effect="dark" placement="bottom">
          <size-select id="size-select" class="right-menu-item hover-effect" />
        </el-tooltip>

        <lang-select class="right-menu-item hover-effect" />

      </template>

      <el-dropdown class="avatar-container right-menu-item hover-effect" trigger="click" @command="handleCommand">
        <div class="avatar-wrapper">
          <img :src="avatar" class="user-avatar">
          <i class="el-icon-caret-bottom" />
        </div>
        <el-dropdown-menu slot="dropdown">
          <el-dropdown-item command="haddlePassword">
            <span>{{ $t('common.edit')+$t('login.password') }}</span>
          </el-dropdown-item>
          <el-dropdown-item v-if="is_admin" command="haddleOpenDev">
            <span>{{ $t('common.openDev') }}</span>
          </el-dropdown-item>
          <el-dropdown-item v-if="is_admin" command="haddleCloseDev">
            <span>{{ $t('common.closeDev') }}</span>
          </el-dropdown-item>
          <!--<router-link to="/resetPassword">
            <el-dropdown-item>
              {{ $t('common.edit')+$t('login.password') }}
            </el-dropdown-item>
          </router-link>-->
          <el-dropdown-item divided command="logout">
            <span style="display:block;">{{ $t('navbar.logOut') }}</span>
          </el-dropdown-item>
        </el-dropdown-menu>
      </el-dropdown>
    </div>
    <el-dialog :visible.sync="dialogFormVisible" :title="$t('common.edit')+$t('login.password')" width="30%" @closed="hiddenDialog">
      <el-form
        ref="passwordForm"
        :rules="rules"
        :model="users"
        label-width="80px"
        label-position="right"
      >
        <el-form-item :label="$t('login.oldPassword')" prop="oldPassword">
          <el-input v-model="users.oldPassword" :type="oldPasswordType" autocomplete="off" :placeholder="$t('common.placeholder',{placeholder:$t('login.oldPassword')})" />
          <span class="show-pwd" @click="showOldPwd">
            <svg-icon :icon-class="oldPasswordType === 'password' ? 'eye' : 'eye-open'" />
          </span>
        </el-form-item>
        <el-form-item :label="$t('login.password')" prop="password">
          <el-input v-model="users.password" :type="passwordType" autocomplete="off" :placeholder="$t('common.placeholder',{placeholder:$t('login.password')})" />
          <span class="show-pwd" @click="showPwd">
            <svg-icon :icon-class="passwordType === 'password' ? 'eye' : 'eye-open'" />
          </span>
        </el-form-item>
        <el-form-item :label="$t('login.confirmPassword')" prop="confirmPassword">
          <el-input v-model="users.password_confirmation" :type="confirmPasswordType" autocomplete="off" :placeholder="$t('common.placeholder',{placeholder:$t('login.confirmPassword')})" />
          <span class="show-pwd" @click="showCfmPwd">
            <svg-icon :icon-class="confirmPasswordType === 'password' ? 'eye' : 'eye-open'" />
          </span>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button type="danger" @click="dialogFormVisible = false">{{ $t('table.cancel') }}</el-button>
        <el-button type="primary" :loading="submitLoading" @click="confirmPassword">{{ $t('table.confirm') }}</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import Breadcrumb from '@/components/Breadcrumb'
import Hamburger from '@/components/Hamburger'
import ErrorLog from '@/components/ErrorLog'
import Screenfull from '@/components/Screenfull'
import SizeSelect from '@/components/SizeSelect'
import LangSelect from '@/components/LangSelect'
import Search from '@/components/HeaderSearch'
import { updatePassoword, setDev } from '@/api/base/adminUsers'

const defaultPassowrd = {
  oldPassword: '',
  password: '',
  password_confirmation: ''
}

export default {
  components: {
    Breadcrumb,
    Hamburger,
    ErrorLog,
    Screenfull,
    SizeSelect,
    LangSelect,
    Search
  },
  data() {
    const validatePassword = (rule, value, callback) => {
      if (value.length < 6) {
        callback(new Error(this.$i18n.t('login.errorEmptyPassWord')))
      } else {
        callback()
      }
    }
    const validateConfirmPassword = (rule, value, callback) => {
      if (this.users.password !== this.users.password_confirmation && this.users.password !== '') {
        callback(new Error(this.$i18n.t('rules.confirmPasswordError')))
      } else {
        callback()
      }
    }
    return {
      dialogFormVisible: false,
      submitLoading: false,
      oldPasswordType: 'password',
      passwordType: 'password',
      confirmPasswordType: 'password',
      users: Object.assign({}, defaultPassowrd),
      rules: {
        oldPassword: [{ required: true, validator: validatePassword, trigger: 'blur' }],
        password: [{ required: true, validator: validatePassword, trigger: 'blur' }],
        confirmPassword: [{ required: true, validator: validateConfirmPassword, trigger: 'blur' }]
      }
    }
  },
  computed: {
    ...mapGetters([
      'sidebar',
      'name',
      'avatar',
      'device',
      'is_admin'
    ])
  },
  methods: {
    hiddenDialog() {
      this.users = Object.assign({}, defaultPassowrd)
    },
    handleCommand(command) {
      this[command]()
    },
    showOldPwd() {
      if (this.oldPasswordType === 'password') {
        this.oldPasswordType = 'text'
      } else {
        this.oldPasswordType = 'password'
      }
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
    confirmPassword() {
      this.submitLoading = true
      this.$refs.passwordForm.validate(async(valid) => {
        if (valid) {
          try {
            await updatePassoword(this.users)
            this.dialogFormVisible = false
            // 修改密码以后 重新登录
            this.logout()
          } catch (error) {
            this.submitLoading = false
          }
        }
        this.submitLoading = false
      })
    },
    haddlePassword() {
      this.dialogFormVisible = true
    },
    async haddleOpenDev() {
      await setDev({ dev: 1 })
      location.reload()
    },
    async haddleCloseDev() {
      await setDev({ dev: 0 })
      location.reload()
    },
    toggleSideBar() {
      this.$store.dispatch('app/toggleSideBar')
    },
    async logout() {
      await this.$store.dispatch('user/logout')
      this.$router.push(`/login?redirect=${this.$route.fullPath}`)
    }
  }
}
</script>

<style lang="scss" scoped>
.navbar {
  height: 50px;
  overflow: hidden;
  position: relative;
  background: #fff;
  box-shadow: 0 1px 4px rgba(0,21,41,.08);
  .show-pwd {
      position: absolute;
      right: 10px;
      top: 2px;
      font-size: 16px;
      cursor: pointer;
      user-select: none;
  }

  .hamburger-container {
    line-height: 46px;
    height: 100%;
    float: left;
    cursor: pointer;
    transition: background .3s;
    -webkit-tap-highlight-color:transparent;

    &:hover {
      background: rgba(0, 0, 0, .025)
    }
  }

  .breadcrumb-container {
    float: left;
  }

  .errLog-container {
    display: inline-block;
    vertical-align: top;
  }

  .right-menu {
    float: right;
    height: 100%;
    line-height: 50px;

    &:focus {
      outline: none;
    }

    .right-menu-item {
      display: inline-block;
      padding: 0 8px;
      height: 100%;
      font-size: 18px;
      color: #5a5e66;
      vertical-align: text-bottom;

      &.hover-effect {
        cursor: pointer;
        transition: background .3s;

        &:hover {
          background: rgba(0, 0, 0, .025)
        }
      }
    }

    .avatar-container {
      margin-right: 30px;

      .avatar-wrapper {
        margin-top: 5px;
        position: relative;

        .user-avatar {
          cursor: pointer;
          width: 40px;
          height: 40px;
          border-radius: 10px;
        }

        .el-icon-caret-bottom {
          cursor: pointer;
          position: absolute;
          right: -20px;
          top: 25px;
          font-size: 12px;
        }
      }
    }
  }
}
</style>
