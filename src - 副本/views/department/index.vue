<template>
  <div class="container">
    <div class="app-container" style="padding: 0 250px">
      <el-tree
        :data="deptList"
        :props="{ label: 'name', children: 'children' }"
        default-expand-all
        :expand-on-click-node="false"
      >
        <template #default="{ data }">
          <el-row style="width: 100%" type="flex">
            <el-col :span="20">{{ data.name }}</el-col>
            <el-col :span="4">
              <el-row type="flex" justify="space-between" :gutter="20" style="margin: 0; padding: 0">
                <el-col :span="12" style="margin: 0; padding: 0">{{ data.managerName }}</el-col>
                <el-col :span="12" style="margin: 0; padding: 0">
                  <el-dropdown @command="handleCommand($event, data.id)">
                    <span class="el-dropdown-link"> 下拉菜单<i class="el-icon-arrow-down el-icon--right" /> </span>
                    <el-dropdown-menu slot="dropdown">
                      <el-dropdown-item command="add">添加部门</el-dropdown-item>
                      <el-dropdown-item command="edit">编辑部门</el-dropdown-item>
                      <el-dropdown-item command="del">删除部门</el-dropdown-item>
                    </el-dropdown-menu>
                  </el-dropdown>
                </el-col>
              </el-row>
            </el-col>
          </el-row>
        </template>
      </el-tree>
      <DeptDialog
        ref="DeptDialog"
        :dialog-visible.sync="dialogVisible"
        :depts="DeptListRoot"
        :current-id="currentId"
        :dialog-type="dialogType"
        :title="title"
        @getDeptList="getDeptList"
      />
    </div>
  </div>
</template>
<script>
import DeptDialog from './components/deptDialog.vue'
import { delDepartmentDetail, getDeptList } from '@/api/department'
import { handleDeptList } from '@/utils'
export default {
  name: 'Department',
  components: {
    DeptDialog
  },
  data() {
    return {
      deptList: [],
      DeptListRoot: [],
      dialogVisible: false,
      currentId: 0,
      dialogType: '',
      title: ''
    }
  },
  created() {
    this.getDeptList()
  },
  methods: {
    async getDeptList() {
      const res = await getDeptList()
      this.DeptListRoot = res
      this.deptList = handleDeptList(res, 0)
      // console.log(JSON.parse(JSON.stringify(res)))
      // console.log(JSON.parse(JSON.stringify(handleDeptList(res, 0))))
    },
    async  handleCommand(command, id) {
      // console.log(command, id)
      this.currentId = id
      this.dialogType = command
      if (command === 'add') {
        this.dialogVisible = true
        this.title = '添加部门'
      } else if (command === 'edit') {
        this.dialogVisible = true
        this.title = '修改部门'
        this.$refs.DeptDialog.getDepartmentItem(id)
      } else if (command === 'del') {
        await delDepartmentDetail(id)
        this.$message.success('删除成功')
        this.getDeptList()
      }
    }
  }

}
</script>
<style lang="scss" scoped>
::v-deep .el-col-12 {
  text-align: center;
}
</style>
