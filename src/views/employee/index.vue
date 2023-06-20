<template>
  <div class="container">
    <el-container class="app-container">
      <el-aside class="left">
        <el-input
          v-model="queryParams.keyword"
          style="margin-bottom: 10px"
          type="text"
          prefix-icon="el-icon-search"
          size="small"
          placeholder="输入员工姓名全员搜索"
          clearable
          @input="searchEmployee"
        />
        <!-- 树形组件 -->
        <el-tree
          ref="deptTree"
          :data="dataList"
          :props="{ label: 'name', children: 'children' }"
          default-expand-all
          :expand-on-click-node="false"
          :highlight-current="true"
          node-key="id"
          @current-change="changeTreeNode"
        />
      </el-aside>
      <el-container class="right">
        <el-header>
          <el-row class="opeate-tools" type="flex" justify="end">
            <el-button
              v-special="'add'"
              size="mini"
              type="primary"
              @click="$router.push('/employee/detail')"
            >添加员工</el-button>
            <el-button v-special="'importexcel'" size="mini" @click="importExcel">excel导入</el-button>
            <el-button v-special="'exportexcel'" size="mini" @click="exportExcel">excel导出</el-button>
          </el-row>
        </el-header>
        <!-- 表格组件 -->
        <el-main>
          <el-table :data="tableList" style="width: 100%">
            <el-table-column prop="staffPhoto" label="头像" width="180">
              <template v-slot="{ row }">
                <el-avatar v-if="row.staffPhoto" :size="30" :src="row.staffPhoto" />
                <span v-else class="employeeAvatar">{{ row.username.charAt(0) }}</span>
              </template>
            </el-table-column>
            <el-table-column prop="username" label="姓名" width="180" />
            <el-table-column prop="mobile" sortable label="手机号" />
            <el-table-column prop="workNumber" sortable label="工号" />
            <el-table-column prop="formOfEmployment" label="聘用形式">
              <template v-slot="{ row }">
                <span>{{ row.formOfEmployment === 1 ? '正式' : '非正式' }}</span>
              </template>
            </el-table-column>
            <el-table-column prop="departmentName" label="部门" />
            <el-table-column prop="timeOfEntry" sortable label="入职时间" />
            <el-table-column label="操作">
              <template v-slot="{ row }">
                <el-button type="text" size="small" @click="$router.push(`/employee/detail/${row.id}`)">查看</el-button>
                <el-button type="text" size="small" @click="assignRoles(row.id)">角色</el-button>
                <el-popconfirm title="这是一段内容确定删除吗？" @onConfirm="del(row.id)">
                  <el-button slot="reference" type="text" size="small" style="margin-left: 10px">删除</el-button>
                </el-popconfirm>
              </template>
            </el-table-column>
          </el-table>
          <el-row type="flex" justify="end" align="middle" style="margin: 20px">
            <el-pagination
              :current-page="queryParams.page"
              :page-sizes="[10, 20, 30, 400]"
              :page-size="queryParams.pagesize"
              layout="total, sizes, prev, pager, next, jumper"
              :total="total"
              @size-change="handleSizeChange"
              @current-change="handleCurrentChange"
            />
          </el-row>
        </el-main>
      </el-container>
    </el-container>
    <!-- 子组件 -->
    <importExcel :show-excel-dialog.sync="showExcelDialog" @update="getEmployeeList" />
    <el-dialog :visible="showRoleDialog" title="分配角色" width="30%" @close="closeRoleDialog">
      <el-row>
        <el-checkbox-group v-model="checkList">
          <el-checkbox v-for="item in roleList" :key="item.id" :label="item.id">{{ item.name }}</el-checkbox>
        </el-checkbox-group>
      </el-row>
      <el-row type="flex" justify="center" style="margin-top: 20px">
        <el-button type="primary" @click="submitRoleList">确定</el-button>
        <el-button @click="closeRoleDialog">取消</el-button>
      </el-row>
    </el-dialog>
  </div>
</template>

<script>
import { getDeptList } from '@/api/department'
import { assignRoles, delEmployeeItem, getEmployeeItem, getEmployeeList, getExcelData } from '@/api/employee'
import { handleDeptList } from '@/utils'
import FileSaver from 'file-saver'
import importExcel from './components/import-excel'
import { getEnableRoleList } from '@/api/role'
// import importExcelSecond from './components/import-excel-second'
export default {
  name: 'Employee',
  components: {
    importExcel
    // importExcelSecond
  },
  data() {
    return {
      dataList: [],
      tableList: [],
      showRoleDialog: false,
      roleList: [],
      checkList: [],
      queryParams: {
        page: 1,
        pagesize: 10,
        keyword: null,
        departmentId: null
      },
      total: 0,
      showExcelDialog: false
      // search: ''
    }
  },
  // 使用监听器监听变化，删除完成最后一个字后进行刷新页面退出搜索
  watch: {
    'queryParams.keyword'(newValue, oldValue) {
      console.log(newValue, oldValue)
      if (oldValue && !newValue) {
        this.queryParams.page = 1
        this.getEmployeeList()
      }
    }
  },
  created() {
    this.getDeptList()
    // 因为设置了默认选择某个树节点,所以不需要在进入页面的时候进行获取数据
    // 在树节点的默认选择驱动下刷新表格列表
    // this.getEmployeeList()
  },
  methods: {
    async getDeptList() {
      const res = await getDeptList()
      this.dataList = handleDeptList(res, 0)
      // console.log(this.dataList)
      this.queryParams.departmentId = this.dataList[0].id
      // defaultDeptId
      // setCurrentKey
      this.$nextTick(() => {
        // 通过tree组件的setCurrentKey方法设置目前高亮节点
        // 通过tree身上绑定的node-key唯一标识来确定高亮节点
        this.$refs.deptTree.setCurrentKey(this.queryParams.departmentId)
      })
      this.getEmployeeList()
    },
    async getEmployeeList() {
      const res = await getEmployeeList(this.queryParams)
      // console.log(JSON.parse(JSON.stringify(res)))
      this.tableList = res.rows
      this.total = res.total
    },
    changeTreeNode(data) {
      // 在树组件切换节点时,让页码回归到第一页
      this.queryParams.page = 1
      this.queryParams.departmentId = data.id
      this.getEmployeeList()
    },
    handleCurrentChange(value) {
      this.queryParams.page = value
      this.getEmployeeList()
    },
    handleSizeChange(value) {
      this.queryParams.page = 1
      this.queryParams.pagesize = value
      this.getEmployeeList()
    },
    searchEmployee() {
      // 添加一个防抖
      // 添加一个判断,如果输入为空,则不发送请求
      if (!this.queryParams.keyword.trim()) {
        return
      }
      // 清空页码(即页码回到1),因为在别的页面访问不到
      this.queryParams.page = 1
      clearTimeout(this.timer)
      this.timer = setTimeout(() => {
        this.getEmployeeList()
      }, 500)
    },
    // 当取消搜索,输入框为空时,回归页面初始
    // 注释原因:无效
    // @change事件
    // changeNull() {
    //   if (!this.queryParams.keyword) {
    //     console.log('change')
    //     this.queryParams.page = 1
    //     this.getEmployeeList()
    //   }
    // },
    // @clear事件
    // clearSearch() {
    //   console.log('clear')
    //   this.queryParams.page = 1
    //   this.getEmployeeList()
    // }
    async exportExcel() {
      const res = await getExcelData()
      FileSaver.saveAs(res, '员工数据表')
    },
    importExcel() {
      this.showExcelDialog = true
    },
    async del(id) {
      await delEmployeeItem(id)
      if (this.tableList === 1 && this.queryParams.page > 1) {
        this.queryParams.page--
      }
      this.$message.success('删除成功')
      this.getEmployeeList()
    },
    async assignRoles(id) {
      // console.log(id)
      this.currentId = id
      // 此处存在多个请求并发，无依赖关系，可以进行优化,减少响应时间
      const values = await Promise.all([getEnableRoleList(), getEmployeeItem(id)])
      this.roleList = values[0]
      this.checkList = values[1].roleIds
      // 获取已启用的角色列表
      // const res = await getEnableRoleList()
      // this.roleList = res
      // 获取员工详情，回显数据
      // const res1 = await getEmployeeItem(id)
      // this.checkList = res1.roleIds
      this.showRoleDialog = true
    },
    closeRoleDialog() {
      this.showRoleDialog = false
    },
    async submitRoleList() {
      await assignRoles({ roleIds: this.checkList, id: this.currentId })
      this.$message.success('分配角色成功')
      this.closeRoleDialog()
    }
  }
}
</script>

<style lang="scss" scoped>
.employeeAvatar {
  display: inline-block;
  width: 30px;
  height: 30px;
  background-color: #8bbac6;
  color: #fff;
  border: none;
  text-align: center;
  line-height: 30px;
  border-radius: 50%;
}
::v-deep .cell {
  text-align: center;
}
.app-container {
  background: #fff;
  display: flex;
  height: 93vh;
  .left {
    width: 280px;
    padding: 20px;
    border-right: 1px solid #eaeef4;
  }
  .right {
    flex: 1;
    padding: 20px;
    .opeate-tools {
      margin: 10px;
    }
    .username {
      height: 30px;
      width: 30px;
      line-height: 30px;
      text-align: center;
      border-radius: 50%;
      color: #fff;
      background: #04c9be;
      font-size: 12px;
      display: inline-block;
    }
  }
}
</style>
