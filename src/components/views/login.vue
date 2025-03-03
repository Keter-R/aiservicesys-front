<template>
  <div class="login-container">
    <div class="form-card">
      <h1>用户登录</h1>

      <form @submit.prevent="handleLogin">
        <div class="form-group">
          <label for="username">用户名</label>
          <input
              type="text"
              id="username"
              v-model="loginForm.username"
              placeholder="请输入用户名"
              required
          />
        </div>

        <div class="form-group">
          <label for="password">密码</label>
          <input
              type="password"
              id="password"
              v-model="loginForm.password"
              placeholder="请输入密码"
              required
          />
        </div>

        <div class="form-group">
          <button type="submit" class="btn-submit">登录</button>
        </div>

        <div class="form-footer">
          <p>还没有账号？<router-link to="/register">立即注册</router-link></p>
        </div>
      </form>
    </div>
  </div>
</template>

<script>
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
        const response = await axios.post(apiConfig.user.login, this.loginForm);

        if (response.data.code) {
          localStorage.setItem('token', response.data.token || '');
          this.$router.push('/');
          alert('登录成功');
        } else {
          const errorMessage = response.data.message || response.data.error || '登录失败';
          alert(errorMessage);
        }
      } catch (error) {
        console.error('登录失败:', error);
        let errorMessage = '服务器异常，请稍后再试';
        if (error.response && error.response.data) {
          errorMessage = error.response.data.message || error.response.data.error || errorMessage;
        }
        alert(errorMessage);
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

.form-group {
  margin-bottom: 20px;
}

label {
  display: block;
  margin-bottom: 8px;
  font-weight: 600;
}

input {
  width: 100%;
  padding: 12px;
  border: 1px solid #ddd;
  border-radius: 4px;
  font-size: 16px;
  transition: border-color 0.3s;
}

input:focus {
  border-color: #4a90e2;
  outline: none;
}

.btn-submit {
  width: 100%;
  padding: 12px;
  background-color: #4a90e2;
  color: white;
  border: none;
  border-radius: 4px;
  font-size: 16px;
  cursor: pointer;
  transition: background-color 0.3s;
}

.btn-submit:hover {
  background-color: #357abD;
}

.form-footer {
  margin-top: 20px;
  text-align: center;
}

a {
  color: #4a90e2;
  text-decoration: none;
}

a:hover {
  text-decoration: underline;
}
</style>