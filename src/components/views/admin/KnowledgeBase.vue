<template>
  <div class="knowledge-base">
    <el-card class="kb-card">
      <template #header>
        <div class="card-header">
          <h2>知识库管理</h2>
          <el-button type="primary" @click="showAddDialog = true">添加知识库</el-button>
        </div>
      </template>

      <el-table :data="pagedKnowledgeBases" style="width: 100%" v-loading="loading">
        <el-table-column prop="id" label="ID" width="80"></el-table-column>
        <el-table-column prop="name" label="知识库名称"></el-table-column>
        <el-table-column prop="description" label="描述"></el-table-column>
        <el-table-column prop="documentCount" label="问答数量" width="120"></el-table-column>
        <el-table-column prop="createdAt" label="创建时间" width="180"></el-table-column>
        <el-table-column label="操作" width="250">
          <template #default="scope">
            <el-button size="small" @click="viewKnowledgeBase(scope.row)">查看</el-button>
            <el-button size="small" type="danger" @click="confirmDelete(scope.row)">删除</el-button>
          </template>
        </el-table-column>
      </el-table>

      <el-pagination
          class="pagination"
          layout="prev, pager, next"
          :total="knowledgeBases.length"
          :page-size="pageSize"
          :current-page="currentPage"
          @current-change="handlePageChange"
      ></el-pagination>

      <!-- 添加知识库对话框 -->
      <el-dialog
          v-model="showAddDialog"
          title="添加知识库"
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
          <el-form-item label="上传文件">
            <el-upload
                class="upload-demo"
                :auto-upload="false"
                :limit="1"
                :on-change="handleFileChange"
                :on-remove="handleFileRemove"
                :file-list="fileList"
            >
              <el-button type="primary">选择文件</el-button>
              <template #tip>
                <div class="el-upload__tip">请上传知识库文件（支持PDF、TXT、DOCX等格式）</div>
              </template>
            </el-upload>
          </el-form-item>
        </el-form>
        <template #footer>
          <span class="dialog-footer">
            <el-button @click="cancelAdd">取消</el-button>
            <el-button type="primary" @click="uploadKnowledgeBase" :loading="uploading">确定</el-button>
          </span>
        </template>
      </el-dialog>

      <!-- 查看知识库详情对话框 -->
      <el-dialog
          v-model="showDetailDialog"
          title="知识库详情"
          width="800px"
      >
        <div v-loading="detailLoading">
          <div class="detail-header">
            <h3>{{ currentDetail.name }}</h3>
            <p><strong>描述：</strong>{{ currentDetail.description }}</p>
            <p><strong>创建时间：</strong>{{ currentDetail.createdAt }}</p>
            <p><strong>问答数量：</strong>{{ currentDetail.documentCount }}</p>
          </div>

          <div class="detail-content">
            <h4>问答对内容（前5条）：</h4>
            <el-collapse v-if="currentDetail.qaList && currentDetail.qaList.length > 0">
              <el-collapse-item v-for="(item, index) in currentDetail.qaList" :key="index" :title="`问题 ${index + 1}: ${item.question}`">
                <div class="qa-answer">{{ item.answer }}</div>
              </el-collapse-item>
            </el-collapse>
            <el-empty v-else description="暂无问答对数据"></el-empty>
          </div>
        </div>
      </el-dialog>
    </el-card>
  </div>
</template>

<script>
import { ref, reactive, computed, onMounted } from 'vue';
import { ElMessage, ElMessageBox } from 'element-plus';
import axios from 'axios';
import apiConfig from '../../api/config';

export default {
  name: 'KnowledgeBase',
  setup() {
    const loading = ref(false);
    const detailLoading = ref(false);
    const showAddDialog = ref(false);
    const showDetailDialog = ref(false);
    const uploading = ref(false);
    const currentPage = ref(1);
    const pageSize = ref(10);
    const fileList = ref([]);
    const selectedFile = ref(null);

    // API路径配置
    const api_list = apiConfig.admin.knowledgeBase.list;
    const api_upload = apiConfig.admin.knowledgeBase.upload;
    const api_delete = apiConfig.admin.knowledgeBase.delete;
    const api_detail = apiConfig.admin.knowledgeBase.detail;

    // 知识库列表数据
    const knowledgeBases = ref([]);

    // 当前查看的知识库详情
    const currentDetail = reactive({
      id: null,
      name: '',
      description: '',
      documentCount: 0,
      createdAt: '',
      qaList: []
    });

    const knowledgeBaseForm = reactive({
      name: '',
      description: ''
    });

    // 计算当前页的数据
    const pagedKnowledgeBases = computed(() => {
      const start = (currentPage.value - 1) * pageSize.value;
      const end = start + pageSize.value;
      return knowledgeBases.value.slice(start, end);
    });

    // 初始化时获取所有知识库列表
    onMounted(() => {
      fetchKnowledgeBases();
    });

    // =============================================
    // ========== 实际API请求部分（已注释）==========
    // =============================================

    /**
     * 获取知识库列表（实际API请求 - 已注释）
     */
    /*
    const fetchKnowledgeBases = async () => {
      loading.value = true;
      try {
        const response = await axios.get(api_list);
        if (response.data.code === 0) {
          knowledgeBases.value = response.data.data || [];
        } else {
          ElMessage.error(response.data.message || '获取知识库列表失败');
        }
      } catch (error) {
        console.error('获取知识库列表错误:', error);
        ElMessage.error('获取知识库列表失败');
      } finally {
        loading.value = false;
      }
    };
    */

    /**
     * 上传知识库文件（实际API请求 - 已注释）
     */
    /*
    const uploadKnowledgeBase = async () => {
      if (!knowledgeBaseForm.name.trim()) {
        ElMessage.warning('知识库名称不能为空');
        return;
      }

      if (!selectedFile.value) {
        ElMessage.warning('请选择要上传的文件');
        return;
      }

      uploading.value = true;

      try {
        const formData = new FormData();
        formData.append('name', knowledgeBaseForm.name);
        formData.append('description', knowledgeBaseForm.description);
        formData.append('file', selectedFile.value);

        const response = await axios.post(api_upload, formData, {
          headers: {
            'Content-Type': 'multipart/form-data'
          }
        });

        if (response.data.code === 0) {
          ElMessage.success('知识库上传成功');
          fetchKnowledgeBases(); // 重新获取列表
          cancelAdd(); // 关闭对话框并重置表单
        } else {
          ElMessage.error(response.data.message || '知识库上传失败');
        }
      } catch (error) {
        console.error('上传知识库错误:', error);
        ElMessage.error('上传知识库失败');
      } finally {
        uploading.value = false;
      }
    };
    */

    /**
     * 查看知识库详情（实际API请求 - 已注释）
     */
    /*
    const viewKnowledgeBase = async (kb) => {
      showDetailDialog.value = true;
      detailLoading.value = true;

      // 初始化基本信息
      Object.assign(currentDetail, {
        id: kb.id,
        name: kb.name,
        description: kb.description,
        documentCount: kb.documentCount,
        createdAt: kb.createdAt,
        qaList: []
      });

      try {
        const response = await axios.get(`${api_detail}?id=${kb.id}`);

        if (response.data.code === 0) {
          // 更新详情数据，特别是问答列表
          const detailData = response.data.data;
          if (detailData && detailData.qaList) {
            currentDetail.qaList = detailData.qaList;
          }
        } else {
          ElMessage.error(response.data.message || '获取知识库详情失败');
        }
      } catch (error) {
        console.error('获取知识库详情错误:', error);
        ElMessage.error('获取知识库详情失败');
      } finally {
        detailLoading.value = false;
      }
    };
    */

    /**
     * 确认删除知识库（实际API请求 - 已注释）
     */
    /*
    const confirmDelete = (kb) => {
      ElMessageBox.confirm(
        `确定要删除知识库"${kb.name}"吗？此操作不可恢复。`,
        '删除确认',
        {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }
      ).then(async () => {
        try {
          const response = await axios.delete(`${api_delete}?id=${kb.id}`);

          if (response.data.code === 0) {
            // 从列表中移除
            const index = knowledgeBases.value.findIndex(item => item.id === kb.id);
            if (index !== -1) {
              knowledgeBases.value.splice(index, 1);
            }
            ElMessage.success('知识库已删除');
          } else {
            ElMessage.error(response.data.message || '删除知识库失败');
          }
        } catch (error) {
          console.error('删除知识库错误:', error);
          ElMessage.error('删除知识库失败');
        }
      }).catch(() => {
        // 用户取消删除
      });
    };
    */

    // =============================================
    // ========== 本地测试Mock部分（使用中）==========
    // =============================================

    /**
     * 获取知识库列表（本地Mock数据）
     */
    const fetchKnowledgeBases = () => {
      loading.value = true;
      // 模拟网络延迟
      setTimeout(() => {
        knowledgeBases.value = [
          { id: 1, name: '产品知识库', description: '包含所有产品的说明和FAQ', documentCount: 125, createdAt: '2023-05-10 14:30:00' },
          { id: 2, name: '技术文档', description: '技术文档和API说明', documentCount: 87, createdAt: '2023-06-15 09:45:00' },
          { id: 3, name: '客服话术', description: '客服常用话术和回复模板', documentCount: 56, createdAt: '2023-07-20 16:20:00' },
          { id: 4, name: '行业知识', description: '行业相关的知识和资讯', documentCount: 93, createdAt: '2023-08-05 11:10:00' },
          { id: 5, name: '用户手册', description: '用户使用指南和手册', documentCount: 42, createdAt: '2023-09-12 15:40:00' },
          { id: 6, name: '培训资料', description: '内部员工培训教程', documentCount: 78, createdAt: '2023-10-05 09:15:00' },
          { id: 7, name: '市场调研', description: '行业市场调研报告', documentCount: 35, createdAt: '2023-10-18 16:20:00' },
          { id: 8, name: '竞品分析', description: '竞争对手产品分析', documentCount: 29, createdAt: '2023-11-02 11:45:00' },
          { id: 9, name: '用户反馈', description: '用户意见和建议收集', documentCount: 63, createdAt: '2023-11-20 14:10:00' },
          { id: 10, name: 'FAQ合集', description: '常见问题解答合集', documentCount: 112, createdAt: '2023-12-05 10:30:00' },
          { id: 11, name: '开发指南', description: '开发人员指南和最佳实践', documentCount: 87, createdAt: '2023-12-15 15:25:00' },
          { id: 12, name: '架构文档', description: '系统架构设计文档', documentCount: 45, createdAt: '2024-01-08 09:20:00' }
        ];
        loading.value = false;
        ElMessage.success('知识库列表加载完成（本地测试）');
      }, 800);
    };

    /**
     * 上传知识库文件（本地Mock）
     */
    const uploadKnowledgeBase = () => {
      if (!knowledgeBaseForm.name.trim()) {
        ElMessage.warning('知识库名称不能为空');
        return;
      }

      if (!selectedFile.value) {
        ElMessage.warning('请选择要上传的文件');
        return;
      }

      uploading.value = true;

      // 模拟上传过程
      setTimeout(() => {
        const newKnowledgeBase = {
          id: knowledgeBases.value.length > 0 ? Math.max(...knowledgeBases.value.map(kb => kb.id)) + 1 : 1,
          name: knowledgeBaseForm.name,
          description: knowledgeBaseForm.description || '暂无描述',
          documentCount: 0,
          createdAt: new Date().toLocaleString()
        };

        knowledgeBases.value.unshift(newKnowledgeBase);
        ElMessage.success('知识库上传成功（本地测试）');
        cancelAdd();
        uploading.value = false;
      }, 1500);
    };

    /**
     * 查看知识库详情（本地Mock）
     */
    const viewKnowledgeBase = (kb) => {
      showDetailDialog.value = true;
      detailLoading.value = true;

      // 初始化基本信息
      Object.assign(currentDetail, {
        id: kb.id,
        name: kb.name,
        description: kb.description,
        documentCount: kb.documentCount,
        createdAt: kb.createdAt,
        qaList: []
      });

      // 模拟API请求延迟
      setTimeout(() => {
        // 生成模拟的问答对数据
        currentDetail.qaList = [
          { question: "什么是产品A？", answer: "产品A是一款智能客服解决方案，支持多渠道对话和自动回复功能。" },
          { question: "如何使用产品B？", answer: "您可以通过登录管理后台，点击\"添加应用\"按钮来开始使用产品B。" },
          { question: "产品价格是多少？", answer: "我们有不同的价格套餐，基础版每月99元，专业版每月299元，企业版每月999元。" },
          { question: "如何联系客服？", answer: "您可以通过官网右下角的对话窗口，或者拨打400-123-4567联系我们的客服。" },
          { question: "支持哪些支付方式？", answer: "我们支持支付宝、微信支付、银联和对公转账等多种支付方式。" },
          // { question: "如何申请退款？", answer: "您可以在\"我的订单\"页面选择需要退款的订单，点击\"申请退款\"按钮。" },
          // { question: "服务器在哪里部署？", answer: "我们的服务器部署在阿里云、腾讯云等多个数据中心，保证高可用性。" },
          // { question: "如何保障数据安全？", answer: "我们采用银行级加密技术，所有数据传输都经过SSL加密，并定期进行安全审计。" },
          // { question: "支持哪些语言？", answer: "目前支持中文、英文、日文、韩文等20多种语言。" },
          // { question: "如何升级套餐？", answer: "您可以在\"账户管理\"页面选择\"套餐升级\"，选择目标套餐并完成支付即可。" }
        ];

        detailLoading.value = false;
        ElMessage.success('知识库详情加载完成（本地测试）');
      }, 1000);
    };

    /**
     * 确认删除知识库（本地Mock）
     */
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
        // 模拟删除过程
        setTimeout(() => {
          const index = knowledgeBases.value.findIndex(item => item.id === kb.id);
          if (index !== -1) {
            knowledgeBases.value.splice(index, 1);
            ElMessage.success('知识库已删除（本地测试）');
          }
        }, 500);
      }).catch(() => {
        // 用户取消删除
      });
    };

    // =============================================
    // ============= 公共方法部分 =================
    // =============================================

    // 页码变化处理
    const handlePageChange = (page) => {
      currentPage.value = page;
    };

    // 文件选择事件处理
    const handleFileChange = (file) => {
      selectedFile.value = file.raw;
      fileList.value = [file]; // 更新文件列表显示
    };

    // 移除文件处理
    const handleFileRemove = () => {
      selectedFile.value = null;
      fileList.value = [];
    };

    // 取消添加知识库
    const cancelAdd = () => {
      showAddDialog.value = false;
      knowledgeBaseForm.name = '';
      knowledgeBaseForm.description = '';
      fileList.value = [];
      selectedFile.value = null;
    };

    // 切换到实际API模式的方法（用于未来切换）
    const switchToRealAPI = () => {
      ElMessage.info('已切换到实际API模式（需要取消注释实际API代码）');
      // 这里实际部署时可以重新加载数据
    };

    return {
      loading,
      detailLoading,
      uploading,
      knowledgeBases,
      pagedKnowledgeBases,
      currentPage,
      pageSize,
      fileList,
      handlePageChange,
      showAddDialog,
      showDetailDialog,
      knowledgeBaseForm,
      currentDetail,
      viewKnowledgeBase,
      confirmDelete,
      handleFileChange,
      handleFileRemove,
      uploadKnowledgeBase,
      cancelAdd,
      switchToRealAPI // 预留切换方法
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

.detail-header {
  margin-bottom: 20px;
  padding-bottom: 15px;
  border-bottom: 1px solid #eee;
}

.detail-header h3 {
  margin-top: 0;
  margin-bottom: 10px;
}

.detail-content {
  margin-top: 20px;
}

.qa-answer {
  padding: 10px;
  background-color: #f9f9f9;
  border-radius: 4px;
}
</style>