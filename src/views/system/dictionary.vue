<template>
  <div class="tab-container">
    <div class="filter-container">
      <el-button v-if="checkPermission('system.dictionary.add')" class="filter-item" style="margin-left: 10px;" type="primary" icon="el-icon-plus" @click="handleAdd">{{ $t('table.add') }}</el-button>
    </div>

    <el-col :span="5">
      <el-menu v-loading="loading" :default-active="active">
        <el-menu-item v-for="item in list" :key="item.id" :index="item.name" @click="handleActive(item.name)">
          <span slot="title">{{ item.title }}</span>
          <span style="float:right">
            <i v-if="checkPermission('system.dictionary.edit')" class="icon-hover el-icon-edit" @click.stop="handleEdit(item)" />
            <i v-if="checkPermission('system.dictionary.delete')" class="icon-hover el-icon-delete" @click.stop="handleDelete(item)" />
          </span>
        </el-menu-item>
      </el-menu>
    </el-col>
    <el-col :span="1">&nbsp;</el-col>
    <el-col :span="18">
      <el-form v-show="formDictionaryValueShow" ref="formDictionaryValue" v-loading="formDictionaryValueLoading" :model="formListDetail">
        <el-form-item v-for="(item,index) in formListDetail.listDetail" :key="index">
          <el-col :span="6">
            <el-form-item
              :prop="'listDetail.' + index + '.key'"
              :rules="{
                required: true, message: $t('table.please') + $t('table.input') + $t('table.dictionary.value'), trigger: 'blur'
              }"
            >
              <el-input v-model="item.key" placeholder="key" style="width: 100%;" />
            </el-form-item>
          </el-col>
          <el-col :span="1">&nbsp;</el-col>
          <el-col :span="6">
            <el-form-item
              :prop="'listDetail.' + index + '.value'"
              :rules="{
                required: true, message: $t('table.please') + $t('table.input') + $t('table.dictionary.value'), trigger: 'blur'
              }"
            >
              <el-input v-model="item.value" placeholder="value" style="width: 100%;" />
            </el-form-item>
          </el-col>
          <el-col :span="1">&nbsp;</el-col>
          <el-col :span="6">
            <el-form-item v-if="checkPermission('system.dictionary.save')">
              <el-button type="danger" @click.prevent="removeDetail(index)">删除</el-button>
              <el-button type="primary" icon="el-icon-top" @click.stop="topDetail(index)" />
              <el-button type="primary" icon="el-icon-bottom" @click.stop="downDetail(index)" />
            </el-form-item>
          </el-col>

        </el-form-item>
        <el-form-item>
          <el-button v-if="checkPermission('system.dictionary.save')" type="primary" :loading="submitDictionaryValueLoading" @click="submitDictionaryValue">{{ $t('table.submit') }}</el-button>
          <el-button v-if="checkPermission('system.dictionary.save')" @click="addDictionaryValue">{{ $t('table.add') }}</el-button>
        </el-form-item>
      </el-form>
    </el-col>
    <el-dialog :visible.sync="formShow" :title="dialogTitle" @close="handleCloseDialog">
      <el-form ref="formDictionary" :inline="true" :rules="rules" :model="dictionary" class="form-inline">
        <el-form-item :label="$t('table.dictionary.name')" prop="name">
          <el-input v-model="dictionary.name" :placeholder="$t('table.dictionary.name')" />
        </el-form-item>
        <el-form-item :label="$t('table.dictionary.title')" prop="title">
          <el-input v-model="dictionary.title" :placeholder="$t('table.dictionary.title')" />
        </el-form-item>
        <el-form-item>
          <el-button type="danger" @click="handleCancle">{{ $t('table.cancel') }}</el-button>
          <el-button type="primary" :loading="submitLoading" @click="confirmDictionary">{{ $t('table.confirm') }}</el-button>
        </el-form-item>
      </el-form>
    </el-dialog>
  </div>
</template>

<script>
import checkPermission from '@/utils/permission'
import { getDictionary, getDictionaryDetail, deleteDictionary, addDictionary, updateDictionary, saveDictionary } from '@/api/base/dictionary'
import i18n from '@/lang'
import cloneDeep from 'lodash/cloneDeep'

const defaultDictionary = {
  id: 0,
  name: '',
  title: '',
  value: []
}

export default {
  // eslint-disable-next-line vue/name-property-casing
  name: 'system_dictionary',
  data() {
    return {
      dictionary: Object.assign({}, defaultDictionary),
      list: [],
      formListDetail: {
        listDetail: [],
        name: ''
      },
      formShow: false,
      formDictionaryValueShow: false,
      formDictionaryValueLoading: false,
      dialogTitle: i18n.t('table.add'),
      type: 'add',
      loading: false,
      listDetailLoading: false,
      submitLoading: false,
      submitDictionaryValueLoading: false,
      active: '',
      rules: {
        name: [{ required: true, message: i18n.t('table.please') + i18n.t('table.input') + i18n.t('table.dictionary.name'), trigger: 'blur' }],
        title: [{ required: true, message: i18n.t('table.please') + i18n.t('table.input') + i18n.t('table.dictionary.title'), trigger: 'blur' }]
      }
    }
  },
  watch: {
    active: function(val) {
      this.getDictionaryDetail(val)
      this.formListDetail.name = val
    }
  },
  created() {
    this.getDictionary()
  },
  methods: {
    checkPermission,
    handleCloseDialog() {
      this.$refs.formDictionary.resetFields()
    },
    handleAdd() {
      this.formShow = true
      this.dialogTitle = i18n.t('table.add')
      this.type = 'add'
      this.dictionary = Object.assign({}, defaultDictionary)
    },
    handleCancle() {
      this.formShow = false
      this.dialogTitle = i18n.t('table.add')
      this.type = 'add'
      this.dictionary = Object.assign({}, defaultDictionary)
      this.$refs.formDictionary.resetFields()
    },
    handleEdit(item) {
      this.formShow = true
      this.dialogTitle = i18n.t('table.edit')
      this.type = 'edit'
      this.$nextTick(() => {
        this.dictionary = cloneDeep(item)
      })
    },
    addDictionaryValue() {
      this.formListDetail.listDetail.push({ key: '', value: '' })
    },
    removeDetail(index) {
      this.formListDetail.listDetail.splice(index, 1)
    },
    topDetail(index) {
      if (index !== 0) {
        const tmp = []
        const top = cloneDeep(this.formListDetail.listDetail[index])
        this.formListDetail.listDetail.forEach((item, detailIndex) => {
          if (detailIndex === index - 1) {
            tmp.push(top)
            tmp.push(item)
          } else {
            if (detailIndex !== index) {
              tmp.push(item)
            }
          }
        })
        this.formListDetail.listDetail = [...tmp] // 复制数组赋值
      }
    },
    downDetail(index) {
      if (index !== this.formListDetail.listDetail.length - 1) {
        const tmp = []
        const down = cloneDeep(this.formListDetail.listDetail[index])
        this.formListDetail.listDetail.forEach((item, detailIndex) => {
          if (detailIndex !== index) {
            if (detailIndex === index + 1) {
              tmp.push(item)
              tmp.push(down)
            } else {
              tmp.push(item)
            }
          }
        })
        this.formListDetail.listDetail = [...tmp] // 复制数组赋值
      }
    },
    submitDictionaryValue() {
      this.submitDictionaryValueLoading = true
      this.$refs.formDictionaryValue.validate(async(valid) => {
        if (valid) {
          try {
            await saveDictionary(this.formListDetail)
            this.$notify({
              title: 'Success',
              dangerouslyUseHTMLString: true,
              message: this.$i18n.t('form.actionSuccess'),
              type: 'success'
            })
          } catch (error) {
            console.log(error)
            this.submitDictionaryValueLoading = false
          }
        }
        this.submitDictionaryValueLoading = false
      })
    },
    handleActive(name) {
      this.active = name
    },
    handleDelete(row) {
      this.$confirm(row.title + ' ' + this.$i18n.t('form.deleteConfirm'), this.$i18n.t('table.tips'), {
        confirmButtonText: this.$i18n.t('table.confirm'),
        cancelButtonText: this.$i18n.t('table.cancel'),
        type: 'warning'
      }).then(async() => {
        await deleteDictionary(row.id)
        this.list.forEach((item, index) => {
          if (item.id === row.id) {
            this.list.splice(index, 1)
          }
        })
        if (this.active === row.name) {
          if (this.list.length > 0) {
            this.active = this.list[0].name
          } else {
            this.active = ''
          }
        }
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
    async getDictionary() {
      this.loading = true
      const data = await getDictionary()
      this.list = data
      if (data.length > 0) {
        this.active = data[0].name
      }
      this.loading = false
    },
    async getDictionaryDetail(val) {
      if (val === '') {
        this.formDictionaryValueShow = false
      } else {
        this.formDictionaryValueLoading = true
        this.formDictionaryValueShow = true
        this.formListDetail.listDetail = []
        const data = await getDictionaryDetail(val)
        this.formListDetail.listDetail = data
        this.formDictionaryValueLoading = false
      }
    },
    confirmDictionary() {
      this.submitLoading = true
      this.$refs.formDictionary.validate(async(valid) => {
        if (valid) {
          try {
            const isEdit = this.type === 'edit'
            if (isEdit) {
              await updateDictionary(this.dictionary)
              this.list.forEach((item, index) => {
                if (item.id === this.dictionary.id) {
                  this.list[index] = cloneDeep(this.dictionary)
                }
              })
              this.handleCancle()
            } else {
              delete this.dictionary.id // 清除id
              const data = await addDictionary(this.dictionary)
              this.list.unshift(data)
              this.handleCancle()
              this.active = data.name
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
  .icon-hover:hover{
    color: #FF0000
  }
</style>
