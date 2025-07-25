"use client";

import React, { useState } from "react";
import { PlusOutlined } from "@ant-design/icons";
import { Image, Upload } from "antd";
import type { GetProp, UploadFile, UploadProps } from "antd";
import { sonnerError } from "../sonner/sonner";
import { uploadApi } from "@/api-client";
import { IImage } from "@/models";

type FileType = Parameters<GetProp<UploadProps, "beforeUpload">>[0];

const getBase64 = (file: FileType): Promise<string> =>
  new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => resolve(reader.result as string);
    reader.onerror = (error) => reject(error);
  });

export interface UploadThumbnailProps {
  getThumbnail?: (
    value: Pick<IImage, "public_id" | "url" | "is_temp">[]
  ) => void;
}

export default function UploadThumbnail({
  getThumbnail,
}: UploadThumbnailProps) {
  const [previewOpen, setPreviewOpen] = useState(false);
  const [previewImage, setPreviewImage] = useState("");
  const [fileList, setFileList] = useState<UploadFile[]>([]);

  const beforeUpload: UploadProps["beforeUpload"] = (file, newfileList) => {
    const currentTotal = newfileList.length + fileList.length;
    // console.log("current total", currentTotal);
    if (currentTotal > 1) {
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

  const handleRemove: UploadProps["onRemove"] = () => {
    getThumbnail?.([]);
    return true;
  };

  const customRequest: UploadProps["customRequest"] = async (options) => {
    const { file, onSuccess, onError, onProgress } = options;

    const formData = new FormData();
    formData.append("files", file);

    try {
      const response = await uploadApi.thumbnail(formData, {
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
      getThumbnail?.(response.data.images || []);
      // console.log("response.data.images", response.data.images);
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
      <h3 className="font-semibold text-lg">Thumbnail</h3>
      <Upload
        // action="http://localhost:5555/api/proxy/upload/image"
        listType="picture-card"
        accept="image/*"
        fileList={fileList}
        onPreview={handlePreview}
        onChange={handleChange}
        onRemove={handleRemove}
        beforeUpload={beforeUpload}
        customRequest={customRequest}
        // className="custom-upload"
      >
        {fileList.length >= 1 ? null : uploadButton}
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
