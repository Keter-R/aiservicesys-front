<template>
  <div class="login-container">
    <div class="form-card">
      <h1>用户登录</h1>

      <el-form :model="loginForm" ref="loginFormRef" label-position="top">
        <el-form-item label="用户名" prop="username">
          <el-input
              v-model="loginForm.username"
              placeholder="请输入用户名"
          ></el-input>
        </el-form-item>

        <el-form-item label="密码" prop="password">
          <el-input
              type="password"
              v-model="loginForm.password"
              placeholder="请输入密码"
              show-password
          ></el-input>
        </el-form-item>

        <el-form-item>
          <el-button type="primary" class="btn-submit" @click="handleLogin">登录</el-button>
        </el-form-item>

        <div class="form-footer">
          <p>还没有账号？<router-link to="/register">立即注册</router-link></p>
          <p>管理员登录？<router-link to="/admin/login">管理员入口</router-link></p>
        </div>
      </el-form>
    </div>
  </div>
</template>

<script>
import { ElMessage } from 'element-plus';
import apiConfig from '@/components/api/config.js';
import axios from 'axios';

export default {
  name: 'Login',
  data() {
    return {
      loginForm: {
        username: '',
        password: ''
      }
    };
  },
  methods: {
    async handleLogin() {
      try {
        // const response = await axios.post(apiConfig.user.login, this.loginForm);
        // 伪造响应，模拟登录成功
        const response = { data: { code: 1, token: 'userToken' } };
        if (response.data.code) {
          localStorage.setItem('token', response.data.token || '');
          this.$router.push('/chat');  // 修改为跳转到聊天界面
          ElMessage.success('登录成功');
        } else {
          const errorMessage = response.data.message || response.data.error || '登录失败';
          ElMessage.error(errorMessage);
        }
      } catch (error) {
        console.error('登录失败:', error);
        let errorMessage = '服务器异常，请稍后再试';
        if (error.response && error.response.data) {
          errorMessage = error.response.data.message || error.response.data.error || errorMessage;
        }
        ElMessage.error(errorMessage);
      }
    }
  }
};
</script>

<style scoped>
.login-container {
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 100vh;
  padding: 20px;
}

.form-card {
  width: 100%;
  max-width: 400px;
  padding: 30px;
  background-color: #fff;
  border-radius: 8px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
}

h1 {
  text-align: center;
  margin-bottom: 24px;
  color: #333;
  font-size: 24px;
}

:deep(.el-form-item__label) {
  font-weight: 600;
}

.btn-submit {
  width: 100%;
}

.form-footer {
  margin-top: 20px;
  text-align: center;
}

a {
  color: var(--el-color-primary);
  text-decoration: none;
}

a:hover {
  text-decoration: underline;
}
</style>