import { Project, Customer } from "@/types/project";

export const mockCustomers: Customer[] = [
  { id: "1", name: "Kamran Ali", email: "kamran@yourbuildpro.com" },
  { id: "2", name: "Al-Fateh Group", email: "contact@alfateh.com" },
];

export const mockProjects: Project[] = [
  {
    id: "1",
    name: "Build House",
    customer: "Kamran Ali",
    location: "Lahore, PK",
    projectType: "Residential Build",
    openInvoice: 2,
    paidInvoice: 3,
    created: "2025-03-10",
    projectNumber: "PRJ-2405",
  },
  {
    id: "2",
    name: "DHA Plaza Extension",
    customer: "Al-Fateh Group",
    location: "Islamabad, PK",
    projectType: "High-Rise Construction",
    openInvoice: 1,
    paidInvoice: 6,
    created: "2025-01-15",
    projectNumber: "PRJ-2401",
  },
  {
    id: "3",
    name: "Sunrise Villas",
    customer: "Kamran Ali",
    location: "Karachi, PK",
    projectType: "Residential Build",
    openInvoice: 3,
    paidInvoice: 6,
    created: "2024-12-20",
    projectNumber: "PRJ-2398",
  },
];


