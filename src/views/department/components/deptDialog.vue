<template>
  <el-dialog :title="title" :visible="dialogVisible" width="30%" @close="close">
    <el-form ref="form" :model="form" :rules="rules">
      <el-form-item label="部门名称" label-width="78px" prop="name">
        <el-input v-model="form.name" />
      </el-form-item>
      <el-form-item label="部门编码" label-width="78px" prop="code">
        <el-input v-model="form.code" />
      </el-form-item>
      <el-form-item label="部门负责" label-width="78px" prop="managerId">
        <el-select v-model="form.managerId" placeholder="请选择部门负责人" style="width: 100%">
          <el-option v-for="item in ManagerList" :key="item.id" :label="item.username" :value="item.id" />
        </el-select>
      </el-form-item>
      <el-form-item label="部门介绍" label-width="78px" prop="introduce">
        <el-input v-model="form.introduce" type="textarea" />
      </el-form-item>
      <el-form-item>
        <el-row type="flex" justify="center">
          <el-button @click="close">取 消</el-button>
          <el-button type="primary" @click="submit">确 定</el-button>
        </el-row>
      </el-form-item>
    </el-form>
  </el-dialog>
</template>

<script>
import { addDepartmentItem, editDepartmentItem, getDepartmentDetail, getDeptList, getDeptManager } from '@/api/department'
export default {
  name: 'DeptDialog',
  props: {
    dialogVisible: {
      type: Boolean
    },
    depts: {
      type: Array,
      required: true
    },
    currentId: {
      type: Number,
      default: 0
    },
    dialogType: {
      type: String,
      required: true
    },
    title: {
      type: String,
      required: true
    }
  },
  data() {
    return {
      ManagerList: [],
      // 此处可以将pid直接放进form中，方便发送请求
      form: {
        name: '',
        code: '',
        managerId: '',
        introduce: ''
      },
      rules: {
        name: [
          { required: true, message: '部门名称不能为空', trigger: ['blur', 'change'] },
          { min: 2, max: 10, message: '部门名称长度为2-10位', trigger: ['blur', 'change'] },
          {
            trigger: 'blur',
            validator: async(rule, value, callback) => {
              // 该处的部门数据可以从请求来，也可以从父组件传送过来
              // 但是父组件传送过来的数据可能有时效性
              let list = await getDeptList()
              if (this.form.id) {
                list = list.filter(item => item.id !== this.form.id)
              }
              if (list.find(item => item.name === value)) {
                callback(new Error('该部门已存在'))
              } else {
                callback()
              }
            }
          }
        ],
        code: [
          { required: true, message: '部门编码不能为空', trigger: ['blur', 'change'] },
          { min: 2, max: 10, message: '部门编码长度为2-10位', trigger: ['blur', 'change'] },
          {
            trigger: 'blur',
            validator: async(rule, value, callback) => {
              // 该处的部门数据可以从请求来，也可以从父组件传送过来
              // 但是父组件传送过来的数据可能有时效性
              let list = await getDeptList()
              if (this.form.id) {
                list = list.filter(item => item.id !== this.form.id)
              }
              if (list.find(item => item.code === value)) {
                callback(new Error('部门编码已存在'))
              } else {
                callback()
              }
            }
          }
        ],
        managerId: [{ required: true, message: '部门负责不能为空', trigger: ['blur', 'change'] }],
        introduce: [{ required: true, message: '部门介绍不能为空', trigger: ['blur', 'change'] }]
      }
    }
  },
  created() {
    // 获取负责人列表
    this.getDeptManager()
  },
  methods: {
    close() {
      this.$refs.form.resetFields()
      this.$emit('update:dialogVisible', false)

      this.form = {
        name: '',
        code: '',
        managerId: '',
        introduce: ''
      }
    },
    // 获取负责人列表
    async getDeptManager() {
      const res = await getDeptManager()
      //   console.log(res)
      this.ManagerList = res
    },
    // 此处发送请求的的pid是从父组件打开页面框的时候传递过来的
    submit() {
      this.$refs.form.validate(async ok => {
        if (ok) {
          if (this.dialogType === 'add') {
            await addDepartmentItem({
              ...this.form,
              pid: this.currentId
            })
            this.$message.success('添加部门成功')
          } else {
            await editDepartmentItem({
              ...this.form,
              pid: this.currentId
            })
            this.$message.success('修改部门成功')
          }
          this.close()
          this.$emit('getDeptList', getDeptList)
        }
      })
    },
    // 由父组件通过$refs的方式进行调用回显
    async getDepartmentItem(id) {
      const res = await getDepartmentDetail(id)
      this.form = res
    }
  }
}
</script>

<style lang="scss" scoped>

::v-deep .cell{
  text-align: center;
  font-size: 14px;
}
</style>
