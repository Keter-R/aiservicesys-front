<template>
  <div class="register-container">
    <div class="form-card">
      <h1>用户注册</h1>

      <form @submit.prevent="handleRegister">
        <div class="form-group">
          <label for="username">用户名</label>
          <input
              type="text"
              id="username"
              v-model="registerForm.username"
              placeholder="请输入用户名"
              required
          />
        </div>

        <div class="form-group">
          <label for="password">密码</label>
          <input
              type="password"
              id="password"
              v-model="registerForm.password"
              placeholder="请输入密码"
              required
          />
        </div>

        <div class="form-group">
          <label for="confirmPassword">确认密码</label>
          <input
              type="password"
              id="confirmPassword"
              v-model="registerForm.confirmPassword"
              placeholder="请再次输入密码"
              required
          />
          <p class="error-message" v-if="passwordError">{{ passwordError }}</p>
        </div>

        <div class="form-group">
          <button type="submit" class="btn-submit" :disabled="!!passwordError">注册</button>
        </div>

        <div class="form-footer">
          <p>已有账号？<router-link to="/login">立即登录</router-link></p>
        </div>
      </form>
    </div>
  </div>
</template>

<script>
import apiConfig from '@/components/api/config.js';
import axios from "axios";

export default {
  name: 'Register',
  data() {
    return {
      registerForm: {
        username: '',
        password: '',
        confirmPassword: ''
      }
    };
  },
  computed: {
    passwordError() {
      if (this.registerForm.confirmPassword &&
          this.registerForm.password !== this.registerForm.confirmPassword) {
        return '两次输入的密码不一致';
      }
      return '';
    }
  },
  methods: {
    async handleRegister() {
      try {
        const response = await axios.post(apiConfig.user.register, this.registerForm);
        console.log(response.data);
        console.log(response)
        if (response.data.code) {
          alert(response.data.message);
          this.$router.push({path: '/login'});
        } else {
          alert(response.data.message || '注册失败');
        }
      } catch (error) {
        alert('服务器异常，请稍后再试');
      }
    }
  }
};
</script>

<style scoped>
.register-container {
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

.error-message {
  color: #e74c3c;
  font-size: 14px;
  margin-top: 6px;
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

.btn-submit:disabled {
  background-color: #b8b8b8;
  cursor: not-allowed;
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