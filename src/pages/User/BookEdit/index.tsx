import { createBook, updateBook, getMyBook } from '@/api/bookApi'
import { uploadFile } from '@/api/ossApi'
import { useParams } from 'react-router-dom';
import { Button, Form, Input, message, Upload, Checkbox } from 'antd';
import { UploadOutlined } from '@ant-design/icons';
import { useEffect, useState } from 'react';
import { useUserStore } from '@/stores/userStore';
import Cropper from 'react-cropper';
import 'cropper/dist/cropper.css'
const UserBookEdit = () => {
  const [form] = Form.useForm();
  const { bookId } = useParams();
  const [coverImage, setCoverImage] = useState('');
  const [cropper, setCropper] = useState<any>();

  useEffect(() => {
    console.log('bookId:', bookId);
    if (bookId !== '0') {
      getMyBook(Number(bookId)).then(res => {
        const { data } = res;
        form.setFieldsValue({
          book_name: data.book_name,
          is_public: data.is_public,
          cover: data.cover
        });
        setCoverImage(data.cover);
        form.setFields([{ name: 'cover', value: data.cover }]);
        form.validateFields(['cover']);
      });
    }
  }, [bookId]);

  const handleUpload = async (file: File) => {
    const reader = new FileReader();
    reader.onload = () => {
      setCoverImage(reader.result as string);
    };
    reader.readAsDataURL(file);
    return false;
  };

  const handleCrop = async () => {
    if (cropper) {
      const blob = await fetch(cropper.getCroppedCanvas().toDataURL())
        .then(res => res.blob());
      const formData = new FormData();
      formData.append('file', new File([blob], 'cover.png'));

      try {
        const file = formData.get('file') as File;
        const {data} = await uploadFile(file);
        form.setFieldsValue({ cover: data.url });
        form.validateFields(['cover']);
        console.log('封面图片上传成功:', data.url);
        message.success('封面图片上传成功');
      } catch (error) {
        console.error('封面图片上传失败:', error);
        message.error('封面图片上传失败');
      }
    }
  };

  const onSubmit = async (values: any) => {
    try {
      if (bookId === '0') {
        const user_id = useUserStore.getState().user?.user_id;
        console.log('user_id: {}, values: {}', user_id, values);
        const is_public = values.is_public ? 1 : 0;
        await createBook(values.book_name, user_id, is_public, values.cover);
        message.success('笔记本创建成功');
      } else {
        await updateBook(Number(bookId), values.book_name, values.is_public, values.cover);
        message.success('笔记本更新成功');
      }
    } catch (error) {
      console.error('操作失败:', error);
      message.error('操作失败');
    }
  };

  return (
    <div style={{ padding: '20px' }}>
      <Form form={form} onFinish={onSubmit} layout="vertical">
        <Form.Item
          label="笔记本名称"
          name="book_name"
          rules={[{ required: true, message: '请输入笔记本名称' }]}
        >
          <Input placeholder="请输入笔记本名称" />
        </Form.Item>

        <Form.Item
          label="封面图片"
          name="cover"
          rules={[{ required: false, message: '请上传封面图片' }]}
        >
          <Upload
            beforeUpload={handleUpload}
            showUploadList={true}
            accept="image/*"
          >
            <Button icon={<UploadOutlined />}>选择图片</Button>
          </Upload>
        </Form.Item>

        {coverImage && (
          <div style={{ marginBottom: 20 }}>
            <Cropper
              src={coverImage}
              style={{ height: 400, width: '100%' }}
              aspectRatio={16 / 9}
              guides={false}
              onInitialized={instance => setCropper(instance)}
            />
            <Button onClick={handleCrop} style={{ marginTop: 10 }}>
              确认裁剪并上传
            </Button>
          </div>
        )}

        <Form.Item
          label="是否公开"
          name="is_public"
          valuePropName="checked"
          style={{ marginBottom: 16 }}
        >
          <Checkbox>公开笔记本</Checkbox>
        </Form.Item>

        <Form.Item>
          <Button type="primary" htmlType="submit">
            {bookId === '0' ? '创建笔记本' : '更新笔记本'}
          </Button>
        </Form.Item>
      </Form>
    </div>
  );
}

export default UserBookEdit
