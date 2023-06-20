<template>
  <el-dialog width="500px" title="员工导入" :visible="showExcelDialog" @close="$emit('update:showExcelDialog', false)">
    <el-row type="flex" justify="center">
      <div class="upload-excel">
        <input
          ref="excel-upload-input"
          class="excel-upload-input"
          type="file"
          accept=".xlsx, .xls"
          @change="filesUpload"
        >
        <draggable
          class="drop"
          :class="{ enter: isEnter }"
          @start.prevent.stop="drag"
          @dragover.prevent.stop="drag"
          @drop.prevent.stop="drop"
          @remove.prevent.stop="dragleave"
        >
          <i class="el-icon-upload" />
          <el-button type="text" @click="downloadTemplate">下载导入模板</el-button>
          <span>将文件拖到此处或
            <el-button type="text" @click="upload">点击上传</el-button>
          </span>
        </draggable>
      </div>
    </el-row>
    <el-row type="flex" justify="end">
      <!-- update:props属性名，值 直接修改 .sync修饰符的属性值 -->
      <el-button size="mini" type="primary" @click="$emit('update:showExcelDialog', false)">取消</el-button>
    </el-row>
  </el-dialog>
</template>
<script>
import { getExcelTemplat, uploadExcel } from '@/api/employee'
import draggable from 'vuedraggable'
import FileSaver from 'file-saver'

export default {
  components: {
    draggable
  },
  props: {
    showExcelDialog: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      isEnter: false
    }
  },
  methods: {
    upload(e) {
      this.$refs['excel-upload-input'].click()
    },
    async downloadTemplate() {
      const res = await getExcelTemplat()
      FileSaver.saveAs(res, '员工数据表模板')
    },
    async filesUpload(e) {
      this.uploadToggleMethod(e.target.files[0])
    },
    drag(e) {
      if (this.timer) return
      this.timer = setTimeout(() => {
        this.isEnter = true
        console.log('进来了')
        this.timer = null
      }, 1000)
    },
    drop(e) {
      this.uploadToggleMethod(e.dataTransfer.files[0])
    },
    dragleave(e) {
      this.isEnter = false
    },
    async uploadToggleMethod(files) {
      if (!files) return
      const data = new FormData()
      data.append('file', files)
      try {
        await uploadExcel(data)
        this.$emit('update:showExcelDialog', false)
        this.$message.success('导入成功')
        this.$emit('update')
      } catch {
        this.$message.error('导入失败')
      } finally {
        this.$refs['excel-upload-input'].value = null
      }
    }
  }
}
</script>

<style scoped lang="scss">
.enter {
  border: 1px dashed #7c99dc !important;
  background-color: #f7f7f7;
}
.upload-excel {
  display: flex;
  justify-content: center;
  margin: 20px;
  width: 360px;
  height: 180px;
  align-items: center;
  color: #697086;
  .excel-upload-input {
    display: none;
    z-index: -9999;
  }
  .btn-upload,
  .drop {
    border: 1px dashed #dcdfe6;
    width: 100%;
    height: 100%;
    text-align: center;
    line-height: 160px;
    border-radius: 8px;
    display: flex;
    flex-direction: column;
    justify-content: center;
  }

  .drop {
    line-height: 40px;
    color: #bbb;
    i {
      font-size: 60px;
      display: block;
      color: #c0c4cc;
    }
  }
}
</style>
