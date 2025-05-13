import { getMyBooks, getBookCommentsCount, getBookNotesCount, getBookLikes, getBookMarks } from "@/api/bookApi"
import { useEffect, useState } from "react"
import { useUserStore } from "@/stores/userStore"
import { Card, List, Pagination, Button, Switch, Row, Col } from "antd"
import { DeleteOutlined, EditOutlined, EyeOutlined } from "@ant-design/icons"
import { useNavigate } from "react-router-dom"

const UserBookList = () => {
  const [books, setBooks] = useState<any[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [isGridLayout, setIsGridLayout] = useState(true);
  const user = useUserStore(state => state.user);
  const navigate = useNavigate();

  useEffect(() => {
    const loadData = async () => {
      if (user?.user_id) {
        const { data } = await getMyBooks(user.user_id, currentPage, 20);
        console.log('data', data);
        const booksWithStats = await Promise.all(data.map(async (book: any) => ({
          ...book,
          comments: (await getBookCommentsCount(book.book_id)).data,
          likes: (await getBookLikes(book.book_id)).data,
          marks: (await getBookMarks(book.book_id)).data,
          notes: (await getBookNotesCount(book.book_id)).data
        })));
        setBooks(booksWithStats);
      }
    };
    loadData();
  }, [currentPage, user]);

  return (
    <div style={{ padding: 20 }}>
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
          total={100}
          onChange={page => setCurrentPage(page)}
        />
      </div>

      {isGridLayout ? (
        <Row gutter={[16, 16]}>
          {books.map(book => (
            <Col 
              key={book.book_id}
              xs={24}
              sm={12}
              md={8}
              lg={6}
              xl={4}
            >
              <Card
                cover={<img alt="封面" src={book.cover} style={{ height: 200, objectFit: 'cover' }} />}
                actions={[
                  <EyeOutlined key="view" onClick={() => navigate(`/my/book/detail/${book.book_id}`)} />,
                  <EditOutlined key="edit" onClick={() => navigate(`/my/book/edit/${book.book_id}`)} />,
                  <DeleteOutlined key="delete" />
                ]}
              >
                <Card.Meta
                  title={book.book_name}
                  description={`创建时间：${new Date(book.create_time).toLocaleDateString()}`}
                />
                <div style={{ marginTop: 8 }}>
                  <span>评论: {book.comments}</span>
                  <span style={{ margin: '0 5px' }}>|</span>
                  <span>点赞: {book.likes}</span>
                  <span style={{ margin: '0 5px' }}>|</span>
                  <span>收藏: {book.marks}</span>
                  <span style={{ margin: '0 5px' }}>|</span>
                  <span>笔记: {book.notes}</span>
                </div>
              </Card>
            </Col>
          ))}
        </Row>
      ) : (
        <List
          itemLayout="horizontal"
          dataSource={books}
          renderItem={book => (
            <List.Item
              actions={[
                <Button key="view" icon={<EyeOutlined />} onClick={() => navigate(`/my/book/detail/${book.book_id}`)} />,
                <Button key="edit" icon={<EditOutlined />} onClick={() => navigate(`/my/book/edit/${book.book_id}`)} />,
                <Button key="delete" danger icon={<DeleteOutlined />} />
              ]}
            >
              <List.Item.Meta
                avatar={<img alt="cover" src={book.cover} style={{ width: 100, height: 60, objectFit: 'cover' }} />}
                title={book.book_name}
                description={
                  <div>
                    <div>创建时间：{new Date(book.create_time).toLocaleDateString()}</div>
                    <div>评论: {book.comments} | 点赞: {book.likes} | 收藏: {book.marks} | 笔记: {book.notes}</div>
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

export default UserBookList
