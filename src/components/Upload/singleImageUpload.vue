<template>
  <el-upload
    class="avatar-uploader"
    :action="url"
    :accept="accept"
    :list-type="listType"
    :before-upload="beforeAvatarUpload"
    :http-request="uploadOnSuccess"
    :show-file-list="false"
  >
    <img v-if="imageUrl" :src="imageUrl" :width="imageWidth" :height="imageHeight" class="avatar">
    <i v-else class="el-icon-plus avatar-uploader-icon" :style="{width:imageWidth,height:imageHeight,lineHeight:imageHeight}" />
    <el-progress v-show="showProgress" :percentage="progress" />
  </el-upload>

</template>
<script>
import { uploadSingleImage } from '@/api/base/upload'
export default {
  name: 'SingleImageUpload',
  props: {
    url: {
      type: String,
      default: ''
    },
    listType: {
      type: String,
      default: 'text'
    },
    width: {
      type: Number,
      default: 178
    },
    height: {
      type: Number,
      default: 178
    },
    params: {
      type: Object,
      default() {
        return { }
      }
    },
    imageUrl: {
      type: String,
      default: ''
    },
    accept: {
      type: String,
      default: 'image'
    },
    validatorType: {
      type: Array,
      default() {
        return ['image/jpeg', 'image/png', 'image/gif', 'image/bmp', 'image/jpg']
      }
    },
    validatorSize: {
      type: Number,
      default: 2 // 默认2M
    },
    auth: {
      type: String,
      default: 'adminUsers.list.editAdminUser'
    }
  },
  data() {
    return {
      showProgress: false,
      progress: 0
    }
  },
  computed: {
    imageWidth: {
      set(val) {
        this.$emit('update:width', val)
      },
      get() {
        return this.width + 'px'
      }
    },
    imageHeight: {
      set(val) {
        this.$emit('update:width', val)
      },
      get() {
        return this.height + 'px'
      }
    }
  },
  methods: {
    beforeAvatarUpload(file) {
      let isJPG = false
      if (this.validatorType.indexOf(file.type) !== -1) {
        isJPG = true
      }
      let isLt2M = false
      if (file.size < 1024 * 1024 * this.validatorSize) {
        isLt2M = true
      }

      if (!isJPG) {
        this.$message.error(this.$i18n.t('rules.PhotoTypeError'))
      }
      if (!isLt2M) {
        this.$message.error(this.$i18n.t('rules.PhotoSizeError', { size: this.validatorSize }))
      }
      return isJPG && isLt2M
    },
    onProgress(progress) {
      this.$nextTick(() => {
        this.showProgress = true
        this.progress = Math.ceil(progress.loaded / progress.total) * 100
        if (this.progress >= 100) {
          setTimeout(() => {
            this.progress = 0
            this.showProgress = false
          }, 1000)
        }
      })
    },
    async uploadOnSuccess(files) {
      if (files.file) {
      // 实现上传
        var form = new FormData()
        // 文件对象
        form.append('file', files.file)
        form.append('auth', this.auth)

        Object.keys(this.params).forEach((param, index) => {
          form.append(param, this.params[param])
        })
        const { real_url, path } = await uploadSingleImage(form, this.onProgress)
        this.$emit('callbackshowPath', real_url)
        this.$emit('callbackRealPath', path) // 传输给父组件
      }
    }
  }
}
</script>
<style>
.avatar-uploader .el-upload {
    border: 1px dashed #d9d9d9;
    border-radius: 6px;
    cursor: pointer;
    position: relative;
    overflow: hidden;
  }
  .avatar-uploader .el-upload:hover {
    border-color: #409EFF;
  }
  .avatar-uploader-icon {
    font-size: 28px;
    color: #8c939d;
    text-align: center;
  }
  .avatar {
    display: block;
  }

</style>

