import { useState } from 'react';
import { Input, Button, Modal } from 'antd';
import { SmileOutlined } from '@ant-design/icons';
import EmojiPicker from './EmojiPicker';

const CommentInput = ({ onSend }: { onSend: (content: string) => void }) => {
  const [value, setValue] = useState('');
  const [visible, setVisible] = useState(false);

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      onSend(value.trim());
      setValue('');
    }
  };

  return (
    <div className="comment-input-wrapper">
      <div className="input-area">
        <Input.TextArea
          value={value}
          onChange={(e) => setValue(e.target.value)}
          onKeyUp={handleKeyPress}
          placeholder="输入评论..."
          autoSize={{ minRows: 2, maxRows: 6 }}
        />
        <Button
          type="text"
          icon={<SmileOutlined />}
          onClick={() => setVisible(true)}
          className="emoji-trigger"
        />
      </div>

      <Modal
        title="选择表情"
        open={visible}
        footer={null}
        onCancel={() => setVisible(false)}
        destroyOnHidden
      >
        <EmojiPicker
          onEmojiSelect={(emoji) => {
            setValue(value + emoji);
            setVisible(false);
          }}
        />
      </Modal>
    </div>
  );
}

export default CommentInput;
