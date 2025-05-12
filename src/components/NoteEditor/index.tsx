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
        handler: async (files) => {
          const file = files[0];
          try {
            const { url } = await uploadFile(file);
            return url;
          } catch (error) {
            console.error('Upload failed:', error);
            return '';
          }
        }
      },
      toolbar: [
        'emoji', 'upload', '|', 'headings', 'bold', 'italic', 'strike', '|',
        'list', 'ordered-list', 'check', 'outdent', 'indent', '|',
        'link', 'table', 'code', 'inline-code', '|', 'undo', 'redo'
      ],
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
