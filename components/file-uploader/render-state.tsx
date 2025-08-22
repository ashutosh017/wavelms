import { cn } from "@/lib/utils";
import { CloudUploadIcon, ImageIcon, Loader2Icon, XIcon } from "lucide-react";
import { Button } from "../ui/button";
import Image from "next/image";

export function RenderEmptyState({ isDragActive }: { isDragActive: boolean }) {
  return (
    <div className="text-center ">
      <div className="flex items-center mx-auto justify-center size-12 rounded-full bg-muted mb-4">
        <CloudUploadIcon
          className={cn(
            "size-6 text-muted-foreground",
            isDragActive && "text-primary"
          )}
        />
      </div>
      <p className="text-base font-semibold text-foreground">
        Drop your files here or{" "}
        <span className="text-primary font-bold cursor-pointer">
          click to upload
        </span>
      </p>
      <Button type="button" className="mt-4">
        Select File
      </Button>
    </div>
  );
}

export function RenderErrorState() {
  return (
    <div className="text-center">
      <div className="flex items-center mx-auto justify-center size-12 rounded-full bg-muted mb-4">
        <ImageIcon className="size-6 text-destructive" />
      </div>
      <p className="text-base font-semibold">Upload Failed</p>
      <p className="text-xs mt-1 text-muted-foreground">Something went wrong</p>
      <Button className="mt-4" type="button">
        Retry File Selection
      </Button>
    </div>
  );
}

export function RenderUploadedState({
  previewUrl,
  isDeleting,
  handleRemoveFile,
  fileType,
}: {
  previewUrl: string;
  isDeleting: boolean;
  handleRemoveFile: () => void;
  fileType: "image" | "video";
}) {
  return (
    <div className="relative group w-full h-full flex items-center">
      {fileType === "video" ? (
        <video src={previewUrl} controls className="rounded-md w-full h-full" />
      ) : (
        <Image
          src={previewUrl}
          alt="Uploaded Image"
          fill
          className="object-contain p-2"
        />
      )}
      <Button
        size={"icon"}
        variant={"destructive"}
        type="button"
        onClick={handleRemoveFile}
        disabled={isDeleting}
        className="absolute top-4 right-4 "
      >
        {isDeleting ? (
          <>
            <Loader2Icon className="size-4 animate-spin" />
          </>
        ) : (
          <>
            <XIcon className="size-4 " />
          </>
        )}
      </Button>
    </div>
  );
}

export function RenderUploadingState({
  progress,
  file,
}: {
  progress: number;
  file: File;
}) {
  return (
    <div className="flex items-center justify-center flex-col text-center">
      <p>{progress}%</p>
      <p className="mt-2 text-sm font-medium text-foreground"> Uploading...</p>
      <p className="mt-1 text-xs text-muted-foreground truncate max-w-xs">
        {file.name}
      </p>
    </div>
  );
}
