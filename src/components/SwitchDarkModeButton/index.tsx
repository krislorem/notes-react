import React from 'react'
import { useModeAnimation } from '@/hooks/useThemeToggle'
import type { ReactThemeSwitchAnimationProps } from '@/hooks/useThemeToggle'
import { Tooltip } from 'antd'
import './index.css'

export interface SwitchDarkModeProps extends ReactThemeSwitchAnimationProps {
  className?: string
}

const SwitchDarkMode: React.FC<SwitchDarkModeProps> = ({
  isDarkMode: externalDarkMode,
  onDarkModeChange,
  ...props
}) => {
  const { ref, toggleSwitchTheme, isDarkMode } = useModeAnimation({
    ...props,
    isDarkMode: externalDarkMode,
    onDarkModeChange,
  })
  const MoonIcon = () => (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path
        d="M2.03009 12.42C2.39009 17.57 6.76009 21.76 11.9901 21.99C15.6801 22.15 18.9801 20.43 20.9601 17.72C21.7801 16.61 21.3401 15.87 19.9701 16.12C19.3001 16.24 18.6101 16.29 17.8901 16.26C13.0001 16.06 9.00009 11.97 8.98009 7.13996C8.97009 5.83996 9.24009 4.60996 9.73009 3.48996C10.2701 2.24996 9.62009 1.65996 8.37009 2.18996C4.41009 3.85996 1.70009 7.84996 2.03009 12.42Z"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  )

  const SunIcon = () => (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path
        d="M12 18.5C15.5899 18.5 18.5 15.5899 18.5 12C18.5 8.41015 15.5899 5.5 12 5.5C8.41015 5.5 5.5 8.41015 5.5 12C5.5 15.5899 8.41015 18.5 12 18.5Z"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M19.14 19.14L19.01 19.01M19.01 4.99L19.14 4.86L19.01 4.99ZM4.86 19.14L4.99 19.01L4.86 19.14ZM12 2.08V2V2.08ZM12 22V21.92V22ZM2.08 12H2H2.08ZM22 12H21.92H22ZM4.99 4.99L4.86 4.86L4.99 4.99Z"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  )
  return (
    <Tooltip
      placement="left"
      title={isDarkMode ? '切换到亮色模式' : '切换到深色模式'}
      style={{ borderRadius: '50%' }}
      className='theme-tooltip'
    >
      <button
        ref={ref}
        onClick={toggleSwitchTheme}
        style={{ borderRadius: '50%', width: '40px', height: '40px', cursor: 'pointer', fontSize: 0, backgroundColor: 'white', border: 'none', boxShadow: '0 0 20px rgba(0, 0, 0, 0.2)' }}
        className="toggletheme"
        aria-label={isDarkMode ? 'Switch to light mode' : 'Switch to dark mode'}
      >
        <div className="relative">{isDarkMode ? <MoonIcon /> : <SunIcon />}</div>
      </button>
    </Tooltip>
  )
}


export default SwitchDarkMode
