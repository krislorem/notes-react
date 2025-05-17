/* eslint-disable @typescript-eslint/no-explicit-any */

import { useEffect, useState } from 'react';
import CommentInput from '../CommentInput';
import { getNoteComments, createNoteComment, likeComment, unlikeComment } from '@/api/bookApi';
import { useUserStore } from '@/stores/userStore';
import { LikeOutlined, LikeFilled } from '@ant-design/icons';
import { Modal, List, Avatar, Skeleton, Pagination, message } from 'antd';
import './index.css'
const NoteComments = ({ note_id, visible, onClose }: {
  note_id: number;
  visible: boolean;
  onClose: () => void;
}) => {
  const [comments, setComments] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize] = useState(10);
  const [total, setTotal] = useState(0);
  const user = useUserStore(state => state.user);

  const loadComments = async () => {
    try {
      setLoading(true);
      const { data } = await getNoteComments(note_id, user.user_id, currentPage, pageSize);
      console.log(data.data)
      setComments(data.data || []);
      setTotal(data.total || 0);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (visible) {
      loadComments();
    }
  }, [visible, currentPage]);

  const handleSubmit = async (content: string) => {
    if (!user) return;
    console.log({ content, user_id: user.user_id, note_id })
    await createNoteComment(content, user.user_id, note_id);
    await loadComments();
  };
  const handleLikeComment = async (comment_id: number, is_liked: number) => {
    if (!user) return;
    console.log(comment_id, is_liked)
    if (is_liked === 1) {
      await unlikeComment(user.user_id, comment_id);
      message.success('取消点赞成功');
      await loadComments();
    } else {
      await likeComment(user.user_id, comment_id);
      message.success('点赞成功');
      await loadComments();
    }
  }
  return (
    <Modal
      title="评论"
      width={800}
      style={{ maxHeight: '70vh', overflowY: 'scroll', borderRadius: '10px' }}
      className='comment-modal'
      open={visible}
      onCancel={onClose}
      footer={null}
    >
      <List
        itemLayout="horizontal"
        dataSource={comments}
        renderItem={item => (
          <List.Item>
            <List.Item.Meta
              avatar={<Avatar src={item.avatar} />}
              title={<span>{item.user_name}</span>}
              description={<>
                <div>{item.content}</div>
                <div onClick={() => handleLikeComment(item.comment_id, item.is_liked)} style={{ marginTop: 8, cursor: 'pointer' }}> {item.is_liked === 1 ? <LikeOutlined /> : <LikeFilled />} {item.like_count}</div>
              </>}
            />
          </List.Item>
        )}
      />
      {loading && <Skeleton active />}
      <Pagination
        current={currentPage}
        pageSize={pageSize}
        total={total}
        onChange={page => setCurrentPage(page)}
        style={{ marginTop: 16, textAlign: 'center' }}
      />
      <div style={{ marginTop: 24 }} className='comment-input-container' >
        <CommentInput onSend={handleSubmit} />
      </div>
    </Modal>
  );
};

export default NoteComments;
