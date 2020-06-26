<template>
  <div class="tab-container">
    <div class="filter-container">
      <el-input v-model="keyword" :placeholder="$t('table.config.name')+'/'+$t('table.config.title')" style="width: 200px;" class="filter-item" @keyup.enter.native="handleSearch" />
      <el-button class="filter-item" type="primary" icon="el-icon-search" @click="handleSearch">{{ $t('table.search') }}</el-button>
      <el-button v-if="activeName!=='all'" :loading="sortLoading" class="filter-item" icon="el-icon-sort" type="primary" @click="handleSortMenu">{{ $t('table.sort') }}</el-button>
      <el-button v-if="checkPermission('system.list.add')" class="filter-item" style="margin-left: 10px;" type="primary" icon="el-icon-plus" @click="handleAdd">{{ $t('table.add') }}</el-button>
    </div>
    <el-tabs v-model="activeName" style="margin-top:15px;" type="border-card">
      <el-tab-pane v-for="item in tabMapOptions" :key="item.key" :label="item.label" :name="item.key">
        <tab-pane v-if="activeName==item.key" ref="tabPane" :type="item.key" :keyword="keyword" @onDelete="handleDeleteRow" @onEdit="handleEditRow" @onSortBlur="haddleSortBlur" @onSortFocus="haddleSortFocus" />
      </el-tab-pane>
    </el-tabs>
    <el-dialog :visible.sync="dialogFormVisible" :title="dialogTitle" width="30%" @closed="hiddenDialog">
      <el-form
        ref="configForm"
        :rules="rules"
        :model="config"
        label-width="80px"
        label-position="right"
      >
        <el-form-item :label="$t('table.config.type')" prop="type">
          <el-select v-model="config.type" :placeholder="$t('common.plaseChoose')">
            <el-option
              v-for="type in tabMapOptionsType"
              :key="type.key"
              :label="type.label"
              :value="type.key"
            />
          </el-select>
        </el-form-item>
        <el-form-item :label="$t('table.config.name')" prop="name">
          <el-input v-model.trim="config.name" :placeholder="$t('table.config.name')" />
        </el-form-item>
        <el-form-item :label="$t('table.config.title')" prop="title">
          <el-input v-model.trim="config.title" :placeholder="$t('table.config.title')" />
        </el-form-item>

        <el-form-item :label="$t('table.config.group')" prop="group">
          <el-select v-model="config.group" :placeholder="$t('common.plaseChoose')">
            <el-option
              v-for="group in tabMapOptionsList"
              :key="group.key"
              :label="group.label"
              :value="group.key"
            />
          </el-select>
        </el-form-item>
        <el-form-item>
          <el-col :span="10">
            <el-switch
              v-model="config.store"
              active-color="#13ce66"
              inactive-color="#ff4949"
              :active-text="$t('table.config.store')"
            />
          </el-col>
          <el-col :span="8">
            <el-switch
              v-model="config.status"
              active-color="#13ce66"
              inactive-color="#ff4949"
              :active-text="$t('table.show')"
              :inactive-text="$t('table.hidden')"
            />
          </el-col>
        </el-form-item>
        <el-form-item v-if="config.type==='select' || config.type==='radio' || config.type==='checkbox'" :label="$t('table.config.extra')" :prop="extra">
          <el-input v-model="config.extra" type="textarea" :autosize="{ minRows: 2, maxRows: 4}" :placeholder="$t('table.config.extra')" />
        </el-form-item>
        <el-form-item :label="$t('table.sort')">
          <el-col :span="8">
            <el-input v-model="config.sort" :placeholder="$t('table.sort')" />
          </el-col>
        </el-form-item>
        <el-form-item :label="$t('table.config.remark')">
          <el-input v-model="config.remark" type="textarea" :autosize="{ minRows: 2, maxRows: 4}" :placeholder="$t('table.config.remark')" />
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button type="danger" @click="dialogFormVisible = false">{{ $t('table.cancel') }}</el-button>
        <el-button type="primary" :loading="submitLoading" @click="confirmConfig">{{ $t('table.confirm') }}</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import checkPermission from '@/utils/permission'
import tabPane from './components/tabPane'
import { getMapsOptions, updateConfig, addConfig, deleteConfig, updateSortConfig } from '@/api/base/config'
import cloneDeep from 'lodash/cloneDeep'
import i18n from '@/lang'

const defaultConfig = {
  id: 0,
  name: '',
  type: '',
  title: '',
  group: '',
  remark: '',
  status: true,
  extra: '',
  value: '',
  store: false,
  sort: 1
}

export default {
  // eslint-disable-next-line vue/name-property-casing
  name: 'system_list',
  components: { tabPane },
  data() {
    return {
      config: Object.assign({}, defaultConfig),
      tabMapOptions: [],
      tabMapOptionsType: [],
      activeName: 'all',
      name: '',
      dialogFormVisible: false,
      dialogTitle: i18n.t('table.add'),
      dialogType: 'new',
      submitLoading: false,
      sortLoading: false,
      oldSort: 0,
      sortData: [],
      extra: 'extra',
      keyword: '',
      rules: {
        name: [{ required: true, message: i18n.t('table.please') + i18n.t('table.input') + i18n.t('table.config.name'), trigger: 'blur' }],
        title: [{ required: true, message: i18n.t('table.please') + i18n.t('table.input') + i18n.t('table.config.title'), trigger: 'blur' }],
        type: [{ required: true, message: i18n.t('table.please') + i18n.t('table.choose') + i18n.t('table.config.type'), trigger: 'blur' }],
        group: [{ required: true, message: i18n.t('table.please') + i18n.t('table.choose') + i18n.t('table.config.group'), trigger: 'blur' }],
        extra: [{ required: true, message: i18n.t('table.please') + i18n.t('table.input') + i18n.t('table.config.extra'), trigger: 'blur' }]
      }
    }
  },
  computed: {
    tabMapOptionsList() {
      const tmp = []
      this.tabMapOptions.forEach((v) => {
        if (v.key !== 'all') {
          tmp.push(v)
        }
      })
      return tmp
    }
  },
  created() {
    this.getMapsOptions()
  },
  methods: {
    handleEditRow(row) {
      console.log(row)
      this.dialogTitle = i18n.t('table.edit')
      this.dialogType = 'edit'
      this.dialogFormVisible = true
      this.$nextTick(() => {
        this.config = cloneDeep(row)
      })
    },
    handleDeleteRow(row) {
      this.$confirm(this.$i18n.t('form.deleteConfirm'), this.$i18n.t('table.tips'), {
        confirmButtonText: this.$i18n.t('table.confirm'),
        cancelButtonText: this.$i18n.t('table.cancel'),
        type: 'warning'
      }).then(async() => {
        await deleteConfig(row.id)
        this.$refs.tabPane[0].getConfigList(this.keyword)
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
    checkPermission,
    hiddenDialog() {
      this.$nextTick(() => {
        this.$refs.configForm.resetFields()
        this.submitLoading = false
      })
    },
    handleSearch() {
      this.$refs.tabPane[0].getConfigList(this.keyword)
    },
    async handleSortMenu() {
      this.sortLoading = true
      if (Array.isArray(this.sortData) && this.sortData.length > 0) {
        try {
          await updateSortConfig(this.sortData)
          this.sortData = []
          this.$refs.tabPane[0].getConfigList(this.keyword)
        } catch (error) {
          console.log(error)
          this.sortLoading = false
        }
      }
      this.sortLoading = false
    },
    haddleSortBlur(row) {
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
    haddleSortFocus(row) {
      this.oldSort = row.sort
    },
    async getMapsOptions() {
      const data = await getMapsOptions()
      this.tabMapOptions = data.group
      this.tabMapOptionsType = data.type
    },
    handleAdd() {
      this.dialogTitle = i18n.t('table.add')
      this.dialogType = 'new'
      this.dialogFormVisible = true
      this.$nextTick(() => {
        this.config = Object.assign({}, defaultConfig) // 重置form使用的数组
        this.$refs.configForm.resetFields()
      })
    },
    confirmConfig() {
      this.submitLoading = true
      this.$refs.configForm.validate(async(valid) => {
        if (valid) {
          try {
            const isEdit = this.dialogType === 'edit'
            if (isEdit) {
              await updateConfig(this.config)
              this.$refs.tabPane[0].getConfigList(this.keyword)
            } else {
              delete this.config.id // 清除id
              await addConfig(this.config)
            }
            this.dialogFormVisible = false
            if (this.activeName === this.config.group || this.activeName === 'all') {
              this.$refs.tabPane[0].getConfigList(this.keyword)
            }
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
    }
  }
}
</script>

<style scoped>
  .tab-container{
    margin: 30px;
  }
</style>
