"use client";

import { ComponentType, ReactNode } from "react";

interface WithLoadingProps {
  isLoading?: boolean;
  loadingComponent?: ReactNode;
  error?: Error | null;
  errorComponent?: ReactNode;
}

export function withLoading<P extends object>(
  Component: ComponentType<P>,
  options?: {
    loadingComponent?: ReactNode;
    errorComponent?: ReactNode;
  }
): ComponentType<P & WithLoadingProps> {
  return function ComponentWithLoading(props: P & WithLoadingProps) {
    const {
      isLoading,
      loadingComponent,
      error,
      errorComponent,
      ...componentProps
    } = props;

    if (error) {
      return (
        <>
          {errorComponent || (
            <div className="flex items-center justify-center p-8 bg-red-50 border border-red-200 rounded-md">
              <div className="text-center">
                <p className="text-red-800 font-semibold">Error</p>
                <p className="text-red-600 text-sm mt-1">{error.message}</p>
              </div>
            </div>
          )}
        </>
      );
    }

    if (isLoading) {
      return (
        <>
          {loadingComponent || (
            <div className="flex items-center justify-center p-8">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
            </div>
          )}
        </>
      );
    }

    return <Component {...(componentProps as P)} />;
  };
}

