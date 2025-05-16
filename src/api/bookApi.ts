import baseAxios from "./baseAxios";
import authAxios from "./authAxios";
// 展示的所有公开的笔记本
const getAllPublicBooks = async (pageNum: number, pageSize: number) => {
  const response = await baseAxios.post("/api/book/all", { pageNum: pageNum, pageSize: pageSize });
  return response.data;
};
// 展示的所有公开的笔记
const getAllPublicNotes = async (pageNum: number, pageSize: number) => {
  const response = await baseAxios.post("/api/book/all/notes", { pageNum: pageNum, pageSize: pageSize });
  return response.data;
};
// 搜索，按关键字分页模糊查询公开的笔记本
const searchAllPublicBooks = async (keyword: string, pageNum: number, pageSize: number) => {
  const response = await baseAxios.post("/api/book/search", { keyword: keyword, pageNum: pageNum, pageSize: pageSize });
  return response.data;
};
// 搜索，按关键字、所属笔记本名和标签分页模糊查询公开的笔记
const searchAllPublicNotes = async (keyword: string, book_name: string, tags: string[], pageNum: number, pageSize: number) => {
  const response = await baseAxios.post("/api/book/note/search", { keyword: keyword, book_name: book_name, tags: tags, pageNum: pageNum, pageSize: pageSize });
  return response.data;
};
// 获取用户的所有公开笔记本
const getUserPublicBooks = async (user_id: number, pageNum: number, pageSize: number) => {
  const response = await baseAxios.post("/api/book/user", { user_id: user_id, pageNum: pageNum, pageSize: pageSize });
  return response.data;
};
// 获取我的所有笔记本的基本信息
const getMyBooks = async (user_id: number, pageNum: number, pageSize: number) => {
  const response = await authAxios.post("/api/book/my", { user_id: user_id, pageNum: pageNum, pageSize: pageSize });
  return response.data;
};
// 获取我的某个笔记本的基本信息
const getMyBook = async (book_id: number) => {
  const response = await authAxios.post("/api/book/my/book", { book_id: book_id });
  return response.data;
};
// 获取我的某个笔记本下的所有笔记基本信息
const getMyBookNotes = async (book_id: number, pageNum: number, pageSize: number) => {
  const response = await authAxios.post("/api/book/my/notes", { book_id: book_id, pageNum: pageNum, pageSize: pageSize });
  return response.data;
};
// 获取我的某个笔记的信息
const getMyNote = async (note_id: number) => {
  const response = await authAxios.post("/api/book/my/note", { note_id: note_id });
  return { data: response.data };
};
// 获取某个笔记本的所有一级评论
const getBookComments = async (book_id: number, user_id: number, pageNum: number, pageSize: number) => {
  const response = await authAxios.post("/api/book/comment", { book_id: book_id, user_id: user_id, pageNum: pageNum, pageSize: pageSize });
  return response.data;
};
// 获取某个笔记的所有一级评论
const getNoteComments = async (note_id: number, user_id: number, pageNum: number, pageSize: number) => {
  const response = await authAxios.post("/api/book/note/comment", { note_id: note_id, user_id: user_id, pageNum: pageNum, pageSize: pageSize });
  return response.data;
};
// 获取某个评论的所有回复
const getCommentReplies = async (comment_id: number, user_id: number, pageNum: number, pageSize: number) => {
  const response = await authAxios.post("/api/book/comment/reply", { comment_id: comment_id, user_id: user_id, pageNum: pageNum, pageSize: pageSize });
  return response.data;
};
// 获取某个笔记本的点赞数
const getBookLikes = async (book_id: number) => {
  const response = await baseAxios.post("/api/book/like", { book_id: book_id });
  return response.data;
};
// 获取某个笔记本的收藏数
const getBookMarks = async (book_id: number) => {
  const response = await baseAxios.post("/api/book/mark", { book_id: book_id });
  return response.data;
};
// 获取某个笔记本的笔记数
const getBookNotesCount = async (book_id: number) => {
  const response = await baseAxios.post("/api/book/note/count", { book_id: book_id });
  return response.data;
};
// 获取某个笔记本的评论数
const getBookCommentsCount = async (book_id: number) => {
  const response = await baseAxios.post("/api/book/comment/count", { book_id: book_id });
  return response.data;
}
// 获取某个笔记的点赞数
const getNoteLikes = async (note_id: number) => {
  const response = await baseAxios.post("/api/book/note/like", { note_id: note_id });
  return response.data;
};
// 获取某个笔记的收藏数
const getNoteMarks = async (note_id: number) => {
  const response = await baseAxios.post("/api/book/note/mark", { note_id: note_id });
  return response.data;
};
// 获取某个笔记的评论数
const getNoteCommentsCount = async (note_id: number) => {
  const response = await baseAxios.post("/api/book/note/comment/count", { note_id: note_id });
  return response.data;
};
// 获取某个评论的点赞数
const getCommentLikes = async (comment_id: number) => {
  const response = await baseAxios.post("/api/book/comment/like", { comment_id: comment_id });
  return response.data;
};
// 获取某个评论的回复数
const getCommentRepliesCount = async (comment_id: number) => {
  const response = await baseAxios.post("/api/book/comment/reply/count", { comment_id: comment_id });
  return response.data;
};
// 获取某个回复的点赞数
const getReplyLikes = async (reply_id: number) => {
  const response = await baseAxios.post("/api/book/reply/like", { reply_id: reply_id });
  return response.data;
};
// 新建一个笔记本
const createBook = async (book_name: string, user_id: number, is_public: number, cover: string) => {
  const response = await authAxios.post("/api/book/create", { book_name: book_name, user_id: user_id, is_public: is_public, cover: cover });
  return response.data;
};
// 修改笔记本信息
const updateBook = async (book_id: number, book_name: string, is_public: number, cover: string) => {
  const response = await authAxios.post("/api/book/update", { book_id: book_id, book_name: book_name, is_public: is_public, cover: cover });
  return response.data;
};
// 删除笔记本
const deleteBook = async (book_id: number) => {
  const response = await authAxios.post("/api/book/delete", { book_id: book_id });
  return response.data;
};
// 新建一个笔记
const createNote = async (note_name: string, user_id: number, book_id: number, tags: string[], content: string) => {
  const response = await authAxios.post("/api/book/note/create", { note_name: note_name, user_id: user_id, book_id: book_id, tags: tags, content: content });
  return response.data;
};
// 修改笔记信息
const updateNote = async (note_id: number, note_name: string, tags: string[], content: string) => {
  const response = await authAxios.post("/api/book/note/update", { note_id: note_id, note_name: note_name, tags: tags, content: content });
  return response.data;
};
// 删除笔记
const deleteNote = async (note_id: number) => {
  const response = await authAxios.post("/api/book/note/delete", { note_id: note_id });
  return response.data;
};
// 查询我删除的笔记本
const getMyDeletedBooks = async (user_id: number, pageNum: number, pageSize: number) => {
  const response = await authAxios.post("/api/book/my/deleted", { user_id: user_id, pageNum: pageNum, pageSize: pageSize });
  return response.data;
}
// 查询我删除的笔记
const getMyDeletedNotes = async (user_id: number, pageNum: number, pageSize: number) => {
  const response = await authAxios.post("/api/book/note/my/deleted", { user_id: user_id, pageNum: pageNum, pageSize: pageSize });
  return response.data;
}
// 恢复我删除的笔记本
const recoverMyDeletedBook = async (book_id: number) => {
  const response = await authAxios.post("/api/book/my/deleted/recover", { book_id: book_id });
  return response.data;
}
// 恢复我删除的笔记
const recoverMyDeletedNote = async (note_id: number) => {
  const response = await authAxios.post("/api/book/note/my/deleted/recover", { note_id: note_id });
  return response.data;
}
// 新建一个笔记本下的一级评论
const createBookComment = async (content: string, user_id: number, object_id: number) => {
  const response = await authAxios.post("/api/book/comment/create/book", { content: content, user_id: user_id, object_id: object_id });
  return response.data;
}
// 新建一个笔记下的一级评论
const createNoteComment = async (content: string, user_id: number, object_id: number) => {
  const response = await authAxios.post("/api/book/comment/create/note", { content: content, user_id: user_id, object_id: object_id });
  return response.data;
}
// 新建一个评论下的回复
const createCommentReply = async (content: string, object_id: number, user_id: number) => {
  const response = await authAxios.post("/api/book/reply/create/comment", { content: content, object_id: object_id, user_id: user_id });
  return response.data;
}
// 新建一个回复下的回复
const createReplyReply = async (content: string, object_id: number, user_id: number, comment_id: number) => {
  const response = await authAxios.post("/api/book/reply/create/reply", { content: content, object_id: object_id, user_id: user_id, comment_id: comment_id });
  return response.data;
}
// 查询是否是我的评论
const getIsMyComment = async (user_id: number, comment_id: number) => {
  const response = await authAxios.post("/api/book/comment/isMyComment", { user_id: user_id, comment_id: comment_id });
  return response.data;
}
// 查询是否是我的回复
const getIsMyReply = async (user_id: number, reply_id: number) => {
  const response = await authAxios.post("/api/book/comment/isMyReply", { user_id: user_id, reply_id: reply_id });
  return response.data;
}
// 删除我的评论
const deleteMyComment = async (comment_id: number) => {
  const response = await authAxios.post("/api/book/comment/delete", { comment_id: comment_id });
  return response.data;
}
// 删除我的回复
const deleteMyReply = async (reply_id: number) => {
  const response = await authAxios.post("/api/book/reply/delete", { reply_id: reply_id });
  return response.data;
}
// 点赞一个笔记本
const likeBook = async (user_id: number, object_id: number) => {
  const response = await authAxios.post("/api/book/like/book", { user_id: user_id, object_id: object_id });
  return response.data;
}
// 取消点赞一个笔记本
const unlikeBook = async (user_id: number, object_id: number) => {
  const response = await authAxios.post("/api/book/like/book/unlike", { user_id: user_id, object_id: object_id });
  return response.data;
}
// 点赞一个笔记
const likeNote = async (user_id: number, object_id: number) => {
  const response = await authAxios.post("/api/book/like/note", { user_id: user_id, object_id: object_id });
  return response.data;
}
// 取消点赞一个笔记
const unlikeNote = async (user_id: number, object_id: number) => {
  const response = await authAxios.post("/api/book/like/note/unlike", { user_id: user_id, object_id: object_id });
  return response.data;
}
// 点赞一个评论
const likeComment = async (user_id: number, object_id: number) => {
  const response = await authAxios.post("/api/book/like/comment", { user_id: user_id, object_id: object_id });
  return response.data;
}
// 取消点赞一个评论
const unlikeComment = async (user_id: number, object_id: number) => {
  const response = await authAxios.post("/api/book/like/comment/unlike", { user_id: user_id, object_id: object_id });
  return response.data;
}
// 点赞一个回复
const likeReply = async (user_id: number, object_id: number) => {
  const response = await authAxios.post("/api/book/like/reply", { user_id: user_id, object_id: object_id });
  return response.data;
}
// 取消点赞一个回复
const unlikeReply = async (user_id: number, object_id: number) => {
  const response = await authAxios.post("/api/book/like/reply/unlike", { user_id: user_id, object_id: object_id });
  return response.data;
}
// 收藏一个笔记本
const markBook = async (user_id: number, object_id: number) => {
  const response = await authAxios.post("/api/book/mark/book", { user_id: user_id, object_id: object_id });
  return response.data;
}
// 取消收藏一个笔记本
const unmarkBook = async (user_id: number, object_id: number) => {
  const response = await authAxios.post("/api/book/mark/book/unmark", { user_id: user_id, object_id: object_id });
  return response.data;
}
// 收藏一个笔记
const markNote = async (user_id: number, object_id: number) => {
  const response = await authAxios.post("/api/book/mark/note", { user_id: user_id, object_id: object_id });
  return response.data;
}
// 取消收藏一个笔记
const unmarkNote = async (user_id: number, object_id: number) => {
  const response = await authAxios.post("/api/book/mark/note/unmark", { user_id: user_id, object_id: object_id });
  return response.data;
}
// 查询我是否点赞了此笔记本
const getIsLikedBook = async (user_id: number, object_id: number) => {
  const response = await authAxios.post("/api/book/like/book/isLiked", { user_id: user_id, object_id: object_id });
  return response.data;
}
// 查询我是否点赞了此笔记
const getIsLikedNote = async (user_id: number, object_id: number) => {
  const response = await authAxios.post("/api/book/like/note/isLiked", { user_id: user_id, object_id: object_id });
  return response.data;
}
// 查询我是否点赞了此评论
const getIsLikedComment = async (user_id: number, object_id: number) => {
  const response = await authAxios.post("/api/book/like/comment/isLiked", { user_id: user_id, object_id: object_id });
  return response.data;
}
// 查询我是否点赞了此回复
const getIsLikedReply = async (user_id: number, object_id: number) => {
  const response = await authAxios.post("/api/book/like/reply/isLiked", { user_id: user_id, object_id: object_id });
  return response.data;
}
// 查询我是否收藏了此笔记本
const getIsMarkedBook = async (user_id: number, object_id: number) => {
  const response = await authAxios.post("/api/book/mark/book/isMarked", { user_id: user_id, object_id: object_id });
  return response.data;
}
// 查询我是否收藏了此笔记
const getIsMarkedNote = async (user_id: number, object_id: number) => {
  const response = await authAxios.post("/api/book/mark/note/isMarked", { user_id: user_id, object_id: object_id });
  return response.data;
}

export {
  getAllPublicBooks,
  getAllPublicNotes,
  searchAllPublicBooks,
  searchAllPublicNotes,
  getUserPublicBooks,
  getMyBook,
  getMyBooks,
  getMyBookNotes,
  getMyNote,
  getBookComments,
  getNoteComments,
  getCommentReplies,
  getBookLikes,
  getBookMarks,
  getNoteCommentsCount,
  getBookNotesCount,
  getBookCommentsCount,
  getNoteLikes,
  getNoteMarks,
  getCommentLikes,
  getCommentRepliesCount,
  getReplyLikes,
  createBook,
  updateBook,
  deleteBook,
  createNote,
  updateNote,
  deleteNote,
  getMyDeletedBooks,
  getMyDeletedNotes,
  recoverMyDeletedBook,
  recoverMyDeletedNote,
  createBookComment,
  createNoteComment,
  createCommentReply,
  createReplyReply,
  getIsMyComment,
  getIsMyReply,
  deleteMyComment,
  deleteMyReply,
  likeBook,
  unlikeBook,
  likeNote,
  unlikeNote,
  likeComment,
  unlikeComment,
  likeReply,
  unlikeReply,
  markBook,
  unmarkBook,
  markNote,
  unmarkNote,
  getIsLikedBook,
  getIsLikedNote,
  getIsLikedComment,
  getIsLikedReply,
  getIsMarkedBook,
  getIsMarkedNote,
}
