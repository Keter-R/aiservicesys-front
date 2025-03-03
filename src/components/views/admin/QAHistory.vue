<template>
  <div class="qa-history">
    <el-card class="history-card">
      <template #header>
        <div class="card-header">
          <h2>问答历史记录</h2>
        </div>
      </template>

      <!-- 搜索区域 -->
      <div class="search-area">
        <el-form :inline="true" :model="searchForm" class="search-form">
          <el-form-item label="用户名称">
            <el-input v-model="searchForm.username" placeholder="请输入用户名称" clearable></el-input>
          </el-form-item>
          <el-form-item label="会话ID">
            <el-input v-model="searchForm.sessionId" placeholder="请输入会话ID" clearable></el-input>
          </el-form-item>
          <el-form-item label="开始时间">
            <el-date-picker
                v-model="searchForm.startTime"
                type="datetime"
                placeholder="选择开始时间"
                format="YYYY-MM-DD HH:mm"
                value-format="YYYY-MM-DD HH:mm:ss"
                clearable
            ></el-date-picker>
          </el-form-item>
          <el-form-item label="截止时间">
            <el-date-picker
                v-model="searchForm.endTime"
                type="datetime"
                placeholder="选择截止时间"
                format="YYYY-MM-DD HH:mm"
                value-format="YYYY-MM-DD HH:mm:ss"
                clearable
            ></el-date-picker>
          </el-form-item>
          <el-form-item>
            <el-button type="primary" @click="searchHistory">
              <el-icon><Search /></el-icon> 搜索
            </el-button>
            <el-button @click="resetSearch">重置</el-button>
          </el-form-item>
        </el-form>
      </div>

      <!-- 数据表格 -->
      <el-table
          :data="paginatedData"
          style="width: 100%"
          v-loading="loading"
          :default-sort="{ prop: 'timestamp', order: 'descending' }"
          row-key="id"
      >
        <el-table-column prop="sessionId" label="会话ID" width="120" sortable></el-table-column>
        <el-table-column prop="username" label="用户名称" width="120" sortable></el-table-column>
        <el-table-column prop="userType" label="用户类型" width="120" sortable>
          <template #default="scope">
            <el-tag :type="getUserTypeTag(scope.row.userType)">{{ scope.row.userType }}</el-tag>
          </template>
        </el-table-column>
        <el-table-column prop="timestamp" label="时间" width="180" sortable></el-table-column>
        <el-table-column prop="content" label="记录内容" show-overflow-tooltip min-width="300"></el-table-column>
      </el-table>

      <!-- 分页控件 -->
      <el-pagination
          class="pagination"
          layout="total, sizes, prev, pager, next, jumper"
          :total="filteredData.length"
          :page-size="pageSize"
          :page-sizes="[10, 25, 50, 100]"
          :current-page="currentPage"
          @current-change="handlePageChange"
          @size-change="handleSizeChange"
      ></el-pagination>
    </el-card>
  </div>
</template>

<script>
import { ref, reactive, computed, onMounted } from 'vue';
import { ElMessage } from 'element-plus';
import { Search } from '@element-plus/icons-vue';
import apiConfig from '../../api/config';
import axios from 'axios';

export default {
  name: 'QAHistory',
  components: {
    Search
  },
  setup() {
    // 加载状态
    const loading = ref(false);

    // 搜索表单
    const searchForm = reactive({
      username: '',
      sessionId: '',
      startTime: '',
      endTime: ''
    });

    // 分页配置
    const currentPage = ref(1);
    const pageSize = ref(10);

    // 数据相关
    const allHistories = ref([]);

    // 根据搜索条件筛选数据
    const filteredData = computed(() => {
      return allHistories.value.filter(item => {
        // 用户名称筛选
        if (searchForm.username && !item.username.toLowerCase().includes(searchForm.username.toLowerCase())) {
          return false;
        }

        // 会话ID筛选
        if (searchForm.sessionId && !item.sessionId.toString().includes(searchForm.sessionId)) {
          return false;
        }

        // 开始时间筛选
        if (searchForm.startTime && new Date(item.timestamp) < new Date(searchForm.startTime)) {
          return false;
        }

        // 截止时间筛选
        if (searchForm.endTime && new Date(item.timestamp) > new Date(searchForm.endTime)) {
          return false;
        }

        return true;
      }).sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp)); // 按时间降序排序
    });

    // 当前页的数据
    const paginatedData = computed(() => {
      const start = (currentPage.value - 1) * pageSize.value;
      const end = start + pageSize.value;
      return filteredData.value.slice(start, end);
    });

    // 获取历史记录数据
    const fetchHistoryData = async () => {
      loading.value = true;
      try {
        // 实际环境的API请求代码（已注释）
        /*
        const response = await axios.get(apiConfig.admin.QAHistory.list, {
          params: {
            username: searchForm.username,
            sessionId: searchForm.sessionId,
            startTime: searchForm.startTime,
            endTime: searchForm.endTime
          }
        });
        allHistories.value = response.data.data;
        */

        // Mock数据（用于本地测试）
        setTimeout(() => {
          allHistories.value = generateMockData(200);
          loading.value = false;
        }, 500);
      } catch (error) {
        console.error('获取历史记录失败:', error);
        ElMessage.error('获取历史记录失败，请稍后重试');
        loading.value = false;
      }
    };

    // 搜索历史记录
    const searchHistory = () => {
      currentPage.value = 1; // 重置为第一页
      // fetchHistoryData(); // 如果需要每次搜索都向后端请求，则取消注释

      // 本地过滤已加载的所有数据
      ElMessage.success('搜索完成');
    };

    // 重置搜索条件
    const resetSearch = () => {
      Object.keys(searchForm).forEach(key => {
        searchForm[key] = '';
      });
      currentPage.value = 1;
      searchHistory();
    };

    // 生成用户类型的标签样式
    const getUserTypeTag = (type) => {
      const typeMap = {
        '普通用户': 'info',
        '智能客服': 'success',
        '管理员': 'danger',
        '访客': 'warning'
      };
      return typeMap[type] || 'info';
    };

    // 处理页码变化
    const handlePageChange = (page) => {
      currentPage.value = page;
    };

    // 处理每页显示数量变化
    const handleSizeChange = (size) => {
      pageSize.value = size;
      currentPage.value = 1;
    };

    // 生成Mock数据函数
    const generateMockData = (count) => {
      const userNames = ['张三', '李四', '王五', '赵六', '钱七', '孙八', '周九', '吴十'];
      const questions = [
        '如何提高机器学习模型的准确率？',
        '深度学习和传统机器学习有什么区别？',
        '推荐几本人工智能入门书籍',
        '如何解决过拟合问题？',
        '神经网络的基本原理是什么？',
        '如何优化大规模数据处理的效率？',
        '自然语言处理的主要应用场景有哪些？',
        '计算机视觉中的目标检测算法有哪些？',
        '强化学习的基本概念和应用',
        '如何评估一个机器学习模型的性能？'
      ];

      const answers = [
        '提高机器学习模型准确率的方法包括：增加训练数据量、特征工程、调整模型参数、使用集成学习方法等。另外，交叉验证也是避免过拟合和提高模型泛化能力的重要技术。',
        '深度学习是传统机器学习的子集，主要区别在于：深度学习能自动进行特征提取，而传统机器学习需要手动特征工程；深度学习通常需要更多的数据和计算资源；深度学习模型结构更为复杂，层次更深；深度学习在图像识别、自然语言处理等领域表现更为出色。',
        '人工智能入门书籍推荐：《人工智能：一种现代方法》、《深度学习》(花书)、《机器学习》(西瓜书)、《Python机器学习》、《动手学深度学习》等。这些书籍从基础理论到实践应用都有很好的覆盖。',
        '解决过拟合问题的方法包括：增加训练数据、使用正则化技术(L1/L2正则)、Dropout、早停法(Early Stopping)、数据增强、减少模型复杂度、使用集成学习等。选择适当的方法应结合具体任务和数据特点。',
        '神经网络的基本原理是模拟人脑神经元的连接方式进行信息处理。它由输入层、隐藏层和输出层组成，通过激活函数引入非线性，使用反向传播算法和梯度下降法进行参数优化，最终学习数据中的模式和特征。',
        '优化大规模数据处理效率的方法：使用分布式计算框架(如Spark/Hadoop)、数据并行与模型并行、批处理优化、使用GPU/TPU加速、优化数据存储和访问方式、算法优化减少计算复杂度、使用增量学习方法等。',
        '自然语言处理的主要应用场景包括：机器翻译、情感分析、文本分类、问答系统、语音识别、文本生成、信息抽取、文档摘要、对话系统、语法分析等。随着大型语言模型的发展，NLP应用正变得越来越广泛。',
        '计算机视觉中常用的目标检测算法有：R-CNN系列(R-CNN、Fast R-CNN、Faster R-CNN)、YOLO系列、SSD、RetinaNet、CenterNet等。这些算法在准确率和速度上各有优劣，可根据具体应用场景选择。',
        '强化学习是通过智能体与环境交互，通过奖励机制学习最优策略的机器学习方法。基本概念包括状态、动作、奖励、策略等。主要应用在游戏AI、自动驾驶、机器人控制、推荐系统、资源调度等领域。',
        '评估机器学习模型性能的指标包括：分类任务中的准确率、精确率、召回率、F1值、ROC曲线、AUC值；回归任务中的MSE、MAE、R²；此外还有混淆矩阵、交叉验证等评估方法。选择指标应根据具体任务和业务需求。'
      ];

      const mockData = [];
      let idCounter = 1;

      // 生成count/2对问答记录
      for (let i = 0; i < count/2; i++) {
        const sessionId = `s${100000 + Math.floor(Math.random() * 900000)}`;
        const userName = userNames[Math.floor(Math.random() * userNames.length)];
        const questionIndex = Math.floor(Math.random() * questions.length);

        // 生成随机日期（过去30天内）
        const questionDate = new Date();
        questionDate.setDate(questionDate.getDate() - Math.floor(Math.random() * 30));
        questionDate.setHours(Math.floor(Math.random() * 24));
        questionDate.setMinutes(Math.floor(Math.random() * 60));
        questionDate.setSeconds(Math.floor(Math.random() * 60));

        // 生成回答时间（问题之后的几秒到几分钟）
        const answerDate = new Date(questionDate);
        answerDate.setSeconds(answerDate.getSeconds() + 5 + Math.floor(Math.random() * 300));

        const questionTimestamp = questionDate.toISOString().replace('T', ' ').substring(0, 19);
        const answerTimestamp = answerDate.toISOString().replace('T', ' ').substring(0, 19);

        // 添加提问记录
        mockData.push({
          id: idCounter++,
          sessionId: sessionId,
          username: userName,
          userType: '普通用户',
          content: questions[questionIndex],
          timestamp: questionTimestamp
        });

        // 添加回答记录
        mockData.push({
          id: idCounter++,
          sessionId: sessionId,
          username: 'AI助手',
          userType: '智能客服',
          content: answers[questionIndex],
          timestamp: answerTimestamp
        });
      }

      return mockData;
    };

    // 组件挂载时加载数据
    onMounted(() => {
      fetchHistoryData();
    });

    return {
      loading,
      searchForm,
      allHistories,
      filteredData,
      paginatedData,
      currentPage,
      pageSize,
      searchHistory,
      resetSearch,
      getUserTypeTag,
      handlePageChange,
      handleSizeChange
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

.search-area {
  margin-bottom: 20px;
  background-color: #f5f7fa;
  padding: 15px;
  border-radius: 4px;
}

.search-form {
  display: flex;
  flex-wrap: wrap;
  gap: 10px;
}

.pagination {
  margin-top: 20px;
  text-align: right;
}
</style>