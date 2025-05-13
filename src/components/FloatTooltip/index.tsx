import React, { useState } from 'react'
import SwitchDarkMode from '@/components/SwitchDarkModeButton';
import { UpOutlined, ArrowUpOutlined, ArrowDownOutlined, FullscreenOutlined, FullscreenExitOutlined } from '@ant-design/icons'
import { Flex, FloatButton } from 'antd';
import { useModeAnimation } from '@/hooks/useThemeToggle';
import { useThemeStore } from '@/stores/themeStore';
import './index.css'
const BOX_SIZE = 100;
const BUTTON_SIZE = 40;
const wrapperStyle: React.CSSProperties = {
  position: 'absolute',
  bottom: 0,
  right: 0,
};

const boxStyle: React.CSSProperties = {
  width: BOX_SIZE,
  height: BOX_SIZE,
  position: 'relative',
};

const insetInlineEnd: React.CSSProperties['insetInlineEnd'] = (BOX_SIZE - BUTTON_SIZE) / 2

const bottom: React.CSSProperties['bottom'] = BOX_SIZE - BUTTON_SIZE / 2

const FloatToolButton = () => {
  const theme = useThemeStore(state => state.theme);
  const { toggleSwitchTheme, isDarkMode } = useModeAnimation({
    isDarkMode: theme === 'dark',
    onDarkModeChange: (isDark) => useThemeStore.setState({ theme: isDark ? 'dark' : 'light' })
  });

  const style: React.CSSProperties = {
    position: 'absolute',
    insetInlineEnd: insetInlineEnd,
    bottom: bottom,
  };
  const scrollToBottom = () => {
    const el = document.getElementById('main-content') as HTMLElement;
    el.scrollTo({
      top: el.scrollHeight - el.clientHeight,
      behavior: 'smooth'
    })
  }
  const scrollToTop = () => {
    const el = document.getElementById('main-content') as HTMLElement;
    el.scrollTo({
      top: 0,
      behavior: 'smooth'
    })
  }
  const [isFullscreen, setIsFullscreen] = useState<boolean>(false);
  const fullscreen = () => {
    const el = document.documentElement
    if (el.requestFullscreen) {
      el.requestFullscreen()
      setIsFullscreen(true)
    }
  }
  const exitfullscreen = () => {
    if (document.exitFullscreen) {
      document.exitFullscreen()
      setIsFullscreen(false)
    }
  }
  return (
    <div className="toolfloot">
      <Flex justify="space-evenly" align="center" style={wrapperStyle}>
        <div style={boxStyle}>
          <FloatButton.Group
            key="top"
            trigger="click"
            placement="top"
            style={style}
            icon={<UpOutlined key="up" />}
            tooltip={{ title: "工具", placement: "left" }}
          >
            <FloatButton icon={<ArrowUpOutlined />} tooltip={{ title: "返回顶部", placement: "left" }} onClick={scrollToTop} />
            <FloatButton icon={<ArrowDownOutlined />} tooltip={{ title: "滚到底部", placement: "left" }} onClick={scrollToBottom} />
            {!isFullscreen ? <FloatButton icon={<FullscreenOutlined />} tooltip={{ title: "全屏", placement: "left" }} onClick={fullscreen} /> : <FloatButton icon={<FullscreenExitOutlined />} tooltip={"退出全屏"} onClick={exitfullscreen} />}
            <SwitchDarkMode
              duration={1000}
              styleId="circle-animation"
              isDarkMode={isDarkMode}
              onDarkModeChange={toggleSwitchTheme}
            />
          </FloatButton.Group>
        </div>
      </Flex>
    </div>
  )
}

export default FloatToolButton
