"use client";

import { useState, useRef, DragEvent, ChangeEvent, useEffect } from "react";
import { Upload, Check, Copy, X, Loader2, Image, FileText } from "lucide-react";

interface UploadedFile {
  url: string;
  publicId: string;
  format: string;
  resourceType: string;
  fileName: string;
  timestamp: number;
}

interface CloudinaryUploaderProps {
  maxFiles?: number;
  value?: string;
  onUploadComplete?: (url: string) => void;
  showCopyButton?: boolean;
  compact?: boolean;
}

export default function CloudinaryUploader({
  maxFiles,
  value,
  onUploadComplete,
  showCopyButton = false,
  compact = false,
}: CloudinaryUploaderProps = {}) {
  const [isDragging, setIsDragging] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadedFiles, setUploadedFiles] = useState<UploadedFile[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [copiedUrl, setCopiedUrl] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Sync uploadedFiles from value prop (for restoring from localStorage or external state changes)
  useEffect(() => {
    if (value && uploadedFiles.length === 0) {
      // Extract filename from URL
      const urlParts = value.split("/");
      const fileName = urlParts[urlParts.length - 1] || "uploaded-file";
      const fileExtension = fileName.split(".").pop();

      setUploadedFiles([
        {
          url: value,
          publicId: fileName,
          format: fileExtension || "file",
          resourceType: "image", // Assume image for ID cards
          fileName: fileName,
          timestamp: Date.now(),
        },
      ]);
    } else if (!value && uploadedFiles.length > 0) {
      // Clear files when value is cleared externally
      setUploadedFiles([]);
    }
  }, [value]);

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

    const cloudName = process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME;
    const uploadPreset = process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET;

    if (!cloudName || !uploadPreset) {
      setError("Cloudinary configuration is missing");
      setIsUploading(false);
      return;
    }

    // Respect maxFiles limit
    const filesToUpload = maxFiles ? files.slice(0, maxFiles) : files;

    for (const file of filesToUpload) {
      try {
        // Validate file type
        // const ALLOWED_TYPES = ["image/jpeg", "image/png", "image/webp", "application/pdf"];
        // if (!ALLOWED_TYPES.includes(file.type)) {
        //   throw new Error("Only JPEG, PNG, WebP images and PDF files are allowed");
        // }

        // Validate file size (5MB max)
        const MAX_SIZE = 5 * 1024 * 1024;
        if (file.size > MAX_SIZE) {
          throw new Error("Maximum file size is 5MB");
        }

        const formData = new FormData();
        formData.append("file", file);
        formData.append("upload_preset", uploadPreset);
        formData.append("folder", "nitrutsav-2026");

        const response = await fetch(`https://api.cloudinary.com/v1_1/${cloudName}/auto/upload`, {
          method: "POST",
          body: formData,
        });

        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.error?.message || "Upload failed");
        }

        const result = await response.json();

        const uploadedFile = {
          url: result.secure_url,
          publicId: result.public_id,
          format: result.format,
          resourceType: result.resource_type,
          fileName: file.name,
          timestamp: Date.now(),
        };

        // If maxFiles is 1, replace the existing file
        if (maxFiles === 1) {
          setUploadedFiles([uploadedFile]);
        } else {
          setUploadedFiles((prev) => [uploadedFile, ...prev]);
        }

        // Call the callback with the URL
        onUploadComplete?.(result.secure_url);
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
      if (navigator.clipboard && navigator.clipboard.writeText) {
        await navigator.clipboard.writeText(url);
        setCopiedUrl(url);
        setTimeout(() => setCopiedUrl(null), 2000);
      } else {
        // Fallback for when navigator.clipboard is not available (e.g., http)
        const textArea = document.createElement("textarea");
        textArea.value = url;

        // Ensure it's not visible but part of the DOM
        textArea.style.position = "fixed";
        textArea.style.left = "-9999px";
        textArea.style.top = "0";
        document.body.appendChild(textArea);

        textArea.focus();
        textArea.select();

        try {
          const successful = document.execCommand("copy");
          if (successful) {
            setCopiedUrl(url);
            setTimeout(() => setCopiedUrl(null), 2000);
          } else {
            console.error("Fallback: Copy command was unsuccessful");
            setError("Failed to copy URL");
          }
        } catch (err) {
          console.error("Fallback: Oops, unable to copy", err);
          setError("Failed to copy URL");
        }

        document.body.removeChild(textArea);
      }
    } catch (err) {
      console.error("Failed to copy:", err);
      // Try fallback if primary method fails
      try {
        const textArea = document.createElement("textarea");
        textArea.value = url;
        textArea.style.position = "fixed";
        textArea.style.left = "-9999px";
        textArea.style.top = "0";
        document.body.appendChild(textArea);
        textArea.focus();
        textArea.select();
        document.execCommand("copy");
        document.body.removeChild(textArea);
        setCopiedUrl(url);
        setTimeout(() => setCopiedUrl(null), 2000);
      } catch (fallbackErr) {
        setError("Failed to copy to clipboard");
      }
    }
  };

  const removeFile = (timestamp: number) => {
    setUploadedFiles((prev) => prev.filter((file) => file.timestamp !== timestamp));
  };

  return (
    <div className={`w-full ${compact ? "space-y-2" : "space-y-4"}`}>
      <div
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        onClick={() => fileInputRef.current?.click()}
        className={`
          relative border-2 border-dashed rounded-[13px] text-center cursor-pointer
          transition-all duration-200 backdrop-blur-[9.25px]
          ${compact ? "p-3" : maxFiles === 1 ? "p-6" : "p-12"}
          ${
            isDragging
              ? "border-white bg-white/30"
              : "border-white/60 hover:border-white bg-white/20 hover:bg-white/25"
          }
          ${isUploading ? "pointer-events-none opacity-60" : ""}
        `}
      >
        <input
          ref={fileInputRef}
          type="file"
          multiple={!maxFiles || maxFiles > 1}
          onChange={handleFileSelect}
          className="hidden"
          accept="image/*,video/*,.pdf,.doc,.docx,.svg"
        />

        <div className={`flex flex-col items-center ${compact ? "gap-1.5" : "gap-3"}`}>
          {isUploading ? (
            <>
              <Loader2
                className={`${compact ? "w-6 h-6" : maxFiles === 1 ? "w-8 h-8" : "w-12 h-12"} text-white animate-spin`}
              />
              <p className="text-white font-semibold text-xs">Uploading...</p>
            </>
          ) : uploadedFiles.length > 0 && maxFiles === 1 ? (
            <>
              <div
                className={`${compact ? "p-1" : "p-2"} bg-green-400/30 backdrop-blur-[9.25px] rounded-full border-2 border-green-400`}
              >
                <svg
                  className={`${compact ? "w-4 h-4" : "w-6 h-6"} text-green-100`}
                  fill="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41z" />
                </svg>
              </div>
              <p className={`${compact ? "text-xs" : "text-sm"} font-semibold text-white`}>
                Uploaded ✓
              </p>
              {!compact && <p className="text-xs text-white/80">Click to change</p>}
            </>
          ) : (
            <>
              <div
                className={`bg-white/30 backdrop-blur-[9.25px] rounded-full ${compact ? "p-1.5" : maxFiles === 1 ? "p-2" : "p-3"}`}
              >
                <Upload
                  className={`${compact ? "w-4 h-4" : maxFiles === 1 ? "w-6 h-6" : "w-10 h-10"} text-white`}
                />
              </div>
              <div>
                <p
                  className={`${compact ? "text-xs" : maxFiles === 1 ? "text-base" : "text-lg"} font-semibold text-white ${compact ? "" : "mb-1"}`}
                >
                  {compact
                    ? "Click to upload"
                    : `Drop ${maxFiles === 1 ? "file" : "files"} here or click`}
                </p>
                {!compact && (
                  <p className="text-sm text-white/80">
                    Supports images (including SVG), videos, and documents
                  </p>
                )}
              </div>
            </>
          )}
        </div>
      </div>

      {error && (
        <div className="bg-red-500/20 border-2 border-red-400 rounded-[13px] backdrop-blur-[9.25px] p-4 flex items-start gap-3">
          <X className="w-5 h-5 text-red-200 flex-shrink-0 mt-0.5" />
          <div>
            <p className="font-semibold text-red-100">Upload Error</p>
            <p className="text-sm text-red-200">{error}</p>
          </div>
          <button
            onClick={() => setError(null)}
            className="ml-auto text-red-200 hover:text-red-100"
          >
            <X className="w-5 h-5" />
          </button>
        </div>
      )}

      {uploadedFiles.length > 0 && !compact && (
        <div className="space-y-4">
          <h3 className="text-lg font-semibold text-white">Uploaded Files</h3>
          <div className="space-y-3">
            {uploadedFiles.map((file) => (
              <div
                key={file.timestamp}
                className="bg-white/25 border-2 border-white/40 rounded-[13px] backdrop-blur-[9.25px] p-4 hover:bg-white/30 transition-colors"
              >
                <div className="flex items-start gap-4">
                  {/* File Icon/Preview */}
                  <div className="flex-shrink-0">
                    {file.resourceType === "image" ? (
                      <div className="w-16 h-16 rounded-lg overflow-hidden bg-white/20">
                        <img
                          src={file.url}
                          alt={file.fileName}
                          className="w-full h-full object-cover"
                        />
                      </div>
                    ) : (
                      <div className="w-16 h-16 rounded-lg bg-white/20 flex items-center justify-center">
                        <FileText className="w-8 h-8 text-white" />
                      </div>
                    )}
                  </div>

                  <div className="flex-1 min-w-0">
                    <p className="font-semibold text-white truncate mb-1">{file.fileName}</p>
                    <p className="text-sm text-white/80">
                      {file.format?.toUpperCase() || "FILE"} • {file.resourceType}
                    </p>
                  </div>

                  <div className="flex items-center gap-2">
                    {showCopyButton && (
                      <button
                        onClick={() => copyToClipboard(file.url)}
                        className="flex-shrink-0 p-2 text-white/70 hover:text-white hover:bg-white/20 rounded-lg transition-colors"
                        title="Copy URL"
                      >
                        {copiedUrl === file.url ? (
                          <Check className="w-5 h-5 text-green-300" />
                        ) : (
                          <Copy className="w-5 h-5" />
                        )}
                      </button>
                    )}

                    <button
                      onClick={() => removeFile(file.timestamp)}
                      className="flex-shrink-0 p-2 text-white/70 hover:text-red-300 hover:bg-white/20 rounded-lg transition-colors"
                    >
                      <X className="w-5 h-5" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
