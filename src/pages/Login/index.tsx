import { useState } from 'react';
import { Form, Input, Button } from 'antd';
import { login, register, sendcode } from '@/api/userApi';
import { useNavigate } from 'react-router-dom';
import { useUserStore } from '@/stores/userStore';
import './index.css';

const Login = () => {
  const [formType, setFormType] = useState<'login' | 'register'>('login');
  const [countdown, setCountdown] = useState(0);
  const [form] = Form.useForm();
  const handleSendCode = async () => {
    try {
      await sendcode(form.getFieldValue('email'));
      setCountdown(60);
      const timer = setInterval(() => {
        setCountdown((prev) => (prev > 0 ? prev - 1 : 0));
      }, 1000);
      setTimeout(() => clearInterval(timer), 60000);
    } catch (error) {
      console.error('发送验证码失败:', error);
    }
  };

  // 表单提交
  // 定义表单值的类型
  type FormValues = {
    user_name: string;
    password: string;
    email: string;
    confirmPassword: string;
    code: string;
  };
  const navigate = useNavigate();
  const handleSubmit = async (values: FormValues) => {
    try {
      if (formType === 'login') {
        console.log('登录', values);
        const { data, code } = await login(values.user_name, values.password);
        console.log('登录', data);
        if (code !== 0) {
          return;
        }
        useUserStore.getState().setUser(data.login_user);
        localStorage.setItem('token', data.token);
        navigate('/');
      } else {
        const isPasswordMatch = values.password === values.confirmPassword;
        if (isPasswordMatch) {
          await register(values.user_name, values.code, values.email, values.password);
        }
      }
    } catch (error) {
      console.error('操作失败:', error);
    }
  };

  return (
    <div className="login-container">
      <Form form={form} onFinish={handleSubmit} className="login-card">
        <Form.Item
          name="user_name"
          rules={[
            { required: true, message: '请输入用户名' },
            { min: 3, message: '用户名至少3位' },
            { max: 16, message: '用户名最多16位' }
          ]}
        >
          <Input placeholder="用户名" />
        </Form.Item>

        {formType === 'register' && (
          <Form.Item
            name="email"
            rules={[
              { required: true, message: '请输入邮箱' },
              {
                type: 'email',
                message: '请输入有效的邮箱地址',
              }
            ]}
          >
            <Input placeholder="邮箱" />
          </Form.Item>
        )}

        <Form.Item
          name="password"
          rules={formType === 'login' ? [
            { required: true, message: '请输入密码' }
          ] : [
            { required: true, message: '请输入密码' },
            { min: 6, message: '密码至少6位' },
            { max: 32, message: '密码最多32位' }
          ]}
        >
          <Input.Password placeholder="密码" />
        </Form.Item>

        {formType === 'register' && (
          <>
            <Form.Item
              name="confirmPassword"
              dependencies={['password']}
              rules={[
                { required: true, message: '请确认密码' },
                ({ getFieldValue }) => ({
                  validator(_, value) {
                    if (!value || getFieldValue('password') === value) {
                      return Promise.resolve();
                    }
                    return Promise.reject(new Error('两次输入的密码不匹配'));
                  },
                }),
              ]}
            >
              <Input.Password placeholder="确认密码" />
            </Form.Item>
            <Form.Item
              name="code"
              rules={[{ required: true, message: '请输入验证码' }]}
            >
              <Input
                placeholder="验证码"
                addonAfter={
                  <Button
                    type="link"
                    onClick={handleSendCode}
                    disabled={countdown > 0}
                  >
                    {countdown > 0 ? `${countdown}秒后重试` : '获取验证码'}
                  </Button>
                }
              />
            </Form.Item>
          </>
        )}

        <Form.Item>
          <Button type="primary" htmlType="submit" block>
            {formType === 'login' ? '登录' : '注册'}
          </Button>
        </Form.Item>

        <div>
          {formType === 'login'
            ? '没有账号？'
            : '已有账号？'}
          <Button
            type="link"
            onClick={() => setFormType(prev => prev === 'login' ? 'register' : 'login')}
          >
            {formType === 'login' ? '立即注册' : '立即登录'}
          </Button>
        </div>
      </Form>
    </div>
  );
};

export default Login;
