import axios from 'axios';

// 后端服务地址
const API_BASE_URL = 'http://127.0.0.1:8000';
const requests = axios.create({
    baseURL: API_BASE_URL, // 动态设置 baseURL
    timeout: 5000,
    headers: {
        'Content-Type': 'application/json'
    }
});

export default requests;