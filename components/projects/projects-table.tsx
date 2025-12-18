"use client";

import { useState } from "react";
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
import { MoreHorizontal, GripVertical } from "lucide-react";
import { Project } from "@/types/project";
import { Button } from "@/components/ui/button";

interface Column {
  key: keyof Project | "actions";
  label: string;
  visible: boolean;
}

interface ProjectsTableProps {
  projects: Project[];
  columns: Column[];
  onColumnToggle: (columnKey: string) => void;
  onEdit?: (project: Project) => void;
  onDelete?: (project: Project) => void;
}

export function ProjectsTable({
  projects,
  columns,
  onColumnToggle,
  onEdit,
  onDelete,
}: ProjectsTableProps) {
  const visibleColumns = columns.filter((col) => col.visible || col.key === "actions");

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
          {projects.length === 0 ? (
            <TableRow>
              <TableCell
                colSpan={visibleColumns.length}
                className="h-24 text-center"
              >
                No projects found.
              </TableCell>
            </TableRow>
          ) : (
            projects.map((project) => (
              <TableRow key={project.id} className="hover:bg-gray-50 dark:hover:bg-gray-800">
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
                            {onEdit && (
                              <DropdownMenuItem onClick={() => onEdit(project)}>
                                Edit
                              </DropdownMenuItem>
                            )}
                            {onDelete && (
                              <DropdownMenuItem 
                                onClick={() => onDelete(project)}
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
                  return (
                    <TableCell key={column.key}>
                      {project[column.key as keyof Project]?.toString() || "-"}
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


