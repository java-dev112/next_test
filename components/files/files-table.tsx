"use client";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Switch } from "@/components/ui/switch";
import { MoreHorizontal, GripVertical, Download, ExternalLink } from "lucide-react";
import { FileItem } from "@/types/file";
import { Button } from "@/components/ui/button";

interface Column {
  key: keyof FileItem | "actions";
  label: string;
  visible: boolean;
}

interface FilesTableProps {
  files: FileItem[];
  columns: Column[];
  onColumnToggle: (columnKey: string) => void;
  onEdit?: (file: FileItem) => void;
  onDelete?: (file: FileItem) => void;
}

export function FilesTable({
  files,
  columns,
  onColumnToggle,
  onEdit,
  onDelete,
}: FilesTableProps) {
  const visibleColumns = columns.filter((col) => col.visible || col.key === "actions");

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return Math.round(bytes / Math.pow(k, i) * 100) / 100 + ' ' + sizes[i];
  };

  const formatDate = (dateString?: string) => {
    if (!dateString) return "-";
    try {
      const date = new Date(dateString);
      return date.toLocaleDateString();
    } catch {
      return dateString;
    }
  };

  const handleDownload = (file: FileItem) => {
    window.open(file.fileUrl, '_blank');
  };

  return (
    <div className="rounded-md border overflow-hidden w-full">
      <div className="overflow-x-auto">
        <Table className="min-w-[800px]">
          <TableHeader>
            <TableRow>
              {visibleColumns.map((column) => (
                <TableHead key={column.key} className="font-semibold">
                  <div className="flex items-center gap-2">
                    {column.key === "actions" ? (
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                            <MoreHorizontal className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end" className="w-56">
                          <div className="p-2">
                            <div className="mb-2 font-semibold text-gray-400">Columns</div>
                            <div className="space-y-2">
                              {columns
                                .filter((col) => col.key !== "actions")
                                .map((column) => (
                                  <div
                                    key={column.key}
                                    className="flex items-center justify-between"
                                  >
                                    <div className="flex items-center gap-2">
                                      <GripVertical
                                        className={`h-4 w-4 cursor-move ${
                                          column.visible ? "text-gray-900" : "text-gray-400"
                                        }`}
                                      />
                                      <label
                                        className={`text-sm font-normal cursor-pointer ${
                                          column.visible ? "text-gray-900" : "text-gray-400"
                                        }`}
                                      >
                                        {column.label}
                                      </label>
                                    </div>
                                    <Switch
                                      checked={column.visible}
                                      onCheckedChange={() =>
                                        onColumnToggle(column.key)
                                      }
                                    />
                                  </div>
                                ))}
                            </div>
                          </div>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    ) : (
                      column.label
                    )}
                  </div>
                </TableHead>
              ))}
            </TableRow>
          </TableHeader>
          <TableBody>
            {files.length === 0 ? (
              <TableRow>
                <TableCell
                  colSpan={visibleColumns.length}
                  className="h-24 text-center"
                >
                  No files found.
                </TableCell>
              </TableRow>
            ) : (
              files.map((file) => (
                <TableRow key={file.id} className="hover:bg-gray-50 dark:hover:bg-gray-800">
                  {visibleColumns.map((column) => {
                    if (column.key === "actions") {
                      return (
                        <TableCell key={column.key}>
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                                <MoreHorizontal className="h-4 w-4" />
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                              <DropdownMenuItem onClick={() => handleDownload(file)}>
                                <Download className="h-4 w-4 mr-2" />
                                Download
                              </DropdownMenuItem>
                              <DropdownMenuItem onClick={() => window.open(file.fileUrl, '_blank')}>
                                <ExternalLink className="h-4 w-4 mr-2" />
                                Open
                              </DropdownMenuItem>
                              {onEdit && (
                                <DropdownMenuItem onClick={() => onEdit(file)}>
                                  Edit
                                </DropdownMenuItem>
                              )}
                              {onDelete && (
                                <DropdownMenuItem
                                  onClick={() => onDelete(file)}
                                  className="text-red-600 focus:text-red-600"
                                >
                                  Delete
                                </DropdownMenuItem>
                              )}
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </TableCell>
                      );
                    }
                    
                    let cellContent: React.ReactNode;
                    const value = file[column.key as keyof FileItem];
                    
                    if (column.key === "fileSize") {
                      cellContent = formatFileSize(value as number);
                    } else if (column.key === "createdAt" || column.key === "updatedAt") {
                      cellContent = formatDate(value as string);
                    } else {
                      cellContent = value?.toString() || "-";
                    }
                    
                    return (
                      <TableCell key={column.key}>
                        {cellContent}
                      </TableCell>
                    );
                  })}
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}

