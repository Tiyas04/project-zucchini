"use client";

import { useState, useRef, DragEvent, ChangeEvent } from "react";
import { Upload, Check, Copy, X, Loader2, Image, FileText } from "lucide-react";

interface UploadedFile {
  url: string;
  publicId: string;
  format: string;
  resourceType: string;
  fileName: string;
  timestamp: number;
}

export default function CloudinaryUploader() {
  const [isDragging, setIsDragging] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadedFiles, setUploadedFiles] = useState<UploadedFile[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [copiedUrl, setCopiedUrl] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleDragOver = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const handleDrop = async (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(false);

    const files = Array.from(e.dataTransfer.files);
    if (files.length > 0) {
      await uploadFiles(files);
    }
  };

  const handleFileSelect = async (e: ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    if (files.length > 0) {
      await uploadFiles(files);
    }
  };

  const uploadFiles = async (files: File[]) => {
    setError(null);
    setIsUploading(true);

    for (const file of files) {
      try {
        const formData = new FormData();
        formData.append("file", file);

        const response = await fetch("/api/cloudinary-upload", {
          method: "POST",
          body: formData,
        });

        const result = await response.json();

        if (!result.success) {
          throw new Error(result.error || "Upload failed");
        }

        setUploadedFiles((prev) => [
          {
            url: result.data.url,
            publicId: result.data.publicId,
            format: result.data.format,
            resourceType: result.data.resourceType,
            fileName: file.name,
            timestamp: Date.now(),
          },
          ...prev,
        ]);
      } catch (err) {
        setError(err instanceof Error ? err.message : "Upload failed");
      }
    }

    setIsUploading(false);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const copyToClipboard = async (url: string) => {
    try {
      await navigator.clipboard.writeText(url);
      setCopiedUrl(url);
      setTimeout(() => setCopiedUrl(null), 2000);
    } catch (err) {
      console.error("Failed to copy:", err);
    }
  };

  const removeFile = (timestamp: number) => {
    setUploadedFiles((prev) => prev.filter((file) => file.timestamp !== timestamp));
  };

  return (
    <div className="w-full max-w-4xl mx-auto space-y-6">
      <div
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        onClick={() => fileInputRef.current?.click()}
        className={`
          relative border-2 border-dashed rounded-lg p-12 text-center cursor-pointer
          transition-all duration-200
          ${
            isDragging
              ? "border-blue-500 bg-blue-50"
              : "border-gray-300 hover:border-gray-400 hover:bg-gray-50"
          }
          ${isUploading ? "pointer-events-none opacity-60" : ""}
        `}
      >
        <input
          ref={fileInputRef}
          type="file"
          multiple
          onChange={handleFileSelect}
          className="hidden"
          accept="image/*,video/*,.pdf,.doc,.docx"
        />

        <div className="flex flex-col items-center gap-4">
          {isUploading ? (
            <>
              <Loader2 className="w-12 h-12 text-gray-600 animate-spin" />
              <p className="text-gray-700">Uploading...</p>
            </>
          ) : (
            <>
              <div className="p-3 bg-gray-200 rounded-full">
                <Upload className="w-10 h-10 text-gray-700" />
              </div>
              <div>
                <p className="text-lg font-medium text-gray-800 mb-1">
                  Drop files here or click to browse
                </p>
                <p className="text-sm text-gray-500">Supports images, videos, and documents</p>
              </div>
            </>
          )}
        </div>
      </div>

      {error && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4 flex items-start gap-3">
          <X className="w-5 h-5 text-red-500 flex-shrink-0 mt-0.5" />
          <div>
            <p className="font-medium text-red-800">Upload Error</p>
            <p className="text-sm text-red-600">{error}</p>
          </div>
          <button
            onClick={() => setError(null)}
            className="ml-auto text-red-500 hover:text-red-700"
          >
            <X className="w-5 h-5" />
          </button>
        </div>
      )}

      {uploadedFiles.length > 0 && (
        <div className="space-y-4">
          <h3 className="text-lg font-semibold text-gray-800">Uploaded Files</h3>
          <div className="space-y-3">
            {uploadedFiles.map((file) => (
              <div
                key={file.timestamp}
                className="bg-white border border-gray-200 rounded-lg p-4 hover:border-gray-300 transition-colors"
              >
                <div className="flex items-start gap-4">
                  {/* File Icon/Preview */}
                  <div className="flex-shrink-0">
                    {file.resourceType === "image" ? (
                      <div className="w-16 h-16 rounded-lg overflow-hidden bg-gray-100">
                        <img
                          src={file.url}
                          alt={file.fileName}
                          className="w-full h-full object-cover"
                        />
                      </div>
                    ) : (
                      <div className="w-16 h-16 rounded-lg bg-gray-100 flex items-center justify-center">
                        <FileText className="w-8 h-8 text-gray-600" />
                      </div>
                    )}
                  </div>

                  <div className="flex-1 min-w-0">
                    <p className="font-medium text-gray-800 truncate mb-1">{file.fileName}</p>
                    <p className="text-sm text-gray-500 mb-2">
                      {file.format.toUpperCase()} • {file.resourceType}
                    </p>

                    <div className="flex items-center gap-2 bg-gray-50 rounded-lg p-2 border border-gray-200">
                      <input
                        type="text"
                        value={file.url}
                        readOnly
                        className="flex-1 bg-transparent text-sm text-gray-700 outline-none"
                      />
                      <button
                        onClick={() => copyToClipboard(file.url)}
                        className="flex items-center gap-1.5 px-3 py-1.5 bg-blue-500 hover:bg-blue-600 text-white text-sm font-medium rounded-md transition-colors"
                      >
                        {copiedUrl === file.url ? (
                          <>
                            <Check className="w-4 h-4" />
                            Copied
                          </>
                        ) : (
                          <>
                            <Copy className="w-4 h-4" />
                            Copy
                          </>
                        )}
                      </button>
                    </div>
                  </div>

                  <button
                    onClick={() => removeFile(file.timestamp)}
                    className="flex-shrink-0 p-2 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
