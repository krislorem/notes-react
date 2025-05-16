import { forwardRef, useEffect, useState, useImperativeHandle } from "react";
import Vditor from "vditor";
import "vditor/dist/index.css";
import "./index.css";
import { useThemeStore } from "@/stores/themeStore";
import { uploadFile } from "@/api/ossApi";


const IREditor = forwardRef((_props, ref) => {
  const [vd, setVd] = useState<Vditor>();
  const theme = useThemeStore(state => state.theme);
  useImperativeHandle(ref, () => ({
    getValue: () => vd?.getValue() ?? '',
    getHTML: () => vd?.getHTML() ?? '',
    getCount: () => vd!.getValue().length - 1 || 0,
    setValue: (content: string) => vd?.setValue(content)
  }));
  useEffect(() => {
    const vditor = new Vditor("vditor", {
      mode: "ir",
      theme: theme === "dark" ? "dark" : "classic",
      after: () => {
        vditor.setValue("> 开始编辑");
        setVd(vditor);
      },
      "counter": {
        "enable": true,
        "type": "markdown"
      },
      upload: {
        handler: async (files): Promise<string> => {
          const file = files[0];
          try {
            // 清理文件名
            const originalName = file.name;
            const [namePart, ...extParts] = originalName.split('.');
            const extension = extParts.length > 0 ? extParts.pop() : '';
            const cleanNamePart = namePart.replace(/[^\w]/g, '') || Date.now().toString();
            const cleanFileName = extension ? `${cleanNamePart}.${extension}` : cleanNamePart;
            // 创建新File对象
            const cleanedFile = new File([file], cleanFileName, { type: file.type });
            // 上传文件
            const { data } = await uploadFile(cleanedFile);
            console.log('Upload successful:', data.url);
            const markdown = `![${cleanFileName}](${data.url})`;
            vditor.insertValue(markdown);
            return data.url;
          } catch (error) {
            console.error('Upload failed:', error);
            return 'Upload failed';
          }
        }
      },
      toolbar: [
        'emoji', 'upload', '|', 'headings', 'bold', 'italic', 'strike', '|',
        'list', 'ordered-list', 'check', 'outdent', 'indent', '|',
        'link', 'table', 'code', 'inline-code', 'export', '|', 'undo', 'redo'
      ]
    })
  }, []);
  useEffect(() => {
    if (vd && theme) {
      vd.setTheme(theme === "dark" ? "dark" : "classic");
    }
  }, [theme, vd]);
  return (
    <div className="vditor-container">
      <div id="vditor" className="vditor" />
    </div>
  )
})
export default IREditor
