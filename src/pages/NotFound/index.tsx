import { Button, Result, theme } from 'antd';
import { useNavigate } from 'react-router-dom';
import type { FC } from 'react';
import './index.css';

const NotFound: FC = () => {
  const navigate = useNavigate();
  const { token } = theme.useToken();

  return (
    <div className="not-found-container">
      <Result
        status="404"
        title="404"
        subTitle="抱歉，您访问的页面不存在"
        extra={
          <Button
            type="primary"
            size="large"
            onClick={() => navigate('/')}
            style={{
              padding: '0 32px',
              height: 48,
              fontSize: 16,
              borderRadius: 8
            }}
          >
            返回首页
          </Button>
        }
        className="custom-result"
      />

      <div className="decorative-line" style={{ background: token.colorPrimary }} />
    </div>
  );
};

export default NotFound;
