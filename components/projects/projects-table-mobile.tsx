"use client";

import { Project } from "@/types/project";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { MoreHorizontal } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

interface ProjectsTableMobileProps {
  projects: Project[];
  onEdit?: (project: Project) => void;
  onDelete?: (project: Project) => void;
}

export function ProjectsTableMobile({ projects, onEdit, onDelete }: ProjectsTableMobileProps) {
  if (projects.length === 0) {
    return (
      <div className="flex items-center justify-center h-64 text-gray-500">
        <p>No projects found.</p>
      </div>
    );
  }

  return (
    <div className="space-y-3">
      {projects.map((project) => (
        <Card key={project.id} className="hover:shadow-md transition-shadow">
          <CardHeader className="pb-3">
            <div className="flex items-start justify-between">
              <div className="flex-1 min-w-0">
                <CardTitle className="text-base font-semibold truncate">
                  {project.name}
                </CardTitle>
                <Badge variant="outline" className="mt-1 text-xs">
                  {project.projectNumber}
                </Badge>
              </div>
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
            </div>
          </CardHeader>
          <CardContent className="pt-0 space-y-2">
            <div className="grid grid-cols-2 gap-3 text-sm">
              <div>
                <p className="text-xs text-gray-500 mb-1">Customer</p>
                <p className="font-medium truncate">{project.customer}</p>
              </div>
              <div>
                <p className="text-xs text-gray-500 mb-1">Location</p>
                <p className="font-medium truncate">{project.location}</p>
              </div>
              <div>
                <p className="text-xs text-gray-500 mb-1">Project Type</p>
                <p className="font-medium truncate">{project.projectType}</p>
              </div>
              <div>
                <p className="text-xs text-gray-500 mb-1">Created</p>
                <p className="font-medium">{project.created}</p>
              </div>
            </div>
            <div className="flex items-center justify-between pt-2 border-t">
              <div className="flex items-center gap-4">
                <div>
                  <p className="text-xs text-gray-500">Open Invoice</p>
                  <p className="text-sm font-semibold text-orange-600">
                    {project.openInvoice}
                  </p>
                </div>
                <div>
                  <p className="text-xs text-gray-500">Paid Invoice</p>
                  <p className="text-sm font-semibold text-green-600">
                    {project.paidInvoice}
                  </p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}

