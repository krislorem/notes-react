/* eslint-disable @typescript-eslint/no-unused-vars */
import { getMyNote, getIsLikedNote, likeNote, unlikeNote, getIsMarkedNote, markNote, unmarkNote } from "@/api/bookApi"
import { useEffect, useState } from "react"
import { Tag, FloatButton, message } from "antd"
import { CommentOutlined, LikeOutlined, LikeFilled, HeartOutlined, HeartFilled, GlobalOutlined } from "@ant-design/icons"
import { useParams, useNavigate } from "react-router-dom"
import NoteReader from "@/components/NoteReader"
import NoteComments from "@/components/NoteComments"
import { useUserStore } from "@/stores/userStore"

const UserNoteDetail = () => {
  const [commentsVisible, setCommentsVisible] = useState(false)
  const { noteId } = useParams()
  const [data, setData] = useState({
    note_name: '',
    tags: [],
    content: '',
  })
  const [isLiked, setIsLiked] = useState(false);
  const [isMarked, setIsMarked] = useState(false);
  const navigate = useNavigate();
  const { user_id } = useUserStore(state => state.user);
  useEffect(() => {
    const checkLikeStatus = async () => {
      try {
        const res = await getIsLikedNote(user_id, Number(noteId));
        setIsLiked(res.data.data);
      } catch (error) {
        console.error('获取点赞状态失败:', error);
      }
    };
    const checkMarkStatus = async () => {
      try {
        const res = await getIsMarkedNote(user_id, Number(noteId));
        setIsMarked(res.data.data);
      } catch (error) {
        console.error('获取收藏状态失败:', error);
      }
    }
    checkLikeStatus();
    checkMarkStatus();
  }, [noteId]);

  const handleLike = async () => {
    try {
      if (isLiked) {
        await unlikeNote(user_id, Number(noteId));
        message.success('取消点赞成功');
      } else {
        await likeNote(user_id, Number(noteId));
        message.success('点赞成功');
      }
      setIsLiked(!isLiked);
    } catch (error) {
      console.error('操作失败:', error);
    }
  };
  const handleMarkNote = async () => {
    try {
      if (isMarked) {
        await unmarkNote(user_id, Number(noteId));
        message.success('取消收藏成功');
      } else {
        await markNote(user_id, Number(noteId));
        message.success('收藏成功');
      }
      setIsMarked(!isMarked);
    } catch (error) {
      console.error('操作失败:', error);
    }
  }
  useEffect(() => {
    try {
      const fetchData = async () => {
        const res = await getMyNote(Number(noteId))
        setData(res.data.data)
      }
      fetchData()
    } catch (error) {
      console.error('获取笔记详情失败:', error)
    }
  }, [])
  return (
    <div style={{ marginBottom: 24 }}>
      <FloatButton.Group shape="circle" style={{ position: 'absolute', right: 80, top: 30, height: '30%' }}>
        <FloatButton tooltip={{ title: "评论", placement: "left" }} icon={<CommentOutlined />} onClick={() => setCommentsVisible(true)} />
        <FloatButton
          tooltip={{ title: isLiked ? "取消点赞" : "点赞", placement: "left" }}
          icon={isLiked ? <LikeFilled /> : <LikeOutlined />}
          onClick={handleLike}
        />
        <FloatButton
          tooltip={{ title: isMarked ? "取消收藏" : "收藏", placement: "left" }}
          icon={isMarked ? <HeartFilled /> : <HeartOutlined />}
          onClick={handleMarkNote}
        />
        <FloatButton
          tooltip={{ title: "翻译", placement: "left" }}
          icon={<GlobalOutlined />}
          onClick={() => {
            navigate(`/ai/${noteId}`)
          }}
        />
      </FloatButton.Group>
      <NoteComments
        visible={commentsVisible}
        onClose={() => setCommentsVisible(false)}
        note_id={Number(noteId)}
      />
      <h1 style={{ fontSize: '24px', marginBottom: 16 }}>{data.note_name}</h1>
      <div style={{ marginBottom: 20 }}>{data.tags.map((tag, _index) => (
        // 为避免使用数组索引作为 key，使用 tag 本身的值作为 key，前提是 tag 具有唯一性
        <Tag key={tag} color="blue" style={{ marginRight: 8 }}>{tag}</Tag>
      ))}</div>
      <NoteReader content={data.content} />
    </div>
  )
}

export default UserNoteDetail


