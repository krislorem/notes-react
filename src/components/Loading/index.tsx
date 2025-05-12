import { Spin } from 'antd';

// 自定义全屏加载蒙版组件
const Loading = () => (
  <Spin
    size="large"
    fullscreen
    tip="Loading..."
  />
);

export default Loading;
