"use client";

import { useEffect } from "react";
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
import { Customer } from "@/types/project";

const customerSchema = z.object({
  name: z.string().min(1, "Name is required"),
  email: z.string().email("Invalid email address"),
  phone: z.string().optional(),
  address: z.string().optional(),
});

type CustomerFormData = z.infer<typeof customerSchema>;

interface EditCustomerDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  customer: Customer | null;
  onSubmit: (data: CustomerFormData & { id: string }) => void;
}

export function EditCustomerDialog({
  open,
  onOpenChange,
  customer,
  onSubmit,
}: EditCustomerDialogProps) {
  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
    reset,
  } = useForm<CustomerFormData>({
    resolver: zodResolver(customerSchema),
  });

  useEffect(() => {
    if (customer && open) {
      setValue("name", customer.name);
      setValue("email", customer.email);
      setValue("phone", customer.phone || "");
      setValue("address", customer.address || "");
    }
  }, [customer, open, setValue]);

  const onFormSubmit = (data: CustomerFormData) => {
    if (!customer) return;
    onSubmit({ ...data, id: customer.id });
    reset();
    onOpenChange(false);
  };

  const handleCancel = () => {
    reset();
    onOpenChange(false);
  };

  if (!customer) return null;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl w-[95vw] sm:w-full">
        <DialogHeader>
          <DialogTitle>Edit Customer</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit(onFormSubmit)} className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {/* Name */}
            <div className="space-y-1.5 sm:col-span-2">
              <Label htmlFor="editName" className="text-sm">Name *</Label>
              <Input
                id="editName"
                {...register("name")}
                placeholder="Enter customer name"
                className="h-9"
              />
              {errors.name && (
                <p className="text-xs text-red-500">{errors.name.message}</p>
              )}
            </div>

            {/* Email */}
            <div className="space-y-1.5 sm:col-span-2">
              <Label htmlFor="editEmail" className="text-sm">Email *</Label>
              <Input
                id="editEmail"
                type="email"
                {...register("email")}
                placeholder="Enter email address"
                className="h-9"
              />
              {errors.email && (
                <p className="text-xs text-red-500">{errors.email.message}</p>
              )}
            </div>

            {/* Phone */}
            <div className="space-y-1.5">
              <Label htmlFor="editPhone" className="text-sm">Phone</Label>
              <Input
                id="editPhone"
                type="tel"
                {...register("phone")}
                placeholder="Enter phone number"
                className="h-9"
              />
              {errors.phone && (
                <p className="text-xs text-red-500">{errors.phone.message}</p>
              )}
            </div>

            {/* Address */}
            <div className="space-y-1.5">
              <Label htmlFor="editAddress" className="text-sm">Address</Label>
              <Input
                id="editAddress"
                {...register("address")}
                placeholder="Enter address"
                className="h-9"
              />
              {errors.address && (
                <p className="text-xs text-red-500">{errors.address.message}</p>
              )}
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-col-reverse sm:flex-row justify-end gap-3 pt-4">
            <Button
              type="button"
              variant="outline"
              onClick={handleCancel}
              className="w-full sm:w-auto"
            >
              Cancel
            </Button>
            <Button
              type="submit"
              className="bg-red-600 hover:bg-red-700 text-white w-full sm:w-auto"
            >
              Update
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}

