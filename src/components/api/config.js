// api/config.js - 集中管理API请求接口
const API_BASE_URL = 'http://127.0.0.1:8080';

export default {
    user: {
        login: `${API_BASE_URL}/user/login`,
        register: `${API_BASE_URL}/user/register`,
    },
    admin: {
        login: `${API_BASE_URL}/admin/login`,
        // 其他管理员API...
    }
};
