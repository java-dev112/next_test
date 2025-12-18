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
import { MoreHorizontal, GripVertical } from "lucide-react";
import { Task } from "@/types/task";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

interface Column {
  key: keyof Task | "actions";
  label: string;
  visible: boolean;
}

interface TasksTableProps {
  tasks: Task[];
  columns: Column[];
  onColumnToggle: (columnKey: string) => void;
  onEdit?: (task: Task) => void;
  onDelete?: (task: Task) => void;
}

export function TasksTable({
  tasks,
  columns,
  onColumnToggle,
  onEdit,
  onDelete,
}: TasksTableProps) {
  const visibleColumns = columns.filter((col) => col.visible || col.key === "actions");

  const getStatusBadgeVariant = (status: string) => {
    switch (status) {
      case "completed":
        return "default";
      case "in-progress":
        return "secondary";
      default:
        return "outline";
    }
  };

  const getPriorityBadgeVariant = (priority: string) => {
    switch (priority) {
      case "high":
        return "destructive";
      case "medium":
        return "default";
      default:
        return "secondary";
    }
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
            {tasks.length === 0 ? (
              <TableRow>
                <TableCell
                  colSpan={visibleColumns.length}
                  className="h-24 text-center"
                >
                  No tasks found.
                </TableCell>
              </TableRow>
            ) : (
              tasks.map((task) => (
                <TableRow key={task.id} className="hover:bg-gray-50 dark:hover:bg-gray-800">
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
                                <DropdownMenuItem onClick={() => onEdit(task)}>
                                  Edit
                                </DropdownMenuItem>
                              )}
                              {onDelete && (
                                <DropdownMenuItem
                                  onClick={() => onDelete(task)}
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
                    const value = task[column.key as keyof Task];
                    
                    if (column.key === "status") {
                      cellContent = (
                        <Badge variant={getStatusBadgeVariant(value as string)}>
                          {value?.toString().replace("-", " ").replace(/\b\w/g, l => l.toUpperCase()) || "-"}
                        </Badge>
                      );
                    } else if (column.key === "priority") {
                      cellContent = (
                        <Badge variant={getPriorityBadgeVariant(value as string)}>
                          {value?.toString().replace(/\b\w/g, l => l.toUpperCase()) || "-"}
                        </Badge>
                      );
                    } else if (column.key === "dueDate" || column.key === "createdAt" || column.key === "updatedAt") {
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

