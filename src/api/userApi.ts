import baseAxios from "./baseAxios";
import authAxios from "./authAxios";
// 登录
const login = async (user_name: string, password: string) => {
  const response = await baseAxios.post("/api/user/login", {
    user_name,
    password,
  });
  return response.data;
};
// 注册
const register = async (user_name: string, email: string, code: string, password: string) => {
  const response = await baseAxios.post("/api/user/register", {
    user_name,
    email,
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
  const response = await baseAxios.post("/api/user/sendcode", { email: email });
  return response.data;
};
// 查询所有用户
const getAllUsers = async (pageNum: number, pageSize: number) => {
  const response = await baseAxios.post("/api/user/list", { pageNum: pageNum, pageSize: pageSize });
  return response.data;
}
// 获取用户信息
const getUserInfo = async (user_id: number) => {
  const response = await authAxios.post("/api/user/info", { user_id: user_id });
  return response.data;
}
// 修改用户信息
const updateUserInfo = async (user_id: number, user_name: string, nick_name: string, info: string, avatar: string) => {
  const response = await authAxios.post("/api/user/update", { user_id: user_id, user_name: user_name, nick_name: nick_name, info: info, avatar: avatar });
  return response.data;
}
// 根据用户名查询用户
const getUserByName = async (username: string) => {
  const response = await baseAxios.post("/api/user/name", { username: username });
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
// 查询这个用户是否是我的粉丝
const getIsFollower = async (user_id: number, object_id: number) => {
  const response = await authAxios.post("/api/user/follower/isFollower", { user_id: user_id, object_id: object_id });
  return response.data;
}
// 获取用户关注的所有用户
const getFollowedUsers = async (user_id: number, pageNum: number, pageSize: number) => {
  const response = await authAxios.post("/api/user/followed", { user_id: user_id, pageNum: pageNum, pageSize: pageSize });
  return response.data;
}
// 获取用户的粉丝
const getFollowers = async (user_id: number, pageNum: number, pageSize: number) => {
  const response = await authAxios.post("/api/user/follower", { user_id: user_id, pageNum: pageNum, pageSize: pageSize });
  return response.data;
}
// 获取用户收藏的所有笔记本
const getUserFavoriteNotebooks = async (user_id: number, pageNum: number, pageSize: number) => {
  const response = await authAxios.post("/api/user/favoriteNotebooks", { user_id: user_id, pageNum: pageNum, pageSize: pageSize });
  return response.data;
}
// 获取用户收藏的所有笔记
const getUserFavoriteNotes = async (user_id: number, pageNum: number, pageSize: number) => {
  const response = await authAxios.post("/api/user/favoriteNotes", { user_id: user_id, pageNum: pageNum, pageSize: pageSize });
  return response.data;
}
// 获取用户一年内的创作指数
const getUserHeat = async (user_id: number) => {
  const response = await authAxios.post("/api/user/heat", { user_id: user_id });
  return response.data;
}

// 获取回复的用户
const getReplyUser = async (reply_id: number) => {
  const response = await authAxios.post("/api/user/reply", { reply_id: reply_id });
  return response.data;
}

// 获取用户的笔记本数量
const getUserNotebookNum = async (user_id: number) => {
  const response = await authAxios.post("/api/user/notebookNum", { user_id: user_id });
  return response.data;
}
// 获取用户的笔记数量
const getUserNoteNum = async (user_id: number) => {
  const response = await authAxios.post("/api/user/noteNum", { user_id: user_id });
  return response.data;
}
// 获取用户的获赞数量
const getUserLikeNum = async (user_id: number) => {
  const response = await authAxios.post("/api/user/likeNum", { user_id: user_id });
  return response.data;
}

export {
  login,
  register,
  exit,
  sendcode,
  getAllUsers,
  getUserInfo,
  updateUserInfo,
  getUserByName,
  followUser,
  unfollowUser,
  getIsFollowedUser,
  getIsFollower,
  getFollowedUsers,
  getFollowers,
  getUserFavoriteNotebooks,
  getUserFavoriteNotes,
  getUserHeat,
  getReplyUser,
  getUserNotebookNum,
  getUserNoteNum,
  getUserLikeNum
};
