<template>
  <el-form ref="form" v-loading="loading" :model="configDetail" label-width="170px">
    <el-form-item v-for="item in list" :key="item.id" :label="item.title">
      <el-col v-if="item.type === 'string' || item.type === 'url' || item.type === 'textarea' || item.type === 'radio' || item.type === 'checkbox'" :span="24">
        <el-form-item v-if="item.type === 'string'">
          <el-input v-model="configDetail[item.name]" :placeholder="item.remark || item.title" />
        </el-form-item>
        <el-form-item v-if="item.type === 'url'">
          <el-input v-model="configDetail[item.name]" :placeholder="item.remark || item.title" />
        </el-form-item>
        <el-form-item v-if="item.type === 'textarea'">
          <el-input v-model="configDetail[item.name]" type="textarea" :autosize="{ minRows: 2, maxRows: 4}" :placeholder="item.remark || item.title" />
        </el-form-item>
        <el-form-item v-if="item.type === 'radio'">
          <el-radio-group v-model="configDetail[item.name]">
            <el-radio v-for="(extra,index) in item.extra" :key="index" :label="index">{{ extra }}</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item v-if="item.type === 'checkbox'">
          <el-checkbox-group v-model="configDetail[item.name]">
            <el-checkbox v-for="(extra,index) in item.extra" :key="index" :label="index">{{ extra }}</el-checkbox>
          </el-checkbox-group>
        </el-form-item>

      </el-col>
      <el-col v-if="item.type === 'number' || item.type === 'password' || item.type === 'select'" :span="5">
        <el-form-item v-if="item.type === 'number'">
          <el-input v-model="configDetail[item.name]" :placeholder="item.remark || item.title" />
        </el-form-item>
        <el-form-item v-if="item.type === 'password'">
          <el-input v-model="configDetail[item.name]" :placeholder="item.remark || item.title" show-password />
        </el-form-item>
        <el-form-item v-if="item.type === 'select'">
          <el-select v-model="configDetail[item.name]" clearable :placeholder="item.title">
            <el-option v-for="(extra,index) in item.extra" :key="index" :label="extra" :value="index" />
          </el-select>
        </el-form-item>

      </el-col>

      <el-col v-if="item.type === 'oneimage' || item.type === 'onefile' || item.type === 'multipleimage' || item.type === 'multiplefile'" :span="8">
        <el-form-item v-if="item.type === 'oneimage'">
          <drag-upload :params="{auth:'system.config'}" :multiple="false" :limit="1" list-type="picture" filetype="图片" :file-list.sync="configDetail[item.name]" :url="uploadAddress.configUpload" />
        </el-form-item>
        <el-form-item v-if="item.type === 'onefile'">
          <drag-upload :params="{auth:'system.config'}" :multiple="false" :validator-size="10" :limit="1" :file-list.sync="configDetail[item.name]" :url="uploadAddress.configUpload" />
        </el-form-item>
        <el-form-item v-if="item.type === 'multipleimage'">
          <drag-upload :params="{auth:'system.config'}" :multiple="true" list-type="picture" filetype="图片" :file-list.sync="configDetail[item.name]" :url="uploadAddress.configUpload" />
        </el-form-item>
        <el-form-item v-if="item.type === 'multiplefile'">
          <drag-upload :params="{auth:'system.config'}" :multiple="true" :validator-size="10" :file-list.sync="configDetail[item.name]" :url="uploadAddress.configUpload" />
        </el-form-item>
      </el-col>
      <el-col v-if="item.type === 'dictionary'" :span="8">
        <el-form-item>
          <el-input v-model="configDetail[item.name]" type="textarea" :autosize="{ minRows: 2, maxRows: 4}" :placeholder="item.title" />
        </el-form-item>
      </el-col>
    </el-form-item>
    <el-form-item>
      <el-button v-if="checkPermission('system.config.save')" type="primary" :loading="submitLoading" @click="confirmConfig">{{ $t('table.confirm') }}</el-button>
    </el-form-item>
  </el-form>
</template>

<script>
import checkPermission from '@/utils/permission'
import { getSystemConfig, updateConfigGroup } from '@/api/base/config'
import { uploadAddress } from '@/api/base/upload'
import DragUpload from '@/components/Upload/dragUpload'

export default {
  components: { 'drag-upload': DragUpload },
  props: {
    type: {
      type: String,
      default: 'base'
    }
  },
  data() {
    return {
      configDetail: {},
      sortLoading: false,
      list: {},
      listQuery: {
        transform: 'yes',
        type: this.type
      },
      loading: false,
      submitLoading: false,
      uploadAddress: uploadAddress
    }
  },
  created() {
    this.getConfigList()
  },
  methods: {
    checkPermission,
    async getConfigList() {
      this.loading = true
      const data = await getSystemConfig(this.listQuery)
      this.list = data
      this.resetData(data)
      // console.log(data)
      this.loading = false
    },
    resetData(list) { // 处理数据生成model
      const formDatas = []
      if (Array.isArray(list) && list.length > 0) {
        for (const item in list) {
          formDatas[list[item].name] = list[item].value
        }
        this.configDetail = { ...formDatas } // 深拷贝数据至data  实现动态绑定v-model
      }
    },
    async confirmConfig() {
      this.submitLoading = true
      try {
        await updateConfigGroup(this.configDetail)
        this.submitLoading = false
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

  }
}
</script>

