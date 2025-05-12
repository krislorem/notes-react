import axios from 'axios';
const baseAxios = axios.create({
  baseURL: import.meta.env.API_URL,
  withCredentials: true,
});
baseAxios.interceptors.request.use(
  (config) => {
    config.headers.Authorization = `Bearer ${localStorage.getItem('token')}`;
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);
export default baseAxios;
