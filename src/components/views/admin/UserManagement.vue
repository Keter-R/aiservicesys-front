<template>
  <div class="user-management">
    <el-card class="user-card">
      <template #header>
        <div class="card-header">
          <h2>用户管理</h2>
          <div class="header-actions">
            <el-input
                v-model="searchQuery"
                placeholder="搜索用户名/邮箱"
                class="search-input"
                clearable
                @keyup.enter="searchUsers"
            >
              <template #append>
                <el-button @click="searchUsers">
                  <el-icon><Search /></el-icon>
                </el-button>
              </template>
            </el-input>
            <el-button type="primary" @click="showAddUserDialog = true">添加用户</el-button>
          </div>
        </div>
      </template>

      <el-tabs v-model="activeTab">
        <el-tab-pane label="所有用户" name="all">
          <el-table :data="users" style="width: 100%" v-loading="loading">
            <el-table-column prop="id" label="ID" width="80"></el-table-column>
            <el-table-column prop="username" label="用户名"></el-table-column>
            <el-table-column prop="email" label="邮箱"></el-table-column>
            <el-table-column prop="role" label="角色" width="100">
              <template #default="scope">
                <el-tag :type="scope.row.role === 'admin' ? 'danger' : 'primary'">
                  {{ scope.row.role === 'admin' ? '管理员' : '普通用户' }}
                </el-tag>
              </template>
            </el-table-column>
            <el-table-column prop="status" label="状态" width="100">
              <template #default="scope">
                <el-tag :type="scope.row.status === 'active' ? 'success' : 'info'">
                  {{ scope.row.status === 'active' ? '正常' : '禁用' }}
                </el-tag>
              </template>
            </el-table-column>
            <el-table-column prop="registeredAt" label="注册时间" width="180"></el-table-column>
            <el-table-column label="操作" width="200">
              <template #default="scope">
                <el-button size="small" @click="editUser(scope.row)">编辑</el-button>
                <el-button
                    size="small"
                    :type="scope.row.status === 'active' ? 'warning' : 'success'"
                    @click="toggleUserStatus(scope.row)"
                >
                  {{ scope.row.status === 'active' ? '禁用' : '启用' }}
                </el-button>
                <el-button size="small" type="danger" @click="confirmDeleteUser(scope.row)">删除</el-button>
              </template>
            </el-table-column>
          </el-table>
        </el-tab-pane>

        <el-tab-pane label="管理员" name="admin">
          <el-table :data="adminUsers" style="width: 100%" v-loading="loading">
            <!-- 相同的列结构 -->
          </el-table>
        </el-tab-pane>

        <el-tab-pane label="已禁用用户" name="disabled">
          <el-table :data="disabledUsers" style="width: 100%" v-loading="loading">
            <!-- 相同的列结构 -->
          </el-table>
        </el-tab-pane>
      </el-tabs>

      <el-pagination
          class="pagination"
          layout="total, sizes, prev, pager, next"
          :total="totalUsers"
          :page-size="pageSize"
          :page-sizes="[10, 20, 50, 100]"
          :current-page="currentPage"
          @current-change="handlePageChange"
          @size-change="handleSizeChange"
      ></el-pagination>

      <!-- 添加/编辑用户对话框 -->
      <el-dialog
          v-model="showAddUserDialog"
          :title="isEditing ? '编辑用户' : '添加用户'"
          width="500px"
      >
        <el-form :model="userForm" label-width="100px">
          <el-form-item label="用户名">
            <el-input v-model="userForm.username" placeholder="请输入用户名"></el-input>
          </el-form-item>
          <el-form-item label="邮箱">
            <el-input v-model="userForm.email" placeholder="请输入邮箱"></el-input>
          </el-form-item>
          <el-form-item label="密码" v-if="!isEditing">
            <el-input v-model="userForm.password" type="password" placeholder="请输入密码" show-password></el-input>
          </el-form-item>
          <el-form-item label="角色">
            <el-select v-model="userForm.role" placeholder="请选择角色">
              <el-option label="普通用户" value="user"></el-option>
              <el-option label="管理员" value="admin"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="状态">
            <el-switch
                v-model="userForm.status"
                active-value="active"
                inactive-value="disabled"
                active-text="正常"
                inactive-text="禁用"
            ></el-switch>
          </el-form-item>
        </el-form>
        <template #footer>
          <span class="dialog-footer">
            <el-button @click="showAddUserDialog = false">取消</el-button>
            <el-button type="primary" @click="saveUser">确定</el-button>
          </span>
        </template>
      </el-dialog>
    </el-card>
  </div>
</template>

<script>
import { ref, reactive, computed } from 'vue';
import { ElMessage, ElMessageBox } from 'element-plus';
import { Search } from '@element-plus/icons-vue';

export default {
  name: 'UserManagement',
  components: {
    Search
  },
  setup() {
    const loading = ref(false);
    const searchQuery = ref('');
    const activeTab = ref('all');
    const currentPage = ref(1);
    const pageSize = ref(10);
    const totalUsers = ref(145); // 示例总数
    const showAddUserDialog = ref(false);
    const isEditing = ref(false);

    // 示例数据
    const allUsers = ref([
      { id: 1, username: 'admin1', email: 'admin1@example.com', role: 'admin', status: 'active', registeredAt: '2023-01-15 09:30:00' },
      { id: 2, username: 'user1', email: 'user1@example.com', role: 'user', status: 'active', registeredAt: '2023-02-20 14:45:00' },
      { id: 3, username: 'user2', email: 'user2@example.com', role: 'user', status: 'active', registeredAt: '2023-03-10 11:20:00' },
      { id: 4, username: 'admin2', email: 'admin2@example.com', role: 'admin', status: 'active', registeredAt: '2023-04-05 16:15:00' },
      { id: 5, username: 'user3', email: 'user3@example.com', role: 'user', status: 'disabled', registeredAt: '2023-05-12 10:30:00' }
    ]);

    // 根据当前选项卡过滤用户
    const users = computed(() => {
      return allUsers.value;
    });

    const adminUsers = computed(() => {
      return allUsers.value.filter(user => user.role === 'admin');
    });

    const disabledUsers = computed(() => {
      return allUsers.value.filter(user => user.status === 'disabled');
    });

    const userForm = reactive({
      id: null,
      username: '',
      email: '',
      password: '',
      role: 'user',
      status: 'active'
    });

    const searchUsers = () => {
      loading.value = true;
      setTimeout(() => {
        loading.value = false;
        ElMessage.info(`搜索用户: ${searchQuery.value}`);
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

    const editUser = (user) => {
      isEditing.value = true;
      userForm.id = user.id;
      userForm.username = user.username;
      userForm.email = user.email;
      userForm.role = user.role;
      userForm.status = user.status;
      userForm.password = ''; // 编辑模式不需要显示或修改密码
      showAddUserDialog.value = true;
    };

    const saveUser = () => {
      if (!userForm.username || !userForm.email) {
        ElMessage.warning('用户名和邮箱不能为空');
        return;
      }

      if (!isEditing.value && !userForm.password) {
        ElMessage.warning('密码不能为空');
        return;
      }

      // 模拟保存操作
      if (isEditing.value) {
        ElMessage.success('用户信息更新成功');
      } else {
        ElMessage.success('用户添加成功');
      }

      // 重置表单和状态
      userForm.id = null;
      userForm.username = '';
      userForm.email = '';
      userForm.password = '';
      userForm.role = 'user';
      userForm.status = 'active';
      isEditing.value = false;
      showAddUserDialog.value = false;
    };

    const toggleUserStatus = (user) => {
      const newStatus = user.status === 'active' ? 'disabled' : 'active';
      user.status = newStatus;
      ElMessage.success(`用户已${newStatus === 'active' ? '启用' : '禁用'}`);
    };

    const confirmDeleteUser = (user) => {
      ElMessageBox.confirm(
          `确定要删除用户"${user.username}"吗？此操作不可恢复。`,
          '删除确认',
          {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            type: 'warning'
          }
      ).then(() => {
        ElMessage.success('用户已删除');
      }).catch(() => {
        // 用户取消删除
      });
    };

    return {
      loading,
      searchQuery,
      activeTab,
      users,
      adminUsers,
      disabledUsers,
      totalUsers,
      currentPage,
      pageSize,
      showAddUserDialog,
      isEditing,
      userForm,
      searchUsers,
      handlePageChange,
      handleSizeChange,
      editUser,
      saveUser,
      toggleUserStatus,
      confirmDeleteUser
    };
  }
}
</script>

<style scoped>
.user-management {
  padding: 20px;
}

.user-card {
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

.header-actions {
  display: flex;
  gap: 10px;
}

.search-input {
  width: 250px;
}

.pagination {
  margin-top: 20px;
  text-align: right;
}
</style>