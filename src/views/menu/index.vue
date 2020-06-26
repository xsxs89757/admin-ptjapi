<template>
  <div>
    <div class="app-container">
      <div class="filter-container">
        <!--<el-input v-model="search" :placeholder="$t('table.menu') + $t('table.name')" style="width: 200px;" class="filter-item" />-->
        <el-button v-permission="'menu.addMenu'" v-waves class="filter-item" icon="el-icon-plus" type="primary" @click="handleAddMenu">{{ $t('table.add') }}</el-button>
        <el-button v-permission="'menu.sortMenu'" v-waves :loading="sortLoading" class="filter-item" icon="el-icon-sort" type="primary" @click="handleSortMenu">{{ $t('table.sort') }}</el-button>
      </div>
      <el-table
        ref="TreeTable"
        v-loading="listLoading"
        :data="menuList.filter(data => !search || data.name.toLowerCase().includes(search.toLowerCase()) || data.introduction.toLowerCase().includes(search.toLowerCase()))"
        row-key="id"
        border
        :default-expand-all="expandAll"
        :tree-props="{children: 'children', hasChildren: 'hasChildren'}"
      >
        <el-table-column
          prop="introduction"
          :label="$t('table.menu') + $t('table.name')"
        />
        <el-table-column
          prop="name"
          :label="$t('table.menu')"
        />
        <el-table-column
          prop="redirect"
          :label="$t('table.redirect')"
        />
        <el-table-column
          prop="params"
          :label="$t('table.params')"
        />
        <el-table-column align="center" :label="$t('table.status')" width="80">
          <template slot-scope="scope">
            <el-tag :type="scope.row.hidden?'danger':'success'">{{ scope.row.hidden?$t('table.hidden'):$t('table.show') }}</el-tag>
          </template>
        </el-table-column>

        <el-table-column align="center" :label="$t('table.cache')" width="80">
          <template slot-scope="scope">
            <el-tag :class="scope.row.no_cache?'el-icon-close':'el-icon-check'" :type="scope.row.no_cache?'danger':'success'" />
          </template>
        </el-table-column>

        <el-table-column align="center" :label="$t('table.externalLink')" width="80">
          <template slot-scope="scope">
            <el-tag :class="scope.row.is_external_link?'el-icon-check':'el-icon-close'" :type="scope.row.is_external_link?'success':'danger'" />
          </template>
        </el-table-column>

        <el-table-column align="center" :label="$t('table.affix')+$t('table.menu')" width="80">
          <template slot-scope="scope">
            <el-tag :class="scope.row.affix?'el-icon-check':'el-icon-close'" :type="scope.row.affix?'success':'danger'" />
          </template>
        </el-table-column>

        <el-table-column :label="$t('table.sort')" width="80">
          <template slot-scope="scope">
            <el-input v-model="scope.row.sort" @blur.prevent="sortBlur(scope.row)" @focus.prevent="sortFocus(scope.row)" />
          </template>
        </el-table-column>

        <el-table-column :label="$t('table.actions')" width="250">
          <template slot-scope="scope">
            <el-button v-if="(!scope.row.is_external_link && !scope.row.hidden && checkPermission('menu.addMenu'))" size="mini" type="primary" @click="addItem(scope.row)">{{ $t('table.add') + $t('table.children') }}</el-button>
            <el-button v-permission="'menu.editMenu'" size="mini" type="success" @click="handleEdit(scope.row)">{{ $t('table.edit') }}</el-button>
            <el-button v-permission="'menu.deleteMenu'" size="mini" type="danger" @click="handleDelete(scope.row)">{{ $t('table.delete') }}</el-button>
          </template>
        </el-table-column>
      </el-table>

    </div>

    <el-dialog :visible.sync="dialogFormVisible" :title="dialogTitle" width="30%" @closed="hiddenDialog">
      <el-form
        ref="menuForm"
        v-loading="formLoading"
        :rules="rules"
        :model="menu"
        label-width="80px"
        label-position="right"
      >
        <el-form-item :label="$t('table.parent')">
          <el-cascader
            v-model="menu.parentKey"
            :options="options"
            :props="{ checkStrictly: true ,expandTrigger:'hover'}"
            clearable
          />
        </el-form-item>
        <el-form-item :label="$t('table.menu')" prop="name">
          <el-input v-model.trim="menu.name" :placeholder="$t('table.menu')" />
        </el-form-item>
        <el-form-item :label="$t('table.menu') + $t('table.name')" prop="introduction">
          <el-input v-model.trim="menu.introduction" :placeholder="$t('table.menu') + $t('table.name')" />
        </el-form-item>
        <el-form-item :label="$t('table.redirect')">
          <el-input v-model.trim="menu.redirect" :placeholder="$t('table.redirect')" />
        </el-form-item>
        <el-form-item :label="$t('table.params')">
          <el-input v-model.trim="menu.params" :placeholder="$t('table.params')" />
        </el-form-item>
        <el-form-item :label="$t('table.sort')">
          <el-col :span="8">
            <el-input v-model.trim="menu.sort" :placeholder="$t('table.sort')" />
          </el-col>
        </el-form-item>
        <el-form-item :label="$t('table.icon')">
          <el-select v-model="menu.icon" clearable :placeholder="$t('table.please')+$t('table.choose')">
            <el-option
              v-for="item in iconsMap"
              :key="item"
              :label="item"
              :value="item"
            >
              <span style="float: left"><svg-icon :icon-class="item" class-name="disabled" /></span>
              <span style="float: right; color: #8492a6; font-size: 13px">{{ item }}</span>
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="">
          <el-col :span="8">
            <el-switch
              v-model="menu.hidden"
              active-color="#ff4949"
              inactive-color="#13ce66"
              :active-text="$t('table.hidden')"
              :inactive-text="$t('table.show')"
            />
          </el-col>
          <el-col :span="16">
            <el-switch
              v-model="menu.always_show"
              active-color="#ff4949"
              inactive-color="#13ce66"
              :active-text="$t('table.noShow')+$t('table.breadcrumb')"
              :inactive-text="$t('table.show')+$t('table.breadcrumb')"
            />
          </el-col>
        </el-form-item>
        <el-form-item label="">
          <el-col :span="8">
            <el-switch
              v-model="menu.cache"
              active-color="#ff4949"
              inactive-color="#13ce66"
              :inactive-text="$t('table.cache')"
            />
          </el-col>
          <el-col :span="8">
            <el-switch
              v-model="menu.affix"
              active-color="#13ce66"
              inactive-color="#ff4949"
              :inactive-text="$t('table.affix')+$t('table.menu')"
            />
          </el-col>
          <el-col :span="8">
            <el-switch
              v-model="menu.is_external_link"
              active-color="#13ce66"
              inactive-color="#ff4949"
              :inactive-text="$t('table.externalLink')"
            />
          </el-col>
        </el-form-item>
        <el-form-item v-if="menu.is_external_link" :label="$t('table.externalLink')" prop="external_link">
          <el-input v-model.trim="menu.external_link" :placeholder="$t('table.externalLink')" />
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button type="danger" @click="dialogFormVisible = false">{{ $t('table.cancel') }}</el-button>
        <el-button type="primary" :loading="submitLoading" @click="confirmMenu">{{ $t('table.confirm') }}</el-button>
      </span>
    </el-dialog>

  </div>
</template>

<script>
import { getMenu, deleteMenu, updateMenu, addMenu, updateMenuSort, getChannel } from '@/api/base/menu'
import i18n from '@/lang'
import checkPermission from '@/utils/permission'
import waves from '@/directive/waves' // Waves directive
import icons from './requireIcons'
import cloneDeep from 'lodash/cloneDeep'

const defaultMenu = {
  id: 0,
  key: '',
  name: '',
  introduction: '',
  redirect: '',
  hidden: false,
  always_show: false,
  no_cache: false,
  is_external_link: false,
  external_link: '',
  affix: false,
  icon: '',
  breadcrumb: false,
  params: '',
  sort: 1,
  pid: 0,
  parentKey: '',
  oldKey: ''
}

export default {
  directives: { waves },
  data() {
    return {
      filterText: '',
      menuList: [],
      menu: Object.assign({}, defaultMenu),
      options: [],
      dialogFormVisible: false,
      listLoading: false,
      formLoading: false,
      expandAll: false,
      dialogTitle: i18n.t('table.add'),
      iconsMap: icons,
      dialogType: 'new',
      submitLoading: false,
      sortLoading: false,
      oldSort: 0,
      sortData: [],
      search: '',
      rules: {
        external_link: [{ required: true, message: i18n.t('table.please') + i18n.t('table.input') + i18n.t('table.externalLink'), trigger: 'blur' },
          { pattern: /^([hH][tT]{2}[pP]:\/\/|[hH][tT]{2}[pP][sS]:\/\/)(([A-Za-z0-9-~]+).)+([A-Za-z0-9-~\/])+$/, message: i18n.t('table.externalLink') + i18n.t('table.input') + i18n.t('table.errors') }
        ],
        name: [{ required: true, message: i18n.t('table.please') + i18n.t('table.input') + i18n.t('table.menu') },
          { pattern: /^[a-zA-Z]+$/, message: i18n.t('rules.mustBeEnglish') }
        ],
        introduction: [{ required: true, message: i18n.t('table.please') + i18n.t('table.input') + i18n.t('table.menu') + i18n.t('table.name') }]

      }
    }
  },
  watch: {
    'menu.parentKey': function() {
      if (Array.isArray(this.menu.parentKey)) {
        this.menu.parentKey = this.menu.parentKey[0]
      }
    }
  },
  created() {
    this.getMenu()
  },
  methods: {
    checkPermission,
    hiddenDialog() {
      this.$nextTick(() => {
        this.$refs.menuForm.resetFields()
        this.submitLoading = false
      })
    },
    async getMenu() {
      this.listLoading = true
      const data = await getMenu()
      this.menuList = data
      this.listLoading = false
    },
    async aysncOtherList() {
      this.formLoading = true
      const res = await getChannel()
      this.options = res
      this.formLoading = false
    },
    handleAddMenu() {
      this.aysncOtherList()
      this.dialogTitle = i18n.t('table.add') + i18n.t('table.menu')
      this.dialogType = 'new'
      this.dialogFormVisible = true
      this.$nextTick(() => {
        this.menu = Object.assign({}, defaultMenu) // 重置form使用的数组
        this.$refs.menuForm.resetFields()
      })
    },
    handleEdit(row) {
      this.aysncOtherList()
      this.dialogTitle = i18n.t('table.edit') + i18n.t('table.menu')
      this.dialogType = 'edit'
      this.dialogFormVisible = true
      this.$nextTick(() => {
        this.menu = cloneDeep(row)
      })
    },
    async handleSortMenu() {
      this.sortLoading = true
      if (Array.isArray(this.sortData) && this.sortData.length > 0) {
        try {
          await updateMenuSort(this.sortData)
          this.sortData = []
          this.getMenu()
        } catch (error) {
          console.log(error)
          this.sortLoading = false
        }
      }
      this.sortLoading = false
    },
    handleDelete(row) {
      this.$confirm(this.$i18n.t('table.menu') + ':' + row.introduction + ' ' + this.$i18n.t('form.deleteConfirm'), this.$i18n.t('table.tips'), {
        confirmButtonText: this.$i18n.t('table.confirm'),
        cancelButtonText: this.$i18n.t('table.cancel'),
        type: 'warning'
      }).then(async() => {
        await deleteMenu(row.id)
        this.getMenu()
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
    confirmMenu() {
      this.submitLoading = true
      this.$refs.menuForm.validate(async(valid) => {
        if (valid) {
          try {
            const isEdit = this.dialogType === 'edit'
            if (isEdit) {
              await updateMenu(this.menu)
            } else {
              delete this.menu.id // 清除id
              await addMenu(this.menu)
            }
            this.dialogFormVisible = false
            this.getMenu()
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
    addItem(row) {
      this.aysncOtherList()
      this.menu = Object.assign({}, defaultMenu) // 重置form使用的数组
      this.menu.parentKey = row.key
      this.dialogTitle = i18n.t('table.add') + i18n.t('table.menu')
      this.dialogType = 'new'
      this.$nextTick(() => {
        this.$refs.menuForm.resetFields()
      })
      this.dialogFormVisible = true
    },
    sortBlur(row) {
      this.$nextTick(() => {
        if (row.sort <= 0 || isNaN(row.sort)) {
          row.sort = 1
        }
        if (row.sort !== this.oldSort) {
          this.sortData.push({ id: row.id, sort: row.sort })
        }
        this.oldSort = 0
      })
    },
    sortFocus(row) {
      this.oldSort = row.sort
    }
  }
}
</script>
<style>
.right{
  float: right;
}
</style>
