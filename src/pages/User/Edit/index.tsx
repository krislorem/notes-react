/* eslint-disable @typescript-eslint/no-explicit-any */
import { getUserInfo, updateUserInfo } from "@/api/userApi"
import { uploadFile } from "@/api/ossApi"
import { useNavigate, useParams } from "react-router-dom"
import { Button, Form, Input, message, Upload } from "antd";
import { UploadOutlined } from "@ant-design/icons";
import { useEffect, useState } from "react";
import Cropper from 'react-cropper';
import 'cropper/dist/cropper.css';

const UserEdit = () => {
  const [form] = Form.useForm();
  const { userId } = useParams();
  const [avatarImage, setAvatarImage] = useState('');
  const [cropper, setCropper] = useState<any>();
  const navigate = useNavigate();

  useEffect(() => {
    const loadData = async () => {
      try {
        const { data } = await getUserInfo(Number(userId));
        form.setFieldsValue({
          user_name: data.user_name,
          nick_name: data.nick_name,
          info: data.info,
          avatar: data.avatar
        });
        setAvatarImage(data.avatar);
      } catch (error) {
        console.error('用户数据加载失败:', error);
      }
    };
    loadData();
  }, [userId]);

  const handleUpload = async (file: File) => {
    const reader = new FileReader();
    reader.onload = () => {
      setAvatarImage(reader.result as string);
    };
    reader.readAsDataURL(file);
    return false;
  };

  const handleCrop = async () => {
    if (cropper) {
      const blob = await fetch(cropper.getCroppedCanvas().toDataURL())
        .then(res => res.blob());
      const formData = new FormData();
      formData.append('file', new File([blob], 'avatar.png'));

      try {
        const file = formData.get('file') as File;
        const { data } = await uploadFile(file);
        form.setFieldsValue({ avatar: data.url });
        message.success('头像上传成功');
      } catch (error) {
        console.error('头像上传失败:', error);
        message.error('头像上传失败');
      }
    }
  };

  const onSubmit = async (values: any) => {
    try {
      await updateUserInfo(
        Number(userId),
        values.user_name,
        values.nick_name,
        values.info,
        values.avatar
      );
      message.success('用户信息更新成功');
      navigate(`/my/info/${userId}`);
    } catch (error) {
      console.error('更新失败:', error);
      message.error('更新失败');
    }
  };

  return (
    <div style={{ padding: '20px' }}>
      <Form form={form} onFinish={onSubmit} layout="vertical">
        <Form.Item 
          label="用户名" 
          name="user_name"
          rules={[{ max: 16, message: '用户名最多16个字符' }]}
        >
          <Input placeholder="请输入用户名" maxLength={16} />
        </Form.Item>

        <Form.Item 
          label="昵称" 
          name="nick_name"
          rules={[{ max: 16, message: '昵称最多16个字符' }]}
        >
          <Input placeholder="请输入昵称" maxLength={16} />
        </Form.Item>

        <Form.Item 
          label="个人简介" 
          name="info"
          rules={[{ max: 100, message: '简介最多100个字符' }]}
        >
          <Input.TextArea 
            placeholder="请输入个人简介" 
            maxLength={100} 
            showCount 
            rows={4}
          />
        </Form.Item>

        <Form.Item label="头像" name="avatar">
          <Upload
            beforeUpload={handleUpload}
            showUploadList={false}
            accept="image/*"
          >
            <Button icon={<UploadOutlined />}>选择头像</Button>
          </Upload>
        </Form.Item>

        {avatarImage && (
          <div style={{ marginBottom: 20 }}>
            <Cropper
              src={avatarImage}
              style={{ height: 400, width: '100%' }}
              aspectRatio={1}
              guides={false}
              onInitialized={instance => setCropper(instance)}
            />
            <Button onClick={handleCrop} style={{ marginTop: 10 }}>
              确认裁剪并上传
            </Button>
          </div>
        )}

        <Form.Item>
          <Button type="primary" htmlType="submit">
            更新资料
          </Button>
        </Form.Item>
      </Form>
    </div>
  );
};

export default UserEdit;
