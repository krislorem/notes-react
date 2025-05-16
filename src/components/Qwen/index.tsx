import { useXAgent, useXChat, Sender, Bubble } from '@ant-design/x';
import { UserOutlined, CopyOutlined, AlibabaOutlined } from '@ant-design/icons';
import OpenAI from 'openai';
import React, { useEffect, useState } from 'react';
import type { GetProp } from 'antd';
import { Button, Flex, Space, Spin, message as antdMessage } from 'antd';
import MarkdownRender from '@/components/QwenItemRender';
import { getMyNote } from '@/api/bookApi';
import dayjs from 'dayjs';
const client = new OpenAI({
  baseURL: 'https://dashscope.aliyuncs.com/compatible-mode/v1',
  apiKey: import.meta.env.VITE_DASHSCOPE_API_KEY,
  dangerouslyAllowBrowser: true,
});
type IndependentProps = {
  noteID: string;
}
const Independent: React.FC<IndependentProps> = ({ noteID }) => {
  // 静态时间状态
  const [hasSentInitialMessage, setHasSentInitialMessage] = useState(false);

  const [agent] = useXAgent({
    request: async (info, callbacks) => {
      const { messages, message } = info;

      const { onSuccess, onUpdate } = callbacks;

      // current message
      console.log('message', message);

      // history messages
      console.log('messages', messages);

      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      let content: any = '';

      try {
        const stream = await client.chat.completions.create({
          model: 'qwen-plus',
          // if chat context is needed, modify the array
          messages: [
            { role: 'system', content: 'hello' },
            { role: 'user', content: message! },
          ],
          // stream mode
          stream: true,
        });
        for await (const chunk of stream) {
          content += chunk.choices[0]?.delta?.content || '';
          onUpdate(content);
        }
        onSuccess(content);
      } catch (error) {
        console.log(error);
      }
    },
  });
  // 初始化时间和发送问候语

  const {
    // use to send message
    onRequest,
    // use to render messages
    messages,
  } = useXChat({ agent });
  useEffect(() => {
    const fetchData = async () => {
      console.log(noteID)
      if (noteID !== "0") {
        try {
          const noteResponse = await getMyNote(Number(noteID));
          const noteData = noteResponse.data.data;
          if (!hasSentInitialMessage) {
            onRequest(`帮我翻译一下这份笔记\n\`\`\`markdown\n${noteData.content}\n\`\`\``);
            setHasSentInitialMessage(true);
          }
        } catch (error) {
          console.error('获取笔记数据失败:', error);
        }
      }
    };

    fetchData();
  }, [onRequest, hasSentInitialMessage, noteID]);

  const items = messages.map(({ message, id }, index) => ({
    key: id,
    content: message,
    role: index % 2 === 0 ? 'user' : 'assistant',
    footer: (
      <Flex>
        <Button
          size="small"
          type="text"
          onClick={() => {
            navigator.clipboard.writeText(message);
            antdMessage.success('复制成功！', 0.5);
          }}
          title="复制"
          icon={<CopyOutlined />}
          style={{ marginInlineEnd: 'auto' }}
        />
      </Flex>
    ),
  }));
  const roles: GetProp<typeof Bubble.List, 'roles'> = {
    user: {
      placement: 'end',
      avatar: { icon: <UserOutlined />, style: { background: '#87d068' } },
      header: `${dayjs().format('HH:mm:ss')}} 我`,
      messageRender: (content) => <MarkdownRender content={content} />,
    },
    assistant: {
      placement: 'start',
      typing: { step: 5, interval: 20 },
      style: {
        maxWidth: 600,
        marginInlineEnd: 44,
      },
      styles: {
        footer: {
          width: '100%',
        },
      },
      avatar: { icon: <AlibabaOutlined />, style: { background: '#5c6ac4' } },
      header: `${dayjs().format('HH:mm:ss')} Assistant`,
      messageRender: (content) => <MarkdownRender content={content} />,
      loadingRender: () => (
        <Space>
          <Spin size="small" />
          loading...
        </Space>
      ),
    },
  };
  return (
    <div>
      <Bubble.List
        items={items}
        roles={roles}
        autoScroll
      />
      <Sender style={{ position: 'absolute', bottom: 10, width: '70%', backdropFilter: 'blur(10px)' }} onSubmit={onRequest} />
    </div>
  );
};

export default Independent;


