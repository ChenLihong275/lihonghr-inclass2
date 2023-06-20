<template>
  <div class="navbar">
    <hamburger :is-active="sidebar.opened" class="hamburger-container" @toggleClick="toggleSideBar" />
    <breadcrumb class="breadcrumb-container" />
    <div class="right-menu">
      <el-dropdown class="avatar-container" trigger="click">
        <div class="avatar-wrapper">
          <img v-if="!avatar" :src="avatar" class="user-avatar">
          <span v-else class="user-avatar">{{ username.charAt(0) }}</span>
          <span class="username">{{ username }}</span>
          <i class="el-icon-caret-bottom" />
        </div>
        <el-dropdown-menu slot="dropdown" class="user-dropdown">
          <router-link to="/">
            <el-dropdown-item> 主页 </el-dropdown-item>
          </router-link>
          <a target="_blank" href="https://github.com/PanJiaChen/vue-admin-template/">
            <el-dropdown-item>项目地址</el-dropdown-item>
          </a>
          <a target="_blank" @click.prevent="editPasswordDialog">
            <el-dropdown-item>修改密码</el-dropdown-item>
          </a>
          <el-dropdown-item divided @click.native="logout">
            <span style="display: block">退出登录</span>
          </el-dropdown-item>
        </el-dropdown-menu>
      </el-dropdown>
      <el-dialog :destroy-on-close="true" :visible.sync="dialogFormVisible" width="30%" title="修改密码" @close="closePasswordDialog">
        <el-form ref="editPasswordForm" label-width="80px" :model="editPasswordForm" :rules="rules">
          <el-form-item label="旧密码" prop="oldPassword">
            <el-input v-model="editPasswordForm.oldPassword" placeholder="请输入旧密码" size="small" />
          </el-form-item>
          <el-form-item label="新密码" prop="newPassword">
            <el-input v-model="editPasswordForm.newPassword" placeholder="请输入新密码" size="small" />
          </el-form-item>
          <el-form-item label="重复密码" prop="repeatPassword">
            <el-input v-model="editPasswordForm.repeatPassword" placeholder="重复输入新密码" size="small" />
          </el-form-item>
          <el-form-item size="small">
            <el-button type="primary" @click="editPassword">确认</el-button>
            <el-button @click="closePasswordDialog">取消</el-button>
          </el-form-item>
        </el-form>
      </el-dialog>
    </div>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import Breadcrumb from '@/components/Breadcrumb'
import Hamburger from '@/components/Hamburger'

export default {
  components: {
    Breadcrumb,
    Hamburger
  },
  data() {
    return {
      dialogFormVisible: false,
      editPasswordForm: {
        oldPassword: '',
        newPassword: '',
        repeatPassword: ''
      },
      rules: {
        oldPassword: [
          { required: true, message: '请输入旧密码', trigger: ['blur', 'change'] }
        ],
        newPassword: [
          { required: true, message: '请输入新密码', trigger: ['blur', 'change'] },
          { min: 6, max: 16, message: '密码长度为6-16位', trigger: ['blur', 'change'] }

        ],
        // 自定义校验
        repeatPassword: [
          { required: true, message: '请再次输入新密码', trigger: ['blur', 'change'] },
          {
            trigger: 'blur',
            validator: (rule, value, callback) => {
              if (value !== this.editPasswordForm.newPassword) {
                callback(new Error('两次密码输入不一致'))
              } else {
                callback()
              }
            }
          }
        ]
      }
    }
  },
  computed: {
    ...mapGetters(['sidebar', 'avatar', 'username'])
  },
  created() {
  },
  methods: {
    toggleSideBar() {
      this.$store.dispatch('app/toggleSideBar')
    },
    async logout() {
      await this.$store.dispatch('user/logout')
      this.$router.push('/login')
    },
    editPasswordDialog() {
      this.dialogFormVisible = true
    },
    editPassword() {
      this.$refs.editPasswordForm.validate(async ok => {
        if (ok) {
          await this.$store.dispatch('user/editPassword', this.editPasswordForm)
          this.$message.success('密码修改成功')
          // 密码修改成功后退出登陆，跳转登录
          this.$store.dispatch('user/logout')
          this.$router.push('/login')
        }
      })
    },
    closePasswordDialog() {
      this.$refs.editPasswordForm.resetFields()
      this.dialogFormVisible = false
    }
  }
}
</script>

<style lang="scss" scoped>
.navbar {
  height: 50px;
  overflow: hidden;
  position: relative;
  background: #fff;
  box-shadow: 0 1px 4px rgba(0, 21, 41, 0.08);

  .hamburger-container {
    line-height: 46px;
    height: 100%;
    float: left;
    cursor: pointer;
    transition: background 0.3s;
    -webkit-tap-highlight-color: transparent;

    &:hover {
      background: rgba(0, 0, 0, 0.025);
    }
  }

  .breadcrumb-container {
    float: left;
  }

  .right-menu {
    float: right;
    height: 100%;
    line-height: 50px;

    &:focus {
      outline: none;
    }

    .right-menu-item {
      display: inline-block;
      padding: 0 8px;
      height: 100%;
      font-size: 18px;
      color: #5a5e66;
      vertical-align: text-bottom;

      &.hover-effect {
        cursor: pointer;
        transition: background 0.3s;

        &:hover {
          background: rgba(0, 0, 0, 0.025);
        }
      }
    }

    .avatar-container {
      margin-right: 30px;

      .avatar-wrapper {
        display: flex;
        align-items: center;
        margin-top: 5px;
        position: relative;
        cursor: pointer;

        .user-avatar {
          cursor: pointer;
          width: 30px;
          height: 30px;
          text-align: center;
          line-height: 30px;
          background-color: #b0d7dd;
          font-weight: 700;
          border-radius: 50%;
        }
        .username{
          display: inline-block;
          margin:0 5px 0 10px;
          font-weight: 700;
        }

        .el-icon-caret-bottom {
          cursor: pointer;
          position: absolute;
          right: -20px;
          top: 25px;
          font-size: 12px;
        }
      }
    }
  }
}
</style>
