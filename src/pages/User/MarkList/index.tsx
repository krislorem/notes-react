/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
import { useState, useEffect } from 'react';
import { List, Avatar, Pagination, Button, message, Empty, Tag, Typography } from 'antd';
import { useUserStore } from '@/stores/userStore';
import dayjs from 'dayjs';
import { useNavigate } from 'react-router-dom';
import { getUserFavoriteNotebooks, getUserFavoriteNotes } from '@/api/userApi';
import { unmarkBook, unmarkNote } from '@/api/bookApi';
import { HeartOutlined, EyeOutlined } from '@ant-design/icons';

const UserMarkList = () => {
  const [data, setData] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [pageNum, setPageNum] = useState(1);
  const [total, setTotal] = useState(0);
  const pageSize = 10;
  const user = useUserStore(state => state.user);
  const navigate = useNavigate();
  const loadData = async () => {
    try {
      setLoading(true);
      const [notebooksRes, notesRes] = await Promise.all([
        getUserFavoriteNotebooks(user.user_id, pageNum, pageSize),
        getUserFavoriteNotes(user.user_id, pageNum, pageSize)
      ]);

      const books = notebooksRes.data?.data?.map((book: { book_id: any; book_name: any; user_name: any; avatar: string, update_time: any; }) => ({
        id: book.book_id,
        type: 'book',
        name: book.book_name,
        avatar: book.avatar,
        username: book.user_name,
        update_time: book.update_time
      })) ?? [];

      const notes = notesRes.data?.data?.map((note: { note_id: any; note_name: any; user_name: any; avatar: string, update_time: any; }) => ({
        id: note.note_id,
        type: 'note',
        name: note.note_name,
        avatar: note.avatar,
        username: note.user_name,
        update_time: note.update_time
      })) ?? [];

      const merged = [...books, ...notes]
        .sort((a, b) => dayjs(b.update_time).unix() - dayjs(a.update_time).unix());

      setData(merged);
      console.log(merged);
      setTotal(notebooksRes.data.total + notesRes.data.total);
    } catch (error) {
      message.error('数据加载失败');
    } finally {
      setLoading(false);
    }
  };

  const handleUnmark = async (item: any) => {
    try {
      if (item.type === 'book') {
        await unmarkBook(user.user_id, item.id);
      } else {
        await unmarkNote(user.user_id, item.id);
      }
      message.success('取消收藏成功');
      loadData();
    } catch (error) {
      message.error('操作失败');
    }
  };

  useEffect(() => {
    loadData();
  }, [pageNum]);

  return (
    <div style={{ padding: 20 }}>
      <List
        itemLayout="horizontal"
        dataSource={data}
        loading={loading}
        locale={{
          emptyText: !loading && data.length === 0 ? (
            <div style={{ padding: '40px 0' }}>
              <Empty image={Empty.PRESENTED_IMAGE_SIMPLE} description="暂无收藏数据" />
            </div>
          ) : undefined
        }}
        renderItem={item => (
          <List.Item
            actions={[
              <Button
                key='unmark'
                danger
                icon={<HeartOutlined />}
                onClick={() => handleUnmark(item)}
              >
                取消收藏
              </Button>
            ]}
          >
            <List.Item.Meta
              avatar={<Avatar src={item.avatar} />}
              title={<>
                <Tag color={item.type === 'book' ? 'blue' : 'green'}>{item.type === 'book' ? '笔记本' : '笔记'}</Tag>
                <Typography.Text strong>{item.name}</Typography.Text>
              </>}
              description={`收藏时间: ${dayjs(item.create_time).format('YYYY-MM-DD HH:mm')}`}
            />
            <div style={{ marginRight: 20 }}>{item.username}</div>
            <Button icon={<EyeOutlined />} onClick={() => navigate(item.type === 'book' ? `/my/book/detail/${item.id}` : `/my/note/detail/${item.id}`)}></Button>
          </List.Item>
        )}
      />
      {total > 0 && (
        <Pagination
          current={pageNum}
          pageSize={pageSize}
          total={total}
          onChange={page => setPageNum(page)}
          style={{ marginTop: 20, textAlign: 'center' }}
        />
      )}
    </div>
  );
};

export default UserMarkList;
