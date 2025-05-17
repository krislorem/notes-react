/* eslint-disable @typescript-eslint/no-explicit-any */
import { useState } from 'react';
import { Button, Form, Input, Select, Space, Switch, Pagination, Row, Col, Card, Tag, List, Empty } from 'antd';
import { EyeOutlined, LikeOutlined, StarOutlined, CommentOutlined } from '@ant-design/icons';
import { searchAllPublicNotes } from '@/api/bookApi';
import { useNavigate } from 'react-router-dom';

const SearchPage = () => {
  const [form] = Form.useForm();
  type Note = {
    user_id: number;
    note_id: number;
    note_name: string;
    tags: string[];
    content: string;
    avatar: string;
    like_count: number;
    mark_count: number;
    comment_count: number;
    create_time: string;
  };
  const [results, setResults] = useState<Note[]>([]);
  const [loading, setLoading] = useState(false);
  const [isGridLayout, setIsGridLayout] = useState(true);
  const [pagination, setPagination] = useState({ current: 1, pageSize: 12, total: 0 });
  const navigate = useNavigate();

  // 为解决参数“values”隐式具有“any”类型的问题，这里为其添加一个宽泛的对象类型注解
  const handleSearch = async (values: { [key: string]: any }) => {
    setLoading(true);
    try {
      const { data } = await searchAllPublicNotes(
        values.keyword || '',
        values.book_name || '',
        values.tags || [],
        pagination.current,
        pagination.pageSize
      );
      setResults(data.data || []);
      const total = data.total || 0;
      setPagination(prev => ({ ...prev, total }));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container mx-auto p-4">
      <Form form={form} layout="vertical" onFinish={handleSearch}>
        <Space wrap>
          <Form.Item name="keyword" label="关键词">
            <Input placeholder="输入搜索关键词" />
          </Form.Item>
          <Form.Item name="book_name" label="笔记本名称">
            <Input placeholder="输入笔记本名称" />
          </Form.Item>
          <Form.Item name="tags" label="标签">
            <Select
              mode="tags"
              placeholder="添加多个标签"
              tokenSeparators={[',']}
              style={{ width: 200 }}
            />
          </Form.Item>
          <Button type="primary" htmlType="submit">搜索</Button>
        </Space>
      </Form>
      <div>
        <Button onClick={() => navigate('/book-search')}>搜索笔记本</Button>
      </div>
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
          onChange={(page) => {
            setPagination(prev => ({ ...prev, current: page }));
            form.submit();
          }}
        />
      </div>

      {results.length === 0 && !loading ? (
        <div style={{ marginTop: 80 }}>
          <Empty description="暂无搜索结果" />
        </div>
      ) : isGridLayout ? (
        <Row gutter={[16, 16]} style={{ marginTop: 16 }}>
          {results.map(item => (
            <Col key={item.note_id} xs={24} sm={12} md={8} lg={6} xl={4}>
              <Card
                actions={[
                  <EyeOutlined key="view" onClick={() => navigate(`/my/note/detail/${item.note_id}`)} />,
                  <span key="like"><LikeOutlined style={{ marginRight: 8 }} /> {item.like_count}</span>,
                  <span key="collect"><StarOutlined style={{ marginRight: 8 }} /> {item.mark_count}</span>,
                  <span key="comment"><CommentOutlined style={{ marginRight: 8 }} /> {item.comment_count}</span>
                ]}
              >
                <Card.Meta
                  title={item.note_name}
                  description={
                    <div style={{ height: 100, overflow: 'hidden' }}>
                      {(item.content?.replace(/(> |)/g, ' ') ?? '无内容').substring(0, 80)}
                    </div>
                  }
                />
                <div style={{ marginTop: 8 }}>
                  {item.tags?.map((tag: string) => (
                    <Tag key='tags' color="blue">{tag}</Tag>
                  ))}
                </div>
                <div style={{ display: 'flex', alignItems: 'center', marginTop: 8 }}>
                  <img
                    alt="avatar"
                    onClick={() => navigate(`/my/info/${item.user_id}`)}
                    src={item.avatar}
                    style={{ width: 24, height: 24, borderRadius: '50%', marginRight: 8, cursor: 'pointer' }}
                  />
                  <span style={{ color: '#999' }}>
                    {new Date(item.create_time).toLocaleDateString()}
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
          renderItem={item => (
            <List.Item
              actions={[
                <Button
                  key={'view'}
                  icon={<EyeOutlined />}
                  onClick={() => navigate(`/my/note/detail/${item.note_id}`)}
                />,
                <span key="like"><LikeOutlined style={{ marginRight: 8 }} /> {item.like_count}</span>,
                <span key="collect"><StarOutlined style={{ marginRight: 8 }} /> {item.mark_count}</span>,
                <span key="comment"><CommentOutlined style={{ marginRight: 8 }} /> {item.comment_count}</span>
              ]}
            >
              <List.Item.Meta
                title={item.note_name}
                description={
                  <div>
                    <div style={{ textOverflow: 'ellipsis', overflow: 'hidden', WebkitLineClamp: 2 }}>
                      {item.content?.replace(/(> |)/g, ' ') ?? '无内容'}
                    </div>
                    <div style={{ marginTop: 8 }}>
                      {item.tags?.map((tag: string) => (
                        <Tag key='tags' color="blue">{tag}</Tag>
                      ))}
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', marginTop: 8 }}>
                      <img
                        alt="avatar"
                        onClick={() => navigate(`/my/info/${item.user_id}`)}
                        src={item.avatar}
                        style={{ width: 24, height: 24, borderRadius: '50%', marginRight: 8, cursor: 'pointer' }}
                      />
                      <span style={{ color: '#999' }}>
                        {new Date(item.create_time).toLocaleDateString()}
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

export default SearchPage;
