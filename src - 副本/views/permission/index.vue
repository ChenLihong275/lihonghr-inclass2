<template>
  <div class="container">
    <div class="app-container">
      <el-row type="flex" align="center">
        <el-button type="primary" size="mini" style="margin:10px" @click="common('',null)">添加权限</el-button>
      </el-row>
      <el-table :data="tableList" style="width: 100%" row-key="id" default-expand-all>
        <el-table-column prop="name" label="名称" align="left" />
        <el-table-column prop="code" label="标识" />
        <el-table-column prop="description" label="描述" />
        <el-table-column label="操作">
          <template v-slot="{row}">
            <el-button v-if="row.pid===0" type="text" @click="common('add',row.id)">添加</el-button>
            <el-button type="text" @click="common('edit',row.id)">编辑</el-button>
            <el-popconfirm
              title="这是一段内容确定删除吗？"
              @onConfirm="del(row.id)"
            >
              <el-button slot="reference" type="text" style="margin-left:10px">删除</el-button>
            </el-popconfirm>
          </template>
        </el-table-column>
      </el-table>
      <el-dialog :title="title" :visible="showDialog" width="30%" @close="close">
        <el-form ref="form" label-width="85px" :model="form" :rules="rules">
          <el-form-item label="权限名称" prop="name">
            <el-input v-model="form.name" size="mini" />
          </el-form-item>
          <el-form-item label="权限标识" prop="code">
            <el-input v-model="form.code" size="mini" />
          </el-form-item>
          <el-form-item label="权限描述" prop="description">
            <el-input v-model="form.description" size="mini" />
          </el-form-item>
          <el-form-item label="开启" prop="enVisible">
            <el-switch
              v-model="form.enVisible"
              active-value="1"
              inactive-value="0"
            />
          </el-form-item>
          <el-row type="flex" align="center" justify="center">
            <el-button type="primary" size="mini" @click="submit">确定</el-button>
            <el-button size="mini" @click="close">取消</el-button>
          </el-row>
        </el-form>
      </el-dialog>
    </div>
  </div>
</template>
<script>
import { addPermissionItem, delPermissionItem, editPermissionItem, getPermissionItem, getPermissionList } from '@/api/permission'
import { handleDeptList } from '@/utils'
export default {
  name: 'Permission',
  data() {
    return {
      tableList: [],
      title: '',
      showDialog: false,
      currentId: null,
      form: {
        name: '',
        code: '',
        description: '',
        enVisible: 0,
        type: 2,
        pid: 0
      },
      rules: {
        name: [
          { required: true, message: '请输入权限名称', trigger: ['blur', 'change'] },
          {
            trigger: 'blur',
            validator: async(rule, value, callback) => {
              let res = await getPermissionList()
              if (this.form.id) {
                // 此处筛选条件应该为其他与v-model未绑定的值进行筛选，否则输入那个就会筛出那个
                res = res.filter(item => item.id !== this.form.id)
              }
              if (res.find(item => item.name === value)) {
                callback(new Error('权限名称已存在'))
              } else {
                callback()
              }
            }
          }
        ],
        code: [
          { required: true, message: '请输入权限标识', trigger: ['blur', 'change'] },
          {
            trigger: 'blur',
            validator: async(rule, value, callback) => {
              let res = await getPermissionList()
              if (this.form.id) {
                res = res.filter(item => item.id !== this.form.id)
              }
              if (res.find(item => item.code === value)) {
                callback(new Error('权限标识已存在'))
              } else {
                callback()
              }
            }
          }
        ],
        description: [
          { required: true, message: '请输入权限描述', trigger: ['blur', 'change'] }
        ]
      }
    }
  },
  created() {
    this.getPermissionList()
  },
  methods: {
    async getPermissionList() {
      const res = await getPermissionList()
      this.tableList = handleDeptList(res, 0)
    },
    async common(dialogType, id) {
      console.log(dialogType, id)
      this.showDialog = true
      this.currentId = id
      if (dialogType === 'edit') {
        this.title = '新增权限点'
        const res = await getPermissionItem(id)
        this.form = res
      } else if (dialogType === 'add') {
        this.title = '修改权限点'
        this.form.pid = id
      }
    },
    close() {
      this.$refs.form.resetFields()
      this.showDialog = false
    },
    submit() {
      this.$refs.form.validate(async ok => {
        if (ok) {
          if (this.form.id) {
            console.log(this.form)
            await editPermissionItem(this.form)
            this.$message.success('修改权限成功')
          } else {
            await addPermissionItem(this.form)
            this.$message.success('新增权限成功')
          }
          this.close()
          this.getPermissionList()
        }
      })
    },
    async del(id) {
      await delPermissionItem(id)
      this.$message.success('删除权限成功')
      this.getPermissionList()
    }
  }
}
</script>
<style lang="scss" scoped>
::v-deep .cell{
  text-align: center;
}
</style>
