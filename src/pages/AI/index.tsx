import Independent from "@/components/Qwen"
import { useParams } from "react-router-dom"
const AIPage = () => {
  const { noteId } = useParams();
  return (
    <div>
      <Independent noteID={noteId!} />
    </div>
  )
}

export default AIPage
