<template>
  <div class="server-status">
    <el-card class="status-card">
      <template #header>
        <div class="card-header">
          <h2>服务器状态监控</h2>
          <el-button type="primary" size="small" @click="refreshStatus">刷新</el-button>
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
        <el-table-column label="操作">
          <template #default="scope">
            <el-button
                size="small"
                :type="scope.row.status === '运行中' ? 'danger' : 'success'"
                @click="toggleService(scope.row)"
            >
              {{ scope.row.status === '运行中' ? '停止' : '启动' }}
            </el-button>
            <el-button size="small" type="warning" @click="restartService(scope.row)">重启</el-button>
          </template>
        </el-table-column>
      </el-table>
    </el-card>
  </div>
</template>

<script>
import { ref } from 'vue';
import { ElMessage } from 'element-plus';

export default {
  name: 'ServerStatus',
  setup() {
    // 示例数据
    const cpuUsage = ref(45);
    const memoryUsage = ref(62);
    const diskUsage = ref(28);

    const serviceStatus = ref([
      { name: 'AI推理服务', status: '运行中', uptime: '3天12小时' },
      { name: '知识库索引服务', status: '运行中', uptime: '3天10小时' },
      { name: '日志服务', status: '运行中', uptime: '3天12小时' },
      { name: '数据库服务', status: '运行中', uptime: '4天5小时' }
    ]);

    const getStatusColor = (percentage) => {
      if (percentage < 50) return '#67c23a';
      if (percentage < 80) return '#e6a23c';
      return '#f56c6c';
    };

    const refreshStatus = () => {
      // 模拟刷新数据
      cpuUsage.value = Math.floor(Math.random() * 100);
      memoryUsage.value = Math.floor(Math.random() * 100);
      diskUsage.value = Math.floor(Math.random() * 100);
      ElMessage.success('状态数据已刷新');
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

    return {
      cpuUsage,
      memoryUsage,
      diskUsage,
      serviceStatus,
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