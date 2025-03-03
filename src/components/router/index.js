import { createRouter, createWebHashHistory } from 'vue-router'
import Login from '../views/login.vue'
import Registerer from '../views/register.vue'

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
    }
]

const router = createRouter({
    history: createWebHashHistory(),
    routes
})

export default router