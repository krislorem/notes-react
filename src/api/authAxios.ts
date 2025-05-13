import axios from 'axios';
import { Modal } from 'antd';
const authAxios = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
  withCredentials: true,
});
authAxios.interceptors.request.use(
  (config) => {
    if (localStorage.getItem('token')) {
      config.headers.Authorization = `Bearer ${localStorage.getItem('token')}`;
      return Promise.resolve(config);
    } else {
      Modal.error({
        title: '错误',
        content: '请先登录',
      });
      window.location.href = '/login';
      return Promise.reject(new Error('请先登录'));
    }
  },
  (error) => {
    return Promise.reject(error);
  }
);
export default authAxios;
