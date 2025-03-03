// api/config.js - 集中管理API请求接口
const API_BASE_URL = 'http://127.0.0.1:8080';

export default {
    user: {
        login: `${API_BASE_URL}/user/login`,
        register: `${API_BASE_URL}/user/register`,
    },
    admin: {
        login: `${API_BASE_URL}/admin/login`,
        serverStatus: `${API_BASE_URL}/admin/server-status`,
        knowledgeBase:{
            list: `${API_BASE_URL}/admin/knowledge-base/list`,
            detail: `${API_BASE_URL}/admin/knowledge-base/detail`,
            upload: `${API_BASE_URL}/admin/knowledge-base/upload`,
            delete: `${API_BASE_URL}/admin/knowledge-base/delete`,
        },
    }
};
