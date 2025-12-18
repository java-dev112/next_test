"use client";

import { useState, useMemo, useEffect } from "react";
import { Sidebar } from "@/components/sidebar";
import { CustomersTable } from "@/components/customers/customers-table";
import { NewCustomerDialog } from "@/components/customers/new-customer-dialog";
import { EditCustomerDialog } from "@/components/customers/edit-customer-dialog";
import { DeleteCustomerDialog } from "@/components/customers/delete-customer-dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Menu, Plus, Search, Users } from "lucide-react";
import { Customer } from "@/types/project";
import {
  getCustomers,
  createCustomer,
  updateCustomer,
  deleteCustomer,
} from "@/lib/customers-api-client";
import { toast } from "sonner";

type Column = {
  key: keyof Customer | "actions";
  label: string;
  visible: boolean;
};

const initialColumns: Column[] = [
  { key: "name", label: "Name", visible: true },
  { key: "email", label: "Email", visible: true },
  { key: "phone", label: "Phone", visible: true },
  { key: "address", label: "Address", visible: true },
  { key: "actions", label: "", visible: true },
];

export default function CustomersPage() {
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [columns, setColumns] = useState<Column[]>(initialColumns);
  const [searchQuery, setSearchQuery] = useState("");
  const [isNewCustomerOpen, setIsNewCustomerOpen] = useState(false);
  const [isEditCustomerOpen, setIsEditCustomerOpen] = useState(false);
  const [isDeleteCustomerOpen, setIsDeleteCustomerOpen] = useState(false);
  const [selectedCustomer, setSelectedCustomer] = useState<Customer | null>(null);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const filteredCustomers = useMemo(() => {
    if (!searchQuery) return customers;
    
    const query = searchQuery.toLowerCase();
    return customers.filter(
      (customer) =>
        customer.name.toLowerCase().includes(query) ||
        customer.email.toLowerCase().includes(query) ||
        (customer.phone && customer.phone.toLowerCase().includes(query)) ||
        (customer.address && customer.address.toLowerCase().includes(query))
    );
  }, [customers, searchQuery]);

  useEffect(() => {
    const fetchCustomers = async () => {
      try {
        setIsLoading(true);
        setError(null);
        const response = await getCustomers();
        
        if (response.success && response.data) {
          setCustomers(response.data);
        } else {
          setError(response.error || "Failed to fetch customers");
          toast.error(response.error || "Failed to fetch customers");
        }
      } catch (error: any) {
        setError(error.message || "Failed to fetch customers");
        toast.error("Failed to fetch customers");
      } finally {
        setIsLoading(false);
      }
    };

    fetchCustomers();
  }, []);

  const handleNewCustomer = async (data: any) => {
    try {
      setIsLoading(true);
      const response = await createCustomer({
        name: data.name,
        email: data.email,
        phone: data.phone,
        address: data.address,
      });

      if (response.success && response.data) {
        setCustomers((prev) => [response.data!, ...prev]);
        toast.success("Customer created successfully");
        setIsNewCustomerOpen(false);
      } else {
        toast.error(response.error || "Failed to create customer");
        setError(response.error || "Failed to create customer");
      }
    } catch (error: any) {
      toast.error("Failed to create customer");
      setError(error.message || "Failed to create customer");
    } finally {
      setIsLoading(false);
    }
  };

  const handleEditCustomer = async (data: any) => {
    if (!selectedCustomer) return;
    
    try {
      setIsLoading(true);
      const response = await updateCustomer(selectedCustomer.id, {
        name: data.name,
        email: data.email,
        phone: data.phone,
        address: data.address,
      });

      if (response.success && response.data) {
        setCustomers((prev) =>
          prev.map((c) => (c.id === selectedCustomer.id ? response.data! : c))
        );
        toast.success("Customer updated successfully");
        setIsEditCustomerOpen(false);
        setSelectedCustomer(null);
      } else {
        toast.error(response.error || "Failed to update customer");
        setError(response.error || "Failed to update customer");
      }
    } catch (error: any) {
      toast.error("Failed to update customer");
      setError(error.message || "Failed to update customer");
    } finally {
      setIsLoading(false);
    }
  };

  const handleDeleteCustomer = async () => {
    if (!selectedCustomer) return;
    
    try {
      setIsLoading(true);
      const response = await deleteCustomer(selectedCustomer.id);

      if (response.success) {
        setCustomers((prev) => prev.filter((c) => c.id !== selectedCustomer.id));
        toast.success("Customer deleted successfully");
        setIsDeleteCustomerOpen(false);
        setSelectedCustomer(null);
      } else {
        toast.error(response.error || "Failed to delete customer");
        setError(response.error || "Failed to delete customer");
      }
    } catch (error: any) {
      toast.error("Failed to delete customer");
      setError(error.message || "Failed to delete customer");
    } finally {
      setIsLoading(false);
    }
  };

  const handleEditClick = (customer: Customer) => {
    setSelectedCustomer(customer);
    setIsEditCustomerOpen(true);
  };

  const handleDeleteClick = (customer: Customer) => {
    setSelectedCustomer(customer);
    setIsDeleteCustomerOpen(true);
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
                <Users className="h-5 w-5 text-gray-600 dark:text-gray-400 flex-shrink-0" />
                <h1 className="text-lg sm:text-xl font-semibold text-gray-900 dark:text-white truncate">
                  Customers
                </h1>
              </div>
              <div className="relative hidden sm:block flex-1 max-w-xs">
                <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
                <Input
                  type="text"
                  placeholder="Search customers..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-10"
                />
              </div>
            </div>
            <div className="flex items-center gap-2 flex-shrink-0">
              <Button
                onClick={() => setIsNewCustomerOpen(true)}
                className="bg-red-600 hover:bg-red-700 text-white"
                size="sm"
              >
                <Plus className="h-4 w-4 mr-2" />
                Add Customer
              </Button>
            </div>
          </div>
          
          {/* Mobile Search Bar */}
          <div className="sm:hidden mt-3">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
              <Input
                type="text"
                placeholder="Search customers..."
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
                <p className="text-gray-600 dark:text-gray-400">Loading customers...</p>
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
                    const response = await getCustomers();
                    if (response.success && response.data) {
                      setCustomers(response.data);
                    } else {
                      setError(response.error || "Failed to fetch customers");
                    }
                    setIsLoading(false);
                  }}
                >
                  Retry
                </Button>
              </div>
            </div>
          ) : filteredCustomers.length === 0 ? (
            <div className="flex items-center justify-center h-full">
              <div className="text-center">
                <p className="text-gray-600 dark:text-gray-400 mb-4">
                  {searchQuery ? "No customers found matching your search" : "No customers found"}
                </p>
                {!searchQuery && (
                  <Button
                    onClick={() => setIsNewCustomerOpen(true)}
                    className="bg-red-600 hover:bg-red-700 text-white"
                  >
                    <Plus className="h-4 w-4 mr-2" />
                    Add Your First Customer
                  </Button>
                )}
              </div>
            </div>
          ) : (
            <CustomersTable
              customers={filteredCustomers}
              columns={columns}
              onColumnToggle={handleColumnToggle}
              onEdit={handleEditClick}
              onDelete={handleDeleteClick}
            />
          )}
        </main>
      </div>

      <NewCustomerDialog
        open={isNewCustomerOpen}
        onOpenChange={setIsNewCustomerOpen}
        onSubmit={handleNewCustomer}
      />

      <EditCustomerDialog
        open={isEditCustomerOpen}
        onOpenChange={setIsEditCustomerOpen}
        customer={selectedCustomer}
        onSubmit={handleEditCustomer}
      />

      <DeleteCustomerDialog
        open={isDeleteCustomerOpen}
        onOpenChange={setIsDeleteCustomerOpen}
        customer={selectedCustomer}
        onConfirm={handleDeleteCustomer}
      />
    </div>
  );
}

