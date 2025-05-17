/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
import { getAllPublicBooks, getAllPublicNotes } from "@/api/bookApi"
import { useEffect, useState } from "react"
import { Tag, Button, Card, Col, Row, Switch, Pagination, List } from "antd"
import { EyeOutlined, LikeOutlined, StarOutlined, CommentOutlined } from '@ant-design/icons';
import { useNavigate } from "react-router-dom"
const ExploreLayout = () => {
  const [dataType, setDataType] = useState<'book' | 'note'>('book');
  const [currentPage, setCurrentPage] = useState(1);
  const [isGridLayout, setIsGridLayout] = useState(true);
  const [data, setData] = useState<any[]>([]);
  const [_loading, setLoading] = useState(false);
  const [totalCount, setTotalCount] = useState(0);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchData = async () => {
      const api = dataType === 'book' ? getAllPublicBooks : getAllPublicNotes;
      try {
        setLoading(true);
        setData([]);
        const { data } = await api(currentPage, 20);
        setData(data.data);
        setTotalCount(data.total);
      } catch (error) {
        console.error('数据加载失败:', error);
        setData([]);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [dataType, currentPage]);

  return (
    <div style={{ padding: 20 }}>
      <div style={{
        marginBottom: 16,
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center'
      }}>
        <div>
          <Button
            type={dataType === 'book' ? 'primary' : 'default'}
            onClick={() => {
              setDataType('book');
              setCurrentPage(1);
            }}
          >
            笔记本
          </Button>
          <Button
            type={dataType === 'note' ? 'primary' : 'default'}
            onClick={() => {
              setDataType('note');
              setCurrentPage(1);
            }}
            style={{ marginLeft: 8 }}
          >
            笔记
          </Button>
        </div>

        <div style={{ display: 'flex', alignItems: 'center' }}>
          <Switch
            checkedChildren="网格"
            unCheckedChildren="列表"
            checked={isGridLayout}
            onChange={setIsGridLayout}
            style={{ marginRight: 16 }}
          />
          <Pagination
            current={currentPage}
            pageSize={20}
            total={totalCount}
            onChange={page => setCurrentPage(page)}
          />
        </div>
      </div>

      {isGridLayout ? (
        <Row gutter={[16, 16]}>
          {data.map(item => dataType === 'book' ? (
            <Col key={`book-${item.book_id}`} xs={24} sm={12} md={8} lg={6} xl={4}>
              <Card
                cover={<img alt="封面" src={item.cover} style={{ height: 200, objectFit: 'cover' }} />}
                actions={[
                  <EyeOutlined key="view" onClick={() => navigate(`/my/book/detail/${item.book_id}`)} />,
                  <span key="like"><LikeOutlined style={{ marginRight: 8 }} /> {item.like_count}</span>,
                  <span key="collect"><StarOutlined style={{ marginRight: 8 }} /> {item.mark_count}</span>,
                  <span key="comment"><CommentOutlined style={{ marginRight: 8 }} /> {item.comment_count}</span>
                ]}
              >
                <Card.Meta
                  title={item.book_name}
                  description={
                    <div style={{ display: 'flex', alignItems: 'center', marginTop: 8 }}>
                      <img
                        alt="avatar"
                        src={item.avatar}
                        onClick={() => navigate(`/my/info/${item.user_id}`)}
                        style={{
                          width: 24,
                          height: 24,
                          borderRadius: '50%',
                          marginRight: 8,
                          cursor: 'pointer'
                        }}
                      />
                      <span>{item.user_name}</span>
                    </div>
                  }
                />
                <div style={{ color: '#999', marginTop: 8 }}>
                  {new Date(item.create_time).toLocaleDateString()}
                </div>
              </Card>
            </Col>
          ) : (
            <Col key={`note-${item.note_id}`} xs={24} sm={12} md={8} lg={6} xl={4}>
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
                    <div style={{
                      height: 100,
                      overflow: 'hidden',
                      textOverflow: 'ellipsis',
                      WebkitLineClamp: 3,
                      WebkitBoxOrient: 'vertical',
                      display: '-webkit-box'
                    }}>
                      {(item.content?.replace(/(> |)/g, ' ') ?? '无内容').substring(0, 80)}
                    </div>
                  }
                />
                <div style={{ marginTop: 8 }}>
                  {item.tags?.map((tag: string) => (
                    <Tag key={tag} color="blue">{tag}</Tag>
                  ))}
                </div>
                <div style={{ display: 'flex', alignItems: 'center', marginTop: 8 }}>
                  <img
                    alt="avatar"
                    src={item.avatar}
                    onClick={() => navigate(`/my/info/${item.user_id}`)}
                    style={{
                      width: 24,
                      height: 24,
                      borderRadius: '50%',
                      marginRight: 8,
                      cursor: 'pointer'
                    }}
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
          dataSource={data}
          renderItem={item => dataType === 'book' ? (
            <List.Item
              key={`note-${item.note_id}`}
              actions={[
                <Button key="view" onClick={() => navigate(`/my/note/detail/${item.note_id}`)} icon={<EyeOutlined />} />,
                <span key="like" ><LikeOutlined style={{ marginRight: 8 }} /> {item.like_count}</span>,
                <span key="collect"><StarOutlined style={{ marginRight: 8 }} /> {item.mark_count}</span>,
                <span key="comment"><CommentOutlined style={{ marginRight: 8 }} /> {item.comment_count}</span>
              ]}
            >
              <List.Item.Meta
                avatar={<img alt="cover" src={item.cover} style={{ width: 100, height: 60, objectFit: 'cover' }} />}
                title={item.book_name}
                description={
                  <div style={{ display: 'flex', alignItems: 'center' }}>
                    <img
                      alt="avatar"
                      src={item.avatar}
                      onClick={() => navigate(`/my/info/${item.user_id}`)}
                      style={{
                        width: 24,
                        height: 24,
                        borderRadius: '50%',
                        marginRight: 8,
                        cursor: 'pointer'
                      }}
                    />
                    <span>{item.user_name}</span>
                    <span style={{ marginLeft: 16, color: '#999' }}>
                      {new Date(item.create_time).toLocaleDateString()}
                    </span>
                  </div>
                }
              />
            </List.Item>
          ) : (
            <List.Item
              key={`note-${item.note_id}`}
              actions={[
                <Button onClick={() => navigate(`/my/note/detail/${item.note_id}`)} key="view" icon={<EyeOutlined />} />,
                <span key="like"><LikeOutlined style={{ marginRight: 8 }} /> {item.like_count}</span>,
                <span key="collect"><StarOutlined style={{ marginRight: 8 }} /> {item.mark_count}</span>,
                <span key="comment"><CommentOutlined style={{ marginRight: 8 }} /> {item.comment_count}</span>
              ]}
            >
              <List.Item.Meta
                title={item.note_name}
                description={
                  <div>
                    <div style={{
                      textOverflow: 'ellipsis',
                      overflow: 'hidden',
                      WebkitLineClamp: 2,
                      WebkitBoxOrient: 'vertical',
                      display: '-webkit-box'
                    }}>
                      {item.content?.replace(/(> |)/g, ' ') ?? '无内容'}
                    </div>
                    <div style={{ marginTop: 8 }}>
                      {item.tags?.map((tag: string) => (
                        <Tag key={tag} color="blue">{tag}</Tag>
                      ))}
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', marginTop: 8 }}>
                      <img
                        alt="avatar"
                        src={item.avatar}
                        onClick={() => navigate(`/my/info/${item.user_id}`)}
                        style={{
                          width: 24,
                          height: 24,
                          borderRadius: '50%',
                          marginRight: 8,
                          cursor: 'pointer'
                        }}
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
  )
}

export default ExploreLayout
