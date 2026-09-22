"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  FolderKanban,
  FileText,
  Users,
  Calendar,
  Images,
  CreditCard,
  Globe,
  BarChart3,
  UserCheck,
  Settings,
  Camera,
  Sparkles,
  ExternalLink,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { StorageMeter } from "./storage-meter";
import { useStudio } from "@/lib/store/store-context";

export function Sidebar({ onCloseMobile }: { onCloseMobile?: () => void }) {
  const pathname = usePathname();
  const { state } = useStudio();
  const { studio, portfolio } = state;

  const workspaceNav = [
    { label: "Overview", href: "/dashboard", icon: LayoutDashboard },
    { label: "Projects", href: "/dashboard/projects", icon: FolderKanban },
    { label: "Quotations", href: "/dashboard/quotations", icon: FileText },
    { label: "Clients & CRM", href: "/dashboard/clients", icon: Users },
    { label: "Calendar", href: "/dashboard/calendar", icon: Calendar },
  ];

  const deliverNav = [
    { label: "Proofing Galleries", href: "/dashboard/galleries", icon: Images },
    { label: "UPI Payments", href: "/dashboard/payments", icon: CreditCard },
    {
      label: "Public Portfolio",
      href: `/p/${portfolio.username}`,
      icon: Globe,
      external: true,
    },
  ];

  const manageNav = [
    { label: "Analytics", href: "/dashboard/analytics", icon: BarChart3 },
    { label: "Team & Roles", href: "/dashboard/team", icon: UserCheck },
    { label: "Studio Settings", href: "/dashboard/settings", icon: Settings },
  ];

  const isLinkActive = (href: string) => {
    if (href === "/dashboard") return pathname === "/dashboard";
    return pathname.startsWith(href);
  };

  return (
    <aside className="flex h-full w-64 flex-col border-r border-studio-border bg-studio-surface/95 backdrop-blur px-3 py-4 select-none">
      {/* Studio Brand Header */}
      <div className="flex items-center justify-between px-2 pb-4 mb-2 border-b border-studio-border/60">
        <Link href="/dashboard" className="flex items-center gap-2.5 group">
          <div className="w-8 h-8 rounded-lg bg-studio-card border border-studio-border flex items-center justify-center text-studio-accent shadow-sm group-hover:border-studio-accent transition-colors">
            <Camera className="w-4 h-4" />
          </div>
          <div>
            <div className="flex items-center gap-1.5">
              <span className="font-semibold text-xs text-studio-primary tracking-tight">
                UIKEY AI
              </span>
              <span className="text-[10px] font-mono font-medium px-1.5 py-0.2 rounded bg-studio-accentMuted text-studio-accent border border-studio-accent/20">
                STUDIO
              </span>
            </div>
            <p className="text-[10px] text-studio-muted truncate max-w-[130px]">
              {studio.name}
            </p>
          </div>
        </Link>
      </div>

      {/* Navigation Sections */}
      <div className="flex-1 space-y-5 overflow-y-auto pr-1">
        {/* Workspace */}
        <div>
          <div className="px-2 mb-1.5 text-[10px] font-semibold uppercase tracking-wider text-studio-muted">
            Workspace
          </div>
          <nav className="space-y-0.5">
            {workspaceNav.map((item) => {
              const active = isLinkActive(item.href);
              const Icon = item.icon;
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={onCloseMobile}
                  className={cn(
                    "flex items-center gap-2.5 rounded-md px-2.5 py-1.5 text-xs font-medium transition-colors",
                    active
                      ? "bg-studio-card text-studio-primary border border-studio-border/70 shadow-sm"
                      : "text-studio-secondary hover:text-studio-primary hover:bg-studio-surface"
                  )}
                >
                  <Icon
                    className={cn(
                      "w-4 h-4",
                      active ? "text-studio-accent" : "text-studio-muted"
                    )}
                  />
                  <span>{item.label}</span>
                </Link>
              );
            })}
          </nav>
        </div>

        {/* Deliver */}
        <div>
          <div className="px-2 mb-1.5 text-[10px] font-semibold uppercase tracking-wider text-studio-muted">
            Deliver
          </div>
          <nav className="space-y-0.5">
            {deliverNav.map((item) => {
              const active = !item.external && isLinkActive(item.href);
              const Icon = item.icon;
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  target={item.external ? "_blank" : undefined}
                  rel={item.external ? "noreferrer" : undefined}
                  onClick={onCloseMobile}
                  className={cn(
                    "flex items-center justify-between rounded-md px-2.5 py-1.5 text-xs font-medium transition-colors",
                    active
                      ? "bg-studio-card text-studio-primary border border-studio-border/70 shadow-sm"
                      : "text-studio-secondary hover:text-studio-primary hover:bg-studio-surface"
                  )}
                >
                  <div className="flex items-center gap-2.5">
                    <Icon
                      className={cn(
                        "w-4 h-4",
                        active ? "text-studio-accent" : "text-studio-muted"
                      )}
                    />
                    <span>{item.label}</span>
                  </div>
                  {item.external && (
                    <ExternalLink className="w-3 h-3 text-studio-muted" />
                  )}
                </Link>
              );
            })}
          </nav>
        </div>

        {/* Manage */}
        <div>
          <div className="px-2 mb-1.5 text-[10px] font-semibold uppercase tracking-wider text-studio-muted">
            Manage
          </div>
          <nav className="space-y-0.5">
            {manageNav.map((item) => {
              const active = isLinkActive(item.href);
              const Icon = item.icon;
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={onCloseMobile}
                  className={cn(
                    "flex items-center gap-2.5 rounded-md px-2.5 py-1.5 text-xs font-medium transition-colors",
                    active
                      ? "bg-studio-card text-studio-primary border border-studio-border/70 shadow-sm"
                      : "text-studio-secondary hover:text-studio-primary hover:bg-studio-surface"
                  )}
                >
                  <Icon
                    className={cn(
                      "w-4 h-4",
                      active ? "text-studio-accent" : "text-studio-muted"
                    )}
                  />
                  <span>{item.label}</span>
                </Link>
              );
            })}
          </nav>
        </div>
      </div>

      {/* Storage Quota Widget at bottom of sidebar */}
      <div className="mt-4 pt-3 border-t border-studio-border/60">
        <StorageMeter />
      </div>
    </aside>
  );
}
