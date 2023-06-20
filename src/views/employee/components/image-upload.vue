<template>
  <el-upload
    class="avatar-uploader"
    action=""
    :show-file-list="false"
    :before-upload="beforeAvatarUpload"
    :http-request="Upload"
  >
    <!-- (自动上传)action是上传地址 人资项目不需要 人资项目(手动上传)  -->
    <!-- show-file-list不展示列表 -->
    <!-- <el-progress v-if="percentage" type="circle" :percentage="percentage" /> -->
    <!-- <template v-else> -->
    <img v-if="value" ref="view" :src="value" class="avatar">
    <i v-else class="el-icon-plus avatar-uploader-icon" />
    <!-- </template> -->
  </el-upload>
</template>

<script>
// 储存桶名称：lihonghr-1318357914
// 地域名称：ap-beijing
// 应用标识：AKIDTrDTfkwukXbEpw63mMq8KKEzthJvMeon
// 应用密钥：xiIH2ABtcEi0F5reN8nFaoMisyuvrkTz

import COS from 'cos-js-sdk-v5'
const cos = new COS({
  SecretId: 'AKIDQgUFpWF1qfUBqMtLkBct48xa2FLSSGrF', // “ 应用标识“,
  SecretKey: '35CGAudDcorofQNCpIaheWCyohU7hKq9' // “应用密钥”
})
export default {
  props: {
    value: {
      type: String,
      default: ''
    },
    disabled: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      percentage: 0
    }
  },
  methods: {
    // 检查函数 判断文件的类型还有大小 return  true(继续上传)/false(停止上传)
    beforeAvatarUpload(file) {
      const isJPG = ['image/jpeg', 'image/png', 'image/gif', 'image/bmp', 'image/webp'].includes(file.type)
      const isLt2M = file.size / 1024 / 1024 < 30 // 5M
      if (!isJPG) {
        this.$message.error('上传头像图片只能是 JPG PNG GIF BMP 格式!')
        // return false
      }
      if (!isLt2M) {
        this.$message.error('上传头像图片大小不能超过 5MB!')
        // return false
      }
      // 和return false一个意思可以直接写进if中
      return isJPG && isLt2M
    },
    // 秘钥
    // SecretId: AKIDQgUFpWF1qfUBqMtLkBct48xa2FLSSGrF
    // SecretKey: 35CGAudDcorofQNCpIaheWCyohU7hKq9
    // 存储桶名称 hm-1305579172
    // 存储桶所在区域 ap-beijing
    Upload(params) {
      // 课堂扩展：前端本地预览图片（与进度条冲突，两个留一个）---------------------------------------------------
      // 会出现问题，因为实际网络慢数据回不来，点击保存之后存的是临时路径
      // 解决：在腾讯云服务器还没有返回来地址之前，禁用提交更新按钮，返回地址再启用
      // 1、获取临时url地址----------------------------------------------------------
      const fileURL = URL.createObjectURL(params.file)
      this.$emit('input', fileURL)
      // 2、获取永久url地址，但是为64位，且图片会被放大---------------------------------
      // const reader = new FileReader()
      // reader.readAsDataURL(params.file)
      // reader.onload = () => {
      //   this.$emit('input', reader.result)
      // }
      // 使用这个方法可以生成一个在线地址
      cos.putObject(
        {
          Bucket: 'hm-1305579172', // “存储桶名称”,
          Region: 'ap-beijing', // “存储桶地域”，
          Key: params.file.name, // “文件名称”,
          StorageClass: 'STANDARD', // “STANDARD”,固定值不可修改
          Body: params.file, // “文件对象”
          // 上传过程中一直执行的函数，可以查看
          onProgress: (progressData) => {
          // console.log(progressData.percent)
          // this.percentage = parseInt(progressData.percent * 100)
          // 在上传过程中禁用提交按钮
            this.$emit('update:disabled', true)
          }
        },
        // 上传成功或失败执行的函数，在此处执行获取到的url地址
        (err, data) => {
          console.log(err, data)
          if (data.statusCode === 200) {
            this.$emit('input', 'http://' + data.Location)
            this.$emit('update:disabled', false)
          }
          // 上传完成之后，将percentage进度置零，原结构显示
          // this.percentage = 0
        }
      )
    }
  }
}
</script>

<style>
.el-upload--text{
  display: flex;
  width: 126px;
  justify-content: center;
  align-items: center;
}
.avatar-uploader .el-upload {
  border: 1px dashed #d9d9d9;
  border-radius: 6px;
  cursor: pointer;
  position: relative;
  overflow: hidden;
}
.avatar-uploader .el-upload:hover {
  border-color: #409eff;
}
.avatar-uploader-icon {
  font-size: 28px;
  color: #8c939d;
  width: 178px;
  height: 178px;
  line-height: 178px;
  text-align: center;
}
.avatar {
  width: 178px;
  height: 178px;
  display: block;
 }
</style>
