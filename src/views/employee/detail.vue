<template>
  <div class="dashboard-container">
    <div class="app-container">
      <div class="edit-form">
        <el-form ref="userForm" :model="userInfo" :rules="rules" label-width="220px">
          <!-- 姓名 -->
          <el-row>
            <el-col :span="12">
              <el-form-item label="姓名" prop="username">
                <el-input v-model="userInfo.username" size="mini" class="inputW" />
              </el-form-item>
            </el-col>
          </el-row>
          <!-- 工号 -->
          <el-row>
            <el-col :span="12">
              <el-form-item label="工号" prop="workNumber">
                <!-- 工号是系统生成的  禁用这个组件-->
                <el-input v-model="userInfo.workNumber" disabled size="mini" class="inputW" />
              </el-form-item>
            </el-col>
          </el-row>
          <!--手机  -->
          <el-row>
            <el-col :span="12">
              <el-form-item label="手机" prop="mobile">
                <el-input v-model="userInfo.mobile" size="mini" class="inputW" />
              </el-form-item>
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="12">
              <el-form-item label="部门" prop="departmentId">
                <el-cascader
                  v-model="userInfo.departmentId"
                  size="mini"
                  :options="options"
                  class="inputW"
                  :props="props"
                  :emit-path="true"
                />
              </el-form-item>
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="12">
              <el-form-item label="聘用形式" prop="formOfEmployment">
                <el-select v-model="userInfo.formOfEmployment" size="mini" class="inputW">
                  <el-option label="正式" :value="1" />
                  <el-option label="非正式" :value="2" />
                </el-select>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="12">
              <el-form-item label="入职时间" prop="timeOfEntry">
                <el-date-picker
                  v-model="userInfo.timeOfEntry"
                  size="mini"
                  type="date"
                  value-format="yyyy-MM-dd"
                  class="inputW"
                />
              </el-form-item>
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="12">
              <el-form-item label="转正时间" prop="correctionTime">
                <el-date-picker
                  v-model="userInfo.correctionTime"
                  size="mini"
                  type="date"
                  value-format="yyyy-MM-dd"
                  class="inputW"
                />
              </el-form-item>
            </el-col>
          </el-row>
          <!-- 员工照片 -->
          <el-row>
            <el-col :span="12">
              <el-form-item label="员工头像">
                <!-- 放置上传图片 -->
                <imageUpload v-model="userInfo.staffPhoto" :disabled.sync="disabled" />
              </el-form-item>
            </el-col>
          </el-row>
          <!-- 保存个人信息 -->
          <el-row type="flex">
            <el-col :span="12" style="margin-left: 220px">
              <el-button size="mini" type="primary" :disabled="disabled" @click="saveData">保存更新</el-button>
            </el-col>
          </el-row>
        </el-form>
      </div>
    </div>
  </div>
</template>

<script>

import { getDeptList } from '@/api/department'
import { handleDeptList } from '@/utils'
import { addEmployeeItem, editEmployeeItem, getEmployeeItem } from '@/api/employee'
import imageUpload from './components/image-upload'
export default {
  components: {
    imageUpload
  },
  data() {
    return {
      userInfo: {
        username: '', // 用户名
        mobile: '', // 手机号
        workNumber: '', // 工号
        formOfEmployment: null, // 聘用形式
        departmentId: null, // 部门id
        timeOfEntry: '', // 入职时间
        correctionTime: '' // 转正时间
      },
      rules: {
        username: [
          { required: true, message: '请输入姓名', trigger: 'blur' },
          { pattern: /^(?:[\u4e00-\u9fa5·]{2,4})$/, message: '请输入2-4位中文字符' }
        ],
        mobile: [
          { required: true, message: '请输入手机号', trigger: 'blur' },
          {
            //   pattern 正则表达式
            pattern: /^1[3-9]\d{9}$/,
            message: '手机号格式不正确',
            trigger: 'blur'
          }
        ],
        formOfEmployment: [{ required: true, message: '请选择聘用形式', trigger: 'change' }],
        departmentId: [{ required: true, message: '请选择部门', trigger: 'change' }],
        timeOfEntry: [{ required: true, message: '请选择入职时间', trigger: 'blur' }],
        correctionTime: [
          { required: true, message: '请选择转正时间', trigger: 'blur' },
          {
            validator: (rule, value, callback) => {
              if (this.userInfo.timeOfEntry) {
                if (new Date(this.userInfo.timeOfEntry) > new Date(value)) {
                  callback(new Error('转正时间不能小于入职时间'))
                  return
                }
              }
              callback()
            }
          }
        ]
      },
      options: [],
      props: {
        label: 'name',
        value: 'id',
        emitPath: false,
        checkStrictly: true
      },
      disabled: false
    }
  },
  created() {
    this.getDeptList()
    // 获取单个员工信息
    this.$route.params.id && this.getEmployeeItem(this.$route.params.id)
  },
  methods: {
    saveData() {
      this.$refs.userForm.validate(async ok => {
        if (!ok) return
        if (this.$route.params.id) {
          console.log(JSON.parse(JSON.stringify(this.$route.params.id)))
          await editEmployeeItem(this.userInfo)
          this.$message.success('员工修改成功')
        } else {
          await addEmployeeItem(this.userInfo)
          this.$message.success('新增员工成功')
        }
        this.$router.push('/employee')
      })
    },
    async getDeptList() {
      const res = await getDeptList()
      this.options = handleDeptList(res, 0)
    },
    async getEmployeeItem(id) {
      const res = await getEmployeeItem(id)
      this.userInfo = res
    }
  }
}
</script>

<style scoped lang="scss">
.edit-form {
  background: #fff;
  padding: 20px;
  .inputW {
    width: 380px;
  }
}
</style>
