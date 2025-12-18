"use client";

import { withFormValidation } from "@/hoc";
import { NewProjectDialog } from "./new-project-dialog";
import { UseFormReturn, FieldValues } from "react-hook-form";

interface EnhancedDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSubmit: (data: any) => void;
  formMethods?: UseFormReturn<FieldValues>;
  validationState?: {
    isValid: boolean;
    errors: Record<string, any>;
  };
  validateForm?: () => Promise<boolean>;
  getFieldError?: (fieldName: string) => string | undefined;
  hasFieldError?: (fieldName: string) => boolean;
  clearFieldError?: (fieldName: string) => void;
}

