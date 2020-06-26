<template>
  <div>
    <div>
      <el-upload
        class="system-uploader"
        drag
        :action="url"
        :list-type="listType"
        :data="params"
        :file-list.sync="fileList"
        :on-preview="handlePictureCardPreview"
        :headers="headers"
        :multiple="multiple"
        :limit="limit"
        :on-exceed="handleExceed"
        :before-upload="handleBeforeUpload"
        :on-success="handleSuccess"
        :on-remove="handleRemove"
      >
        <i class="el-icon-upload" />
        <div class="el-upload__text">{{ $t('common.uploader1') }}<em>{{ $t('common.uploader2') }}</em></div>
        <div slot="tip" class="el-upload__tip">{{ $t('common.uploaderMessage',{ filetype: filetype, size: validatorSize + 'M' }) }}</div>
      </el-upload>
    </div>
    <el-dialog :visible.sync="dialogVisible">
      <img width="100%" :src="dialogImageUrl" alt="">
    </el-dialog>
  </div>
</template>
<script>
import store from '@/store'
import { getToken } from '@/utils/auth'

export default {
  name: 'DragUpload',
  props: {
    url: {
      type: String,
      default: ''
    },
    listType: {
      type: String,
      default: 'text'
    },
    params: {
      type: Object,
      default() {
        return { }
      }
    },
    fileList: {
      type: Array,
      default() {
        return []
      }
    },
    accept: {
      type: String,
      default: 'image'
    },
    validatorType: {
      type: Array,
      default() {
        return []
      }
    },
    validatorSize: {
      type: Number,
      default: 2 // 默认2M
    },
    filetype: {
      type: String,
      default: ''
    },
    multiple: {
      type: Boolean,
      default: true
    },
    limit: {
      type: Number,
      default: 100
    }
  },
  data() {
    return {
      dialogImageUrl: '',
      dialogVisible: false,
      headers: {
        'Authorization': getToken(),
        'x-lang': store.getters.language
      }
    }
  },
  computed: {
    computedFileList: {
      get() {
        return this.fileList
      },
      set(val) {
        this.$emit('update:fileList', val)
      }
    }
  },
  methods: {
    handlePictureCardPreview(file) {
      if (this.listType === 'picture') {
        this.dialogImageUrl = file.url
        this.dialogVisible = true
      }
    },
    handleSuccess(response, file, fileList) {
      const data = response
      const fileObject = { name: file.name, url: data.real_url, path: data.path }
      this.fileList.push(fileObject)
    },
    handleRemove(file, fileList) {
      this.fileList.forEach((files, index) => {
        if (files.path === file.path) {
          this.fileList.splice(index, 1)
        }
      })
      // this.$set(this.fileList, fileList)
      // this.fileList = fileList
      console.log(file)
      console.log(fileList)
      console.log(this.fileList)
    },
    handleBeforeUpload(file) {
      let isTYPE = true
      if (this.validatorType.length > 0 && this.validatorType.indexOf(file.type) === -1) {
        isTYPE = false
      }
      let isLtSize = false
      if (file.size < 1024 * 1024 * this.validatorSize) {
        isLtSize = true
      }
      if (!isTYPE) {
        if (this.listType === 'picture') {
          this.$message.error(this.$i18n.t('rules.PhotoTypeError'))
        } else {
          this.$message.error(this.$i18n.t('rules.fileTypeError'))
        }
      }
      if (!isLtSize) {
        if (this.listType === 'picture') {
          this.$message.error(this.$i18n.t('rules.PhotoSizeError', { size: this.validatorSize }))
        } else {
          this.$message.error(this.$i18n.t('rules.fileSizeError', { size: this.validatorSize }))
        }
      }
      return isTYPE && isLtSize
    },
    handleExceed(file, fileList) {
      this.$message.error(this.$i18n.t('rules.limitError'))
    }
  }
}
</script>

