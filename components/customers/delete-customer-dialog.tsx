"use client";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Customer } from "@/types/project";

interface DeleteCustomerDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  customer: Customer | null;
  onConfirm: () => void;
}

export function DeleteCustomerDialog({
  open,
  onOpenChange,
  customer,
  onConfirm,
}: DeleteCustomerDialogProps) {
  const handleConfirm = () => {
    onConfirm();
    onOpenChange(false);
  };

  if (!customer) return null;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>Delete Customer</DialogTitle>
          <DialogDescription>
            Are you sure you want to delete the customer "{customer.name}"? This action cannot be undone.
          </DialogDescription>
        </DialogHeader>
        <div className="flex flex-col-reverse sm:flex-row justify-end gap-3 pt-4">
          <Button
            type="button"
            variant="outline"
            onClick={() => onOpenChange(false)}
            className="w-full sm:w-auto"
          >
            Cancel
          </Button>
          <Button
            type="button"
            onClick={handleConfirm}
            className="bg-red-600 hover:bg-red-700 text-white w-full sm:w-auto"
          >
            Delete
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}

