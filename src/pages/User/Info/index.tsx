/* eslint-disable @typescript-eslint/no-explicit-any */
import { useParams, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { Card, Avatar, Descriptions, Button, List } from "antd";
import { EditOutlined } from "@ant-design/icons";
import { useUserStore } from "@/stores/userStore";
import CalendarHeatMap from "@/components/CalendarHeat";
import { getUserInfo, getUserNotebookNum, getUserNoteNum, getUserLikeNum } from "@/api/userApi";
const UserInfo = () => {
  const { userId } = useParams();
  const [userData, setUserData] = useState<any>({});
  const [notebookNum, setNotebookNum] = useState(0);
  const [noteNum, setNoteNum] = useState(0);
  const [likeNum, setLikeNum] = useState(0);
  const navigate = useNavigate();
  const { user_id } = useUserStore((state) => state.user);
  useEffect(() => {
    const loadData = async () => {
      try {
        const { data } = await getUserInfo(Number(userId));
        const { notebookNum } = await getUserNotebookNum(Number(userId)).then((res) => res.data);
        const { noteNum } = await getUserNoteNum(Number(userId)).then((res) => res.data);
        const { likeNum } = await getUserLikeNum(Number(userId)).then((res) => res.data);
        setNotebookNum(notebookNum);
        setNoteNum(noteNum);
        setLikeNum(likeNum)
        setUserData(data);
      } catch (error) {
        console.error('用户数据加载失败:', error);
      }
    };
    loadData();
  }, [userId]);
  return (
    <div style={{ padding: 20 }}>
      <Card
        title="用户信息"
        actions={[
          <div key='edit'>
            {user_id === Number(userId) ? (
              <Button
                key="edit"
                type="primary"
                icon={<EditOutlined />}
                onClick={() => navigate(`/my/edit/${userId}`)}
              >
                编辑资料
              </Button>
            ) : (<></>)}
          </div>
        ]}
      >
        <Descriptions bordered column={1}>
          <Descriptions.Item label="头像">
            <Avatar src={userData.avatar} size={64} />
          </Descriptions.Item>
          <Descriptions.Item label="用户名">{userData.user_name}</Descriptions.Item>
          <Descriptions.Item label="昵称">{userData.nick_name || '未设置'}</Descriptions.Item>
          <Descriptions.Item label="邮箱">{userData.email || '未设置'}</Descriptions.Item>
          <Descriptions.Item label="个人简介">{userData.info || '暂无简介'}</Descriptions.Item>
        </Descriptions>
      </Card>
      <Card title="活跃日历" style={{ marginTop: 20 }}>
        <CalendarHeatMap user_id={Number(userId)} />
      </Card>
      <Card title="统计数据" style={{ marginTop: 20 }}>
        <List
          grid={{ gutter: 16, column: 3 }}
          dataSource={[
            { title: '笔记本', content: notebookNum },
            { title: '笔记', content: noteNum },
            { title: '获赞', content: likeNum },
          ]}
          renderItem={(item) => (
            <List.Item>
              <Card title={item.title}>{item.content}</Card>
            </List.Item>
          )}
        />
      </Card>
    </div>
  );
};

export default UserInfo
