"use client";

import React, { useState } from "react";
import {
  Bell,
  Search,
  Plus,
  Menu,
  Sparkles,
  ExternalLink,
  CheckCircle2,
  AlertCircle,
  Clock,
  RotateCcw,
  User,
  LogOut,
  Settings,
  HardDrive,
  ChevronDown,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useStudio } from "@/lib/store/store-context";
import { QuickCreateModal } from "@/components/modals/quick-create-modal";
import { createClient, isSupabaseConfigured } from "@/lib/supabase/client";
import Link from "next/link";
import { useRouter } from "next/navigation";

export function Topbar({ onOpenMobileMenu }: { onOpenMobileMenu: () => void }) {
  const router = useRouter();
  const { state, resetToDemo } = useStudio();
  const { studio, notifications, storageUsage } = state;
  const [showQuickCreate, setShowQuickCreate] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);
  const [showProfileMenu, setShowProfileMenu] = useState(false);

  const unreadCount = notifications.filter((n) => !n.read).length;

  return (
    <header className="sticky top-0 z-30 flex h-14 w-full items-center justify-between border-b border-studio-border bg-studio-bg/85 backdrop-blur-md px-4 sm:px-6">
      {/* Left: Mobile hamburger & Studio Context */}
      <div className="flex items-center gap-3">
        <button
          onClick={onOpenMobileMenu}
          className="lg:hidden p-1.5 rounded-md text-studio-secondary hover:text-studio-primary hover:bg-studio-surface"
          aria-label="Open sidebar"
        >
          <Menu className="w-5 h-5" />
        </button>

        <div className="flex items-center gap-2">
          <Badge
            variant="accent"
            className="hidden sm:inline-flex gap-1 text-[10px] py-0 font-medium"
          >
            <Sparkles className="w-2.5 h-2.5" />
            <span>Demo Mode</span>
          </Badge>
          <span className="text-xs text-studio-muted hidden md:inline">·</span>
          <span className="text-xs text-studio-secondary hidden md:inline truncate max-w-[200px]">
            {studio.city} · {studio.serviceArea}
          </span>
        </div>
      </div>

      {/* Right: Actions */}
      <div className="flex items-center gap-2.5">
        {/* Quick Search trigger (visual hint) */}
        <button
          onClick={() => setShowQuickCreate(true)}
          className="hidden sm:flex items-center gap-2 rounded-md border border-studio-border bg-studio-surface/60 px-3 py-1.5 text-xs text-studio-muted hover:border-studio-borderHover hover:text-studio-secondary transition-colors"
        >
          <Search className="w-3.5 h-3.5" />
          <span>Quick search or action...</span>
          <kbd className="rounded border border-studio-border bg-studio-card px-1.5 text-[10px] font-mono text-studio-muted">
            ⌘K
          </kbd>
        </button>

        {/* In-app Notifications Bell */}
        <div className="relative">
          <button
            onClick={() => setShowNotifications(!showNotifications)}
            className="relative p-2 rounded-md text-studio-secondary hover:text-studio-primary hover:bg-studio-surface transition-colors"
            aria-label="Notifications"
          >
            <Bell className="w-4 h-4" />
            {unreadCount > 0 && (
              <span className="absolute top-1.5 right-1.5 flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-studio-accent opacity-75" />
                <span className="relative inline-flex rounded-full h-2 w-2 bg-studio-accent" />
              </span>
            )}
          </button>

          {/* Notifications Dropdown */}
          {showNotifications && (
            <div className="absolute right-0 mt-2 w-80 rounded-xl border border-studio-border bg-studio-card p-3 shadow-xl z-50 animate-scale-in text-xs">
              <div className="flex items-center justify-between pb-2 mb-2 border-b border-studio-border/60">
                <span className="font-semibold text-studio-primary">Notifications</span>
                <span className="text-[10px] text-studio-muted font-mono">{unreadCount} unread</span>
              </div>
              <div className="space-y-2 max-h-72 overflow-y-auto">
                {notifications.map((n) => (
                  <Link
                    key={n.id}
                    href={n.linkUrl || "#"}
                    onClick={() => setShowNotifications(false)}
                    className="block p-2 rounded-lg hover:bg-studio-surface transition-colors border border-transparent hover:border-studio-border/50"
                  >
                    <div className="flex items-center justify-between">
                      <p className="font-medium text-studio-primary truncate">{n.title}</p>
                      <span className="text-[10px] text-studio-muted">Just now</span>
                    </div>
                    <p className="text-[11px] text-studio-secondary mt-0.5 leading-snug">{n.message}</p>
                  </Link>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Demo State Reset Button */}
        <button
          onClick={() => {
            if (confirm("Reset demo data to initial studio state?")) {
              resetToDemo();
            }
          }}
          title="Reset Demo Data"
          className="hidden sm:flex items-center gap-1 p-2 text-studio-muted hover:text-studio-warning hover:bg-studio-surface rounded-md text-[11px] transition-colors"
        >
          <RotateCcw className="w-3.5 h-3.5" />
        </button>

        {/* Create New Action Button */}
        <Button
          onClick={() => setShowQuickCreate(true)}
          variant="accent"
          size="sm"
          className="gap-1.5 shadow-sm"
        >
          <Plus className="w-3.5 h-3.5" />
          <span>Create New</span>
        </Button>

        {/* User Profile & Studio Account Dropdown */}
        <div className="relative ml-1">
          <button
            onClick={() => setShowProfileMenu(!showProfileMenu)}
            className="flex items-center gap-2 p-1 pl-1.5 pr-2 rounded-full border border-studio-border bg-studio-surface/80 hover:bg-studio-surface hover:border-studio-borderHover transition-colors text-left"
            aria-label="Studio user menu"
          >
            <div className="h-6 w-6 rounded-full bg-studio-accent/20 border border-studio-accent/40 text-studio-accent flex items-center justify-center text-[10px] font-bold">
              AM
            </div>
            <span className="text-xs font-medium text-studio-primary hidden md:inline truncate max-w-[100px]">
              {studio.ownerName}
            </span>
            <ChevronDown className="w-3 h-3 text-studio-muted" />
          </button>

          {showProfileMenu && (
            <div className="absolute right-0 mt-2 w-64 rounded-xl border border-studio-border bg-studio-card p-3 shadow-2xl z-50 animate-scale-in text-xs">
              <div className="pb-2.5 mb-2 border-b border-studio-border/60">
                <p className="font-bold text-studio-primary">{studio.name}</p>
                <p className="text-[11px] text-studio-secondary mt-0.5">{studio.email}</p>
                <div className="flex items-center gap-1.5 mt-2">
                  <Badge variant="accent" className="text-[9px] py-0 px-1.5 capitalize">
                    {studio.planId} Plan
                  </Badge>
                  <span className="text-[10px] text-studio-muted font-mono">
                    {(storageUsage.totalBytes / (1024 * 1024 * 1024)).toFixed(1)} / {(storageUsage.quotaBytes / (1024 * 1024 * 1024)).toFixed(0)} GB
                  </span>
                </div>
              </div>

              <div className="space-y-1">
                <Link
                  href="/dashboard/settings"
                  onClick={() => setShowProfileMenu(false)}
                  className="flex items-center gap-2.5 px-2.5 py-1.5 rounded-lg text-studio-secondary hover:text-studio-primary hover:bg-studio-surface transition-colors"
                >
                  <Settings className="w-3.5 h-3.5 text-studio-muted" />
                  <span>Studio Settings</span>
                </Link>

                <Link
                  href="/dashboard/settings#storage"
                  onClick={() => setShowProfileMenu(false)}
                  className="flex items-center gap-2.5 px-2.5 py-1.5 rounded-lg text-studio-secondary hover:text-studio-primary hover:bg-studio-surface transition-colors"
                >
                  <HardDrive className="w-3.5 h-3.5 text-studio-muted" />
                  <span>Storage Quota</span>
                </Link>

                <button
                  onClick={async () => {
                    setShowProfileMenu(false);
                    if (isSupabaseConfigured) {
                      try {
                        const supabase = createClient();
                        if (supabase) await supabase.auth.signOut();
                      } catch (e) {
                        console.error(e);
                      }
                    }
                    router.push("/login");
                  }}
                  className="w-full flex items-center gap-2.5 px-2.5 py-1.5 rounded-lg text-studio-error hover:bg-studio-error/10 transition-colors mt-1 border-t border-studio-border/40 pt-2"
                >
                  <LogOut className="w-3.5 h-3.5" />
                  <span>Sign Out</span>
                </button>
              </div>
            </div>
          )}
        </div>
      </div>

      <QuickCreateModal open={showQuickCreate} onOpenChange={setShowQuickCreate} />
    </header>
  );
}
