<template>
  <el-container class="admin-layout">
    <!-- 顶部导航 -->
    <el-header>
      <div class="header-logo">AI 管理系统</div>
      <div class="header-right">
        <span>欢迎，管理员</span>
        <el-button type="danger" size="small" @click="logout">退出登录</el-button>
      </div>
    </el-header>

    <el-container>
      <!-- 侧边导航栏 -->
      <el-aside width="200px">
        <el-menu
            :router="true"
            :default-active="activeMenu"
            class="el-menu-vertical"
            background-color="#304156"
            text-color="#bfcbd9"
            active-text-color="#409EFF"
        >
          <el-menu-item index="/admin/server-status">
            <el-icon><Monitor /></el-icon>
            <span>服务器状态</span>
          </el-menu-item>
          <el-menu-item index="/admin/knowledge-base">
            <el-icon><Notebook /></el-icon>
            <span>知识库管理</span>
          </el-menu-item>
          <el-menu-item index="/admin/qa-history">
            <el-icon><ChatLineRound /></el-icon>
            <span>问答历史</span>
          </el-menu-item>
          <el-menu-item index="/admin/user-management">
            <el-icon><User /></el-icon>
            <span>用户管理</span>
          </el-menu-item>
          <el-menu-item index="/admin/model-management">
            <el-icon><Setting /></el-icon>
            <span>模型管理</span>
          </el-menu-item>
        </el-menu>
      </el-aside>

      <!-- 主内容区 -->
      <el-main>
        <router-view />
      </el-main>
    </el-container>
  </el-container>
</template>

<script>
import { ref, computed } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { ElMessage } from 'element-plus';
import { Monitor, Notebook, ChatLineRound, User, Setting } from '@element-plus/icons-vue';

export default {
  name: 'AdminDashboard',
  components: {
    Monitor,
    Notebook,
    ChatLineRound,
    User,
    Setting
  },
  setup() {
    const route = useRoute();
    const router = useRouter();

    const activeMenu = computed(() => route.path);

    const logout = () => {
      localStorage.removeItem('adminToken');
      localStorage.removeItem('isAdmin');
      router.push('/admin/login');
      ElMessage.success('已成功退出登录');
    };

    return {
      activeMenu,
      logout
    };
  }
}
</script>

<style scoped>
.admin-layout {
  height: 100vh;
}

.el-header {
  background-color: #409EFF;
  color: white;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0 20px;
}

.header-logo {
  font-size: 18px;
  font-weight: bold;
}

.header-right {
  display: flex;
  align-items: center;
  gap: 15px;
}

.el-aside {
  background-color: #304156;
}

.el-menu {
  border-right: none;
  height: 100%;
}

.el-main {
  background-color: #f0f2f5;
  padding: 20px;
}
</style>