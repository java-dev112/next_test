"use client";

import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Checkbox } from "@/components/ui/checkbox";
import { FileDown, Download } from "lucide-react";
import { Project } from "@/types/project";
import { exportToCSV, exportToJSON, exportToExcel, exportToPDF } from "@/lib/export-utils";
import { toast } from "sonner";

interface ExportDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  projects: Project[];
}

export function ExportDialog({
  open,
  onOpenChange,
  projects,
}: ExportDialogProps) {
  const [format, setFormat] = useState("csv");
  const [includeHeaders, setIncludeHeaders] = useState(true);
  const [selectedColumns, setSelectedColumns] = useState<string[]>([
    "name",
    "customer",
    "location",
    "projectType",
    "openInvoice",
    "paidInvoice",
    "created",
    "projectNumber",
  ]);

  const availableColumns = [
    { key: "name", label: "Name" },
    { key: "customer", label: "Customer" },
    { key: "location", label: "Location" },
    { key: "projectType", label: "Project Type" },
    { key: "openInvoice", label: "Open Invoice" },
    { key: "paidInvoice", label: "Paid Invoice" },
    { key: "created", label: "Created" },
    { key: "projectNumber", label: "Project Number" },
  ];

  const handleColumnToggle = (columnKey: string) => {
    setSelectedColumns((prev) =>
      prev.includes(columnKey)
        ? prev.filter((key) => key !== columnKey)
        : [...prev, columnKey]
    );
  };

  const handleExport = () => {
    if (selectedColumns.length === 0) {
      toast.error("Please select at least one column to export");
      return;
    }

    if (!projects || projects.length === 0) {
      toast.error("No projects to export");
      return;
    }

    const filteredProjects = projects.map((project) => {
      const filtered: Record<string, any> = {};
      selectedColumns.forEach((key) => {
        const value = project[key as keyof Project];
        if (value !== undefined && value !== null) {
          filtered[key] = value;
        }
      });
      return filtered as Partial<Project>;
    });

    try {
      switch (format) {
        case "csv":
          exportToCSV(filteredProjects, "projects");
          toast.success("Projects exported to CSV");
          break;
        case "json":
          exportToJSON(filteredProjects, "projects");
          toast.success("Projects exported to JSON");
          break;
        case "excel":
          exportToExcel(filteredProjects, "projects");
          toast.success("Projects exported to Excel");
          break;
        case "pdf":
          exportToPDF(filteredProjects, "projects");
          toast.success("Projects exported to PDF");
          break;
        default:
          toast.error("Invalid export format");
          return;
      }
      onOpenChange(false);
    } catch (error: any) {
      const errorMessage = error?.message || "Failed to export projects";
      toast.error(errorMessage);
      console.error("Export error:", error);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md w-[95vw] sm:w-full">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <FileDown className="h-5 w-5" />
            Export Projects
          </DialogTitle>
        </DialogHeader>
        <div className="space-y-4">
          {/* Format Selection */}
          <div className="space-y-2">
            <Label>Export Format</Label>
            <RadioGroup
              value={format}
              onValueChange={setFormat}
              className="flex flex-col sm:flex-row gap-3 sm:gap-4"
            >
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="csv" id="csv" />
                <Label htmlFor="csv" className="font-normal cursor-pointer">
                  CSV
                </Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="json" id="json" />
                <Label htmlFor="json" className="font-normal cursor-pointer">
                  JSON
                </Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="excel" id="excel" />
                <Label htmlFor="excel" className="font-normal cursor-pointer">
                  Excel
                </Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="pdf" id="pdf" />
                <Label htmlFor="pdf" className="font-normal cursor-pointer">
                  PDF
                </Label>
              </div>
            </RadioGroup>
          </div>

          {/* Column Selection */}
          <div className="space-y-2">
            <Label>Select Columns</Label>
            <div className="max-h-48 overflow-y-auto border rounded-md p-2 space-y-2">
              {availableColumns.map((column) => (
                <div key={column.key} className="flex items-center space-x-2">
                  <Checkbox
                    id={`column-${column.key}`}
                    checked={selectedColumns.includes(column.key)}
                    onCheckedChange={() => handleColumnToggle(column.key)}
                  />
                  <Label
                    htmlFor={`column-${column.key}`}
                    className="font-normal cursor-pointer flex-1"
                  >
                    {column.label}
                  </Label>
                </div>
              ))}
            </div>
          </div>

          {/* Options */}
          <div className="space-y-2">
            <div className="flex items-center space-x-2">
              <Checkbox
                id="includeHeaders"
                checked={includeHeaders}
                onCheckedChange={(checked) =>
                  setIncludeHeaders(checked as boolean)
                }
              />
              <Label htmlFor="includeHeaders" className="font-normal cursor-pointer">
                Include Headers
              </Label>
            </div>
          </div>

          {/* Export Info */}
          <div className="bg-gray-50 p-3 rounded-md text-sm text-gray-600">
            <p>
              Exporting <strong>{projects.length}</strong> project
              {projects.length !== 1 ? "s" : ""} with{" "}
              <strong>{selectedColumns.length}</strong> column
              {selectedColumns.length !== 1 ? "s" : ""}
            </p>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-col-reverse sm:flex-row justify-end gap-2 pt-2">
            <Button variant="outline" onClick={() => onOpenChange(false)} className="w-full sm:w-auto">
              Cancel
            </Button>
            <Button onClick={handleExport} className="bg-blue-600 hover:bg-blue-700 w-full sm:w-auto">
              <Download className="h-4 w-4 mr-2" />
              Export
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}

