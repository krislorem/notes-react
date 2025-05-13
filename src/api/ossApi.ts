import authAxios from "./authAxios";

const uploadFile = async (file: File) => {
  const formData = new FormData();
  formData.append("file", file);
  const response = await authAxios.post("/api/oss/upload", formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });
  return response.data;
}
export { uploadFile };
