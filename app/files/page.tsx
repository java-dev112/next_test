"use client";

import { useState, useMemo, useEffect } from "react";
import { Sidebar } from "@/components/sidebar";
import { FilesTable } from "@/components/files/files-table";
import { UploadFileDialog } from "@/components/files/upload-file-dialog";
import { EditFileDialog } from "@/components/files/edit-file-dialog";
import { DeleteFileDialog } from "@/components/files/delete-file-dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Menu, Plus, Search, FileText } from "lucide-react";
import { FileItem } from "@/types/file";
import {
  getFiles,
  createFile,
  updateFile,
  deleteFile,
} from "@/lib/files-api-client";
import { toast } from "sonner";

type Column = {
  key: keyof FileItem | "actions";
  label: string;
  visible: boolean;
};

const initialColumns: Column[] = [
  { key: "name", label: "Name", visible: true },
  { key: "fileName", label: "File Name", visible: true },
  { key: "fileType", label: "Type", visible: true },
  { key: "fileSize", label: "Size", visible: true },
  { key: "category", label: "Category", visible: true },
  { key: "description", label: "Description", visible: true },
  { key: "createdAt", label: "Created", visible: true },
  { key: "actions", label: "", visible: true },
];

export default function FilesPage() {
  const [files, setFiles] = useState<FileItem[]>([]);
  const [columns, setColumns] = useState<Column[]>(initialColumns);
  const [searchQuery, setSearchQuery] = useState("");
  const [isUploadFileOpen, setIsUploadFileOpen] = useState(false);
  const [isEditFileOpen, setIsEditFileOpen] = useState(false);
  const [isDeleteFileOpen, setIsDeleteFileOpen] = useState(false);
  const [selectedFile, setSelectedFile] = useState<FileItem | null>(null);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const filteredFiles = useMemo(() => {
    if (!searchQuery) return files;
    
    const query = searchQuery.toLowerCase();
    return files.filter(
      (file) =>
        file.name.toLowerCase().includes(query) ||
        file.fileName.toLowerCase().includes(query) ||
        (file.description && file.description.toLowerCase().includes(query)) ||
        (file.category && file.category.toLowerCase().includes(query))
    );
  }, [files, searchQuery]);

  useEffect(() => {
    const fetchFiles = async () => {
      try {
        setIsLoading(true);
        setError(null);
        const response = await getFiles();
        
        if (response.success && response.data) {
          setFiles(response.data);
        } else {
          setError(response.error || "Failed to fetch files");
          toast.error(response.error || "Failed to fetch files");
        }
      } catch (error: any) {
        setError(error.message || "Failed to fetch files");
        toast.error("Failed to fetch files");
      } finally {
        setIsLoading(false);
      }
    };

    fetchFiles();
  }, []);

  const handleUploadFile = async (data: any) => {
    try {
      setIsLoading(true);
      const response = await createFile({
        name: data.name,
        fileName: data.fileName,
        fileType: data.fileType,
        fileSize: data.fileSize,
        fileUrl: data.fileUrl,
        description: data.description,
        category: data.category,
      });

      if (response.success && response.data) {
        setFiles((prev) => [response.data!, ...prev]);
        toast.success("File uploaded successfully");
        setIsUploadFileOpen(false);
      } else {
        toast.error(response.error || "Failed to upload file");
        setError(response.error || "Failed to upload file");
      }
    } catch (error: any) {
      toast.error("Failed to upload file");
      setError(error.message || "Failed to upload file");
    } finally {
      setIsLoading(false);
    }
  };

  const handleEditFile = async (data: any) => {
    if (!selectedFile) return;
    
    try {
      setIsLoading(true);
      const response = await updateFile(selectedFile.id, {
        name: data.name,
        description: data.description,
        category: data.category,
      });

      if (response.success && response.data) {
        setFiles((prev) =>
          prev.map((f) => (f.id === selectedFile.id ? response.data! : f))
        );
        toast.success("File updated successfully");
        setIsEditFileOpen(false);
        setSelectedFile(null);
      } else {
        toast.error(response.error || "Failed to update file");
        setError(response.error || "Failed to update file");
      }
    } catch (error: any) {
      toast.error("Failed to update file");
      setError(error.message || "Failed to update file");
    } finally {
      setIsLoading(false);
    }
  };

  const handleDeleteFile = async () => {
    if (!selectedFile) return;
    
    try {
      setIsLoading(true);
      const response = await deleteFile(selectedFile.id);

      if (response.success) {
        setFiles((prev) => prev.filter((f) => f.id !== selectedFile.id));
        toast.success("File deleted successfully");
        setIsDeleteFileOpen(false);
        setSelectedFile(null);
      } else {
        toast.error(response.error || "Failed to delete file");
        setError(response.error || "Failed to delete file");
      }
    } catch (error: any) {
      toast.error("Failed to delete file");
      setError(error.message || "Failed to delete file");
    } finally {
      setIsLoading(false);
    }
  };

  const handleEditClick = (file: FileItem) => {
    setSelectedFile(file);
    setIsEditFileOpen(true);
  };

  const handleDeleteClick = (file: FileItem) => {
    setSelectedFile(file);
    setIsDeleteFileOpen(true);
  };

  const handleColumnToggle = (columnKey: string) => {
    setColumns((prev) =>
      prev.map((col) =>
        col.key === columnKey ? { ...col, visible: !col.visible } : col
      )
    );
  };

  return (
    <div className="flex h-screen bg-gray-50 dark:bg-gray-950">
      <Sidebar
        isMobileOpen={isMobileMenuOpen}
        onMobileClose={() => setIsMobileMenuOpen(false)}
      />
      <div className="flex flex-1 flex-col overflow-hidden w-full lg:w-auto">
        {/* Header */}
        <header className="border-b bg-white dark:bg-gray-900 px-3 sm:px-4 lg:px-6 py-3 lg:py-4">
          <div className="flex items-center justify-between gap-2">
            <div className="flex items-center gap-2 sm:gap-4 flex-1 min-w-0">
              {/* Mobile Menu Button */}
              <Button
                variant="ghost"
                size="sm"
                className="lg:hidden h-9 w-9 p-0"
                onClick={() => setIsMobileMenuOpen(true)}
              >
                <Menu className="h-5 w-5" />
              </Button>
              <div className="flex items-center gap-2 min-w-0">
                <FileText className="h-5 w-5 text-gray-600 dark:text-gray-400 flex-shrink-0" />
                <h1 className="text-lg sm:text-xl font-semibold text-gray-900 dark:text-white truncate">
                  Files
                </h1>
              </div>
              <div className="relative hidden sm:block flex-1 max-w-xs">
                <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
                <Input
                  type="text"
                  placeholder="Search files..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-10"
                />
              </div>
            </div>
            <div className="flex items-center gap-2 flex-shrink-0">
              <Button
                onClick={() => setIsUploadFileOpen(true)}
                className="bg-red-600 hover:bg-red-700 text-white"
                size="sm"
              >
                <Plus className="h-4 w-4 mr-2" />
                <span className="hidden lg:inline">Upload File</span>
                <span className="lg:hidden">Upload</span>
              </Button>
            </div>
          </div>
          
          {/* Mobile Search Bar */}
          <div className="sm:hidden mt-3">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
              <Input
                type="text"
                placeholder="Search files..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10"
              />
            </div>
          </div>
        </header>

        {/* Main Content */}
        <main className="flex-1 overflow-y-auto p-3 sm:p-4 lg:p-6">
          {isLoading ? (
            <div className="flex items-center justify-center h-full">
              <div className="text-center">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900 dark:border-gray-100 mx-auto mb-4"></div>
                <p className="text-gray-600 dark:text-gray-400">Loading files...</p>
              </div>
            </div>
          ) : error ? (
            <div className="flex items-center justify-center h-full">
              <div className="text-center">
                <p className="text-red-600 dark:text-red-400 mb-4">{error}</p>
                <Button
                  onClick={async () => {
                    setIsLoading(true);
                    setError(null);
                    const response = await getFiles();
                    if (response.success && response.data) {
                      setFiles(response.data);
                    } else {
                      setError(response.error || "Failed to fetch files");
                    }
                    setIsLoading(false);
                  }}
                >
                  Retry
                </Button>
              </div>
            </div>
          ) : filteredFiles.length === 0 ? (
            <div className="flex items-center justify-center h-full">
              <div className="text-center">
                <p className="text-gray-600 dark:text-gray-400 mb-4">
                  {searchQuery ? "No files found matching your search" : "No files found"}
                </p>
                {!searchQuery && (
                  <Button
                    onClick={() => setIsUploadFileOpen(true)}
                    className="bg-red-600 hover:bg-red-700 text-white"
                  >
                    <Plus className="h-4 w-4 mr-2" />
                    Upload Your First File
                  </Button>
                )}
              </div>
            </div>
          ) : (
            <FilesTable
              files={filteredFiles}
              columns={columns}
              onColumnToggle={handleColumnToggle}
              onEdit={handleEditClick}
              onDelete={handleDeleteClick}
            />
          )}
        </main>
      </div>

      <UploadFileDialog
        open={isUploadFileOpen}
        onOpenChange={setIsUploadFileOpen}
        onSubmit={handleUploadFile}
      />

      <EditFileDialog
        open={isEditFileOpen}
        onOpenChange={setIsEditFileOpen}
        file={selectedFile}
        onSubmit={handleEditFile}
      />

      <DeleteFileDialog
        open={isDeleteFileOpen}
        onOpenChange={setIsDeleteFileOpen}
        file={selectedFile}
        onConfirm={handleDeleteFile}
      />
    </div>
  );
}

