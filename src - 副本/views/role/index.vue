<template>
  <div class="container">
    <div class="app-container">
      <el-row style="margin: 20px">
        <el-button type="primary" size="mini" @click="addRole">添加角色</el-button>
      </el-row>
      <el-table :data="tableData" style="width: 100%">
        <el-table-column prop="name" label="角色" width="350">
          <template v-slot="{ row }">
            <el-input v-if="row.isEdit" v-model="row.editForm.name" size="mini" placeholder="请输入部门名称" />
            <span v-else>{{ row.name }}</span>
          </template>
        </el-table-column>
        <el-table-column prop="state" label="启用" width="350">
          <template v-slot="{ row }">
            <el-switch v-if="row.isEdit" v-model="row.editForm.state" :active-value="1" :inactive-value="0" />
            <span v-else>{{ row.state === 1 ? '启用' : '未启用' }}</span>
          </template>
        </el-table-column>
        <el-table-column prop="description" label="描述" width="600">
          <template v-slot="{ row }">
            <el-input v-if="row.isEdit" v-model="row.editForm.description" size="mini" placeholder="请输入部门描述" />
            <span v-else>{{ row.description }}</span>
          </template>
        </el-table-column>
        <el-table-column label="操作">
          <template #default="{ row }">
            <template v-if="row.isEdit">
              <el-button type="primary" size="mini" @click="submitEdit(row)">确认</el-button>
              <el-button size="mini" @click="closeEdit(row)">取消</el-button>
            </template>
            <template v-else>
              <el-button type="text" size="small" @click="assignPermission(row.id)">分配权限</el-button>
              <el-button type="text" size="small" @click="edit(row)">编辑</el-button>
              <el-popconfirm title="确定删除吗？" @onConfirm="del(row.id)">
                <el-button slot="reference" type="text" size="small" style="margin-left: 10px">删除</el-button>
              </el-popconfirm>
            </template>
          </template>
        </el-table-column>
      </el-table>
      <el-row type="flex" justify="end" style="margin: 20px">
        <el-pagination
          :current-page="page"
          :page-size="pagesize"
          :page-sizes="[10, 20, 30, 400]"
          layout="total ,sizes, prev, pager, next, jumper"
          :total="total"
          @size-change="handleSizeChange"
          @current-change="handleCurrentChange"
        />
      </el-row>
      <el-dialog title="添加角色" :visible="addRoledialog" width="30%" @close="closeAddRoledialog">
        <el-form ref="addForm" :model="addForm" :rules="rules">
          <el-form-item prop="name" label="角色名称" label-width="80px">
            <el-input v-model="addForm.name" size="small" />
          </el-form-item>
          <el-form-item prop="state" label="启用" label-width="80px">
            <el-switch
              v-model="addForm.state"
              :active-value="1"
              :inactive-value="0"
              active-icon-class="启用"
              inactive-icon-class="未启用"
            />
          </el-form-item>
          <el-form-item prop="description" label="角色描述" label-width="80px">
            <el-input
              v-model="addForm.description"
              type="textarea"
              size="small"
            /></el-form-item>
          <el-row type="flex" justify="center" style="margin: 20px 0">
            <el-button type="primary" size="mini" @click="setaddSubmit">确定</el-button>
            <el-button size="mini" @click="closeAddRoledialog">取消</el-button>
          </el-row>
        </el-form>
      </el-dialog>
      <el-dialog :visible="assignDialog" title="分配权限">
        <el-tree
          ref="permissionTree"
          :data="permissionList"
          show-checkbox
          node-key="id"
          :props="{ label: 'name', children: 'children' }"
          :default-checked-keys="checkList"
          :expand-on-click-node="false"
          :check-strictly="true"
          default-expand-all
        />
        <el-row type="flex" justify="center" style="margin-top: 20px">
          <el-button type="primary" @click="submitPermission">确定</el-button>
          <el-button @click="closeDialog">取消</el-button>
        </el-row>
      </el-dialog>
    </div>
  </div>
</template>
<script>
import {
  addRole,
  assignPermission,
  delRoleItem,
  editRoleItem,
  getPermissionList,
  getRoleItem,
  getRoleList
} from '@/api/role'
import { handleDeptList } from '@/utils'

export default {
  name: 'Role',
  data() {
    return {
      tableData: [],
      page: 1,
      pagesize: 10,
      total: 0,
      addRoledialog: false,
      assignDialog: false,
      permissionList: [],
      checkList: [],
      currentId: 0,
      addForm: {
        id: '',
        name: '',
        description: '',
        state: 0
      },
      rules: {
        name: [{ required: true, message: '请输入角色名称', trigger: ['blur', 'change'] }],
        description: [{ required: true, message: '请输入角色描述', trigger: ['blur', 'change'] }]
      }
    }
  },
  created() {
    this.getRoleList()
  },
  methods: {
    async getRoleList() {
      // console.log(this.page)
      const res = await getRoleList({
        page: this.page,
        pagesize: this.pagesize
      })
      this.tableData = res.rows
      this.total = res.total
      this.tableData.forEach(item => {
        this.$set(item, 'isEdit', false)
        // 此处可以将编辑模式下回显数据进行绑定到响应式数据
        // 使用v-model绑定这些新数据后即可实现双向数据绑定和响应式
        this.$set(item, 'editForm', {
          name: item.name,
          state: item.state,
          description: item.description
        })
      })
    },
    handleCurrentChange(value) {
      // console.log(value)
      this.page = value
      this.getRoleList()
    },
    handleSizeChange(value) {
      this.pagesize = value
      this.getRoleList()
    },
    addRole() {
      console.log('add')
      this.addRoledialog = true
    },
    closeAddRoledialog() {
      this.$refs.addForm.resetFields()
      this.addRoledialog = false
    },
    addSubmit() {
      this.$refs.addForm.validate(async ok => {
        if (ok) {
          await addRole(this.addForm)
          // console.log(this.addForm)
          this.$message.success('角色添加成功')
          this.closeAddRoledialog()
          this.handleCurrentChange(this.total / this.pagesize + 1)
        }
      })
    },
    // 定时器添加,和上面
    async setaddSubmit() {
      setInterval(async() => {
        await addRole({
          id: '',
          name: '常山赵子龙' + Math.floor(Math.random() * 255),
          description: '常山赵子龙给大家加点数据删除' + Math.floor(Math.random() * 255),
          state: Math.floor(Math.random() * 1)
        })
        // console.log(this.addForm)
        this.closeAddRoledialog()
      }, 200)
    },
    // 点击编辑，行内样式切换，
    // 数据回显
    edit(row) {
      row.isEdit = true
    },
    closeEdit(row) {
      row.isEdit = false
      row.editForm = {
        name: row.name,
        state: row.state,
        description: row.description
      }
    },
    updateViews(row) {
      row.isEdit = false
      // 单独存放是因为eslint的校验规则问题,报错不影响,但不美观
      // 点击编辑提交,让默认显示的数据更新为修改后的数据进行显示,可以少发送一次请求
      // 减少发请求次数
      row.name = row.editForm.name
      row.state = row.editForm.state
      row.description = row.editForm.description
    },
    async submitEdit(row) {
      if (!row.editForm.name.trim() || !row.editForm.description.trim()) return alert('输入不能为空')
      await editRoleItem({ ...row.editForm, id: row.id })
      this.$message.success('部门修改成功')
      this.updateViews(row)
    },
    async del(id) {
      await delRoleItem(id)
      this.$message.success('删除角色成功')
      if (this.page > 1 && this.tableData.length === 1) {
        this.page--
        this.getRoleList()
      }
    },
    async assignPermission(id) {
      this.currentId = id
      this.checkList = []
      // 优化
      const values = await Promise.all([getPermissionList(), getRoleItem(id)])
      console.log(values)
      this.permissionList = handleDeptList(values[0], 0)
      this.checkList = values[1].permIds
      this.assignDialog = true
      // 获取权限列表
      // getPermissionList()
      // 获取角色详情，查看权限回显
      // getRoleItem()
    },
    async submitPermission() {
      await assignPermission({
        permIds: this.$refs.permissionTree.getCheckedKeys(),
        id: this.currentId
      })
      this.$message.success('分配权限成功')
      this.closeDialog()
    },
    closeDialog() {
      this.assignDialog = false
    }
  }
}
</script>
<style lang="scss" scoped>
::v-deep .cell {
  text-align: center;
}
</style>
