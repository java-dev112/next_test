"use client";

import { useState, useMemo, useEffect } from "react";
import { Sidebar } from "@/components/sidebar";
import { ProjectsTable } from "@/components/projects/projects-table";
import { ProjectsTableMobile } from "@/components/projects/projects-table-mobile";
import { ProjectsGrid } from "@/components/projects/projects-grid";
import { NewProjectDialog } from "@/components/projects/new-project-dialog";
import { EditProjectDialog } from "@/components/projects/edit-project-dialog";
import { DeleteProjectDialog } from "@/components/projects/delete-project-dialog";
import { ShareDialog } from "@/components/projects/share-dialog";
import { ScheduleReportDialog } from "@/components/projects/schedule-report-dialog";
import { FiltersDialog, FilterState } from "@/components/projects/filters-dialog";
import { ExportDialog } from "@/components/projects/export-dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Search,
  Share2,
  Calendar,
  Download,
  Maximize2,
  Grid3x3,
  Filter,
  FileDown,
  Plus,
  FolderKanban,
  Menu,
  MoreVertical,
  List,
} from "lucide-react";
import { Project } from "@/types/project";
import { getProjects, createProject, updateProject, deleteProject, uploadImage } from "@/lib/projects-api-client";
import { getCustomers } from "@/lib/customers-api-client";
import { toast } from "sonner";

type Column = {
  key: keyof Project | "actions";
  label: string;
  visible: boolean;
};

const initialColumns: Column[] = [
  { key: "name", label: "Name", visible: true },
  { key: "customer", label: "Customer", visible: true },
  { key: "location", label: "Location", visible: true },
  { key: "projectType", label: "Project Type", visible: true },
  { key: "openInvoice", label: "Open Invoice", visible: true },
  { key: "paidInvoice", label: "Paid Invoice", visible: true },
  { key: "created", label: "Created", visible: true },
  { key: "projectNumber", label: "Project Number", visible: true },
  { key: "actions", label: "", visible: true },
];

export default function ProjectsPage() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [columns, setColumns] = useState<Column[]>(initialColumns);
  const [searchQuery, setSearchQuery] = useState("");
  const [isNewProjectOpen, setIsNewProjectOpen] = useState(false);
  const [isEditProjectOpen, setIsEditProjectOpen] = useState(false);
  const [isDeleteProjectOpen, setIsDeleteProjectOpen] = useState(false);
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);
  const [isShareOpen, setIsShareOpen] = useState(false);
  const [isScheduleReportOpen, setIsScheduleReportOpen] = useState(false);
  const [isFiltersOpen, setIsFiltersOpen] = useState(false);
  const [isExportOpen, setIsExportOpen] = useState(false);
  const [activeFilters, setActiveFilters] = useState<FilterState | null>(null);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [viewMode, setViewMode] = useState<"table" | "grid">("table");
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isMounted, setIsMounted] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const filteredProjects = useMemo(() => {
    let filtered = [...projects];

    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(
        (project) =>
          project.name.toLowerCase().includes(query) ||
          project.customer.toLowerCase().includes(query) ||
          project.location.toLowerCase().includes(query) ||
          project.projectNumber.toLowerCase().includes(query)
      );
    }

    if (activeFilters) {
      if (activeFilters.customers.length > 0) {
        filtered = filtered.filter((project) =>
          activeFilters.customers.includes(project.customer)
        );
      }

      if (activeFilters.locations.length > 0) {
        filtered = filtered.filter((project) =>
          activeFilters.locations.includes(project.location)
        );
      }

      if (activeFilters.projectTypes.length > 0) {
        filtered = filtered.filter((project) =>
          activeFilters.projectTypes.includes(project.projectType)
        );
      }

      if (activeFilters.dateFrom) {
        filtered = filtered.filter(
          (project) => project.created >= activeFilters.dateFrom
        );
      }
      if (activeFilters.dateTo) {
        filtered = filtered.filter(
          (project) => project.created <= activeFilters.dateTo
        );
      }

      if (activeFilters.minOpenInvoices) {
        filtered = filtered.filter(
          (project) =>
            project.openInvoice >= parseInt(activeFilters.minOpenInvoices)
        );
      }
      if (activeFilters.maxOpenInvoices) {
        filtered = filtered.filter(
          (project) =>
            project.openInvoice <= parseInt(activeFilters.maxOpenInvoices)
        );
      }

      if (activeFilters.minPaidInvoices) {
        filtered = filtered.filter(
          (project) =>
            project.paidInvoice >= parseInt(activeFilters.minPaidInvoices)
        );
      }
      if (activeFilters.maxPaidInvoices) {
        filtered = filtered.filter(
          (project) =>
            project.paidInvoice <= parseInt(activeFilters.maxPaidInvoices)
        );
      }
    }

    return filtered;
  }, [projects, searchQuery, activeFilters]);

  const handleColumnToggle = (columnKey: string) => {
    setColumns((prev) =>
      prev.map((col) =>
        col.key === columnKey ? { ...col, visible: !col.visible } : col
      )
    );
  };

  const handleNewProject = async (data: any) => {
    try {
      setIsLoading(true);
      
      let coverPhotoUrl: string | undefined;
      if (data.coverPhoto && data.coverPhoto instanceof File) {
        const uploadResponse = await uploadImage(data.coverPhoto);
        if (uploadResponse.success && uploadResponse.data) {
          coverPhotoUrl = uploadResponse.data.url;
        } else {
          toast.error(uploadResponse.error || "Failed to upload image");
          setIsLoading(false);
          return;
        }
      }

      const response = await createProject({
        projectName: data.projectName,
        customer: data.customer,
        remodelType: data.remodelType,
        projectDescription: data.projectDescription,
        location: data.location || "TBD",
        coverPhoto: coverPhotoUrl,
      });

      if (response.success && response.data) {
        setProjects((prev) => [response.data!, ...prev]);
        toast.success("Project created successfully");
        setIsNewProjectOpen(false);
      } else {
        toast.error(response.error || "Failed to create project");
        setError(response.error || "Failed to create project");
      }
    } catch (error: any) {
      toast.error("Failed to create project");
      setError(error.message || "Failed to create project");
    } finally {
      setIsLoading(false);
    }
  };

  const handleEditProject = async (data: any) => {
    if (!selectedProject) return;
    
    try {
      setIsLoading(true);
      
      let coverPhotoUrl: string | undefined = selectedProject.coverPhoto;
      if (data.coverPhoto && data.coverPhoto instanceof File) {
        const uploadResponse = await uploadImage(data.coverPhoto);
        if (uploadResponse.success && uploadResponse.data) {
          coverPhotoUrl = uploadResponse.data.url;
        } else {
          toast.error(uploadResponse.error || "Failed to upload image");
          setIsLoading(false);
          return;
        }
      }

      let customerName = selectedProject.customer;
      if (data.customer) {
        try {
          const customerResponse = await getCustomers();
          if (customerResponse.success && customerResponse.data) {
            const customer = customerResponse.data.find((c) => c.id === data.customer);
            customerName = customer?.name || selectedProject.customer;
          }
        } catch (error) {
          console.error("Failed to fetch customer:", error);
        }
      }

      const response = await updateProject(selectedProject.id, {
        name: data.projectName,
        customer: customerName,
        location: data.location || "TBD",
        projectType: data.remodelType,
        description: data.projectDescription,
        coverPhoto: coverPhotoUrl,
      });

      if (response.success && response.data) {
        setProjects((prev) =>
          prev.map((p) => (p.id === selectedProject.id ? response.data! : p))
        );
        toast.success("Project updated successfully");
        setIsEditProjectOpen(false);
        setSelectedProject(null);
      } else {
        toast.error(response.error || "Failed to update project");
        setError(response.error || "Failed to update project");
      }
    } catch (error: any) {
      toast.error("Failed to update project");
      setError(error.message || "Failed to update project");
    } finally {
      setIsLoading(false);
    }
  };

  const handleDeleteProject = async () => {
    if (!selectedProject) return;
    
    try {
      setIsLoading(true);
      const response = await deleteProject(selectedProject.id);

      if (response.success) {
        setProjects((prev) => prev.filter((p) => p.id !== selectedProject.id));
        toast.success("Project deleted successfully");
        setIsDeleteProjectOpen(false);
        setSelectedProject(null);
      } else {
        toast.error(response.error || "Failed to delete project");
        setError(response.error || "Failed to delete project");
      }
    } catch (error: any) {
      toast.error("Failed to delete project");
      setError(error.message || "Failed to delete project");
    } finally {
      setIsLoading(false);
    }
  };

  const handleEditClick = (project: Project) => {
    setSelectedProject(project);
    setIsEditProjectOpen(true);
  };

  const handleDeleteClick = (project: Project) => {
    setSelectedProject(project);
    setIsDeleteProjectOpen(true);
  };

  useEffect(() => {
    const fetchProjects = async () => {
      try {
        setIsLoading(true);
        setError(null);
        const response = await getProjects();
        
        if (response.success && response.data) {
          setProjects(response.data);
        } else {
          setError(response.error || "Failed to fetch projects");
          toast.error(response.error || "Failed to fetch projects");
        }
      } catch (error: any) {
        setError(error.message || "Failed to fetch projects");
        toast.error("Failed to fetch projects");
      } finally {
        setIsLoading(false);
      }
    };

    fetchProjects();
  }, []);

  const handleDownload = () => {
    if (filteredProjects.length === 0) {
      return;
    }
    import("@/lib/export-utils").then(({ exportToCSV }) => {
      exportToCSV(filteredProjects, "projects");
    });
  };

  const handleFullscreen = () => {
    if (typeof window === "undefined" || typeof document === "undefined") return;
    
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen().catch((err) => {
        console.error("Error attempting to enable fullscreen:", err);
      });
      setIsFullscreen(true);
    } else {
      document.exitFullscreen();
      setIsFullscreen(false);
    }
  };

  useEffect(() => {
    setIsMounted(true);
  }, []);

  useEffect(() => {
    if (!isMounted || typeof window === "undefined") return;
    
    const handleFullscreenChange = () => {
      setIsFullscreen(!!document.fullscreenElement);
    };
    
    setIsFullscreen(!!document.fullscreenElement);
    
    document.addEventListener("fullscreenchange", handleFullscreenChange);
    return () => {
      document.removeEventListener("fullscreenchange", handleFullscreenChange);
    };
  }, [isMounted]);

  return (
    <div className="flex h-screen bg-gray-50 dark:bg-gray-950">
      <Sidebar
        isMobileOpen={isMobileMenuOpen}
        onMobileClose={() => setIsMobileMenuOpen(false)}
      />
      <div className="flex flex-1 flex-col overflow-hidden w-full lg:w-auto">
        <header className="border-b bg-white dark:bg-gray-900">
          <div className="px-3 sm:px-4 lg:px-6 py-3 lg:py-4 border-b">
            <div className="flex items-center justify-between gap-2">
              <div className="flex items-center gap-2 sm:gap-4 flex-1 min-w-0">
                <Button
                  variant="ghost"
                  size="sm"
                  className="lg:hidden h-9 w-9 p-0"
                  onClick={() => setIsMobileMenuOpen(true)}
                >
                  <Menu className="h-5 w-5" />
                </Button>
                <div className="flex items-center gap-2 min-w-0">
                  <FolderKanban className="h-5 w-5 text-gray-600 dark:text-gray-400 flex-shrink-0" />
                  <h1 className="text-lg sm:text-xl font-semibold text-gray-900 dark:text-white truncate">
                    Projects
                  </h1>
                </div>
              </div>
              <div className="flex items-center gap-1 sm:gap-2 flex-shrink-0">
                <div className="hidden md:flex items-center gap-2">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setIsShareOpen(true)}
                    className="text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800"
                  >
                    Share
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setIsScheduleReportOpen(true)}
                    className="text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800"
                  >
                    <Calendar className="h-4 w-4 mr-2" />
                    Schedule report
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="h-9 w-9 p-0 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800"
                    onClick={handleDownload}
                    title="Quick Download (CSV)"
                  >
                    <Download className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="h-9 w-9 p-0 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800"
                    onClick={handleFullscreen}
                    title={isFullscreen ? "Exit Fullscreen" : "Enter Fullscreen"}
                  >
                    <Maximize2 className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="h-9 w-9 p-0 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800"
                    title="More options"
                  >
                    <MoreVertical className="h-4 w-4" />
                  </Button>
                </div>
                
                <div className="md:hidden">
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="sm" className="h-9 w-9 p-0">
                        <MoreVertical className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end" className="w-48">
                      <DropdownMenuItem onClick={() => setIsShareOpen(true)}>
                        <Share2 className="h-4 w-4 mr-2" />
                        Share
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={() => setIsScheduleReportOpen(true)}>
                        <Calendar className="h-4 w-4 mr-2" />
                        Schedule report
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={handleDownload}>
                        <Download className="h-4 w-4 mr-2" />
                        Download
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={handleFullscreen}>
                        <Maximize2 className="h-4 w-4 mr-2" />
                        {isFullscreen ? "Exit Fullscreen" : "Fullscreen"}
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
              </div>
            </div>
          </div>
          
          <div className="px-3 sm:px-4 lg:px-6 py-3 lg:py-4">
            <div className="flex items-center justify-between gap-2">
              <div className="flex items-center gap-2 sm:gap-4 flex-1 min-w-0">
                <div className="relative flex-1 max-w-xs">
                  <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
                  <Input
                    type="text"
                    placeholder="Search..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full pl-10"
                  />
                </div>
              </div>
              <div className="flex items-center gap-1 sm:gap-2 flex-shrink-0">
                <div className="hidden md:flex items-center gap-0 border border-gray-200 dark:border-gray-700 rounded-md overflow-hidden">
                  <Button
                    variant="ghost"
                    size="sm"
                    className={`h-9 px-3 rounded-none border-0 ${
                      viewMode === "table"
                        ? "bg-gray-100 dark:bg-gray-800 text-gray-900 dark:text-white"
                        : "text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-900"
                    }`}
                    onClick={() => setViewMode("table")}
                    title="List View"
                  >
                    <List className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    className={`h-9 px-3 rounded-none border-0 border-l border-gray-200 dark:border-gray-700 ${
                      viewMode === "grid"
                        ? "bg-gray-100 dark:bg-gray-800 text-gray-900 dark:text-white"
                        : "text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-900"
                    }`}
                    onClick={() => setViewMode("grid")}
                    title="Grid View"
                  >
                    <Grid3x3 className="h-4 w-4" />
                  </Button>
                </div>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setIsFiltersOpen(true)}
                  className="text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800"
                >
                  <Filter className="h-4 w-4 mr-2" />
                  Filters
                  {activeFilters &&
                    Object.values(activeFilters).some(
                      (v) =>
                        (Array.isArray(v) && v.length > 0) ||
                        (typeof v === "string" && v !== "")
                    ) && (
                      <span className="ml-2 px-1.5 py-0.5 text-xs bg-blue-600 text-white rounded-full">
                        {
                          Object.values(activeFilters).filter(
                            (v) =>
                              (Array.isArray(v) && v.length > 0) ||
                              (typeof v === "string" && v !== "")
                          ).length
                        }
                      </span>
                    )}
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setIsExportOpen(true)}
                  className="text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800"
                >
                  <FileDown className="h-4 w-4 mr-2" />
                  Export
                </Button>
                <Button
                  onClick={() => setIsNewProjectOpen(true)}
                  className="bg-red-600 hover:bg-red-700 text-white"
                  size="sm"
                >
                  <Plus className="h-4 w-4 mr-2" />
                  Add Project
                </Button>
              </div>
            </div>
          </div>
        </header>

        <main className="flex-1 overflow-y-auto p-3 sm:p-4 lg:p-6">
          {isLoading ? (
            <div className="flex items-center justify-center h-full">
              <div className="text-center">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900 dark:border-gray-100 mx-auto mb-4"></div>
                <p className="text-gray-600 dark:text-gray-400">Loading projects...</p>
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
                    const response = await getProjects();
                    if (response.success && response.data) {
                      setProjects(response.data);
                    } else {
                      setError(response.error || "Failed to fetch projects");
                    }
                    setIsLoading(false);
                  }}
                >
                  Retry
                </Button>
              </div>
            </div>
          ) : filteredProjects.length === 0 ? (
            <div className="flex items-center justify-center h-full">
              <div className="text-center">
                <p className="text-gray-600 dark:text-gray-400 mb-4">No projects found</p>
                <Button
                  onClick={() => setIsNewProjectOpen(true)}
                  className="bg-red-600 hover:bg-red-700 text-white"
                >
                  <Plus className="h-4 w-4 mr-2" />
                  Add Your First Project
                </Button>
              </div>
            </div>
          ) : viewMode === "table" ? (
            <>
              <div className="hidden md:block">
                <ProjectsTable
                  projects={filteredProjects}
                  columns={columns}
                  onColumnToggle={handleColumnToggle}
                  onEdit={handleEditClick}
                  onDelete={handleDeleteClick}
                />
              </div>
              <div className="md:hidden">
                <ProjectsTableMobile 
                  projects={filteredProjects}
                  onEdit={handleEditClick}
                  onDelete={handleDeleteClick}
                />
              </div>
            </>
          ) : (
            <ProjectsGrid projects={filteredProjects} />
          )}
        </main>
      </div>

      <NewProjectDialog
        open={isNewProjectOpen}
        onOpenChange={setIsNewProjectOpen}
        onSubmit={handleNewProject}
      />

      <EditProjectDialog
        open={isEditProjectOpen}
        onOpenChange={setIsEditProjectOpen}
        project={selectedProject}
        onSubmit={handleEditProject}
      />

      <DeleteProjectDialog
        open={isDeleteProjectOpen}
        onOpenChange={setIsDeleteProjectOpen}
        project={selectedProject}
        onConfirm={handleDeleteProject}
      />

      <ShareDialog
        open={isShareOpen}
        onOpenChange={setIsShareOpen}
      />

      <ScheduleReportDialog
        open={isScheduleReportOpen}
        onOpenChange={setIsScheduleReportOpen}
      />

      <FiltersDialog
        open={isFiltersOpen}
        onOpenChange={setIsFiltersOpen}
        projects={projects}
        onApplyFilters={setActiveFilters}
        currentFilters={activeFilters || undefined}
      />

      <ExportDialog
        open={isExportOpen}
        onOpenChange={setIsExportOpen}
        projects={filteredProjects}
      />
    </div>
  );
}

