"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  MessageSquare,
  CheckSquare,
  FolderKanban,
  Users,
  Package,
  FileText,
  Settings,
  Search,
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  X,
  Menu,
} from "lucide-react";
import { cn } from "@/lib/utils";

interface SidebarProps {
  isMobileOpen?: boolean;
  onMobileClose?: () => void;
}

const navigationItems = [
  { name: "Dashboard", icon: LayoutDashboard, href: "/" },
  { name: "Messages", icon: MessageSquare, href: "/messages" },
  { name: "Task", icon: CheckSquare, href: "/tasks" },
  { name: "Projects", icon: FolderKanban, href: "/projects" },
  { name: "Customers", icon: Users, href: "/customers" },
  { name: "Catalog", icon: Package, href: "/catalog" },
  { name: "Files", icon: FileText, href: "/files" },
  { name: "Settings", icon: Settings, href: "/settings" },
];

export function Sidebar({ isMobileOpen = false, onMobileClose }: SidebarProps) {
  const pathname = usePathname();
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);
  useEffect(() => {
    if (onMobileClose && isMounted) {
      onMobileClose();
    }
  }, [pathname, onMobileClose, isMounted]);

  return (
    <>
      {/* Mobile Overlay */}
      {isMobileOpen && isMounted && (
        <div
          className="fixed inset-0 bg-black/50 z-[50] lg:hidden"
          onClick={onMobileClose}
        />
      )}

      {/* Sidebar */}
      <div
        className={cn(
          "h-screen flex-col border-r bg-white dark:bg-gray-900 relative z-[60] transition-transform duration-300 ease-in-out",
          isCollapsed ? "w-16" : "w-64",
          "lg:static fixed left-0 top-0",
          isMounted && isMobileOpen
            ? "translate-x-0"
            : "-translate-x-full lg:translate-x-0",
          isMounted && isMobileOpen ? "flex" : "hidden lg:flex"
        )}
      >
      {/* Logo Section */}
      <div className="flex items-center gap-2 border-b p-4 relative">
        <div className="flex h-8 w-8 items-center justify-center rounded bg-teal-600 text-white font-semibold flex-shrink-0">
          B
        </div>
        <div
          className={cn(
            "flex flex-1 items-center justify-between overflow-hidden transition-all duration-300",
            isCollapsed && "opacity-0 w-0"
          )}
        >
          <span className="font-semibold text-gray-900 dark:text-white whitespace-nowrap">
            Bahria Town
          </span>
          <ChevronDown className="h-4 w-4 text-gray-500 flex-shrink-0 hidden lg:block" />
        </div>
        {/* Mobile close button */}
        <button
          onClick={onMobileClose}
          className="lg:hidden absolute right-2 top-1/2 -translate-y-1/2 p-1 rounded-md hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
          aria-label="Close sidebar"
        >
          <X className="h-4 w-4 text-gray-500" />
        </button>
        {/* Desktop collapse button */}
        <button
          onClick={() => setIsCollapsed(!isCollapsed)}
          className={cn(
            "hidden lg:block absolute right-2 top-1/2 -translate-y-1/2 p-1 rounded-md hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors",
            isCollapsed && "right-1/2 translate-x-1/2"
          )}
          aria-label={isCollapsed ? "Expand sidebar" : "Collapse sidebar"}
        >
          {isCollapsed ? (
            <ChevronRight className="h-4 w-4 text-gray-500" />
          ) : (
            <ChevronLeft className="h-4 w-4 text-gray-500" />
          )}
        </button>
      </div>

      {/* Search */}
      <div className={cn("border-b p-4", isCollapsed && "px-2")}>
        <div className="relative">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            placeholder={isCollapsed ? "" : "Search..."}
            className={cn(
              "rounded-md border border-gray-300 bg-white py-2 pl-10 pr-4 text-sm focus:border-gray-500 focus:outline-none focus:ring-1 focus:ring-gray-500 dark:border-gray-700 dark:bg-gray-800 dark:text-white transition-all duration-300",
              isCollapsed ? "w-10 pr-2" : "w-full"
            )}
          />
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 space-y-1 p-4">
        {navigationItems.map((item) => {
          const Icon = item.icon;
          const isActive = pathname === item.href;
          return (
            <Link
              key={item.name}
              href={item.href}
              className={cn(
                "flex items-center rounded-md px-3 py-2 text-sm font-medium transition-all duration-200 group relative",
                isActive
                  ? "bg-gray-100 text-gray-900 dark:bg-gray-800 dark:text-white"
                  : "text-gray-600 hover:bg-gray-50 hover:text-gray-900 dark:text-gray-400 dark:hover:bg-gray-800 dark:hover:text-white",
                isCollapsed && "justify-center px-2"
              )}
              title={isCollapsed ? item.name : undefined}
            >
              <Icon className="h-5 w-5 flex-shrink-0" />
              <span
                className={cn(
                  "transition-all duration-300 overflow-hidden",
                  isCollapsed ? "opacity-0 w-0 ml-0" : "opacity-100 w-auto ml-3"
                )}
              >
                {item.name}
              </span>
              {isCollapsed && (
                <div className="absolute left-full ml-2 px-2 py-1 bg-gray-900 text-white text-xs rounded opacity-0 group-hover:opacity-100 pointer-events-none whitespace-nowrap z-50 transition-opacity">
                  {item.name}
                </div>
              )}
            </Link>
          );
        })}
      </nav>

      {/* User Profile */}
      <div className={cn("border-t p-4", isCollapsed && "px-2")}>
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-full bg-gray-300 text-sm font-semibold text-gray-700 flex-shrink-0">
            KA
          </div>
          <div
            className={cn(
              "flex-1 overflow-hidden transition-all duration-300",
              isCollapsed && "opacity-0 w-0"
            )}
          >
            <p className="text-sm font-medium text-gray-900 dark:text-white whitespace-nowrap">
              Kamran Ali
            </p>
            <p className="text-xs text-gray-500 dark:text-gray-400 whitespace-nowrap">
              kamran@yourbuildpro.com
            </p>
          </div>
          <ChevronDown
            className={cn(
              "h-4 w-4 text-gray-500 flex-shrink-0 transition-all duration-300",
              isCollapsed && "opacity-0 w-0"
            )}
          />
        </div>
      </div>
    </div>
    </>
  );
}


