"use client";

import { ComponentType, useState, useCallback } from "react";
import { FieldValues, UseFormReturn } from "react-hook-form";

interface WithFormValidationProps {
  formMethods?: UseFormReturn<FieldValues>;
  validateOnChange?: boolean;
  validateOnBlur?: boolean;
}

export function withFormValidation<P extends object>(
  Component: ComponentType<P & WithFormValidationProps>
): ComponentType<P & WithFormValidationProps> {
  return function ComponentWithFormValidation(
    props: P & WithFormValidationProps
  ) {
    const { formMethods, validateOnChange = true, validateOnBlur = true } = props;
    const [validationState, setValidationState] = useState<{
      isValid: boolean;
      errors: Record<string, any>;
    }>({
      isValid: false,
      errors: {},
    });

    const validateForm = useCallback(async () => {
      if (!formMethods) return false;

      const isValid = await formMethods.trigger();
      const errors = formMethods.formState.errors;

      setValidationState({
        isValid,
        errors: errors as Record<string, any>,
      });

      return isValid;
    }, [formMethods]);

    const getFieldError = useCallback(
      (fieldName: string) => {
        if (!formMethods) return null;
        return formMethods.formState.errors[fieldName]?.message as string | undefined;
      },
      [formMethods]
    );

    const hasFieldError = useCallback(
      (fieldName: string) => {
        if (!formMethods) return false;
        return !!formMethods.formState.errors[fieldName];
      },
      [formMethods]
    );

    const clearFieldError = useCallback(
      (fieldName: string) => {
        if (!formMethods) return;
        formMethods.clearErrors(fieldName);
      },
      [formMethods]
    );

    const enhancedProps = {
      ...props,
      validationState,
      validateForm,
      getFieldError,
      hasFieldError,
      clearFieldError,
    };

    return <Component {...(enhancedProps as P & WithFormValidationProps)} />;
  };
}

