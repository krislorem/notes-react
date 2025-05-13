import { useState, useEffect } from 'react';
import { Progress } from 'antd';
import './index.css';
const ScrollProgress = () => {
  const [scrollPercent, setScrollPercent] = useState(0);

  const handleScroll = (e: Event) => {
    const scrollTop = (e.target as HTMLElement).scrollTop;
    const windowHeight = (e.target as HTMLElement).clientHeight;
    const docHeight = (e.target as HTMLElement).scrollHeight;
    const progress = (scrollTop / (docHeight - windowHeight)) * 100;
    setScrollPercent(progress);
  };

  useEffect(() => {
    const scrollContainer = document.querySelector('.ant-layout-content');
    if (!scrollContainer) return;

    scrollContainer.addEventListener('scroll', handleScroll);
    return () => scrollContainer.removeEventListener('scroll', handleScroll);
  }, []);

  return <Progress className="scroll-progress" percent={scrollPercent} showInfo={false}
    strokeColor={
      {
        '0%': '#87d068',
        '100%': '#108ee9'
      }
    }
    strokeLinecap="round" />;
};

export default ScrollProgress;
