"use client";

import { useEffect, useState } from "react";
import { uploadApi } from "@/api-client";
import { PlusOutlined } from "@ant-design/icons";
import { Upload, Image } from "antd";
import type { UploadFile, UploadProps, GetProp } from "antd";
import { sonnerError } from "../sonner/sonner";
import { ImageResponsePayload } from "@/models";

type FileType = Parameters<GetProp<UploadProps, "beforeUpload">>[0];

const getBase64 = (file: FileType): Promise<string> =>
  new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => resolve(reader.result as string);
    reader.onerror = (error) => reject(error);
  });

export interface UploadDescriptionProps {
  getImageList?: (listValue: ImageResponsePayload[]) => void;
}

export default function UploadDescription({
  getImageList,
}: UploadDescriptionProps) {
  const [previewOpen, setPreviewOpen] = useState(false);
  const [previewImage, setPreviewImage] = useState("");
  const [fileList, setFileList] = useState<UploadFile[]>([]);

  useEffect(() => {
    const imagesResponse = fileList.map((item) => item.response);
    getImageList?.(imagesResponse || []);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [fileList]);

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

  const handleRemove: UploadProps["onRemove"] = async () => {
    // console.log("file list", fileList);
    // console.log("handle remove", file.response);

    return true;
  };

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

      const uploadedData = response.data;

      // Update state: thêm response vào đúng file trong fileList
      setFileList((prevList) =>
        prevList.map((item) =>
          item.uid === (file as UploadFile).uid
            ? {
                ...item,
                response: uploadedData, //  lưu response tại đây
                url: uploadedData.url, //  optional: để preview ảnh luôn
              }
            : item
        )
      );

      // Simulate progress as 100% after upload is done
      onProgress?.({ percent: 100 }, file);
      onSuccess?.(uploadedData, file);
      // console.log(response);
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
        onRemove={handleRemove}
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
