<template>
  <div class="register-container">
    <div class="form-card">
      <h1>用户注册</h1>

      <el-form
          :model="registerForm"
          :rules="rules"
          ref="registerFormRef"
          label-position="top"
      >
        <el-form-item label="用户名" prop="username">
          <el-input
              v-model="registerForm.username"
              placeholder="请输入用户名（仅包含字母和数字）"
          ></el-input>
        </el-form-item>

        <el-form-item label="密码" prop="password">
          <el-input
              type="password"
              v-model="registerForm.password"
              placeholder="请输入密码（不少于8位，包含字母、数字和特殊符号）"
              show-password
          ></el-input>
        </el-form-item>

        <el-form-item label="确认密码" prop="confirmPassword">
          <el-input
              type="password"
              v-model="registerForm.confirmPassword"
              placeholder="请再次输入密码"
              show-password
          ></el-input>
        </el-form-item>

        <el-form-item>
          <el-button type="primary" class="btn-submit" @click="submitForm">注册</el-button>
        </el-form-item>

        <div class="form-footer">
          <p>已有账号？<router-link to="/login">立即登录</router-link></p>
        </div>
      </el-form>
    </div>
  </div>
</template>

<script>
import { ElMessage } from 'element-plus';
import apiConfig from '@/components/api/config.js';
import axios from "axios";

export default {
  name: 'Register',
  data() {
    // 自定义验证规则
    const validateConfirmPassword = (rule, value, callback) => {
      if (!value) {
        return callback(new Error('请再次输入密码'));
      }
      if (value !== this.registerForm.password) {
        return callback(new Error('两次输入的密码不一致'));
      }
      callback();
    };

    return {
      registerForm: {
        username: '',
        password: '',
        confirmPassword: ''
      },
      rules: {
        username: [
          { required: true, message: '用户名不能为空', trigger: 'blur' },
          { pattern: /^[a-zA-Z0-9]+$/, message: '用户名只能包含字母和数字', trigger: 'blur' }
        ],
        password: [
          { required: true, message: '密码不能为空', trigger: 'blur' },
          { min: 8, message: '密码长度不能少于8位', trigger: 'blur' },
          {
            pattern: /^[a-zA-Z0-9!@#$%^&*()_+\-=[\]{};':"\\|,.<>/?]+$/,
            message: '密码只能包含字母、数字和部分特殊符号',
            trigger: 'blur'
          }
        ],
        confirmPassword: [
          { required: true, message: '请再次输入密码', trigger: 'blur' },
          { validator: validateConfirmPassword, trigger: 'blur' }
        ]
      }
    };
  },
  methods: {
    submitForm() {
      this.$refs.registerFormRef.validate(async (valid) => {
        if (valid) {
          try {
            const response = await axios.post(apiConfig.user.register, {
              username: this.registerForm.username,
              password: this.registerForm.password
            });

            if (response.data.code) {
              ElMessage.success(response.data.message || '注册成功');
              this.$router.push('/login');
            } else {
              ElMessage.error(response.data.message || '注册失败');
            }
          } catch (error) {
            ElMessage.error('服务器异常，请稍后再试');
          }
        } else {
          ElMessage.error('请正确填写所有必填项');
          return false;
        }
      });
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