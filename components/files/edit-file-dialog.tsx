"use client";

import { useEffect } from "react";
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
import { FileItem } from "@/types/file";

const fileSchema = z.object({
  name: z.string().min(1, "Name is required"),
  description: z.string().optional(),
  category: z.string().optional(),
});

type FileFormData = z.infer<typeof fileSchema>;

interface EditFileDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  file: FileItem | null;
  onSubmit: (data: FileFormData & { id: string }) => void;
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

export function EditFileDialog({
  open,
  onOpenChange,
  file,
  onSubmit,
}: EditFileDialogProps) {
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

  useEffect(() => {
    if (file && open) {
      setValue("name", file.name);
      setValue("description", file.description || "");
      setValue("category", file.category || "");
    }
  }, [file, open, setValue]);

  const onFormSubmit = (data: FileFormData) => {
    if (!file) return;
    onSubmit({ ...data, id: file.id });
    reset();
    onOpenChange(false);
  };

  const handleCancel = () => {
    reset();
    onOpenChange(false);
  };

  if (!file) return null;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl w-[95vw] sm:w-full">
        <DialogHeader>
          <DialogTitle>Edit File</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit(onFormSubmit)} className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {/* Current File Info */}
            <div className="space-y-1.5 sm:col-span-2">
              <Label className="text-sm">Current File</Label>
              <div className="text-sm text-gray-600 dark:text-gray-400 p-2 bg-gray-50 dark:bg-gray-800 rounded">
                {file.fileName} ({formatFileSize(file.fileSize)})
              </div>
            </div>

            {/* Name */}
            <div className="space-y-1.5 sm:col-span-2">
              <Label htmlFor="editName" className="text-sm">Name *</Label>
              <Input
                id="editName"
                {...register("name")}
                placeholder="Enter file name"
                className="h-9"
              />
              {errors.name && (
                <p className="text-xs text-red-500">{errors.name.message}</p>
              )}
            </div>

            {/* Category */}
            <div className="space-y-1.5">
              <Label htmlFor="editCategory" className="text-sm">Category</Label>
              <Select
                value={watch("category") || ""}
                onValueChange={(value) => setValue("category", value)}
              >
                <SelectTrigger id="editCategory" className="w-full h-9">
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
              <Label htmlFor="editDescription" className="text-sm">Description</Label>
              <Input
                id="editDescription"
                {...register("description")}
                placeholder="Enter description"
                className="h-9"
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
              onClick={handleCancel}
              className="w-full sm:w-auto"
            >
              Cancel
            </Button>
            <Button
              type="submit"
              className="bg-red-600 hover:bg-red-700 text-white w-full sm:w-auto"
            >
              Update
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}

function formatFileSize(bytes: number) {
  if (bytes === 0) return '0 Bytes';
  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return Math.round(bytes / Math.pow(k, i) * 100) / 100 + ' ' + sizes[i];
}

