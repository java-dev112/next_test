"use client";

import { useState, useMemo, useEffect } from "react";
import { Sidebar } from "@/components/sidebar";
import { TasksTable } from "@/components/tasks/tasks-table";
import { NewTaskDialog } from "@/components/tasks/new-task-dialog";
import { EditTaskDialog } from "@/components/tasks/edit-task-dialog";
import { DeleteTaskDialog } from "@/components/tasks/delete-task-dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Menu, Plus, Search, CheckSquare } from "lucide-react";
import { Task } from "@/types/task";
import {
  getTasks,
  createTask,
  updateTask,
  deleteTask,
} from "@/lib/api-client";
import { toast } from "sonner";

type Column = {
  key: keyof Task | "actions";
  label: string;
  visible: boolean;
};

const initialColumns: Column[] = [
  { key: "title", label: "Title", visible: true },
  { key: "description", label: "Description", visible: true },
  { key: "status", label: "Status", visible: true },
  { key: "priority", label: "Priority", visible: true },
  { key: "dueDate", label: "Due Date", visible: true },
  { key: "createdAt", label: "Created", visible: true },
  { key: "actions", label: "", visible: true },
];

export default function TasksPage() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [columns, setColumns] = useState<Column[]>(initialColumns);
  const [searchQuery, setSearchQuery] = useState("");
  const [isNewTaskOpen, setIsNewTaskOpen] = useState(false);
  const [isEditTaskOpen, setIsEditTaskOpen] = useState(false);
  const [isDeleteTaskOpen, setIsDeleteTaskOpen] = useState(false);
  const [selectedTask, setSelectedTask] = useState<Task | null>(null);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const filteredTasks = useMemo(() => {
    if (!searchQuery) return tasks;
    
    const query = searchQuery.toLowerCase();
    return tasks.filter(
      (task) =>
        task.title.toLowerCase().includes(query) ||
        (task.description && task.description.toLowerCase().includes(query)) ||
        task.status.toLowerCase().includes(query) ||
        task.priority.toLowerCase().includes(query)
    );
  }, [tasks, searchQuery]);

  useEffect(() => {
    const fetchTasks = async () => {
      try {
        setIsLoading(true);
        setError(null);
        const response = await getTasks();
        
        if (response.success && response.data) {
          setTasks(response.data);
        } else {
          setError(response.error || "Failed to fetch tasks");
          toast.error(response.error || "Failed to fetch tasks");
        }
      } catch (error: any) {
        setError(error.message || "Failed to fetch tasks");
        toast.error("Failed to fetch tasks");
      } finally {
        setIsLoading(false);
      }
    };

    fetchTasks();
  }, []);

  const handleNewTask = async (data: any) => {
    try {
      setIsLoading(true);
      const response = await createTask({
        title: data.title,
        description: data.description,
        status: data.status,
        priority: data.priority,
        dueDate: data.dueDate,
      });

      if (response.success && response.data) {
        setTasks((prev) => [response.data!, ...prev]);
        toast.success("Task created successfully");
        setIsNewTaskOpen(false);
      } else {
        toast.error(response.error || "Failed to create task");
        setError(response.error || "Failed to create task");
      }
    } catch (error: any) {
      toast.error("Failed to create task");
      setError(error.message || "Failed to create task");
    } finally {
      setIsLoading(false);
    }
  };

  const handleEditTask = async (data: any) => {
    if (!selectedTask) return;
    
    try {
      setIsLoading(true);
      const response = await updateTask(selectedTask.id, {
        title: data.title,
        description: data.description,
        status: data.status,
        priority: data.priority,
        dueDate: data.dueDate,
      });

      if (response.success && response.data) {
        setTasks((prev) =>
          prev.map((t) => (t.id === selectedTask.id ? response.data! : t))
        );
        toast.success("Task updated successfully");
        setIsEditTaskOpen(false);
        setSelectedTask(null);
      } else {
        toast.error(response.error || "Failed to update task");
        setError(response.error || "Failed to update task");
      }
    } catch (error: any) {
      toast.error("Failed to update task");
      setError(error.message || "Failed to update task");
    } finally {
      setIsLoading(false);
    }
  };

  const handleDeleteTask = async () => {
    if (!selectedTask) return;
    
    try {
      setIsLoading(true);
      const response = await deleteTask(selectedTask.id);

      if (response.success) {
        setTasks((prev) => prev.filter((t) => t.id !== selectedTask.id));
        toast.success("Task deleted successfully");
        setIsDeleteTaskOpen(false);
        setSelectedTask(null);
      } else {
        toast.error(response.error || "Failed to delete task");
        setError(response.error || "Failed to delete task");
      }
    } catch (error: any) {
      toast.error("Failed to delete task");
      setError(error.message || "Failed to delete task");
    } finally {
      setIsLoading(false);
    }
  };

  const handleEditClick = (task: Task) => {
    setSelectedTask(task);
    setIsEditTaskOpen(true);
  };

  const handleDeleteClick = (task: Task) => {
    setSelectedTask(task);
    setIsDeleteTaskOpen(true);
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
                <CheckSquare className="h-5 w-5 text-gray-600 dark:text-gray-400 flex-shrink-0" />
                <h1 className="text-lg sm:text-xl font-semibold text-gray-900 dark:text-white truncate">
                  Tasks
                </h1>
              </div>
              <div className="relative hidden sm:block flex-1 max-w-xs">
                <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
                <Input
                  type="text"
                  placeholder="Search tasks..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-10"
                />
              </div>
            </div>
            <div className="flex items-center gap-2 flex-shrink-0">
              <Button
                onClick={() => setIsNewTaskOpen(true)}
                className="bg-red-600 hover:bg-red-700 text-white"
                size="sm"
              >
                <Plus className="h-4 w-4 mr-2" />
                <span className="hidden lg:inline">Add Task</span>
                <span className="lg:hidden">Add</span>
              </Button>
            </div>
          </div>
          
          {/* Mobile Search Bar */}
          <div className="sm:hidden mt-3">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
              <Input
                type="text"
                placeholder="Search tasks..."
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
                <p className="text-gray-600 dark:text-gray-400">Loading tasks...</p>
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
                    const response = await getTasks();
                    if (response.success && response.data) {
                      setTasks(response.data);
                    } else {
                      setError(response.error || "Failed to fetch tasks");
                    }
                    setIsLoading(false);
                  }}
                >
                  Retry
                </Button>
              </div>
            </div>
          ) : filteredTasks.length === 0 ? (
            <div className="flex items-center justify-center h-full">
              <div className="text-center">
                <p className="text-gray-600 dark:text-gray-400 mb-4">
                  {searchQuery ? "No tasks found matching your search" : "No tasks found"}
                </p>
                {!searchQuery && (
                  <Button
                    onClick={() => setIsNewTaskOpen(true)}
                    className="bg-red-600 hover:bg-red-700 text-white"
                  >
                    <Plus className="h-4 w-4 mr-2" />
                    Add Your First Task
                  </Button>
                )}
              </div>
            </div>
          ) : (
            <TasksTable
              tasks={filteredTasks}
              columns={columns}
              onColumnToggle={handleColumnToggle}
              onEdit={handleEditClick}
              onDelete={handleDeleteClick}
            />
          )}
        </main>
      </div>

      <NewTaskDialog
        open={isNewTaskOpen}
        onOpenChange={setIsNewTaskOpen}
        onSubmit={handleNewTask}
      />

      <EditTaskDialog
        open={isEditTaskOpen}
        onOpenChange={setIsEditTaskOpen}
        task={selectedTask}
        onSubmit={handleEditTask}
      />

      <DeleteTaskDialog
        open={isDeleteTaskOpen}
        onOpenChange={setIsDeleteTaskOpen}
        task={selectedTask}
        onConfirm={handleDeleteTask}
      />
    </div>
  );
}

