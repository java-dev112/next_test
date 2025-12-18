"use client";

import { withLoading, withErrorBoundary } from "@/hoc";
import { ProjectsTable } from "./projects-table";
import { Project } from "@/types/project";

interface Column {
  key: keyof Project | "actions";
  label: string;
  visible: boolean;
}

interface ProjectsTableWithHOCProps {
  projects: Project[];
  columns: Column[];
  onColumnToggle: (columnKey: string) => void;
  isLoading?: boolean;
  error?: Error | null;
}

