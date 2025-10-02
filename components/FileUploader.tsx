"use client";

import { formatSize } from "@/lib/utils";
import Image from "next/image";
import { useCallback } from "react";
import { useDropzone } from "react-dropzone";

interface FileUploaderProps {
  onFileSelect?: (file: File | null) => void;
}

const FileUploader = ({ onFileSelect }: FileUploaderProps) => {
  const onDrop = useCallback(
    (acceptedFiles: File[]) => {
      const file = acceptedFiles[0] || null;

      onFileSelect?.(file);
    },
    [onFileSelect]
  );

  const maxFileSize = 20 * 1024 * 1024; // 20MB in bytes

  const { getRootProps, getInputProps, isDragActive, acceptedFiles } =
    useDropzone({
      onDrop,
      multiple: false,
      accept: { "application/pdf": [".pdf"] },
      maxSize: maxFileSize,
    });

  const file = acceptedFiles[0] || null;

  return (
    <div className="w-full gradient-border">
      <div {...getRootProps()}>
        <input {...getInputProps()} />

        <div className="space-y-4 cursor-pointer">
          <p className="text-white">Upload Resume</p>
          {file ? (
            <div
              className="flex items-center justify-between p-3 bg-gray-50 rounded-2xl shadow-sm border border-gray-200"
              onClick={(e) => e.stopPropagation()}>
              {" "}
              {/* once you already uploaded a file, and click again, it won't open the file and just processes a new upload*/}
              <Image src="/images/pdf.png" alt="pdf" width={48} height={48} />
              <div className="flex items-center space-x-3">
                <div>
                  <p className="text-sm font-medium text-gray-700 truncate max-w-xs">
                    {file.name}
                  </p>
                  <p className="text-sm text-gray-500">
                    {formatSize(file.size)}
                  </p>
                </div>
              </div>
              <button
                className="p-2 cursor-pointer"
                onClick={(e) => {
                  onFileSelect?.(null);
                }}>
                <Image
                  src="/icons/cross.svg"
                  alt="remove"
                  width={36}
                  height={36}
                />
              </button>
            </div>
          ) : (
            <div className="p-4 border-2 border-gray-300 rounded-2xl flex flex-col items-center justify-center">
              <div className="mx-auto w-16 h-16 flex items-center justify-center mb-2">
                <Image
                  src="/icons/info.svg"
                  alt="upload"
                  width={36}
                  height={36}
                />
              </div>
              <p className="text-lg text-gray-500">
                <span className="font-semibold">Click to upload</span> or drag
                and drop
              </p>
              <p className="text-lg text-gray-500">
                PDF (max {formatSize(maxFileSize)})
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
export default FileUploader;
