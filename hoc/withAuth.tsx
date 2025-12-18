"use client";

import { ComponentType, useEffect, useState } from "react";
import { useRouter } from "next/navigation";

export function withAuth<P extends object>(
  Component: ComponentType<P>,
  redirectTo: string = "/login"
): ComponentType<P> {
  return function AuthenticatedComponent(props: P) {
    const router = useRouter();
    const [isAuthenticated, setIsAuthenticated] = useState<boolean | null>(null);

    useEffect(() => {
      const checkAuth = () => {
        const token = localStorage.getItem("authToken");
        const user = localStorage.getItem("user");
        
        if (token && user) {
          setIsAuthenticated(true);
        } else {
          setIsAuthenticated(false);
          router.push(redirectTo);
        }
      };

      checkAuth();
    }, [router, redirectTo]);

    if (isAuthenticated === null) {
      return (
        <div className="flex items-center justify-center min-h-screen">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
        </div>
      );
    }

    if (!isAuthenticated) {
      return null;
    }

    return <Component {...props} />;
  };
}

