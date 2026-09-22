import React from "react";
import Link from "next/link";
import { Camera, Home, ArrowLeft, Search } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function NotFound() {
  return (
    <div className="min-h-screen bg-studio-bg flex items-center justify-center p-4">
      <div className="w-full max-w-md rounded-xl border border-studio-border bg-studio-card p-6 shadow-2xl text-center">
        <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-studio-surface text-studio-muted border border-studio-border">
          <Camera className="h-6 w-6" />
        </div>

        <span className="text-[11px] font-mono text-studio-accent font-semibold tracking-wider uppercase">
          404 Error
        </span>
        <h1 className="text-xl font-bold text-studio-primary mt-1">
          Studio Asset Not Found
        </h1>
        <p className="mt-2 text-xs text-studio-secondary leading-relaxed">
          The requested proofing gallery, quotation, invoice, or portal link does not exist or may have been archived by the studio owner.
        </p>

        <div className="mt-6 flex flex-col sm:flex-row gap-2.5">
          <Link href="/dashboard" className="flex-1">
            <Button variant="accent" size="sm" className="w-full gap-1.5">
              <Home className="h-3.5 w-3.5" />
              <span>Go to Dashboard</span>
            </Button>
          </Link>
          <Link href="/" className="flex-1">
            <Button variant="outline" size="sm" className="w-full gap-1.5">
              <ArrowLeft className="h-3.5 w-3.5" />
              <span>Back to Home</span>
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
}
