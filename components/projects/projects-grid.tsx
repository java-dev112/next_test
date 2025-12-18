"use client";

import { Project } from "@/types/project";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { FolderKanban, MapPin, User, Calendar, FileText } from "lucide-react";

interface ProjectsGridProps {
  projects: Project[];
}

export function ProjectsGrid({ projects }: ProjectsGridProps) {
  if (projects.length === 0) {
    return (
      <div className="flex items-center justify-center h-64 text-gray-500">
        <p>No projects found.</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      {projects.map((project) => (
        <Card key={project.id} className="hover:shadow-lg transition-shadow">
          <CardHeader>
            <CardTitle className="flex items-start justify-between">
              <div className="flex items-center gap-2 flex-1">
                <FolderKanban className="h-5 w-5 text-blue-600" />
                <span className="text-lg">{project.name}</span>
              </div>
              <Badge variant="outline" className="text-xs">
                {project.projectNumber}
              </Badge>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="flex items-center gap-2 text-sm text-gray-600">
              <User className="h-4 w-4" />
              <span>{project.customer}</span>
            </div>
            <div className="flex items-center gap-2 text-sm text-gray-600">
              <MapPin className="h-4 w-4" />
              <span>{project.location}</span>
            </div>
            <div className="flex items-center gap-2 text-sm text-gray-600">
              <FileText className="h-4 w-4" />
              <span>{project.projectType}</span>
            </div>
            <div className="flex items-center justify-between pt-2 border-t">
              <div className="flex flex-col gap-1">
                <span className="text-xs text-gray-500">Open Invoice</span>
                <span className="text-sm font-semibold text-orange-600">
                  {project.openInvoice}
                </span>
              </div>
              <div className="flex flex-col gap-1">
                <span className="text-xs text-gray-500">Paid Invoice</span>
                <span className="text-sm font-semibold text-green-600">
                  {project.paidInvoice}
                </span>
              </div>
              <div className="flex items-center gap-1 text-xs text-gray-500">
                <Calendar className="h-3 w-3" />
                <span>{project.created}</span>
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}

