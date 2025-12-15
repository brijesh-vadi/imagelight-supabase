"use client";

import { FileText, Upload, X } from "lucide-react";
import Image from "next/image";
import type React from "react";
import { useEffect } from "react";
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
  value?: FileWithPreview | null;
  variant?: "round" | "square" | "rectangle";
  label?: React.ReactNode;
  disabled?: boolean;
  size?: "sm" | "md" | "lg" | "xl";
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
  size = "md",
  value,
}) => {
  const acceptAttr =
    accept === "image"
      ? "image/*"
      : accept === "pdf"
        ? "application/pdf"
        : "image/*,application/pdf";

  const initialFiles = value
    ? [
        {
          id: value.id,
          name: value.file.name,
          size: value.file.size,
          type: value.file.type,
          url: value.preview || "",
        },
      ]
    : [];

  const [state, actions] = useFileUpload({
    initialFiles,
    maxFiles: 1,
    maxSize: maxSize ?? 2 * 1024 * 1024,
    accept: acceptAttr,
    multiple: false,
  } as FileUploadOptions);

  const getSizeClass = () => {
    if (variant === "round") {
      switch (size) {
        case "sm":
          return "h-24 w-24";
        case "md":
          return "h-40 w-40";
        case "lg":
          return "h-56 w-56";
        case "xl":
          return "h-72 w-72";
        default:
          return "h-40 w-40";
      }
    } else if (variant === "square") {
      switch (size) {
        case "sm":
          return "h-24 w-24";
        case "md":
          return "h-32 w-32";
        case "lg":
          return "h-48 w-48";
        case "xl":
          return "h-64 w-64";
        default:
          return "h-32 w-32";
      }
    } else {
      // rectangle
      switch (size) {
        case "sm":
          return "h-32 w-full";
        case "md":
          return "h-40 w-full";
        case "lg":
          return "h-56 w-full";
        case "xl":
          return "h-72 w-full";
        default:
          return "h-40 w-full";
      }
    }
  };

  const outerShapeClass = getSizeClass();

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

  // biome-ignore lint/correctness/useExhaustiveDependencies: <explanation>
  useEffect(() => {
    const file = files[0] ?? null;
    onFileChange?.(file ?? null);
  }, [files]);

  const current = files[0] ?? null;

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
            // If there's an uploaded file AND it's a PDF → show PDF preview
            current &&
            current.file instanceof File &&
            current.file.type === "application/pdf" ? (
              <div className="flex h-full w-full flex-col items-center justify-center gap-2 p-4 text-center">
                <FileText className="size-12 text-muted-foreground" />
                <div className="text-sm font-medium break-all">
                  {current.file.name}
                </div>
              </div>
            ) : // If defaultPreview ends with .pdf → treat as PDF
            defaultPreview && /\.(pdf)(\?.*)?$/i.test(defaultPreview) ? (
              <div className="flex h-full w-full flex-col items-center justify-center gap-2 p-4 text-center">
                <FileText className="size-12 text-muted-foreground" />
                <div className="text-xs text-muted-foreground">
                  {defaultPreview.split("/").pop()?.split("?")[0]}
                </div>
              </div>
            ) : (
              // Otherwise: show image (from uploaded preview or defaultPreview URL)
              <Image
                src={current?.preview || defaultPreview || ""}
                alt="preview"
                fill
                className="h-full w-full object-cover"
                // unoptimized
              />
            )
          ) : (
            <div className="flex flex-col items-center justify-center gap-2 px-4 text-center">
              <Upload className="size-4 text-muted-foreground" />
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
