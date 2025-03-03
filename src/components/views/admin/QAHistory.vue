<template>
  <div class="qa-history">
    <el-card class="history-card">
      <template #header>
        <div class="card-header">
          <h2>问答历史记录</h2>
          <div>
            <el-input
                v-model="searchQuery"
                placeholder="搜索问题内容"
                class="search-input"
                clearable
                @keyup.enter="searchHistory"
            >
              <template #append>
                <el-button @click="searchHistory">
                  <el-icon><Search /></el-icon>
                </el-button>
              </template>
            </el-input>
          </div>
        </div>
      </template>

      <el-table :data="qaHistories" style="width: 100%" v-loading="loading">
        <el-table-column prop="id" label="ID" width="80"></el-table-column>
        <el-table-column prop="username" label="用户" width="120"></el-table-column>
        <el-table-column prop="question" label="问题" show-overflow-tooltip></el-table-column>
        <el-table-column prop="timestamp" label="时间" width="180"></el-table-column>
        <el-table-column label="操作" width="120">
          <template #default="scope">
            <el-button size="small" @click="viewDetail(scope.row)">查看详情</el-button>
          </template>
        </el-table-column>
      </el-table>

      <el-pagination
          class="pagination"
          layout="total, sizes, prev, pager, next"
          :total="totalHistories"
          :page-size="pageSize"
          :page-sizes="[10, 20, 50, 100]"
          :current-page="currentPage"
          @current-change="handlePageChange"
          @size-change="handleSizeChange"
      ></el-pagination>

      <!-- 问答详情对话框 -->
      <el-dialog
          v-model="showDetailDialog"
          title="问答详情"
          width="60%"
      >
        <div v-if="selectedQA">
          <div class="qa-detail-header">
            <div>
              <div><strong>用户：</strong> {{ selectedQA.username }}</div>
              <div><strong>时间：</strong> {{ selectedQA.timestamp }}</div>
            </div>
            <el-tag size="large" :type="selectedQA.model === 'GPT-4' ? 'success' : 'primary'">{{ selectedQA.model }}</el-tag>
          </div>

          <el-divider content-position="left">问题</el-divider>
          <div class="qa-content question">{{ selectedQA.question }}</div>

          <el-divider content-position="left">回答</el-divider>
          <div class="qa-content answer">{{ selectedQA.answer }}</div>

          <el-divider content-position="left">参考知识</el-divider>
          <el-collapse>
            <el-collapse-item
                v-for="(source, index) in selectedQA.sources"
                :key="index"
                :title="`来源 ${index + 1}: ${source.title}`"
            >
              <div class="source-content">{{ source.content }}</div>
              <div class="source-meta">
                <span>相关度: {{ source.relevance }}%</span>
                <span>知识库: {{ source.knowledgeBase }}</span>
              </div>
            </el-collapse-item>
          </el-collapse>
        </div>
      </el-dialog>
    </el-card>
  </div>
</template>

<script>
import { ref, reactive } from 'vue';
import { ElMessage } from 'element-plus';
import { Search } from '@element-plus/icons-vue';

export default {
  name: 'QAHistory',
  components: {
    Search
  },
  setup() {
    const loading = ref(false);
    const searchQuery = ref('');
    const currentPage = ref(1);
    const pageSize = ref(10);
    const totalHistories = ref(256); // 示例总数
    const showDetailDialog = ref(false);
    const selectedQA = ref(null);

    // 示例数据
    const qaHistories = ref([
      { id: 1, username: 'user1', question: '如何重置我的账户密码？', timestamp: '2023-10-10 10:30:15', model: 'GPT-3.5' },
      { id: 2, username: 'user2', question: '你们的产品支持哪些语言？', timestamp: '2023-10-10 11:25:33', model: 'GPT-4' },
      { id: 3, username: 'user3', question: '如何导出我的历史聊天记录？', timestamp: '2023-10-10 14:12:45', model: 'GPT-3.5' },
      { id: 4, username: 'user4', question: '你们的API有使用限制吗？', timestamp: '2023-10-11 09:05:28', model: 'GPT-4' },
      { id: 5, username: 'user5', question: '如何升级到高级账户？', timestamp: '2023-10-11 16:47:19', model: 'GPT-3.5' }
    ]);

    // 模拟的详细问答数据
    const qaDetails = {
      1: {
        username: 'user1',
        question: '如何重置我的账户密码？',
        answer: '要重置您的账户密码，请按照以下步骤操作：\n1. 在登录页面点击"忘记密码"链接\n2. 输入您的注册邮箱\n3. 点击"发送重置链接"\n4. 检查您的邮箱，并点击邮件中的重置链接\n5. 在新页面中设置新密码\n\n如果您没有收到重置邮件，请检查垃圾邮件文件夹或联系客服支持。',
        timestamp: '2023-10-10 10:30:15',
        model: 'GPT-3.5',
        sources: [
          { title: '账户管理指南', content: '密码重置流程：用户可以通过登录页面的"忘记密码"选项进行密码重置。系统将向注册邮箱发送重置链接。', relevance: 95, knowledgeBase: '用户手册' },
          { title: '常见问题解答', content: '问：我没有收到密码重置邮件怎么办？\n答：请检查您的垃圾邮件文件夹，或者联系客服支持。', relevance: 80, knowledgeBase: '客服知识库' }
        ]
      }
    };

    const searchHistory = () => {
      loading.value = true;
      setTimeout(() => {
        loading.value = false;
        if (searchQuery.value) {
          ElMessage.success(`搜索关键词: ${searchQuery.value}`);
        }
      }, 500);
    };

    const handlePageChange = (page) => {
      currentPage.value = page;
      ElMessage.info(`加载第${page}页数据`);
    };

    const handleSizeChange = (size) => {
      pageSize.value = size;
      currentPage.value = 1;
      ElMessage.info(`每页显示${size}条记录`);
    };

    const viewDetail = (qa) => {
      selectedQA.value = qaDetails[qa.id] || {
        ...qa,
        answer: '这是一个示例回答。在实际应用中，这里应该显示AI的实际回答内容。',
        sources: [
          { title: '示例来源', content: '这是一个示例参考内容。', relevance: 85, knowledgeBase: '示例知识库' }
        ]
      };
      showDetailDialog.value = true;
    };

    return {
      loading,
      searchQuery,
      qaHistories,
      totalHistories,
      currentPage,
      pageSize,
      showDetailDialog,
      selectedQA,
      searchHistory,
      handlePageChange,
      handleSizeChange,
      viewDetail
    };
  }
}
</script>

<style scoped>
.qa-history {
  padding: 20px;
}

.history-card {
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

.search-input {
  width: 300px;
}

.pagination {
  margin-top: 20px;
  text-align: right;
}

.qa-detail-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
}

.qa-content {
  padding: 15px;
  margin-bottom: 20px;
  border-radius: 8px;
  white-space: pre-wrap;
}

.question {
  background-color: #f5f7fa;
}

.answer {
  background-color: #ecf5ff;
}

.source-content {
  padding: 10px;
  background-color: #f8f8f8;
  border-radius: 4px;
  margin-bottom: 10px;
}

.source-meta {
  display: flex;
  justify-content: space-between;
  color: #909399;
  font-size: 12px;
}
</style>