"use client";

import React, { useEffect } from "react";
import Link from "next/link";
import { AlertTriangle, RefreshCw, Home, ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    // Log the error to console
    console.error("UIKEY Studio Error Boundary caught:", error);
  }, [error]);

  return (
    <div className="min-h-screen bg-studio-bg flex items-center justify-center p-4">
      <div className="w-full max-w-md rounded-xl border border-studio-border bg-studio-card p-6 shadow-2xl text-center">
        <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-studio-warning/10 text-studio-warning border border-studio-warning/30">
          <AlertTriangle className="h-6 w-6" />
        </div>

        <h1 className="text-lg font-bold text-studio-primary">
          Something went wrong
        </h1>
        <p className="mt-1.5 text-xs text-studio-secondary leading-relaxed">
          An unexpected issue occurred while rendering this studio workspace view. Your data is safe.
        </p>

        {error.message && (
          <div className="mt-4 p-3 rounded-lg bg-studio-surface border border-studio-border text-left">
            <p className="text-[11px] font-mono text-studio-muted break-all">
              {error.message}
            </p>
          </div>
        )}

        <div className="mt-6 flex flex-col sm:flex-row gap-2.5">
          <Button
            onClick={() => reset()}
            variant="accent"
            size="sm"
            className="flex-1 gap-1.5"
          >
            <RefreshCw className="h-3.5 w-3.5" />
            <span>Try Again</span>
          </Button>

          <Link href="/dashboard" className="flex-1">
            <Button
              variant="outline"
              size="sm"
              className="w-full gap-1.5"
            >
              <Home className="h-3.5 w-3.5" />
              <span>Studio Dashboard</span>
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
}
