/* eslint-disable @typescript-eslint/no-explicit-any */
import { getMyDeletedBooks, getMyDeletedNotes, recoverMyDeletedBook, recoverMyDeletedNote } from "@/api/bookApi"
import { List, Button, Pagination, Tag, Typography, message } from "antd";
import { useEffect, useState } from "react";
import dayjs from "dayjs";
import { useUserStore } from "@/stores/userStore";

interface MergedItem {
  id: number;
  type: 'book' | 'note';
  name: string;
  username: string;
  update_time: string;
}

const UserTemp = () => {
  const { user_id } = useUserStore((state) => state.user);
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(false);
  const [mergedData, setMergedData] = useState<MergedItem[]>([]);

  const fetchData = async () => {
    try {
      setLoading(true);
      const [booksRes, notesRes] = await Promise.all([
        getMyDeletedBooks(user_id, currentPage, pageSize),
        getMyDeletedNotes(user_id, currentPage, pageSize)
      ]);

      const books = booksRes.data?.data?.map((book: { book_id: any; book_name: any; user_name: any; update_time: any; }) => ({
        id: book.book_id,
        type: 'book',
        name: book.book_name,
        username: book.user_name,
        update_time: book.update_time
      })) ?? [];

      const notes = notesRes.data?.data?.map((note: { note_id: any; note_name: any; user_name: any; update_time: any; }) => ({
        id: note.note_id,
        type: 'note',
        name: note.note_name,
        username: note.user_name,
        update_time: note.update_time
      })) ?? [];

      const merged = [...books, ...notes]
        .sort((a, b) => dayjs(b.update_time).unix() - dayjs(a.update_time).unix());

      setMergedData(merged);
      setTotal(booksRes.data.total + notesRes.data.total);
    } finally {
      setLoading(false);
    }
  };

  const handleRecover = async (item: MergedItem) => {
    try {
      if (item.type === 'book') {
        await recoverMyDeletedBook(item.id);
      } else {
        await recoverMyDeletedNote(item.id);
      }
      fetchData();
      message.success('恢复成功');
    } catch (error) {
      console.error('恢复失败:', error);
      message.error('恢复失败');
    }
  };

  useEffect(() => {
    fetchData();
  }, [currentPage, pageSize]);

  return (
    <div style={{ padding: 24 }}>
      <List
        loading={loading}
        dataSource={mergedData}
        renderItem={(item) => (
          <List.Item
            actions={[
              <Button
                type="link"
                onClick={() => handleRecover(item)}
                key="recover"
              >
                恢复
              </Button>
            ]}
          >
            <List.Item.Meta
              title={<>
                <Tag color={item.type === 'book' ? 'blue' : 'green'}>{item.type === 'book' ? '笔记本' : '笔记'}</Tag>
                <Typography.Text strong>{item.name}</Typography.Text>
              </>}
              description={`最后更新：${dayjs(item.update_time).format('YYYY-MM-DD HH:mm')}`}
            />
          </List.Item>
        )}
      />
      <Pagination
        current={currentPage}
        pageSize={pageSize}
        total={total}
        onChange={(page, size) => {
          setCurrentPage(page);
          setPageSize(size);
        }}
        showTotal={(total) => `共 ${total} 条`}
        style={{ marginTop: 16, textAlign: 'right' }}
      />
    </div>
  );
};

export default UserTemp;
