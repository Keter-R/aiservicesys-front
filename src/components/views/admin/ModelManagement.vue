<template>
  <div class="model-management">
    <el-card class="model-card">
      <template #header>
        <div class="card-header">
          <h2>AI模型管理</h2>
          <el-button type="primary" @click="showAddModelDialog = true">添加模型</el-button>
        </div>
      </template>

      <el-table :data="models" style="width: 100%" v-loading="loading">
        <el-table-column prop="id" label="ID" width="70"></el-table-column>
        <el-table-column prop="name" label="模型名称"></el-table-column>
        <el-table-column prop="provider" label="提供商" width="120"></el-table-column>
        <el-table-column prop="version" label="版本" width="100"></el-table-column>
        <el-table-column prop="status" label="状态" width="100">
          <template #default="scope">
            <el-tag :type="getStatusType(scope.row.status)">
              {{ getStatusText(scope.row.status) }}
            </el-tag>
          </template>
        </el-table-column>
        <el-table-column prop="usage" label="使用次数" width="100"></el-table-column>
        <el-table-column prop="addedAt" label="添加时间" width="180"></el-table-column>
        <el-table-column label="操作" width="280">
          <template #default="scope">
            <el-button size="small" type="primary" @click="configureModel(scope.row)">配置参数</el-button>
            <el-button
                size="small"
                :type="scope.row.status === 'active' ? 'warning' : 'success'"
                @click="toggleModelStatus(scope.row)"
            >
              {{ scope.row.status === 'active' ? '禁用' : '启用' }}
            </el-button>
            <el-button size="small" type="danger" @click="confirmDeleteModel(scope.row)">删除</el-button>
          </template>
        </el-table-column>
      </el-table>

      <!-- 添加/编辑模型对话框 -->
      <el-dialog
          v-model="showAddModelDialog"
          :title="isEditing ? '编辑模型' : '添加模型'"
          width="500px"
      >
        <el-form :model="modelForm" label-width="100px">
          <el-form-item label="模型名称">
            <el-input v-model="modelForm.name" placeholder="请输入模型名称"></el-input>
          </el-form-item>
          <el-form-item label="提供商">
            <el-select v-model="modelForm.provider" placeholder="请选择提供商">
              <el-option label="OpenAI" value="OpenAI"></el-option>
              <el-option label="Anthropic" value="Anthropic"></el-option>
              <el-option label="Google" value="Google"></el-option>
              <el-option label="本地模型" value="Local"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="版本">
            <el-input v-model="modelForm.version" placeholder="请输入版本号"></el-input>
          </el-form-item>
          <el-form-item label="API KEY">
            <el-input v-model="modelForm.apiKey" placeholder="请输入API KEY" show-password></el-input>
          </el-form-item>
          <el-form-item label="状态">
            <el-select v-model="modelForm.status" placeholder="请选择状态">
              <el-option label="已启用" value="active"></el-option>
              <el-option label="已禁用" value="disabled"></el-option>
            </el-select>
          </el-form-item>
        </el-form>
        <template #footer>
          <span class="dialog-footer">
            <el-button @click="showAddModelDialog = false">取消</el-button>
            <el-button type="primary" @click="saveModel">确定</el-button>
          </span>
        </template>
      </el-dialog>

      <!-- 模型参数配置对话框 -->
      <el-dialog
          v-model="showConfigDialog"
          title="模型参数配置"
          width="600px"
      >
        <div v-if="selectedModel">
          <h3>{{ selectedModel.name }} - 参数设置</h3>

          <el-form :model="modelConfigForm" label-width="180px">
            <el-form-item label="温度 (Temperature)">
              <el-slider
                  v-model="modelConfigForm.temperature"
                  :min="0"
                  :max="2"
                  :step="0.1"
                  show-input
              ></el-slider>
              <div class="param-desc">控制响应的随机性，较高的值会使输出更加随机</div>
            </el-form-item>

            <el-form-item label="最大响应长度">
              <el-input-number
                  v-model="modelConfigForm.maxTokens"
                  :min="1"
                  :max="8192"
                  controls-position="right"
              ></el-input-number>
              <div class="param-desc">生成回复的最大令牌数量</div>
            </el-form-item>

            <el-form-item label="系统提示词">
              <el-input
                  v-model="modelConfigForm.systemPrompt"
                  type="textarea"
                  :rows="4"
                  placeholder="设置模型的角色和行为约束"
              ></el-input>
            </el-form-item>
          </el-form>
        </div>
        <template #footer>
          <span class="dialog-footer">
            <el-button @click="showConfigDialog = false">取消</el-button>
            <el-button type="primary" @click="saveModelConfig">保存配置</el-button>
          </span>
        </template>
      </el-dialog>
    </el-card>
  </div>
</template>

<script>
import { ref, reactive } from 'vue';
import { ElMessage, ElMessageBox } from 'element-plus';

export default {
  name: 'ModelManagement',
  setup() {
    const loading = ref(false);
    const showAddModelDialog = ref(false);
    const showConfigDialog = ref(false);
    const isEditing = ref(false);
    const selectedModel = ref(null);

    // 示例数据
    const models = ref([
      { id: 1, name: 'GPT-4', provider: 'OpenAI', version: '0428', status: 'active', usage: 1250, addedAt: '2023-05-10 14:30:00' },
      { id: 2, name: 'GPT-3.5 Turbo', provider: 'OpenAI', version: '0613', status: 'active', usage: 5680, addedAt: '2023-03-15 09:45:00' },
      { id: 3, name: 'Claude 2', provider: 'Anthropic', version: '2.0', status: 'active', usage: 850, addedAt: '2023-08-22 16:20:00' },
      { id: 4, name: 'PaLM 2', provider: 'Google', version: '1.0', status: 'disabled', usage: 320, addedAt: '2023-07-05 11:10:00' },
      { id: 5, name: 'Llama 2', provider: 'Local', version: '70B', status: 'active', usage: 780, addedAt: '2023-09-12 15:40:00' }
    ]);

    const modelForm = reactive({
      id: null,
      name: '',
      provider: '',
      version: '',
      apiKey: '',
      status: 'active'
    });

    const modelConfigForm = reactive({
      temperature: 0.7,
      maxTokens: 2048,
      systemPrompt: '您是一个乐于助人、知识渊博、诚实的AI助手。'
    });

    const getStatusType = (status) => {
      switch (status) {
        case 'active': return 'success';
        case 'disabled': return 'info';
        case 'error': return 'danger';
        default: return 'warning';
      }
    };

    const getStatusText = (status) => {
      switch (status) {
        case 'active': return '已启用';
        case 'disabled': return '已禁用';
        case 'error': return '错误';
        default: return '未知';
      }
    };

    const configureModel = (model) => {
      selectedModel.value = model;
      showConfigDialog.value = true;
    };

    const saveModelConfig = () => {
      ElMessage.success(`${selectedModel.value.name} 配置已保存`);
      showConfigDialog.value = false;
    };

    const toggleModelStatus = (model) => {
      model.status = model.status === 'active' ? 'disabled' : 'active';
      ElMessage.success(`模型已${model.status === 'active' ? '启用' : '禁用'}`);
    };

    const saveModel = () => {
      if (!modelForm.name || !modelForm.provider || !modelForm.version) {
        ElMessage.warning('模型名称、提供商和版本不能为空');
        return;
      }

      // 模拟保存操作
      if (isEditing.value) {
        ElMessage.success('模型更新成功');
      } else {
        ElMessage.success('模型添加成功');
      }

      // 重置表单和状态
      modelForm.id = null;
      modelForm.name = '';
      modelForm.provider = '';
      modelForm.version = '';
      modelForm.apiKey = '';
      modelForm.status = 'active';
      isEditing.value = false;
      showAddModelDialog.value = false;
    };

    const confirmDeleteModel = (model) => {
      ElMessageBox.confirm(
          `确定要删除模型"${model.name}"吗？此操作不可恢复。`,
          '删除确认',
          {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            type: 'warning'
          }
      ).then(() => {
        ElMessage.success('模型已删除');
      }).catch(() => {
        // 用户取消删除
      });
    };

    return {
      loading,
      models,
      showAddModelDialog,
      showConfigDialog,
      isEditing,
      selectedModel,
      modelForm,
      modelConfigForm,
      getStatusType,
      getStatusText,
      configureModel,
      saveModelConfig,
      toggleModelStatus,
      saveModel,
      confirmDeleteModel
    };
  }
}
</script>

<style scoped>
.model-management {
  padding: 20px;
}

.model-card {
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

.param-desc {
  color: #909399;
  font-size: 12px;
  margin-top: 5px;
}
</style>