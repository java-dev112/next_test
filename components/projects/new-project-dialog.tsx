"use client";

import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { ProjectType, RemodelType, Customer } from "@/types/project";
import { getCustomers } from "@/lib/customers-api-client";

const projectSchema = z.object({
  customer: z.string().min(1, "Customer is required"),
  projectName: z.string().min(1, "Project name is required"),
  projectDescription: z.string().optional(),
  projectType: z.enum(["Fixed Price", "Cost Plus", "No Customer"]),
  remodelType: z.string().min(1, "Remodel type is required"),
  projectTypeCategory: z.string().min(1, "Project type category is required"),
  coverPhoto: z.union([z.instanceof(File), z.undefined()]).optional(),
});

type ProjectFormData = z.infer<typeof projectSchema>;

interface NewProjectDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSubmit: (data: ProjectFormData) => void;
}

const remodelTypes: RemodelType[] = [
  "Residential Build",
  "High-Rise Construction",
  "Commercial",
  "Renovation",
];

const projectTypeCategories = [
  "New Construction",
  "Renovation",
  "Extension",
  "Interior Design",
];

export function NewProjectDialog({
  open,
  onOpenChange,
  onSubmit,
}: NewProjectDialogProps) {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [isLoadingCustomers, setIsLoadingCustomers] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
    watch,
    reset,
  } = useForm<ProjectFormData>({
    resolver: zodResolver(projectSchema),
    defaultValues: {
      customer: "",
      projectType: "Fixed Price",
    },
  });

  useEffect(() => {
    if (open) {
      const fetchCustomers = async () => {
        setIsLoadingCustomers(true);
        try {
          const response = await getCustomers();
          if (response.success && response.data) {
            setCustomers(response.data);
            if (response.data.length > 0) {
              setValue("customer", response.data[0].id);
            }
          }
        } catch (error) {
          console.error("Failed to fetch customers:", error);
        } finally {
          setIsLoadingCustomers(false);
        }
      };
      fetchCustomers();
    }
  }, [open, setValue]);

  const projectType = watch("projectType");

  const onFormSubmit = (data: ProjectFormData) => {
    if (selectedFile) {
      data.coverPhoto = selectedFile;
    }
    onSubmit(data);
    reset();
    setSelectedFile(null);
    onOpenChange(false);
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setSelectedFile(file);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl w-[95vw] sm:w-full border-2 border-dashed border-purple-300 bg-white p-0 overflow-visible">
        <div className="flex flex-row items-center justify-between pb-3 border-b mb-0 px-4 sm:px-6 pt-4 pr-8">
          <DialogTitle className="text-lg font-semibold m-0">New Project</DialogTitle>
        </div>
        <form onSubmit={handleSubmit(onFormSubmit)} className="px-4 sm:px-6 py-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {/* Customer */}
            <div className="space-y-1.5">
              <Label htmlFor="customer" className="text-sm">Customer</Label>
              <Select
                value={watch("customer")}
                onValueChange={(value) => setValue("customer", value)}
              >
                <SelectTrigger id="customer" className="w-full h-9">
                  <SelectValue placeholder="Select a customer" />
                </SelectTrigger>
                <SelectContent>
                  {isLoadingCustomers ? (
                    <SelectItem value="loading" disabled>Loading customers...</SelectItem>
                  ) : customers.length === 0 ? (
                    <SelectItem value="no-customers" disabled>No customers available</SelectItem>
                  ) : (
                    customers.map((customer) => (
                      <SelectItem key={customer.id} value={customer.id}>
                        {customer.name}
                      </SelectItem>
                    ))
                  )}
                </SelectContent>
              </Select>
              {errors.customer && (
                <p className="text-xs text-red-500">{errors.customer.message}</p>
              )}
            </div>

            {/* Project Name */}
            <div className="space-y-1.5">
              <Label htmlFor="projectName" className="text-sm">Project Name</Label>
              <Input
                id="projectName"
                {...register("projectName")}
                placeholder="Enter project name"
                className="h-9"
              />
              {errors.projectName && (
                <p className="text-xs text-red-500">{errors.projectName.message}</p>
              )}
            </div>

            {/* Project Description - Full Width */}
            <div className="space-y-1.5 col-span-1 sm:col-span-2">
              <Label htmlFor="projectDescription" className="text-sm">Project Description</Label>
              <textarea
                id="projectDescription"
                {...register("projectDescription")}
                placeholder="Enter project description"
                className="flex min-h-[60px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
              />
            </div>

            {/* Project Type (Radio) */}
            <div className="space-y-1.5 col-span-1 sm:col-span-2">
              <Label className="text-sm">Project Type</Label>
              <RadioGroup
                value={projectType}
                onValueChange={(value) =>
                  setValue("projectType", value as ProjectType)
                }
                className="flex flex-col sm:flex-row gap-3"
              >
                <div className="flex items-center">
                  <RadioGroupItem value="Fixed Price" id="fixed-price" className="mr-1.5" />
                  <Label 
                    htmlFor="fixed-price" 
                    className={`font-normal cursor-pointer px-2.5 py-1 rounded-md text-sm transition-colors ${
                      projectType === "Fixed Price" 
                        ? "bg-gray-100 text-gray-900" 
                        : "text-gray-700 hover:bg-gray-50"
                    }`}
                  >
                    Fixed Price
                  </Label>
                </div>
                <div className="flex items-center">
                  <RadioGroupItem value="Cost Plus" id="cost-plus" className="mr-1.5" />
                  <Label 
                    htmlFor="cost-plus" 
                    className={`font-normal cursor-pointer px-2.5 py-1 rounded-md text-sm transition-colors ${
                      projectType === "Cost Plus" 
                        ? "bg-gray-100 text-gray-900" 
                        : "text-gray-700 hover:bg-gray-50"
                    }`}
                  >
                    Cost Plus
                  </Label>
                </div>
                <div className="flex items-center">
                  <RadioGroupItem value="No Customer" id="no-customer" className="mr-1.5" />
                  <Label 
                    htmlFor="no-customer" 
                    className={`font-normal cursor-pointer px-2.5 py-1 rounded-md text-sm transition-colors ${
                      projectType === "No Customer" 
                        ? "bg-gray-100 text-gray-900" 
                        : "text-gray-700 hover:bg-gray-50"
                    }`}
                  >
                    No Customer
                  </Label>
                </div>
              </RadioGroup>
              {errors.projectType && (
                <p className="text-xs text-red-500">{errors.projectType.message}</p>
              )}
            </div>

            {/* Remodel Type */}
            <div className="space-y-1.5">
              <Label htmlFor="remodelType" className="text-sm">Remodel Type</Label>
              <Select
                value={watch("remodelType")}
                onValueChange={(value) => setValue("remodelType", value)}
              >
                <SelectTrigger id="remodelType" className="h-9">
                  <SelectValue placeholder="Select remodel type" />
                </SelectTrigger>
                <SelectContent>
                  {remodelTypes.map((type) => (
                    <SelectItem key={type} value={type}>
                      {type}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {errors.remodelType && (
                <p className="text-xs text-red-500">{errors.remodelType.message}</p>
              )}
            </div>

            {/* Project Type Category */}
            <div className="space-y-1.5">
              <Label htmlFor="projectTypeCategory" className="text-sm">Project type</Label>
              <Select
                value={watch("projectTypeCategory")}
                onValueChange={(value) => setValue("projectTypeCategory", value)}
              >
                <SelectTrigger id="projectTypeCategory" className="h-9">
                  <SelectValue placeholder="Select project type category" />
                </SelectTrigger>
                <SelectContent>
                  {projectTypeCategories.map((category) => (
                    <SelectItem key={category} value={category}>
                      {category}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {errors.projectTypeCategory && (
                <p className="text-xs text-red-500">
                  {errors.projectTypeCategory.message}
                </p>
              )}
            </div>

            {/* Cover Photo Upload */}
            <div className="space-y-1.5 col-span-2">
              <Label htmlFor="coverPhoto" className="text-sm">Upload a cover photo</Label>
              <div className="flex items-center gap-3">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => {
                    if (typeof document !== "undefined") {
                      document.getElementById("coverPhoto")?.click();
                    }
                  }}
                  className="cursor-pointer h-9"
                >
                  Upload a cover photo
                </Button>
                <Input
                  id="coverPhoto"
                  type="file"
                  accept="image/*"
                  onChange={handleFileChange}
                  className="hidden"
                />
                <span className="text-sm text-gray-500">
                  {selectedFile ? selectedFile.name : "No file chosen"}
                </span>
              </div>
            </div>
          </div>
        </form>
        {/* Action Buttons */}
        <div className="flex flex-col-reverse sm:flex-row justify-end gap-3 px-4 sm:px-6 pb-4 pt-3 border-t">
          <Button
            type="button"
            variant="outline"
            onClick={() => {
              reset();
              setSelectedFile(null);
              onOpenChange(false);
            }}
            className="bg-white text-gray-700 border-gray-300 hover:bg-gray-50 w-full sm:w-auto"
          >
            Cancel
          </Button>
          <Button 
            type="button"
            onClick={handleSubmit(onFormSubmit)} 
            className="bg-red-600 hover:bg-red-700 text-white w-full sm:w-auto"
          >
            Save
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}


