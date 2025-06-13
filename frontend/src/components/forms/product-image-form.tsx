import UploadDescription from "./upload-description";
import UploadThumbnail from "./upload-thumbnail";

export default function ProductImageForm() {
  return (
    <div className="w-full">
      <div className="mb-4">
        <UploadThumbnail />
      </div>
      <div className="mb-4">
        <UploadDescription />
      </div>
    </div>
  );
}
