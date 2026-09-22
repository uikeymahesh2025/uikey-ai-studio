"use client";

import React from "react";
import { HardDrive, AlertTriangle, ShieldAlert } from "lucide-react";
import { useStudio } from "@/lib/store/store-context";
import { Progress } from "@/lib/../components/ui/progress";
import { formatBytes } from "@/lib/utils";
import Link from "next/link";

export function StorageMeter() {
  const { state } = useStudio();
  const { storageUsage, studio } = state;

  const usedGB = (storageUsage.totalBytes / (1024 * 1024 * 1024)).toFixed(1);
  const quotaGB = (storageUsage.quotaBytes / (1024 * 1024 * 1024)).toFixed(0);
  const percentage = Math.min(100, Math.round((storageUsage.totalBytes / storageUsage.quotaBytes) * 100));

  let indicatorColor = "bg-studio-accent";
  let alertBadge = null;

  if (storageUsage.warningLevel === "blocked_100") {
    indicatorColor = "bg-studio-error";
    alertBadge = (
      <span className="flex items-center gap-1 text-[10px] font-semibold text-studio-error">
        <ShieldAlert className="w-3 h-3" /> 100% Limit Reached
      </span>
    );
  } else if (storageUsage.warningLevel === "warning_95") {
    indicatorColor = "bg-studio-error";
    alertBadge = (
      <span className="flex items-center gap-1 text-[10px] font-medium text-studio-error">
        <AlertTriangle className="w-3 h-3" /> 95% Full
      </span>
    );
  } else if (storageUsage.warningLevel === "warning_85") {
    indicatorColor = "bg-studio-warning";
    alertBadge = (
      <span className="flex items-center gap-1 text-[10px] font-medium text-studio-warning">
        <AlertTriangle className="w-3 h-3" /> 85% Warning
      </span>
    );
  } else if (storageUsage.warningLevel === "warning_70") {
    indicatorColor = "bg-studio-warning";
    alertBadge = (
      <span className="flex items-center gap-1 text-[10px] font-medium text-studio-warning">
        70% Used
      </span>
    );
  }

  return (
    <div className="rounded-lg border border-studio-border bg-studio-surface/70 p-3 text-studio-secondary">
      <div className="flex items-center justify-between mb-1.5">
        <div className="flex items-center gap-1.5 text-xs font-medium text-studio-primary">
          <HardDrive className="w-3.5 h-3.5 text-studio-accent" />
          <span>Storage</span>
        </div>
        <Link
          href="/dashboard/settings#storage"
          className="text-[10px] text-studio-muted hover:text-studio-accent transition-colors uppercase tracking-wider font-mono"
        >
          {studio.planId}
        </Link>
      </div>

      <Progress
        value={storageUsage.totalBytes}
        max={storageUsage.quotaBytes}
        className="h-1.5 mb-2"
        indicatorClassName={indicatorColor}
      />

      <div className="flex items-center justify-between text-[11px]">
        <span className="text-studio-primary font-medium">
          {usedGB} <span className="text-studio-muted font-normal">/ {quotaGB} GB</span>
        </span>
        <span className="text-studio-muted font-mono">{percentage}%</span>
      </div>

      {alertBadge && <div className="mt-2 pt-2 border-t border-studio-border/50">{alertBadge}</div>}
    </div>
  );
}
