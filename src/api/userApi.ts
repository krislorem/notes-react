import authAxios from "./axiosInstance";
// 登录
const login = async (username: string, password: string) => {
  const response = await authAxios.post("/api/user/login", {
    username,
    password,
  });
  return response.data;
};
// 注册
const register = async (username: string, code: number, password: string) => {
  const response = await authAxios.post("/api/user/register", {
    username,
    code,
    password,
  });
  return response.data;
};
// 登出
const exit = async () => {
  const response = await authAxios.post("/api/user/logout");
  return response.data;
};
// 邮箱验证
const sendcode = async (email: string) => {
  const response = await authAxios.post("/api/user/sendcode", { email: email });
  return response.data;
};
// 查询所有用户
const getAllUsers = async (pageNum: number, pageSize: number) => {
  const response = await authAxios.post("/api/user/list", { pageNum: pageNum, pageSize: pageSize});
  return response.data;
}
// 根据用户名查询用户
const getUserByName = async (username: string) => {
  const response = await authAxios.post("/api/user/name", { username: username });
  return response.data;
}
// 关注用户
const followUser = async (user_id: number, follower_id: number) => {
  const response = await authAxios.post("/api/user/follow", { user_id: user_id, follower_id: follower_id });
  return response.data;
}
// 取消关注用户
const unfollowUser = async (user_id: number, follower_id: number) => {
  const response = await authAxios.post("/api/user/unfollow", { user_id: user_id, follower_id: follower_id });
  return response.data;
}
// 查询我是否关注了此用户
const getIsFollowedUser = async (user_id: number, object_id: number) => {
  const response = await authAxios.post("/api/user/follow/isFollowed", { user_id: user_id, object_id: object_id });
  return response.data;
}
// 查询我是否是此用户的粉丝
const getIsFollower = async (user_id: number, object_id: number) => {
  const response = await authAxios.post("/api/user/follower/isFollower", { user_id: user_id, object_id: object_id });
  return response.data;
}
export default {
  login,
  register,
  exit,
  sendcode,
  getAllUsers,
  getUserByName,
  followUser,
  unfollowUser,
  getIsFollowedUser,
  getIsFollower
};