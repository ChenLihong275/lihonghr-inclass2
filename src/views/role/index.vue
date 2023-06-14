<template>
  <div class="container">
    <div class="app-container">
      <el-row style="margin: 20px">
        <el-button type="primary" size="mini" @click="addRole">添加角色</el-button>
      </el-row>
      <el-table :data="tableData" style="width: 100%">
        <el-table-column prop="name" label="角色" width="350">
          <template v-slot="{ row }">
            <!-- <el-input v-if="row.isEdit" v-model="form.name" placeholder="请输入部门名称" /> -->
            <span>{{ row.name }}</span>
          </template>
        </el-table-column>
        <el-table-column prop="state" label="启用" width="350">
          <template v-slot="{ row }">
            <!-- <el-switch v-if="row.isEdit" v-model="form.state" :active-value="1" :inactive-value="0" /> -->
            <span>{{ row.state === 1 ? '启用' : '未启用' }}</span>
          </template>
        </el-table-column>
        <el-table-column prop="description" label="描述" width="600">
          <template v-slot="{ row }">
            <!-- <el-input v-if="row.isEdit" v-model="form.description" placeholder="请输入部门描述" /> -->
            <span>{{ row.description }}</span>
          </template>
        </el-table-column>
        <el-table-column label="操作">
          <template>
            <!-- <template v-if="row.isEdit">
                <el-button type="primary" size="mini" @click="submitEdit(row)">确认</el-button>
                <el-button size="mini" @click="closeEdit(row)">取消</el-button>
              </template> -->
            <template>
              <el-button type="text" size="small">分配权限</el-button>
              <el-button type="text" size="small">编辑</el-button>
              <el-popconfirm title="确定删除吗？">
                <el-button slot="reference" type="text" size="small" style="margin-left: 10px">删除</el-button>
              </el-popconfirm>
            </template>
          </template>
        </el-table-column>
      </el-table>
      <el-row type="flex" justify="end">
        <el-pagination
          :current-page="page"
          :page-size="pagesize"
          layout="total , prev, pager, next, jumper"
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
            <el-button type="primary" size="mini" @click="addSubmit">确定</el-button>
            <el-button size="mini" @click="closeAddRoledialog">取消</el-button>
          </el-row>
        </el-form>
      </el-dialog>
    </div>
  </div>
</template>
<script>
import { addRole, getRoleList } from '@/api/role'

export default {
  name: 'Role',
  data() {
    return {
      tableData: [],
      page: 1,
      pagesize: 10,
      total: 0,
      addRoledialog: false,
      addForm: {
        id: '',
        name: '',
        description: '',
        state: 0
      },
      rules: {
        name: [{ required: true, message: '请输入角色名称', trigger: ['blur', 'change'] }],
        description: [{ required: true, message: '请输入角色描述', trigger: ['blur', 'change'] }]
        // { required: true, message: '请输入活动名称', trigger: 'blur' },
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
      // console.log(res)
      this.tableData = res.rows
      this.total = res.total
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
    }
  }
}
</script>
<style lang="scss" scoped>
::v-deep .cell {
  text-align: center;
}
</style>
