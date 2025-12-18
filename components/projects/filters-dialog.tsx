"use client";

import { useState, useEffect } from "react";
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
import { Checkbox } from "@/components/ui/checkbox";
import { Filter, X } from "lucide-react";
import { Project, Customer } from "@/types/project";
import { getCustomers } from "@/lib/customers-api-client";

export interface FilterState {
  customers: string[];
  locations: string[];
  projectTypes: string[];
  dateFrom: string;
  dateTo: string;
  minOpenInvoices: string;
  maxOpenInvoices: string;
  minPaidInvoices: string;
  maxPaidInvoices: string;
}

interface FiltersDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  projects: Project[];
  onApplyFilters: (filters: FilterState) => void;
  currentFilters?: FilterState;
}

export function FiltersDialog({
  open,
  onOpenChange,
  projects,
  onApplyFilters,
  currentFilters,
}: FiltersDialogProps) {
  const [filters, setFilters] = useState<FilterState>({
    customers: [],
    locations: [],
    projectTypes: [],
    dateFrom: "",
    dateTo: "",
    minOpenInvoices: "",
    maxOpenInvoices: "",
    minPaidInvoices: "",
    maxPaidInvoices: "",
  });
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [isLoadingCustomers, setIsLoadingCustomers] = useState(false);

  const uniqueLocations = Array.from(
    new Set(projects.map((p) => p.location))
  ).sort();
  const uniqueProjectTypes = Array.from(
    new Set(projects.map((p) => p.projectType))
  ).sort();

  useEffect(() => {
    if (open) {
      const fetchCustomers = async () => {
        setIsLoadingCustomers(true);
        try {
          const response = await getCustomers();
          if (response.success && response.data) {
            setCustomers(response.data);
          }
        } catch (error) {
          console.error("Failed to fetch customers:", error);
        } finally {
          setIsLoadingCustomers(false);
        }
      };
      fetchCustomers();
    }
  }, [open]);

  useEffect(() => {
    if (currentFilters) {
      setFilters(currentFilters);
    }
  }, [currentFilters]);

  const handleCustomerToggle = (customer: string) => {
    setFilters((prev) => ({
      ...prev,
      customers: prev.customers.includes(customer)
        ? prev.customers.filter((c) => c !== customer)
        : [...prev.customers, customer],
    }));
  };

  const handleLocationToggle = (location: string) => {
    setFilters((prev) => ({
      ...prev,
      locations: prev.locations.includes(location)
        ? prev.locations.filter((l) => l !== location)
        : [...prev.locations, location],
    }));
  };

  const handleProjectTypeToggle = (type: string) => {
    setFilters((prev) => ({
      ...prev,
      projectTypes: prev.projectTypes.includes(type)
        ? prev.projectTypes.filter((t) => t !== type)
        : [...prev.projectTypes, type],
    }));
  };

  const handleApply = () => {
    onApplyFilters(filters);
    onOpenChange(false);
  };

  const handleClear = () => {
    const clearedFilters: FilterState = {
      customers: [],
      locations: [],
      projectTypes: [],
      dateFrom: "",
      dateTo: "",
      minOpenInvoices: "",
      maxOpenInvoices: "",
      minPaidInvoices: "",
      maxPaidInvoices: "",
    };
    setFilters(clearedFilters);
    onApplyFilters(clearedFilters);
  };

  const activeFilterCount =
    filters.customers.length +
    filters.locations.length +
    filters.projectTypes.length +
    (filters.dateFrom ? 1 : 0) +
    (filters.dateTo ? 1 : 0) +
    (filters.minOpenInvoices ? 1 : 0) +
    (filters.maxOpenInvoices ? 1 : 0) +
    (filters.minPaidInvoices ? 1 : 0) +
    (filters.maxPaidInvoices ? 1 : 0);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto w-[95vw] sm:w-full">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Filter className="h-5 w-5" />
            Filters
            {activeFilterCount > 0 && (
              <span className="ml-2 px-2 py-0.5 text-xs bg-blue-100 text-blue-800 rounded-full">
                {activeFilterCount}
              </span>
            )}
          </DialogTitle>
        </DialogHeader>
        <div className="space-y-6">
          {/* Customers */}
          <div className="space-y-2">
            <Label>Customers</Label>
            <div className="max-h-32 overflow-y-auto border rounded-md p-2 space-y-2">
              {isLoadingCustomers ? (
                <div className="flex items-center justify-center py-4 text-sm text-gray-500">
                  Loading customers...
                </div>
              ) : customers.length === 0 ? (
                <div className="flex items-center justify-center py-4 text-sm text-gray-500">
                  No customers found
                </div>
              ) : (
                customers.map((customer) => (
                  <div key={customer.id} className="flex items-center space-x-2">
                    <Checkbox
                      id={`customer-${customer.id}`}
                      checked={filters.customers.includes(customer.name)}
                      onCheckedChange={() => handleCustomerToggle(customer.name)}
                    />
                    <Label
                      htmlFor={`customer-${customer.id}`}
                      className="font-normal cursor-pointer flex-1"
                    >
                      {customer.name}
                    </Label>
                  </div>
                ))
              )}
            </div>
          </div>

          {/* Locations */}
          <div className="space-y-2">
            <Label>Locations</Label>
            <div className="max-h-32 overflow-y-auto border rounded-md p-2 space-y-2">
              {uniqueLocations.map((location) => (
                <div key={location} className="flex items-center space-x-2">
                  <Checkbox
                    id={`location-${location}`}
                    checked={filters.locations.includes(location)}
                    onCheckedChange={() => handleLocationToggle(location)}
                  />
                  <Label
                    htmlFor={`location-${location}`}
                    className="font-normal cursor-pointer flex-1"
                  >
                    {location}
                  </Label>
                </div>
              ))}
            </div>
          </div>

          {/* Project Types */}
          <div className="space-y-2">
            <Label>Project Types</Label>
            <div className="max-h-32 overflow-y-auto border rounded-md p-2 space-y-2">
              {uniqueProjectTypes.map((type) => (
                <div key={type} className="flex items-center space-x-2">
                  <Checkbox
                    id={`type-${type}`}
                    checked={filters.projectTypes.includes(type)}
                    onCheckedChange={() => handleProjectTypeToggle(type)}
                  />
                  <Label
                    htmlFor={`type-${type}`}
                    className="font-normal cursor-pointer flex-1"
                  >
                    {type}
                  </Label>
                </div>
              ))}
            </div>
          </div>

          {/* Date Range */}
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="dateFrom">Created From</Label>
              <Input
                id="dateFrom"
                type="date"
                value={filters.dateFrom}
                onChange={(e) =>
                  setFilters((prev) => ({ ...prev, dateFrom: e.target.value }))
                }
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="dateTo">Created To</Label>
              <Input
                id="dateTo"
                type="date"
                value={filters.dateTo}
                onChange={(e) =>
                  setFilters((prev) => ({ ...prev, dateTo: e.target.value }))
                }
              />
            </div>
          </div>

          {/* Invoice Filters */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>Open Invoices</Label>
              <div className="grid grid-cols-2 gap-2">
                <Input
                  type="number"
                  placeholder="Min"
                  value={filters.minOpenInvoices}
                  onChange={(e) =>
                    setFilters((prev) => ({
                      ...prev,
                      minOpenInvoices: e.target.value,
                    }))
                  }
                />
                <Input
                  type="number"
                  placeholder="Max"
                  value={filters.maxOpenInvoices}
                  onChange={(e) =>
                    setFilters((prev) => ({
                      ...prev,
                      maxOpenInvoices: e.target.value,
                    }))
                  }
                />
              </div>
            </div>
            <div className="space-y-2">
              <Label>Paid Invoices</Label>
              <div className="grid grid-cols-2 gap-2">
                <Input
                  type="number"
                  placeholder="Min"
                  value={filters.minPaidInvoices}
                  onChange={(e) =>
                    setFilters((prev) => ({
                      ...prev,
                      minPaidInvoices: e.target.value,
                    }))
                  }
                />
                <Input
                  type="number"
                  placeholder="Max"
                  value={filters.maxPaidInvoices}
                  onChange={(e) =>
                    setFilters((prev) => ({
                      ...prev,
                      maxPaidInvoices: e.target.value,
                    }))
                  }
                />
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-col-reverse sm:flex-row justify-between items-center gap-3 pt-4 border-t">
            <Button variant="outline" onClick={handleClear} className="w-full sm:w-auto">
              <X className="h-4 w-4 mr-2" />
              Clear All
            </Button>
            <div className="flex flex-col sm:flex-row gap-2 w-full sm:w-auto">
              <Button variant="outline" onClick={() => onOpenChange(false)} className="w-full sm:w-auto">
                Cancel
              </Button>
              <Button onClick={handleApply} className="w-full sm:w-auto">Apply Filters</Button>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}

