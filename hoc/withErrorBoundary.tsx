"use client";

import { ComponentType, Component, ReactNode, ErrorInfo } from "react";

interface ErrorBoundaryState {
  hasError: boolean;
  error: Error | null;
}

interface WithErrorBoundaryProps {
  fallback?: ReactNode;
  onError?: (error: Error, errorInfo: ErrorInfo) => void;
}

export function withErrorBoundary<P extends object>(
  WrappedComponent: ComponentType<P>,
  options?: {
    fallback?: ReactNode;
    onError?: (error: Error, errorInfo: ErrorInfo) => void;
  }
): ComponentType<P & WithErrorBoundaryProps> {
  class ErrorBoundaryWrapper extends Component<
    P & WithErrorBoundaryProps,
    ErrorBoundaryState
  > {
    static displayName = `withErrorBoundary(${
      WrappedComponent.displayName || WrappedComponent.name || "Component"
    })`;

    constructor(props: P & WithErrorBoundaryProps) {
      super(props);
      this.state = {
        hasError: false,
        error: null,
      };
    }

    static getDerivedStateFromError(error: Error): ErrorBoundaryState {
      return {
        hasError: true,
        error,
      };
    }

    componentDidCatch(error: Error, errorInfo: ErrorInfo) {
      if (options?.onError) {
        options.onError(error, errorInfo);
      }

      console.error("Error caught by boundary:", error, errorInfo);
    }

    render() {
      if (this.state.hasError) {
        return (
          <>
            {options?.fallback || (
              <div className="flex items-center justify-center p-8 bg-red-50 border border-red-200 rounded-md">
                <div className="text-center">
                  <p className="text-red-800 font-semibold text-lg mb-2">
                    Something went wrong
                  </p>
                  <p className="text-red-600 text-sm mb-4">
                    {this.state.error?.message || "An unexpected error occurred"}
                  </p>
                  <button
                    onClick={() => {
                      this.setState({ hasError: false, error: null });
                      window.location.reload();
                    }}
                    className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 transition-colors"
                  >
                    Reload Page
                  </button>
                </div>
              </div>
            )}
          </>
        );
      }

      const { fallback, onError, ...componentProps } = this.props;
      return <WrappedComponent {...(componentProps as P)} />;
    }
  }

  return ErrorBoundaryWrapper;
}

