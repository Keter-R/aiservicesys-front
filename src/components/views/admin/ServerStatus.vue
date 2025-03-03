<template>
  <div class="server-status">
    <el-card class="status-card">
      <template #header>
        <div class="card-header">
          <h2>服务器状态监控</h2>
          <div class="refresh-section">
            <span class="update-time" v-if="lastUpdateTime">更新于：{{ lastUpdateTime }}</span>
            <el-button type="primary" size="small" @click="refreshStatus">刷新</el-button>
          </div>
        </div>
      </template>

      <el-row :gutter="20">
        <el-col :span="8">
          <el-card shadow="hover">
            <template #header>CPU 使用率</template>
            <div class="status-item">
              <el-progress type="dashboard" :percentage="cpuUsage" :color="getStatusColor(cpuUsage)"></el-progress>
              <div class="status-detail">{{ cpuUsage }}%</div>
            </div>
          </el-card>
        </el-col>

        <el-col :span="8">
          <el-card shadow="hover">
            <template #header>内存使用率</template>
            <div class="status-item">
              <el-progress type="dashboard" :percentage="memoryUsage" :color="getStatusColor(memoryUsage)"></el-progress>
              <div class="status-detail">{{ memoryUsage }}%</div>
            </div>
          </el-card>
        </el-col>

        <el-col :span="8">
          <el-card shadow="hover">
            <template #header>磁盘使用率</template>
            <div class="status-item">
              <el-progress type="dashboard" :percentage="diskUsage" :color="getStatusColor(diskUsage)"></el-progress>
              <div class="status-detail">{{ diskUsage }}%</div>
            </div>
          </el-card>
        </el-col>
      </el-row>

      <el-divider></el-divider>

      <h3>运行状态</h3>
      <el-table :data="serviceStatus" style="width: 100%">
        <el-table-column prop="name" label="服务名称"></el-table-column>
        <el-table-column prop="status" label="状态">
          <template #default="scope">
            <el-tag :type="scope.row.status === '运行中' ? 'success' : 'danger'">
              {{ scope.row.status }}
            </el-tag>
          </template>
        </el-table-column>
        <el-table-column prop="uptime" label="运行时间"></el-table-column>
<!--        <el-table-column label="操作">-->
<!--          <template #default="scope">-->
<!--            <el-button-->
<!--                size="small"-->
<!--                :type="scope.row.status === '运行中' ? 'danger' : 'success'"-->
<!--                @click="toggleService(scope.row)"-->
<!--            >-->
<!--              {{ scope.row.status === '运行中' ? '停止' : '启动' }}-->
<!--            </el-button>-->
<!--            <el-button size="small" type="warning" @click="restartService(scope.row)">重启</el-button>-->
<!--          </template>-->
<!--        </el-table-column>-->
      </el-table>
    </el-card>
  </div>
</template>

<script>
import { ref, onMounted, onUnmounted } from 'vue';
import { ElMessage } from 'element-plus';
import apiConfig from '../../api/config';

export default {
  name: 'ServerStatus',
  setup() {
    // 状态数据
    const cpuUsage = ref(45);
    const memoryUsage = ref(62);
    const diskUsage = ref(28);
    const lastUpdateTime = ref('');
    const refreshTimer = ref(null);

    const serviceStatus = ref([
      { name: 'AI推理服务', status: '运行中', uptime: '3天12小时' },
      { name: '知识库索引服务', status: '运行中', uptime: '3天10小时' },
      { name: '日志服务', status: '运行中', uptime: '3天12小时' },
      { name: '数据库服务', status: '运行中', uptime: '4天5小时' }
    ]);


    // 服务器状态API路径
    const SERVER_STATUS_API = apiConfig.admin.serverStatus

    const getStatusColor = (percentage) => {
      if (percentage < 50) return '#67c23a';
      if (percentage < 80) return '#e6a23c';
      return '#f56c6c';
    };

    // 生成模拟响应数据
    const generateMockResponse = () => {
      return {
        cpuUsage: Math.floor(Math.random() * 100),
        memoryUsage: Math.floor(Math.random() * 100),
        diskUsage: Math.floor(Math.random() * 100),
        services: [
          { name: 'AI推理服务', status: Math.random() > 0.2 ? '运行中' : '已停止', uptime: `${Math.floor(Math.random() * 10)}天${Math.floor(Math.random() * 24)}小时` },
          { name: '知识库索引服务', status: Math.random() > 0.2 ? '运行中' : '已停止', uptime: `${Math.floor(Math.random() * 10)}天${Math.floor(Math.random() * 24)}小时` },
          { name: '日志服务', status: Math.random() > 0.2 ? '运行中' : '已停止', uptime: `${Math.floor(Math.random() * 10)}天${Math.floor(Math.random() * 24)}小时` },
          { name: '数据库服务', status: Math.random() > 0.2 ? '运行中' : '已停止', uptime: `${Math.floor(Math.random() * 10)}天${Math.floor(Math.random() * 24)}小时` }
        ]
      };
    };

    // 格式化日期时间
    const formatDateTime = (date) => {
      const pad = (n) => n < 10 ? `0${n}` : n;

      const year = date.getFullYear();
      const month = pad(date.getMonth() + 1);
      const day = pad(date.getDate());
      const hours = pad(date.getHours());
      const minutes = pad(date.getMinutes());
      const seconds = pad(date.getSeconds());

      return `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`;
    };

    // 刷新服务器状态
    const refreshStatus = async () => {
      try {
        // 在实际环境下取消这些注释，使用实际API
        // const response = await fetch(SERVER_STATUS_API);
        // const data = await response.json();

        // 单机测试使用模拟数据
        const data = generateMockResponse();

        // 更新状态数据
        cpuUsage.value = data.cpuUsage;
        memoryUsage.value = data.memoryUsage;
        diskUsage.value = data.diskUsage;

        if (data.services && data.services.length > 0) {
          serviceStatus.value = data.services;
        }

        // 更新刷新时间
        lastUpdateTime.value = formatDateTime(new Date());

        ElMessage.success('状态数据已刷新');
      } catch (error) {
        console.error('Failed to fetch server status:', error);
        ElMessage.error('获取服务器状态失败');
      }
    };

    const toggleService = (service) => {
      service.status = service.status === '运行中' ? '已停止' : '运行中';
      if (service.status === '运行中') {
        service.uptime = '刚刚启动';
        ElMessage.success(`${service.name}已启动`);
      } else {
        ElMessage.warning(`${service.name}已停止`);
      }
    };

    const restartService = (service) => {
      service.status = '运行中';
      service.uptime = '刚刚重启';
      ElMessage.success(`${service.name}已重启`);
    };

    // 设置自动刷新
    const startAutoRefresh = () => {
      // 清除现有定时器
      if (refreshTimer.value) {
        clearInterval(refreshTimer.value);
      }

      // 设置10秒刷新一次
      refreshTimer.value = setInterval(() => {
        refreshStatus();
      }, 5000);
    };

    // 组件挂载时初始化
    onMounted(() => {
      refreshStatus(); // 立即获取一次数据
      startAutoRefresh(); // 启动自动刷新
    });

    // 组件卸载时清理
    onUnmounted(() => {
      if (refreshTimer.value) {
        clearInterval(refreshTimer.value);
      }
    });

    return {
      cpuUsage,
      memoryUsage,
      diskUsage,
      serviceStatus,
      lastUpdateTime,
      getStatusColor,
      refreshStatus,
      toggleService,
      restartService
    };
  }
}
</script>

<style scoped>
.server-status {
  padding: 20px;
}

.status-card {
  margin-bottom: 20px;
}

.card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.card-header h2 {
  margin: 0;
}

.refresh-section {
  display: flex;
  align-items: center;
}

.update-time {
  margin-right: 10px;
  font-size: 14px;
  color: #606266;
}

.status-item {
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 10px 0;
}

.status-detail {
  margin-top: 10px;
  font-size: 18px;
  font-weight: bold;
}
</style>