"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { uploadFile } from "@/lib/files-api-client";

const fileSchema = z.object({
  name: z.string().min(1, "Name is required"),
  description: z.string().optional(),
  category: z.string().optional(),
  file: z.instanceof(File).optional(),
});

type FileFormData = z.infer<typeof fileSchema>;

interface UploadFileDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSubmit: (data: FileFormData & { fileUrl: string; fileName: string; fileType: string; fileSize: number }) => void;
}

const fileCategories = [
  "Document",
  "Image",
  "Video",
  "Audio",
  "Spreadsheet",
  "Presentation",
  "Other",
];

export function UploadFileDialog({
  open,
  onOpenChange,
  onSubmit,
}: UploadFileDialogProps) {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [isUploading, setIsUploading] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
    watch,
    reset,
  } = useForm<FileFormData>({
    resolver: zodResolver(fileSchema),
  });

  const onFormSubmit = async (data: FileFormData) => {
    if (!selectedFile) {
      return;
    }

    setIsUploading(true);
    try {
      const uploadResponse = await uploadFile(selectedFile);
      
      if (uploadResponse.success && uploadResponse.data) {
        const fileSize = selectedFile.size;
        const fileName = selectedFile.name;
        const fileType = selectedFile.type || selectedFile.name.split('.').pop() || 'unknown';
        
        onSubmit({
          ...data,
          fileUrl: uploadResponse.data.url,
          fileName,
          fileType,
          fileSize,
        });
        
        reset();
        setSelectedFile(null);
        onOpenChange(false);
      } else {
        throw new Error(uploadResponse.error || "Failed to upload file");
      }
    } catch (error: any) {
      console.error("Upload error:", error);
    } finally {
      setIsUploading(false);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setSelectedFile(file);
      if (!watch("name")) {
        const nameWithoutExt = file.name.replace(/\.[^/.]+$/, "");
        setValue("name", nameWithoutExt);
      }
    }
  };

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return Math.round(bytes / Math.pow(k, i) * 100) / 100 + ' ' + sizes[i];
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl w-[95vw] sm:w-full">
        <DialogHeader>
          <DialogTitle>Upload File</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit(onFormSubmit)} className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {/* File Upload */}
            <div className="space-y-1.5 sm:col-span-2">
              <Label htmlFor="file" className="text-sm">File *</Label>
              <div className="flex items-center gap-3">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => {
                    if (typeof document !== "undefined") {
                      document.getElementById("file")?.click();
                    }
                  }}
                  className="cursor-pointer h-9"
                  disabled={isUploading}
                >
                  Choose File
                </Button>
                <Input
                  id="file"
                  type="file"
                  onChange={handleFileChange}
                  className="hidden"
                  disabled={isUploading}
                />
                <span className="text-sm text-gray-500">
                  {selectedFile 
                    ? `${selectedFile.name} (${formatFileSize(selectedFile.size)})` 
                    : "No file chosen"}
                </span>
              </div>
              {!selectedFile && (
                <p className="text-xs text-red-500">Please select a file</p>
              )}
            </div>

            {/* Name */}
            <div className="space-y-1.5 sm:col-span-2">
              <Label htmlFor="name" className="text-sm">Name *</Label>
              <Input
                id="name"
                {...register("name")}
                placeholder="Enter file name"
                className="h-9"
                disabled={isUploading}
              />
              {errors.name && (
                <p className="text-xs text-red-500">{errors.name.message}</p>
              )}
            </div>

            {/* Category */}
            <div className="space-y-1.5">
              <Label htmlFor="category" className="text-sm">Category</Label>
              <Select
                value={watch("category") || ""}
                onValueChange={(value) => setValue("category", value)}
                disabled={isUploading}
              >
                <SelectTrigger id="category" className="w-full h-9">
                  <SelectValue placeholder="Select category" />
                </SelectTrigger>
                <SelectContent>
                  {fileCategories.map((category) => (
                    <SelectItem key={category} value={category}>
                      {category}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Description */}
            <div className="space-y-1.5">
              <Label htmlFor="description" className="text-sm">Description</Label>
              <Input
                id="description"
                {...register("description")}
                placeholder="Enter description"
                className="h-9"
                disabled={isUploading}
              />
              {errors.description && (
                <p className="text-xs text-red-500">{errors.description.message}</p>
              )}
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-col-reverse sm:flex-row justify-end gap-3 pt-4">
            <Button
              type="button"
              variant="outline"
              onClick={() => {
                reset();
                setSelectedFile(null);
                onOpenChange(false);
              }}
              className="w-full sm:w-auto"
              disabled={isUploading}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              className="bg-red-600 hover:bg-red-700 text-white w-full sm:w-auto"
              disabled={!selectedFile || isUploading}
            >
              {isUploading ? "Uploading..." : "Upload"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}

