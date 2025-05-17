/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
import NoteEditor from '@/components/NoteEditor';
import { useNavigate, useLocation } from 'react-router-dom';
import { useRef, useEffect, useState } from 'react';
import { createNote } from '@/api/bookApi';
import { useUserStore } from '@/stores/userStore';
import { Button, Form, Input, Tag, message, Select } from 'antd';
import * as PDFJS from 'pdfjs-dist/legacy/build/pdf.mjs'
PDFJS.GlobalWorkerOptions.workerSrc = new URL('pdfjs-dist/legacy/build/pdf.worker.mjs', import.meta.url).href;
const UserNoteEdit = () => {


  const location = useLocation();
  const bookId = location.pathname.match(/\/(\d+)$/)?.[1];

  const fileInputRef = useRef<HTMLInputElement>(null);
  const editorRef = useRef<any>(null);
  const [_importing, setImporting] = useState(false);

  useEffect(() => {
    if (!bookId || !/^\d+$/.test(bookId)) {
      message.error('无效的笔记本ID格式');
      navigate(-1);
    }
  }, [bookId]);

  const user_id = useUserStore.getState().user?.user_id;
  const [form] = Form.useForm();

  const navigate = useNavigate();
  const handleSubmit = async () => {
    try {
      const values = await form.validateFields();
      if (editorRef.current?.getCount() > 2000) {
        message.error('内容长度不能超过2000字符');
        return;
      }
      if (!bookId) {
        message.error('未指定笔记本ID');
        return;
      }
      console.log(bookId?.toString())
      await createNote(
        values.note_name,
        user_id!,
        Number(bookId),
        values.tags || [],
        editorRef.current?.getValue()
      );
      message.success('创建成功');
      navigate(-1);
    } catch (error) {
      console.error('创建失败:', error);
      message.error('创建失败');
    }
  };
  const handleFileImport = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files?.length) return;

    try {
      setImporting(true);
      for (const file of files) {
        let content = '';

        if (file.type === 'application/pdf') {
          const arrayBuffer = await file.arrayBuffer();
          const pdf = await PDFJS.getDocument(arrayBuffer).promise;
          for (let i = 1; i <= pdf.numPages; i++) {
            const page = await pdf.getPage(i);
            const textContent = await page.getTextContent();
            content += textContent.items.map(item => ('str' in item ? item.str : '')).join('');
          }
        } else {
          content = await new Promise((resolve) => {
            const reader = new FileReader();
            reader.onload = (e) => resolve(e.target?.result as string);
            reader.readAsText(file);
          });
        }

        if (editorRef.current) {
          const editor = editorRef.current;
          const currentContent = editor.getValue();
          editor.setValue(currentContent + (currentContent ? '\n\n' : '') + content);
        }
      }
      message.success(`成功导入 ${files.length} 个文件`);
    } catch (error) {
      console.error('文件导入失败:', error);
      message.error('文件导入失败');
    } finally {
      setImporting(false);
      if (fileInputRef.current) fileInputRef.current.value = '';
    }
  };
  return (
    <>
      <Form form={form} layout="vertical">
        <Form.Item
          label="笔记名称"
          name="note_name"
          rules={[
            { required: true, message: '请输入笔记名称' },
            { max: 16, message: '名称不能超过16个字符' }
          ]}
        >
          <Input placeholder="请输入笔记名称" />
        </Form.Item>
        <Form.Item
          label="标签"
          name="tags"
          rules={[
            {
              validator: (_, tags) => {

                if ((tags || []).some((t: string | any[]) => t?.length > 8)) {
                  return Promise.reject('单个标签不能超过8个字符');
                }
                if (tags?.length > 16) {
                  return Promise.reject('最多添加16个标签');
                }
                return Promise.resolve();
              }
            }
          ]}
        >
          <Select
            mode="tags"
            tagRender={({ value, closable }) => (
              <Tag closable={closable}
                onClose={(e) => {
                  e.preventDefault();
                  const newTags = (form.getFieldValue('tags') || []).filter((t: any) => t !== value);
                  form.setFieldsValue({ tags: newTags });
                }}
                style={{ margin: 2 }}
              >
                {value?.length > 8 ? `${value.slice(0, 8)}...` : value}
              </Tag>
            )}
            tokenSeparators={[',']}
            onMouseDown={(e) => {
              e.preventDefault();
              e.stopPropagation();
            }}
          >
            <Select.Option value="学习笔记">学习笔记</Select.Option>
            <Select.Option value="工作日志">工作日志</Select.Option>
            <Select.Option value="技术备忘">技术备忘</Select.Option>
            <Select.Option value="生活记录">生活记录</Select.Option>
          </Select>
        </Form.Item>
      </Form>
      <NoteEditor ref={editorRef} />
      <div style={{ marginBottom: 16 }}>
        <input
          type="file"
          accept=".txt,.md,.pdf"
          multiple
          style={{ display: 'none' }}
          ref={fileInputRef}
          onChange={handleFileImport}
        />
        <Button
          onClick={() => fileInputRef.current?.click()}
          style={{ marginRight: 8 }}
        >
          导入文件
        </Button>
      </div>
      <Button type="primary" onClick={handleSubmit}>提交</Button>
    </>
  )
}
export default UserNoteEdit;


