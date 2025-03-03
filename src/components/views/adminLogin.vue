<template>
  <div class="admin-login-container">
    <div class="form-card">
      <h1>管理员登录</h1>

      <el-form :model="loginForm" ref="loginFormRef" label-position="top">
        <el-form-item label="管理员账号" prop="username">
          <el-input
              v-model="loginForm.username"
              placeholder="请输入管理员账号"
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
          <el-button type="primary" class="btn-submit" @click="handleAdminLogin">管理员登录</el-button>
        </el-form-item>

        <div class="form-footer">
          <p>普通用户？<router-link to="/login">用户登录</router-link></p>
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
  name: 'AdminLogin',
  data() {
    return {
      loginForm: {
        username: '',
        password: ''
      }
    };
  },
  methods: {
    async handleAdminLogin() {
      try {
        // 管理员登录API端点
        // const response = await axios.post(apiConfig.admin.login, this.loginForm);
        // 单机测试，伪造管理员登录成功
        const response = { data: { code: 1, token: 'adminToken' } };

        if (response.data.code) {
          localStorage.setItem('adminToken', response.data.token || '');
          localStorage.setItem('isAdmin', 'true');
          this.$router.push('/admin');
          ElMessage.success('管理员登录成功');
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
.admin-login-container {
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 100vh;
  padding: 20px;
  background-color: #f5f7fa;
}

.form-card {
  width: 100%;
  max-width: 400px;
  padding: 30px;
  background-color: #fff;
  border-radius: 8px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  border-top: 4px solid #409EFF;
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