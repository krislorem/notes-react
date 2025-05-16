
import { searchAllPublicBooks } from "@/api/bookApi"
import { useEffect, useState } from "react"
import { Card, List, Pagination, Button, Switch, Row, Col, Empty, Form, Input, Space } from "antd"
import { useNavigate } from "react-router-dom"
import { LikeOutlined, StarOutlined, CommentOutlined, EyeOutlined } from "@ant-design/icons"

const SearchPageBooks = () => {
  const [form] = Form.useForm();
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [isGridLayout, setIsGridLayout] = useState(true);
  const [pagination, setPagination] = useState({ current: 1, pageSize: 12, total: 0 });
  const navigate = useNavigate();

  // 为参数 values 显式指定类型，假设 values 是一个包含 keyword 字段的对象
  const handleSearch = async (values: { keyword?: string }) => {
    setLoading(true);
    try {
      const { data } = await searchAllPublicBooks(
        values.keyword || '',
        pagination.current,
        pagination.pageSize
      );
      setResults(data.data || []);
      setPagination(prev => ({ ...prev, total: data.total || 0 }));
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    form.submit();
  }, [pagination.current]);

  return (
    <div className="container mx-auto p-4">
      <Form form={form} layout="vertical" onFinish={handleSearch}>
        <Space wrap>
          <Form.Item name="keyword" label="关键词">
            <Input placeholder="输入搜索关键词" />
          </Form.Item>
          <Button type="primary" htmlType="submit">搜索</Button>
        </Space>
      </Form>

      <div style={{ margin: '20px 0', display: 'flex', justifyContent: 'space-between' }}>
        <Switch
          checkedChildren="网格"
          unCheckedChildren="列表"
          checked={isGridLayout}
          onChange={setIsGridLayout}
        />
        <Pagination
          current={pagination.current}
          pageSize={pagination.pageSize}
          total={pagination.total}
          onChange={(page) => setPagination(prev => ({ ...prev, current: page }))}
        />
      </div>

      {results.length === 0 && !loading ? (
        <div style={{ marginTop: 80 }}>
          <Empty description="暂无搜索结果" />
        </div>
      ) : isGridLayout ? (
        <Row gutter={[16, 16]} style={{ marginTop: 16 }}>
          {results.map(book => (
            <Col key={book.book_id} xs={24} sm={12} md={8} lg={6} xl={4}>
              <Card
                cover={<img alt="封面" src={book.cover} style={{ height: 200, objectFit: 'cover' }} />}
                actions={[
                  <EyeOutlined key="view" onClick={() => navigate(`/my/book/detail/${book.book_id}`)} />,
                  <span key="like"><LikeOutlined style={{ marginRight: 8 }} /> {book.like_count}</span>,
                  <span key="collect"><StarOutlined style={{ marginRight: 8 }} /> {book.mark_count}</span>,
                  <span key="comment"><CommentOutlined style={{ marginRight: 8 }} /> {book.comment_count}</span>
                ]}
              >
                <Card.Meta
                  title={book.book_name}
                />
                <div style={{ marginTop: 8 }}>
                  <img
                    alt="avatar"
                    src={book.avatar}
                    onClick={() => navigate(`/my/info/${book.user_id}`)}
                    style={{ width: 24, height: 24, borderRadius: '50%', marginRight: 8, cursor: 'pointer' }}
                  />
                  <span style={{ color: '#999' }}>
                    {new Date(book.create_time).toLocaleDateString()}
                  </span>
                </div>
              </Card>
            </Col>
          ))}
        </Row>
      ) : (
        <List
          itemLayout="horizontal"
          dataSource={results}
          renderItem={book => (
            <List.Item
              actions={[
                <Button
                  key={'view'}
                  icon={<EyeOutlined />}
                  onClick={() => navigate(`/book/detail/${book.book_id}`)}
                />,
                <span key="like"><LikeOutlined style={{ marginRight: 8 }} /> {book.like_count}</span>,
                <span key="collect"><StarOutlined style={{ marginRight: 8 }} /> {book.mark_count}</span>,
                <span key="comment"><CommentOutlined style={{ marginRight: 8 }} /> {book.comment_count}</span>
              ]}
            >
              <List.Item.Meta
                avatar={<img alt="cover" src={book.cover} style={{ width: 100, height: 60, objectFit: 'cover' }} />}
                title={book.book_name}
                description={
                  <div>
                    <div>{book.book_intro || '暂无介绍'}</div>
                    <div style={{ display: 'flex', alignItems: 'center', marginTop: 8 }}>
                      <img
                        alt="avatar"
                        src={book.avatar}
                        onClick={() => navigate(`/my/info/${book.user_id}`)}
                        style={{ width: 24, height: 24, borderRadius: '50%', marginRight: 8, cursor: 'pointer' }}
                      />
                      <span style={{ color: '#999' }}>
                        {new Date(book.create_time).toLocaleDateString()}
                      </span>
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

export default SearchPageBooks;
