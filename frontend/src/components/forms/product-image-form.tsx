import { IImage, ImageResponsePayload } from "@/models";
import UploadDescription from "./upload-description";
import UploadThumbnail from "./upload-thumbnail";

export interface ProductImageFormProps {
  getThumbnail?: (
    value: Pick<IImage, "public_id" | "url" | "is_temp">[]
  ) => void;
  getImageList?: (listValue: ImageResponsePayload[]) => void;
}

export default function ProductImageForm({
  getThumbnail,
  getImageList,
}: ProductImageFormProps) {
  return (
    <div className="w-full">
      <div className="mb-4">
        <UploadThumbnail getThumbnail={getThumbnail} />
      </div>
      <div className="mb-4">
        <UploadDescription getImageList={getImageList} />
      </div>
    </div>
  );
}
