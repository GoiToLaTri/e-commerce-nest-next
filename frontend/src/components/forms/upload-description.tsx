"use client";

import { useState } from "react";
import { uploadApi } from "@/api-client";
import { PlusOutlined } from "@ant-design/icons";
import { Upload, Image } from "antd";
import type { UploadFile, UploadProps, GetProp } from "antd";
import { sonnerError } from "../sonner/sonner";

type FileType = Parameters<GetProp<UploadProps, "beforeUpload">>[0];

const getBase64 = (file: FileType): Promise<string> =>
  new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => resolve(reader.result as string);
    reader.onerror = (error) => reject(error);
  });

export default function UploadDescription() {
  const [previewOpen, setPreviewOpen] = useState(false);
  const [previewImage, setPreviewImage] = useState("");
  const [fileList, setFileList] = useState<UploadFile[]>([]);

  const beforeUpload: UploadProps["beforeUpload"] = (file, newfileList) => {
    const currentTotal = newfileList.length + fileList.length;
    // console.log("current total", currentTotal);
    if (currentTotal > 8) {
      sonnerError("You can only upload up to 8 images.");
      return Upload.LIST_IGNORE;
    }
    return true;
  };

  const handlePreview = async (file: UploadFile) => {
    if (!file.url && !file.preview) {
      file.preview = await getBase64(file.originFileObj as FileType);
    }

    setPreviewImage(file.url || (file.preview as string));
    setPreviewOpen(true);
  };

  const handleChange: UploadProps["onChange"] = ({ fileList: newFileList }) =>
    setFileList(newFileList);

  const customRequest: UploadProps["customRequest"] = async (options) => {
    const { file, onSuccess, onError, onProgress } = options;

    const formData = new FormData();
    formData.append("files", file);

    try {
      const response = await uploadApi.images(formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
        onUploadProgress: (event) => {
          const percent = Math.floor((event.loaded / event.total!) * 100);
          if (onProgress) {
            onProgress({ percent }, file);
          }
        },
      });
      // Simulate progress as 100% after upload is done
      onProgress?.({ percent: 100 }, file);
      onSuccess?.(response.data, file);
      console.log(response);
    } catch (err) {
      onError?.(err as Error);
    }
  };

  const uploadButton = (
    <button
      style={{
        border: 0,
        background: "none",
      }}
      type="button"
    >
      <PlusOutlined />
      <div style={{ marginTop: 8 }}>Upload</div>
    </button>
  );
  return (
    <div className="w-full">
      <h3 className="font-semibold text-lg">Product images</h3>
      <Upload
        listType="picture-card"
        accept="image/*"
        fileList={fileList}
        onPreview={handlePreview}
        onChange={handleChange}
        beforeUpload={beforeUpload}
        customRequest={customRequest}
        multiple
      >
        {fileList.length >= 8 ? null : uploadButton}
      </Upload>
      {previewImage && (
        <Image
          wrapperStyle={{ display: "none" }}
          preview={{
            visible: previewOpen,
            onVisibleChange: (visible) => setPreviewOpen(visible),
            afterOpenChange: (visible) => !visible && setPreviewImage(""),
          }}
          src={previewImage}
          alt="thumbnail"
        />
      )}
    </div>
  );
}
