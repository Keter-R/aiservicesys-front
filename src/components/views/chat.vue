<template>
  <div class="chat-container">
    <div class="chat-header">
      <h2>智能客服</h2>
      <!-- 退出登录按钮 -->
      <el-button type="danger" plain size="small" @click="logout" class="logout-btn">
        <el-icon><SwitchButton /></el-icon> 退出登录
      </el-button>
    </div>

    <div class="chat-messages" ref="messagesContainer">
      <div v-for="(message, index) in chatMessages" :key="index"
           :class="['message-item', message.role === 'user' ? 'user-message' : 'assistant-message']">
        <!-- 客服头像 -->
        <div class="avatar-container" v-if="message.role !== 'user'">
          <el-avatar :size="40" src="https://cube.elemecdn.com/0/88/03b0d39583f48206768a7534e55bcpng.png"></el-avatar>
        </div>

        <div class="message-content">
          <div class="message-sender">{{ message.role === 'user' ? '我' : '智能客服' }}</div>
          <div class="message-text">{{ message.content }}</div>
        </div>

        <!-- 用户头像 -->
        <div class="avatar-container" v-if="message.role === 'user'">
          <el-avatar :size="40" src="https://cube.elemecdn.com/3/7c/3ea6beec64369c2642b92c6726f1epng.png"></el-avatar>
        </div>
      </div>
    </div>

    <div class="chat-input">
      <el-input
          v-model="userInput"
          placeholder="请输入您的问题..."
          @keyup.enter="sendMessage"
          :disabled="loading"
      >
        <!-- 客服思考中提示 -->
        <template #append v-if="loading">
          <span class="thinking-indicator">客服思考中...</span>
        </template>
      </el-input>
      <el-button type="primary" @click="sendMessage" :loading="loading">发送</el-button>
    </div>
  </div>
</template>

<script>
import axios from 'axios';
import { ElMessage, ElMessageBox } from 'element-plus';
import { SwitchButton } from '@element-plus/icons-vue';
import apiConfig from '@/components/api/config.js';

export default {
  name: 'Chat',
  components: {
    SwitchButton
  },
  data() {
    return {
      chatMessages: [],
      userInput: '',
      loading: false
    };
  },
  methods: {
    // 退出登录
    logout() {
      ElMessageBox.confirm('确定要退出登录吗?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        // 清除本地存储中的token和其他用户相关数据
        localStorage.removeItem('token');

        // 显示退出成功消息
        ElMessage.success('退出登录成功');

        // 跳转到登录页面
        this.$router.push('/login');
      }).catch(() => {
        // 用户取消操作，不做处理
      });
    },

    // 获取聊天记录
    async fetchChatRecords() {
      try {
        // 实际请求代码
        /*
        const response = await axios.get(apiConfig.user.record, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`
          }
        });

        if (response.data.code === 200) {
          this.chatMessages = response.data.data;
          this.scrollToBottom();
        } else {
          ElMessage.error(response.data.message || '获取聊天记录失败');
        }
        */

        // mock代码，用于单机测试
        setTimeout(() => {
          this.chatMessages = [
            { role: 'assistant', content: '您好，我是智能客服助手，有什么可以帮您解答的问题吗？' }
          ];
          this.scrollToBottom();
        }, 500);
      } catch (error) {
        console.error('获取聊天记录失败:', error);
        ElMessage.error('获取聊天记录失败，请刷新页面重试');
      }
    },

    // 发送消息
    async sendMessage() {
      if (!this.userInput.trim()) return;

      const userMessage = this.userInput;
      this.userInput = '';

      // 添加用户消息到聊天记录
      this.chatMessages.push({ role: 'user', content: userMessage });
      this.scrollToBottom();

      this.loading = true;

      try {
        // 实际请求代码
        /*
        const response = await axios.post(apiConfig.user.ask, {
          message: userMessage
        }, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`
          }
        });

        if (response.data.code === 200) {
          // 添加机器人回复到聊天记录
          this.chatMessages.push({ role: 'assistant', content: response.data.data.reply });
          this.scrollToBottom();
        } else {
          ElMessage.error(response.data.message || '发送消息失败');
        }
        */

        // mock代码，用于单机测试
        setTimeout(() => {
          // 模拟智能客服回复
          const botResponses = [
            '您好，我正在查询相关信息，请稍候。',
            '感谢您的咨询，我们的系统已经收到您的问题。',
            '根据您的描述，我建议您可以尝试以下解决方案...',
            '您的问题已经记录，我们将会进一步处理。',
            '很高兴能帮到您，还有其他问题吗？'
          ];
          const randomResponse = botResponses[Math.floor(Math.random() * botResponses.length)];

          this.chatMessages.push({ role: 'assistant', content: randomResponse });
          this.scrollToBottom();
          this.loading = false;
        }, 3000);
      } catch (error) {
        console.error('发送消息失败:', error);
        ElMessage.error('发送消息失败，请重试');
        this.loading = false;
      }
    },

    // 滚动到最新消息
    scrollToBottom() {
      this.$nextTick(() => {
        const container = this.$refs.messagesContainer;
        if (container) {
          container.scrollTop = container.scrollHeight;
        }
      });
    }
  },
  mounted() {
    this.fetchChatRecords();
  }
};
</script>

<style scoped>
.chat-container {
  display: flex;
  flex-direction: column;
  height: 100vh;
  max-width: 1000px;
  margin: 0 auto;
  padding: 20px;
  box-sizing: border-box;
}

.chat-header {
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 15px 0;
  border-bottom: 1px solid #eee;
  margin-bottom: 20px;
  position: relative;
}

.chat-header h2 {
  margin: 0;
}

.logout-btn {
  position: absolute;
  right: 0;
  transition: all 0.3s;
}

.logout-btn:hover {
  background-color: #f56c6c;
  color: white;
}

.chat-messages {
  flex: 1;
  overflow-y: auto;
  padding: 10px;
  display: flex;
  flex-direction: column;
  gap: 15px;
  margin-bottom: 20px;
  border: 1px solid #eaeaea;
  border-radius: 8px;
  background-color: #f9f9f9;
}

.message-item {
  display: flex;
  margin-bottom: 16px;
  align-items: flex-start;
}

.user-message {
  justify-content: flex-end;
}

.assistant-message {
  justify-content: flex-start;
}

.avatar-container {
  margin: 0 8px;
  flex-shrink: 0;
}

.message-content {
  max-width: 65%;
  padding: 12px 16px;
  border-radius: 12px;
  word-break: break-word;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

.user-message .message-content {
  background-color: #2b85e4; /* 用户消息背景色改为蓝色 */
  color: white; /* 用户消息文字改为白色 */
}

.assistant-message .message-content {
  background-color: #f3c97d; /* 客服消息背景色改为黄色 */
  color: #333; /* 文字颜色为深灰色 */
  border: 1px solid #e8e8e8;
}

.message-sender {
  font-size: 12px;
  margin-bottom: 6px;
  font-weight: bold;
}

.user-message .message-sender {
  color: #e8f4ff; /* 用户名称颜色 */
}

.assistant-message .message-sender {
  color: #666; /* 客服名称颜色 */
}

.message-text {
  line-height: 1.5;
}

.chat-input {
  display: flex;
  gap: 10px;
  padding: 15px 0;
  border-top: 1px solid #eee;
}

.chat-input .el-input {
  flex: 1;
}

.el-button {
  min-width: 80px;
}

.thinking-indicator {
  color: #909399;
  font-style: italic;
  white-space: nowrap;
  padding: 0 10px;
}
</style>