// "use client";

// import { Upload, X } from "lucide-react";
// import Image from "next/image";
// import { Button } from "@/components/ui/button";
// import { type FileWithPreview, useFileUpload } from "@/hooks/use-file-upload";
// import { cn } from "@/lib/utils";

// interface FileUploadProps {
//   maxSize?: number;
//   className?: string;
//   onFileChange?: (file: FileWithPreview | null) => void;
//   defaultAvatar?: string;
//   accept: "image" | "pdf" | "image-pdf";
//   variant: "round" | "sqaure" | "rectangle";
// }

// const FileUpload = ({
//   maxSize = 2 * 1024 * 1024,
//   className,
//   onFileChange,
//   defaultAvatar,
// }: FileUploadProps) => {
//   const [
//     { files, isDragging },
//     {
//       removeFile,
//       handleDragEnter,
//       handleDragLeave,
//       handleDragOver,
//       handleDrop,
//       openFileDialog,
//       getInputProps,
//     },
//   ] = useFileUpload({
//     maxFiles: 1,
//     maxSize,
//     accept: "image/*",
//     multiple: false,
//     onFilesChange: (files) => {
//       onFileChange?.(files[0] || null);
//     },
//   });

//   const currentFile = files[0];
//   const previewUrl = currentFile?.preview || defaultAvatar;

//   const handleRemove = () => {
//     if (currentFile) {
//       removeFile(currentFile.id);
//     }
//   };

//   return (
//     <div className={cn("flex gap-4", className)}>
//       {/* Avatar Preview */}
//       <div className="relative">
//         <button
//           type="button"
//           className={cn(
//             "group/avatar relative h-32 w-32 cursor-pointer overflow-hidden rounded-full border border-dashed transition-colors",
//             isDragging
//               ? "border-primary bg-primary/5"
//               : "border-muted-foreground/25 hover:border-muted-foreground/20",
//             previewUrl && "border-solid",
//           )}
//           onDragEnter={handleDragEnter}
//           onDragLeave={handleDragLeave}
//           onDragOver={handleDragOver}
//           onDrop={handleDrop}
//           onClick={openFileDialog}
//         >
//           <input {...getInputProps()} className="sr-only" />

//           {previewUrl ? (
//             <Image
//               src={previewUrl}
//               alt="Avatar"
//               fill
//               className="h-full w-full object-cover"
//             />
//           ) : (
//             <div className="flex h-full w-full items-center justify-center">
//               <Upload className="size-4 text-muted-foreground" />
//             </div>
//           )}
//         </button>

//         {/* Remove Button - only show when file is uploaded */}
//         {currentFile && (
//           <Button
//             size="icon"
//             variant="outline"
//             onClick={handleRemove}
//             className="size-4 absolute end-0 top-1 right-4 rounded-full"
//             aria-label="Remove avatar"
//           >
//             <X className="size-3 text-destructive" />
//           </Button>
//         )}
//       </div>
//     </div>
//   );
// };

// export default FileUpload;

"use client";

import { FileText, Upload, X } from "lucide-react";
import Image from "next/image";
import type React from "react";
import { useEffect } from "react";
import { Button } from "@/components/ui/button";
import type {
  FileUploadOptions,
  FileUploadState,
  FileWithPreview,
} from "@/hooks/use-file-upload";
import { useFileUpload } from "@/hooks/use-file-upload";
import { cn } from "@/lib/utils";

type AcceptType = "image" | "pdf" | "image-pdf";

interface FileUploadProps {
  maxSize?: number; // bytes
  className?: string;
  onFileChange?: (file: FileWithPreview | null) => void;
  defaultPreview?: string;
  accept?: AcceptType;
  variant?: "round" | "square" | "rectangle";
  label?: React.ReactNode;
  disabled?: boolean;
}

const FileUpload: React.FC<FileUploadProps> = ({
  maxSize,
  className,
  onFileChange,
  defaultPreview,
  accept = "image",
  variant = "round",
  label,
  disabled = false,
}) => {
  const acceptAttr =
    accept === "image"
      ? "image/*"
      : accept === "pdf"
        ? "application/pdf"
        : "image/*,application/pdf";

  const [state, actions] = useFileUpload({
    maxFiles: 1,
    maxSize: maxSize ?? 2 * 1024 * 1024,
    accept: acceptAttr,
    multiple: false,
  } as FileUploadOptions);

  const { files, isDragging } = state as FileUploadState;
  const {
    removeFile,
    openFileDialog,
    handleDragEnter,
    handleDragLeave,
    handleDragOver,
    handleDrop,
    getInputProps,
    clearErrors,
  } = actions;

  // notify parent on change
  // biome-ignore lint/correctness/useExhaustiveDependencies: <explanation>
  useEffect(() => {
    const file = files[0] ?? null;
    onFileChange?.(file ?? null);
  }, [files]);

  const current = files[0] ?? null;

  // Outer wrapper controls overall size and allows negative-positioned remove button to be visible.
  const outerShapeClass =
    variant === "round"
      ? "h-40 w-40"
      : variant === "square"
        ? "h-32 w-32"
        : "h-40 w-full";

  // Inner preview area is clipped (overflow-hidden) and rounded as needed.
  const innerShapeClass =
    variant === "round"
      ? "rounded-full"
      : variant === "square"
        ? "rounded-md"
        : "rounded-md";

  // remove button placement differs per variant:
  const removeButtonClass =
    variant === "round"
      ? "absolute top-3 right-5 z-20 p-1 bg-white rounded-full border"
      : "absolute top-2 right-2 z-20 p-1 bg-white rounded-full border";

  const inputProps = getInputProps({
    accept: acceptAttr,
    disabled,
  });

  return (
    <div className={cn("flex flex-col items-start gap-2", className)}>
      {label && <div className="text-sm font-medium">{label}</div>}

      {/* Hidden input */}
      <input
        {...(inputProps as React.InputHTMLAttributes<HTMLInputElement>)}
        className="sr-only"
      />

      {/* Outer wrapper: relative so remove button positioned against it and NOT clipped */}
      <div
        className={cn(
          "relative flex items-center justify-center cursor-pointer",
          outerShapeClass,
          disabled && "pointer-events-none opacity-60",
        )}
        // Drag/drop & click handlers live on the outer wrapped preview area
        onClick={() => {
          if (!disabled) openFileDialog();
        }}
        onKeyDown={(e) => {
          if (!disabled && (e.key === "Enter" || e.key === " "))
            openFileDialog();
        }}
        onDragEnter={(e) => {
          if (!disabled) handleDragEnter(e);
        }}
        onDragLeave={(e) => {
          if (!disabled) handleDragLeave(e);
        }}
        onDragOver={(e) => {
          if (!disabled) handleDragOver(e);
        }}
        onDrop={(e) => {
          if (!disabled) handleDrop(e);
        }}
        role="button"
        tabIndex={0}
      >
        {/* Inner content: clipped and rounded */}
        <div
          className={cn(
            "relative h-full w-full overflow-hidden border border-dashed transition-colors bg-transparent flex items-center justify-center",
            innerShapeClass,
            isDragging
              ? "border-primary bg-primary/5"
              : "border-muted-foreground/25 hover:border-muted-foreground/20",
          )}
        >
          {/* preview */}
          {current?.preview || defaultPreview ? (
            // Decide if PDF preview or image
            (current?.file instanceof File &&
              current.file.type === "application/pdf") ||
            (typeof current?.file !== "object" &&
              /\.(pdf)(\?.*)?$/i.test(String(current?.preview))) ? (
              <div className="flex h-full w-full flex-col items-center justify-center gap-2 p-4 text-center">
                <FileText className="text-muted-foreground" />
                <div className="text-xs">
                  {current.file instanceof File
                    ? current.file.name
                    : (current.file as any).name}
                </div>
              </div>
            ) : // Use <img> for object URLs to avoid next/image blob limitations — but Next Image is ok for remote URLs.
            current?.preview ? (
              <Image
                src={current.preview}
                alt="preview"
                fill
                className="h-full w-full object-cover"
                style={{ display: "block" }}
              />
            ) : (
              <div className="flex items-center justify-center w-full h-full">
                <Upload className="size-6 text-muted-foreground" />
              </div>
            )
          ) : (
            <div className="flex flex-col items-center justify-center gap-2 px-4 text-center">
              <Upload className="size-6 text-muted-foreground" />
            </div>
          )}
        </div>

        {current && (
          <button
            type="button"
            className={removeButtonClass}
            onClick={(e) => {
              e.stopPropagation();
              removeFile(current.id);
              clearErrors();
            }}
          >
            <X className="size-3 text-destructive" />
          </button>
        )}
      </div>
    </div>
  );
};

export default FileUpload;
