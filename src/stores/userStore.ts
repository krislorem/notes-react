import { create } from 'zustand'
import { persist, createJSONStorage } from 'zustand/middleware'
import { immer } from 'zustand/middleware/immer'

interface UserState {
  user: {
    user_id: number;
    user_name: string;
    nick_name: string;
    avatar: string;
    email: string;
    info: string;
  };
  logout: () => void;
  setUser: (user: UserState['user']) => void;
}

export const useUserStore = create<UserState>()(
  persist(
    immer((set) => ({
      user: {
        user_id: 0,
        user_name: '',
        nick_name: '',
        avatar: '',
        email: '',
        info: '',
      },
      setUser: (user) => set((state) => {
        state.user = user
      }),
      logout: () => set((state) => {
        state.user = {
          user_id: 0,
          user_name: '',
          nick_name: '',
          avatar: '',
          email: '',
          info: '',
        }
      }),
    })),
    {
      name: 'user',
      storage: createJSONStorage(() => localStorage)
    }
  )
)
