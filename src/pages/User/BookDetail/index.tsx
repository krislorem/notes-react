import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Card, List, Pagination, Switch, Row, Col, Button, Tag, Empty, FloatButton, message } from 'antd';
import { EyeOutlined, DeleteOutlined, CommentOutlined, LikeOutlined, LikeFilled, HeartOutlined, HeartFilled } from '@ant-design/icons';
import { getMyBookNotes, deleteNote, getIsLikedBook, likeBook, unlikeBook, getIsMarkedBook, markBook, unmarkBook } from '@/api/bookApi';
import BookComments from '@/components/BookComments';
import { useUserStore } from '@/stores/userStore';
type NoteType = {
  user_id: number;
  user_name: string;
  avatar: string;
  note_id: number;
  note_name: string;
  content: string;
  create_time: string;
  tags: string[];
};

const UserBookDetail = () => {
  const { bookId } = useParams();
  const { user_id } = useUserStore(state => state.user);
  const [notes, setNotes] = useState<NoteType[]>([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [total, setTotal] = useState(0);
  const [isGridLayout, setIsGridLayout] = useState(true);
  const [commentsVisible, setCommentsVisible] = useState(false);
  const [isLiked, setIsLiked] = useState(false);
  const [isMarked, setIsMarked] = useState(false);
  const navigate = useNavigate();
  useEffect(() => {
    const checkLikeStatus = async () => {
      try {
        const res = await getIsLikedBook(user_id, Number(bookId));
        setIsLiked(res.data.data);
      } catch (error) {
        console.error('获取点赞状态失败:', error);
      }
    };
    const checkMarkStatus = async () => {
      try {
        const res = await getIsMarkedBook(user_id, Number(bookId));
        setIsMarked(res.data.data);
      } catch (error) {
        console.error('获取收藏状态失败:', error);
      }
    }
    checkLikeStatus();
    checkMarkStatus();
  }, [bookId]);

  const handleLike = async () => {
    try {
      if (isLiked) {
        await unlikeBook(user_id, Number(bookId));
        message.success('取消点赞成功');
      } else {
        await likeBook(user_id, Number(bookId));
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
        await unmarkBook(user_id, Number(bookId));
        message.success('取消收藏成功');
      } else {
        await markBook(user_id, Number(bookId));
        message.success('收藏成功');
      }
      setIsMarked(!isMarked);
    } catch (error) {
      console.error('操作失败:', error);
    }
  }
  useEffect(() => {
    const loadNotes = async () => {
      try {
        if (bookId) {
          setLoading(true);
          const { data } = await getMyBookNotes(Number(bookId), currentPage, 20);
          setNotes(data.data || []);
          setTotal(data.total);
        }
      } catch (error) {
        console.error('数据加载失败:', error);
        setNotes([]);
      } finally {
        setLoading(false);
      }
    };
    loadNotes();
  }, [bookId, currentPage]);

  return (
    <div style={{ padding: 20 }}>
      <FloatButton.Group shape="circle" style={{ position: 'absolute', right: 24, top: 10, height: '30%' }}>
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
      </FloatButton.Group>
      <BookComments
        visible={commentsVisible}
        onClose={() => setCommentsVisible(false)}
        book_id={Number(bookId)}
      />
      <div style={{ marginBottom: 16, display: 'flex', justifyContent: 'space-between' }}>
        <Switch
          checkedChildren="网格"
          unCheckedChildren="列表"
          checked={isGridLayout}
          onChange={setIsGridLayout}
        />
        <Pagination
          current={currentPage}
          pageSize={20}
          total={total}
          onChange={page => setCurrentPage(page)}
        />
      </div>
      {(notes?.length === 0 && !loading) ? (
        <div style={{ marginTop: 80 }}>
          <Empty description="暂无笔记数据" />
        </div>
      ) : isGridLayout ? (
        <Row gutter={[16, 16]}>
          {notes.map(note => (
            <Col key={note.note_id} xs={24} sm={12} md={8} lg={6} xl={4}>
              <Card
                title={note.note_name}
                actions={[
                  <div key={note.note_id}>
                    <Button style={{ marginRight: 10 }}><EyeOutlined key="view" onClick={() => navigate(`/my/note/detail/${note.note_id}`)} /></Button>
                    <Button><DeleteOutlined key="delete" onClick={async () => {
                      try {
                        await deleteNote(note.note_id);
                        const { data } = await getMyBookNotes(Number(bookId), currentPage, 20);
                        setNotes(data.data || []);
                        setTotal(data.total);
                        message.success('删除成功');
                      } catch (error) {
                        console.error('删除失败:', error);
                        message.error('删除失败');
                      }
                    }} /></Button>
                  </div>
                ]}
              >
                <div style={{ height: 100, overflow: 'hidden' }}>
                  {note.content.replace(/(> |\n)/g, ' ').substring(0, 80)}
                </div>
                <div style={{ marginTop: 8 }}>
                  {note.tags.map(tag => (
                    <Tag key={tag} color="blue">{tag}</Tag>
                  ))}
                </div>
                <div style={{ marginTop: 8 }}>
                  <img onClick={() => navigate(`/my/info/${note.user_id}`)} src={note.avatar} alt="avatar" style={{ width: 24, height: 24, borderRadius: '50%', marginRight: 8 }} />
                  <span>{note.user_name}</span>
                </div>
                <div style={{ marginTop: 8, color: '#999' }}>
                  创建时间：{new Date(note.create_time).toLocaleDateString()}
                </div>
              </Card>
            </Col>
          ))}
        </Row>
      ) : (
        <List
          itemLayout="horizontal"
          dataSource={notes}
          renderItem={note => (
            <List.Item
              actions={[
                <div key={note.note_id}>
                  <Button
                    key="view"
                    icon={<EyeOutlined />}
                    style={{ marginRight: 10 }}
                    onClick={() => navigate(`/my/note/detail/${note.note_id}`)}
                  />

                  <Button danger icon={<DeleteOutlined />} onClick={async () => {
                    try {
                      await deleteNote(note.note_id);
                      const { data } = await getMyBookNotes(Number(bookId), currentPage, 20);
                      setNotes(data.data || []);
                      setTotal(data.total);
                      message.success('删除成功');
                    } catch (error) {
                      console.error('删除失败:', error);
                      message.error('删除失败');
                    }
                  }} />
                </div>
              ]}
            >
              <List.Item.Meta
                title={note.note_name}
                description={
                  <div>
                    <div>{note.content.replace(/(> |\n)/g, ' ').substring(0, 80)}</div>
                    <div style={{ marginTop: 8 }}>
                      {note.tags.map(tag => (
                        <Tag key={tag} color="blue">{tag}</Tag>
                      ))}
                    </div>
                    <div style={{ marginTop: 8 }}>
                      <img src={note.avatar} onClick={() => navigate(`/my/info/${note.user_id}`)} alt="avatar" style={{ width: 24, height: 24, borderRadius: '50%', marginRight: 8 }} />
                      <span>{note.user_name}</span>
                    </div>
                    <div style={{ marginTop: 8, color: '#999' }}>
                      创建时间：{new Date(note.create_time).toLocaleDateString()}
                    </div>
                  </div>
                }
              />
            </List.Item>
          )}
        />
      )}
    </div>
  );
};

export default UserBookDetail;
