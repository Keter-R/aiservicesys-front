<template>
  <div class="knowledge-base">
    <el-card class="kb-card">
      <template #header>
        <div class="card-header">
          <h2>知识库管理</h2>
          <el-button type="primary" @click="showAddDialog = true">添加知识库</el-button>
        </div>
      </template>

      <el-table :data="knowledgeBases" style="width: 100%" v-loading="loading">
        <el-table-column prop="id" label="ID" width="80"></el-table-column>
        <el-table-column prop="name" label="知识库名称"></el-table-column>
        <el-table-column prop="description" label="描述"></el-table-column>
        <el-table-column prop="documentCount" label="文档数量" width="120"></el-table-column>
        <el-table-column prop="createdAt" label="创建时间" width="180"></el-table-column>
        <el-table-column label="操作" width="250">
          <template #default="scope">
            <el-button size="small" @click="viewKnowledgeBase(scope.row)">查看</el-button>
            <el-button size="small" type="primary" @click="editKnowledgeBase(scope.row)">编辑</el-button>
            <el-button size="small" type="danger" @click="confirmDelete(scope.row)">删除</el-button>
          </template>
        </el-table-column>
      </el-table>

      <el-pagination
          class="pagination"
          layout="prev, pager, next"
          :total="totalKnowledgeBases"
          :page-size="pageSize"
          :current-page="currentPage"
          @current-change="handlePageChange"
      ></el-pagination>

      <!-- 添加/编辑知识库对话框 -->
      <el-dialog
          v-model="showAddDialog"
          :title="isEditing ? '编辑知识库' : '添加知识库'"
          width="500px"
      >
        <el-form :model="knowledgeBaseForm" label-width="100px">
          <el-form-item label="名称">
            <el-input v-model="knowledgeBaseForm.name" placeholder="请输入知识库名称"></el-input>
          </el-form-item>
          <el-form-item label="描述">
            <el-input
                v-model="knowledgeBaseForm.description"
                type="textarea"
                placeholder="请输入知识库描述"
            ></el-input>
          </el-form-item>
        </el-form>
        <template #footer>
          <span class="dialog-footer">
            <el-button @click="showAddDialog = false">取消</el-button>
            <el-button type="primary" @click="saveKnowledgeBase">确定</el-button>
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
  name: 'KnowledgeBase',
  setup() {
    const loading = ref(false);
    const showAddDialog = ref(false);
    const isEditing = ref(false);
    const currentPage = ref(1);
    const pageSize = ref(10);
    const totalKnowledgeBases = ref(23); // 示例总数

    // 示例数据
    const knowledgeBases = ref([
      { id: 1, name: '产品知识库', description: '包含所有产品的说明和FAQ', documentCount: 125, createdAt: '2023-05-10 14:30:00' },
      { id: 2, name: '技术文档', description: '技术文档和API说明', documentCount: 87, createdAt: '2023-06-15 09:45:00' },
      { id: 3, name: '客服话术', description: '客服常用话术和回复模板', documentCount: 56, createdAt: '2023-07-20 16:20:00' },
      { id: 4, name: '行业知识', description: '行业相关的知识和资讯', documentCount: 93, createdAt: '2023-08-05 11:10:00' },
      { id: 5, name: '用户手册', description: '用户使用指南和手册', documentCount: 42, createdAt: '2023-09-12 15:40:00' }
    ]);

    const knowledgeBaseForm = reactive({
      id: null,
      name: '',
      description: ''
    });

    const handlePageChange = (page) => {
      currentPage.value = page;
      ElMessage.info(`加载第${page}页数据`);
    };

    const viewKnowledgeBase = (kb) => {
      ElMessage.info(`查看知识库: ${kb.name}`);
    };

    const editKnowledgeBase = (kb) => {
      isEditing.value = true;
      knowledgeBaseForm.id = kb.id;
      knowledgeBaseForm.name = kb.name;
      knowledgeBaseForm.description = kb.description;
      showAddDialog.value = true;
    };

    const saveKnowledgeBase = () => {
      if (!knowledgeBaseForm.name) {
        ElMessage.warning('知识库名称不能为空');
        return;
      }

      // 模拟保存操作
      if (isEditing.value) {
        // 更新现有知识库
        const index = knowledgeBases.value.findIndex(kb => kb.id === knowledgeBaseForm.id);
        if (index !== -1) {
          knowledgeBases.value[index].name = knowledgeBaseForm.name;
          knowledgeBases.value[index].description = knowledgeBaseForm.description;
          ElMessage.success('知识库更新成功');
        }
      } else {
        // 添加新知识库
        const newId = knowledgeBases.value.length > 0 ? Math.max(...knowledgeBases.value.map(kb => kb.id)) + 1 : 1;
        knowledgeBases.value.unshift({
          id: newId,
          name: knowledgeBaseForm.name,
          description: knowledgeBaseForm.description,
          documentCount: 0,
          createdAt: new Date().toLocaleString()
        });
        totalKnowledgeBases.value++;
        ElMessage.success('知识库添加成功');
      }

      // 重置表单和状态
      knowledgeBaseForm.id = null;
      knowledgeBaseForm.name = '';
      knowledgeBaseForm.description = '';
      isEditing.value = false;
      showAddDialog.value = false;
    };

    const confirmDelete = (kb) => {
      ElMessageBox.confirm(
          `确定要删除知识库"${kb.name}"吗？此操作不可恢复。`,
          '删除确认',
          {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            type: 'warning'
          }
      ).then(() => {
        // 模拟删除操作
        const index = knowledgeBases.value.findIndex(item => item.id === kb.id);
        if (index !== -1) {
          knowledgeBases.value.splice(index, 1);
          totalKnowledgeBases.value--;
          ElMessage.success('知识库已删除');
        }
      }).catch(() => {
        // 用户取消删除
      });
    };

    return {
      loading,
      knowledgeBases,
      totalKnowledgeBases,
      currentPage,
      pageSize,
      handlePageChange,
      showAddDialog,
      isEditing,
      knowledgeBaseForm,
      viewKnowledgeBase,
      editKnowledgeBase,
      saveKnowledgeBase,
      confirmDelete
    };
  }
}
</script>

<style scoped>
.knowledge-base {
  padding: 20px;
}

.kb-card {
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

.pagination {
  margin-top: 20px;
  text-align: right;
}
</style>