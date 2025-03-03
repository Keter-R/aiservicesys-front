import { createRouter, createWebHashHistory } from 'vue-router'
import Login from '../views/login.vue'
import Registerer from '../views/register.vue'
import AdminLogin from '../views/adminLogin.vue'
import Dashboard from '../views/admin/Dashboard.vue'
import ServerStatus from '../views/admin/ServerStatus.vue'
import KnowledgeBase from '../views/admin/KnowledgeBase.vue'
import QAHistory from '../views/admin/QAHistory.vue'
import UserManagement from '../views/admin/UserManagement.vue'
import ModelManagement from '../views/admin/ModelManagement.vue'
import Chat from '../views/chat.vue'  // 导入新的Chat组件

const routes = [
    {
        path: '/',
        redirect: '/login'
    },
    {
        path: '/login',
        name: 'Login',
        component: Login
    },
    {
        path: '/register',
        name: 'Register',
        component: Registerer
    },
    {
        path: '/chat',
        name: 'Chat',
        component: Chat,
        meta: { requiresAuth: true }  // 添加权限验证
    },
    {
        path: '/admin/login',
        name: 'AdminLogin',
        component: AdminLogin
    },
    {
        path: '/admin',
        component: Dashboard,
        meta: { requiresAdmin: true },
        children: [
            {
                path: '',
                redirect: '/admin/server-status'
            },
            {
                path: 'server-status',
                name: 'ServerStatus',
                component: ServerStatus,
                meta: { requiresAdmin: true }
            },
            {
                path: 'knowledge-base',
                name: 'KnowledgeBase',
                component: KnowledgeBase,
                meta: { requiresAdmin: true }
            },
            {
                path: 'qa-history',
                name: 'QAHistory',
                component: QAHistory,
                meta: { requiresAdmin: true }
            },
            {
                path: 'user-management',
                name: 'UserManagement',
                component: UserManagement,
                meta: { requiresAdmin: true }
            },
            {
                path: 'model-management',
                name: 'ModelManagement',
                component: ModelManagement,
                meta: { requiresAdmin: true }
            }
        ]
    }
]

const router = createRouter({
    history: createWebHashHistory(),
    routes
})

// 导航守卫，保护管理员路由和普通用户路由
router.beforeEach((to, from, next) => {
    if (to.meta.requiresAdmin) {
        const isAdmin = localStorage.getItem('isAdmin') === 'true';
        const adminToken = localStorage.getItem('adminToken');

        if (isAdmin && adminToken) {
            next();
        } else {
            next('/admin/login');
        }
    } else if (to.meta.requiresAuth) {  // 添加普通用户的权限验证
        const token = localStorage.getItem('token');

        if (token) {
            next();
        } else {
            next('/login');
        }
    } else {
        next();
    }
});

export default router