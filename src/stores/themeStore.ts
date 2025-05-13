import { create } from 'zustand'
import { persist, createJSONStorage } from 'zustand/middleware'
import { immer } from 'zustand/middleware/immer'
import type { PersistOptions } from 'zustand/middleware'

interface ThemeState {
  theme: "light" | "dark"
  toggleTheme: () => void
}

export const useThemeStore = create<ThemeState>()(
  persist(
    immer((set) => ({
      theme: 'light',
      toggleTheme: () => set((draft) => {
        draft.theme = draft.theme === 'light' ? 'dark' : 'light'
      })
    })),
    {
      name: 'theme',
      storage: createJSONStorage(() => localStorage),
      onHydrate: () => (state: ThemeState) => {
        // 初始化时立即同步一次主题
        if (state) {
          document.documentElement.classList.toggle('dark', state.theme === 'dark');
        }
      },
      onRehydrateStorage: () => (state) => {
        // 持久化存储加载完成后再次同步
        if (state) {
          document.documentElement.classList.toggle('dark', state.theme === 'dark');
        }
      }
    } as PersistOptions<ThemeState, ThemeState> // 添加类型断言
  )
)
