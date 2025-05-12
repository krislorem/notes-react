import baseAxios from "./axiosInstance";

const uploadFile = async (file: File) => {
  const formData = new FormData();
  formData.append("file", file);
  const response = await baseAxios.post("/api/oss/upload", formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });
  return response.data;
}
export default uploadFile;