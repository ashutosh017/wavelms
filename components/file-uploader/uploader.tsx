
import { useCallback, useState } from "react";
import { FileRejection, useDropzone } from "react-dropzone";
import { Card, CardContent } from "../ui/card";
import { cn } from "@/lib/utils";
import {
  RenderEmptyState,
  RenderErrorState,
  RenderUploadedState,
  RenderUploadingState,
} from "./render-state";
import { toast } from "sonner";
import { v4 as uuid } from "uuid";
interface UploaderState {
  id: string | null;
  file: File | null;
  uploading: boolean;
  progress: number;
  key?: string;
  isDeleting: boolean;
  error: boolean;
  objectUrl?: string;
  fileType: "image" | "video";
}

export default function Uploader() {
  const [fileState, setFileState] = useState<UploaderState>({
    id: null,
    error: false,
    file: null,
    fileType: "image",
    isDeleting: false,
    progress: 0,
    uploading: false,
  });
  async function uploadFile(file: File) {
    setFileState((prev) => ({
      ...prev,
      progress: 0,
      uploading: true,
    }));

    try {
      const preSignedUrlResponse = await fetch("/api/s3/upload", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          fileName: file.name,
          contentType: file.type,
          size: file.size,
          isImage: true,
        }),
      });
      if (!preSignedUrlResponse.ok) {
        toast.error("Failed to get presigned URL");
        setFileState((prev) => ({
          ...prev,
          error: true,
          progress: 0,
          uploading: false,
        }));
        return;
      }
      const { preSignedUrl, key } = await preSignedUrlResponse.json();
      console.log(preSignedUrl)
      await new Promise<void>((resolve, reject) => {
        const xhr = new XMLHttpRequest();
        xhr.upload.onprogress = (event) => {
          if (event.lengthComputable) {
            const percentageCompleted = (event.loaded / event.total) * 100;
            setFileState((prev) => ({
              ...prev,
              progress: Math.round(percentageCompleted),
              uploading: true,
            }));
          }
        };
        xhr.onload = () => {
          if (xhr.status === 200 || xhr.status === 204) {
            setFileState((prev) => ({
              ...prev,
              progress: 100,
              uploading: false,
              key: key,
            }));
            toast.success("File uploaded successfully");
            resolve();
          } else {
            reject(new Error("Upload failed..."));
          }
        };
        xhr.onerror = () => {
          reject(new Error("Some error occurred while uploading..."));
        };
        xhr.open("PUT", preSignedUrl);
        xhr.setRequestHeader("Content-Type", file.type);
        xhr.send(file);
      });
    } catch (error) {
        console.log("errorf: ",error)
      toast.error("Something went wrong");
      setFileState((prev) => ({
        ...prev,
        uploading: false,
        progress: 0,
        error: true,
      }));
    }
  }
  function RenderContent() {
    if (fileState.uploading) {
      return (
        <RenderUploadingState
          file={fileState.file as File}
          progress={fileState.progress}
        />
      );
    }
    if (fileState.error) {
      return <RenderErrorState />;
    }
    if (fileState.objectUrl) {
      return <RenderUploadedState previewUrl={fileState.objectUrl} />;
    }
    return <RenderEmptyState isDragActive={isDragActive} />;
  }
  const onDrop = useCallback((acceptedFiles: File[]) => {
    if (acceptedFiles.length > 0) {
      const file = acceptedFiles[0];
      setFileState({
        file,
        error: false,
        fileType: "image",
        id: uuid(),
        isDeleting: false,
        progress: 0,
        uploading: false,
        objectUrl: URL.createObjectURL(file),
      });
      uploadFile(file);
    }
  }, []);
  function rejectedFiles(fileRejection: FileRejection[]) {
    if (fileRejection.length) {
      const tooManyFiles = fileRejection.find(
        (rejection) => rejection.errors[0].code === "too-many-files"
      );
      if (tooManyFiles) {
        toast.error("Too many files selected, max is 1");
      }
      const fileSizeIsTooBig = fileRejection.find(
        (rejection) => rejection.errors[0].code === "file-too-large"
      );
      if (fileSizeIsTooBig) {
        toast.error("File size exceeds the limit");
      }
    }
  }
  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: { "image/*": [] },
    maxFiles: 1,
    multiple: false,
    maxSize: 5 * 1024 * 1024,
    onDropRejected:rejectedFiles
  });

  return (
    <Card
      {...getRootProps()}
      className={cn(
        "relative border-2 border-dashed transition-colors duration-200 ease-in-out w-full h-64",
        isDragActive
          ? "border-primary bg-primary/10 border-solid"
          : "border-border hover:border-primary"
      )}
    >
      <CardContent className="flex items-center justify-center w-full h-full">
        <input {...getInputProps()} />
        {RenderContent()}
      </CardContent>
    </Card>
  );
}
