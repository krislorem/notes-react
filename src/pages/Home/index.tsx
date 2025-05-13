import './index.css';
import ScrollProgress from '@/components/ScrollProgress';
import { Layout, Menu, Button, Modal } from 'antd';
import { useUserStore } from '@/stores/userStore';
import { exit } from '@/api/userApi'
import {
  LeftOutlined,
  RightOutlined,
  SearchOutlined,
  PlusOutlined,
  UserOutlined,
  DeleteOutlined,
  RobotOutlined,
  LogoutOutlined,
  LoginOutlined,
  FileTextOutlined
} from '@ant-design/icons';
import { Outlet, useNavigate } from 'react-router-dom';

const { Sider, Content } = Layout;

const Home = () => {
  const navigate = useNavigate();

  const menuItems = [
    { label: '搜索', key: 'search', icon: <SearchOutlined /> },
    { label: '新建', key: 'new', icon: <PlusOutlined /> },
    { label: '笔记本', key: 'book', icon: <FileTextOutlined /> },
    { label: 'AI', key: 'ai', icon: <RobotOutlined /> },
    { label: '回收站', key: 'temp', icon: <DeleteOutlined /> },
  ];

  return (
    <Layout style={{ minHeight: '100vh' }}>
      <Sider collapsible width={200}>
        <div className="app-logo">NOTE</div>
        <div className="logo" style={{ padding: 16 }}>
          <Button
            type="text"
            icon={<LeftOutlined />}
            onClick={() => navigate(-1)}
          />
          <Button
            type="text"
            icon={<RightOutlined />}
            onClick={() => navigate(1)}
          />
        </div>

        <Menu
          mode="inline"
          items={menuItems}
          style={{
            position: 'absolute',
            top: 100,
            width: '100%',
          }}
          onSelect={({ key }) => {
            const routes = {
              search: '/search',
              new: '/my/book/edit/0',
              book: '/my/book/list',
              ai: '/ai',
              temp: '/my/temp'
            };
            const routeKey = key as keyof typeof routes;
            navigate(routes[routeKey]);
          }}
        />

        <div style={{ position: 'absolute', bottom: 50, width: '100%' }}>
          <Menu
            mode="inline"
            items={localStorage.getItem('token') ? [
              {
                key: 'profile',
                icon: <UserOutlined />,
                label: '用户中心',
              },
              {
                key: 'logout',
                icon: <LogoutOutlined />,
                label: '退出登录',
                danger: true,
              }
            ] : [{
              key: 'login',
              icon: <LoginOutlined />,
              label: '立即登录',
            }]}
            onSelect={({ key }) => {
              const { user, logout } = useUserStore.getState();
              if (key === 'login') {
                Modal.confirm({
                  title: '登录确认',
                  content: '您需要登录后才能继续操作',
                  okText: '去登录',
                  cancelText: '取消',
                  onOk: () => navigate('/login')
                });
              } else if (key === 'logout') {
                logout();
                localStorage.removeItem('token');
                exit();
                navigate('/login', { replace: true });
              } else if (user.user_id) {
                navigate('/my');
              }
            }}
          />
        </div>
      </Sider>

      <Layout>
        <Content id='main-content' style={{ padding: 24 }}>
          <ScrollProgress />
          <Outlet />
        </Content>
      </Layout>
    </Layout>
  );
};

export default Home;
