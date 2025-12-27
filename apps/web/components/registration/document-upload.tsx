import CloudinaryUploader from "../cloudinary-uploader";

interface DocumentUploadProps {
  label: string;
  description?: string;
  value: string | undefined;
  error?: string;
  onUploadComplete: (url: string) => void;
}

export default function DocumentUpload({
  label,
  description,
  value,
  error,
  onUploadComplete,
}: DocumentUploadProps) {
  return (
    <div>
      <label className="block text-sm font-semibold text-gray-700 mb-2">
        {label} <span className="text-red-500">*</span>
      </label>
      {description && <p className="text-xs text-gray-500 mb-2">{description}</p>}
      <CloudinaryUploader maxFiles={1} value={value} onUploadComplete={onUploadComplete} />
      {error && <p className="mt-1 text-sm text-red-600">{error}</p>}
    </div>
  );
}
