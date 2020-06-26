<template>
  <div>
    <el-table v-loading="loading" :data="list" border fit highlight-current-row style="width: 100%">
      <el-table-column type="expand">
        <template slot-scope="props">
          <el-form label-position="left" inline class="demo-table-expand">
            <el-form-item :label="$t('table.config.value')">
              <span>{{ props.row.value }}</span>
            </el-form-item>
          </el-form>
        </template>
      </el-table-column>
      <el-table-column v-if="type!=='all'" :label="$t('table.sort')" width="80">
        <template slot-scope="scope">
          <el-input v-model="scope.row.sort" @blur.prevent="sortBlur(scope.row)" @focus.prevent="sortFocus(scope.row)" />
        </template>
      </el-table-column>

      <el-table-column align="center" :label="$t('table.config.title')">
        <template slot-scope="scope">
          <span>{{ scope.row.title }}</span>
        </template>
      </el-table-column>

      <el-table-column align="center" :label="$t('table.config.name')">
        <template slot-scope="scope">
          <span>{{ scope.row.name }}</span>
        </template>
      </el-table-column>

      <el-table-column align="center" :label="$t('table.config.type')">
        <template slot-scope="scope">
          <span>{{ scope.row.type_name }}</span>
        </template>
      </el-table-column>

      <el-table-column align="center" :label="$t('table.config.group')">
        <template slot-scope="scope">
          <span>{{ scope.row.group_name }}</span>
        </template>
      </el-table-column>

      <el-table-column align="center" :label="$t('table.config.status')">
        <template slot-scope="scope">
          <el-tag :type="scope.row.status?'success':'danger'">{{ scope.row.status?$t('table.show'):$t('table.hidden') }}</el-tag>
        </template>
      </el-table-column>

      <el-table-column align="center" :label="$t('table.config.store')">
        <template slot-scope="scope">
          <el-tag :type="scope.row.store?'success':'danger'">{{ scope.row.store?$t('common.yes'):$t('common.no') }}</el-tag>
        </template>
      </el-table-column>

      <el-table-column :label="$t('table.actions')" width="250">
        <template slot-scope="scope">
          <el-button v-if="checkPermission('system.list.edit')" size="mini" type="success" @click="handleEdit(scope.row)">{{ $t('table.edit') }}</el-button>
          <el-button v-if="checkPermission('system.list.delete')" size="mini" type="danger" @click="handleDelete(scope.row)">{{ $t('table.delete') }}</el-button>
        </template>
      </el-table-column>

    </el-table>

    <pagination v-show="total>0" :total="total" :page.sync="listQuery.page" :limit.sync="listQuery.limit" @pagination="getConfigList" />
  </div>
</template>

<script>
import checkPermission from '@/utils/permission'
import { getConfigList } from '@/api/base/config'
import Pagination from '@/components/Pagination' // Secondary package based on el-pagination

export default {
  components: { Pagination },
  props: {
    type: {
      type: String,
      default: 'all'
    },
    keyword: {
      type: String,
      default: ''
    }
  },
  data() {
    return {
      sortLoading: false,
      list: [],
      total: 0,
      listQuery: {
        page: 1,
        limit: 20,
        type: this.type,
        keyword: ''
      },
      loading: false
    }
  },
  created() {
    this.getConfigList(this.keyword)
  },
  methods: {
    checkPermission,
    async getConfigList(k = '') {
      this.listQuery.keyword = k
      this.loading = true
      const data = await getConfigList(this.listQuery)
      this.list = data.data
      this.total = data.meta.total
      // console.log(data)
      this.loading = false
    },
    haddleSearch(keyword) {
      this.listQuery.keyword = keyword
    },
    handleEdit(row) {
      this.$emit('onEdit', row)
    },
    handleDelete(row) {
      this.$emit('onDelete', row)
    },
    sortBlur(row) {
      this.$emit('onSortBlur', row)
    },
    sortFocus(row) {
      this.$emit('onSortFocus', row)
    }

  }
}
</script>

