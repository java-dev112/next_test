export type ProjectType = "Fixed Price" | "Cost Plus" | "No Customer";
export type RemodelType = "Residential Build" | "High-Rise Construction" | "Commercial" | "Renovation";

export interface Project {
  id: string;
  name: string;
  customer: string;
  location: string;
  projectType: RemodelType;
  openInvoice: number;
  paidInvoice: number;
  created: string;
  projectNumber: string;
  budgetVariance?: string;
  description?: string;
  coverPhoto?: string;
}

export interface Customer {
  id: string;
  name: string;
  email: string;
  phone?: string;
  address?: string;
}


