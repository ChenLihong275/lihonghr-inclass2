<template>
  <div class="login-container">
    <div class="logo" />
    <div class="form">
      <h1>登录</h1>
      <el-card shadow="never" class="login-card">
        <el-form ref="loginForm" :model="loginForm" :rules="rules">
          <el-form-item prop="mobile">
            <el-input v-model="loginForm.mobile" />
          </el-form-item>
          <el-form-item prop="password">
            <el-input v-model="loginForm.password" :type="showPassword ? 'password' : 'text'">
              <template #suffix>
                <svg-icon v-if="showPassword" icon-class="eye" @click="showPassword = !showPassword" />
                <svg-icon v-else icon-class="eye-open" @click="showPassword = !showPassword" />
              </template>
            </el-input>
          </el-form-item>
          <el-form-item prop="checked">
            <el-checkbox v-model="loginForm.checked"> 用户平台使用协议 </el-checkbox>
          </el-form-item>
          <el-form-item>
            <el-button type="primary" style="width: 350px" :loading="loading" @click="loginSubmit"> 登录 </el-button>
          </el-form-item>
        </el-form>
      </el-card>
    </div>
  </div>
</template>
<script>
export default {
  name: 'Login',
  data() {
    return {
      showPassword: true,
      loginForm: {
        mobile: '13800000002',
        password: 'hm#qd@23!',
        // mobile: '',
        // password: '',
        checked: true
      },
      rules: {
        mobile: [
          { required: true, message: '请输入手机号', trigger: ['blur', 'change'] },
          { pattern: /^1[3-9]\d{9}$/, message: '手机号格式不正确', trigger: ['blur', 'change'] }
        ],
        password: [
          { required: true, message: '请输入密码', trigger: ['blur', 'change'] },
          { min: 6, max: 16, message: '长度在 6 到 15 个字符', trigger: ['blur', 'change'] }
        ],
        checked: [
          {
            validator: (rule, value, callback) => {
              value ? callback() : callback(new Error('必须勾选协议'))
            },
            trigger: 'change'
          }
        ]
      },
      loading: false
    }
  },
  methods: {
    // 登录表单验证
    loginSubmit() {
      this.$refs.loginForm.validate(async OK => {
        if (OK) {
          this.loading = true
          try {
            await this.$store.dispatch('user/login', this.loginForm)
            this.$message.success('登录成功')
            this.$router.push('/dashboard')
          } catch {
            this.loading = false
          }
        }
      })
    }
  }
}
</script>
<style lang="scss">
.login-container {
  display: flex;
  align-items: stretch;
  height: 100vh;
  .logo {
    flex: 3;
    background: rgba(38, 72, 176) url(../../assets/common/login_back.png) no-repeat center / cover;
    border-top-right-radius: 60px;
    display: flex;
    flex-direction: column;
    align-items: flex-end;
    justify-content: center;
    padding: 0 100px;
    .icon {
      background: url(../../assets/common/logo.png) no-repeat 70px center / contain;
      width: 300px;
      height: 50px;
      margin-bottom: 50px;
    }
    p {
      color: #fff;
      font-size: 18px;
      margin-top: 20px;
      width: 300px;
      text-align: center;
    }
  }
  .form {
    flex: 2;
    display: flex;
    flex-direction: column;
    justify-content: center;
    padding-left: 176px;
    .el-card {
      border: none;
      padding: 0;
    }
    h1 {
      padding-left: 20px;
      font-size: 24px;
    }
    .el-input {
      width: 350px;
      height: 44px;
      .el-input__suffix {
        margin-right: 10px;
      }
      .el-input__inner {
        background: #f4f5fb;
      }
    }
    .el-checkbox {
      color: #606266;
    }
  }
}
</style>
