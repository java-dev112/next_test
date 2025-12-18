"use client";

import { ComponentType, ReactNode } from "react";

interface WithPermissionProps {
  requiredPermission?: string | string[];
  fallback?: ReactNode;
  userPermissions?: string[];
}

export function withPermission<P extends object>(
  Component: ComponentType<P>,
  options?: {
    requiredPermission?: string | string[];
    fallback?: ReactNode;
    getUserPermissions?: () => string[];
  }
): ComponentType<P & WithPermissionProps> {
  return function ComponentWithPermission(
    props: P & WithPermissionProps
  ) {
    const {
      requiredPermission: propPermission,
      fallback: propFallback,
      userPermissions: propUserPermissions,
      ...componentProps
    } = props;

    const requiredPermission =
      propPermission || options?.requiredPermission || [];
    const getUserPermissions =
      options?.getUserPermissions ||
      (() => {
        const stored = localStorage.getItem("userPermissions");
        return stored ? JSON.parse(stored) : [];
      });

    const userPermissions = propUserPermissions || getUserPermissions();

    const hasPermission = () => {
      if (!requiredPermission || requiredPermission.length === 0) {
        return true;
      }

      const permissions = Array.isArray(requiredPermission)
        ? requiredPermission
        : [requiredPermission];

      return permissions.every((permission) =>
        userPermissions.includes(permission)
      );
    };

    if (!hasPermission()) {
      return (
        <>
          {propFallback ||
            options?.fallback || (
              <div className="flex items-center justify-center p-8 bg-yellow-50 border border-yellow-200 rounded-md">
                <div className="text-center">
                  <p className="text-yellow-800 font-semibold">
                    Access Denied
                  </p>
                  <p className="text-yellow-600 text-sm mt-1">
                    You don't have permission to view this content.
                  </p>
                </div>
              </div>
            )}
        </>
      );
    }

    return <Component {...(componentProps as P)} />;
  };
}

