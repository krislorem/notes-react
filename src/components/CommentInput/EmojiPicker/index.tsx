import data from '@emoji-mart/data'
import Picker from '@emoji-mart/react'
import { useThemeStore } from '@/stores/themeStore'
function EmojiPicker({ onEmojiSelect }: { onEmojiSelect: (emoji: string) => void }) {
  const { theme } = useThemeStore()
  return (
    <Picker data={data} theme={theme === "dark" ? "dark" : "light"} onEmojiSelect={(emoji: { native: string }) => onEmojiSelect(emoji.native)} />
  )
}
export default EmojiPicker
