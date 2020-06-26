<template>
  <div class="app-container">
    <div class="filter-container">
      <el-input v-model="listQuery.uid" placeholder="UID" style="width: 200px;" class="filter-item" @keyup.enter.native="getAdminControllerLogs" />
      <el-select v-model="listQuery.sort" style="width: 140px" class="filter-item" @change="getAdminControllerLogs">
        <el-option v-for="item in sortOptions" :key="item.key" :label="item.label" :value="item.key" />
      </el-select>
      <el-button v-waves class="filter-item" type="primary" icon="el-icon-search" @click="getAdminControllerLogs">{{ $t('table.search') }}</el-button>
      <el-button v-permission="'adminControllerLogs.clearAdminLogs'" v-waves class="filter-item" type="primary" icon="el-icon-delete" @click="handleDelete">{{ $t('table.clear') }}</el-button>
    </div>

    <el-table
      :key="tableKey"
      v-loading="listLoading"
      :data="logsList"
      border
      class="adminControllerLogs-table"
    >
      <el-table-column type="expand">
        <template slot-scope="scope">
          <el-form label-position="left" inline class="table-expand">
            <el-form-item :label="$t('table.params')">
              <span>{{ scope.row.input }}</span>
            </el-form-item>
          </el-form>
        </template>
      </el-table-column>
      <el-table-column align="center" :label="$t('table.operator')+'/UID'">
        <template slot-scope="scope">{{ scope.row.action_username }}/{{ scope.row.action_uid }}</template>
      </el-table-column>
      <el-table-column align="center" :label=" $t('table.actions') ">
        <template slot-scope="scope">{{ scope.row.action_name }}</template>
      </el-table-column>
      <el-table-column align="center" :label=" $t('table.type') ">
        <el-tag slot-scope="scope">{{ scope.row.method }}</el-tag>
      </el-table-column>
      <el-table-column align="center" label="IP">
        <template slot-scope="scope">{{ scope.row.ip }}</template>
      </el-table-column>
      <el-table-column align="center" :label=" $t('table.actions')+$t('table.date') ">
        <template slot-scope="scope">{{ scope.row.created_at }}</template>
      </el-table-column>
      <el-table-column align="center" :label=" $t('table.status') ">
        <template slot-scope="scope">
          <el-tag v-if="scope.row.status" type="success">{{ $t('table.success') }}</el-tag>
          <el-tag v-if="!scope.row.status" type="danger">{{ $t('table.error') }}</el-tag>
        </template>
      </el-table-column>
    </el-table>

    <pagination v-show="total>0" :total="total" :page.sync="listQuery.page" :limit.sync="listQuery.limit" @pagination="getAdminControllerLogs" />

  </div>

</template>

<script>
import { getAdminControllerLogs, clearAdminControllerLogs } from '@/api/base/adminUsers'
import i18n from '@/lang'
import Pagination from '@/components/Pagination' // Secondary package based on el-pagination
import waves from '@/directive/waves' // Waves directive
export default {
  // eslint-disable-next-line vue/name-property-casing
  name: 'adminControllerLogs',
  components: { Pagination },
  directives: { waves }, // 插件
  data() {
    return {
      logsList: [],
      tableKey: 0,
      listLoading: false,
      total: 0,
      listQuery: {
        page: 1,
        limit: 20,
        uid: '',
        sortName: 'created_at',
        sort: 'desc'
      },
      sortOptions: [{ label: i18n.t('table.descending'), key: 'desc' }, { label: i18n.t('table.ascending'), key: 'asc' }]
    }
  },
  computed: {

  },
  created() {
    this.getAdminControllerLogs() // 初始化加载
  },
  methods: {
    async getAdminControllerLogs() {
      this.listLoading = true
      const res = await getAdminControllerLogs(this.listQuery)
      this.logsList = res.data
      this.total = res.meta.total
      this.listLoading = false
    },
    handleDelete({ $index, row }) {
      this.$confirm(this.$i18n.t('form.deleteConfirm'), this.$i18n.t('table.tips'), {
        confirmButtonText: this.$i18n.t('table.confirm'),
        cancelButtonText: this.$i18n.t('table.cancel'),
        type: 'warning'
      }).then(async() => {
        await clearAdminControllerLogs()
        this.getAdminControllerLogs()
        this.$notify({
          title: this.$i18n.t('status.success'),
          dangerouslyUseHTMLString: true,
          message: this.$i18n.t('form.deleteSuccess'),
          type: 'success'
        })
      }).catch(() => {
        console.log('catch')
      })
    }
  }
}
</script>

<style lang="scss" scoped>
$dark_gray:#889aa4;
.app-container {
  .adminControllerLogs-table {
    width: 100%;
    margin-top: 30px;
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
