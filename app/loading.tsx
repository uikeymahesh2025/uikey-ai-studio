import React from "react";
import { Camera } from "lucide-react";

export default function Loading() {
  return (
    <div className="min-h-screen bg-studio-bg flex flex-col items-center justify-center p-4">
      <div className="relative flex items-center justify-center mb-4">
        {/* Glowing pulse ring */}
        <div className="absolute h-16 w-16 rounded-2xl bg-studio-accent/20 animate-ping" />
        <div className="h-14 w-14 rounded-2xl bg-studio-card border border-studio-border flex items-center justify-center text-studio-accent shadow-xl relative z-10 animate-pulse">
          <Camera className="h-6 w-6" />
        </div>
      </div>
      <p className="text-xs font-medium text-studio-primary animate-pulse tracking-wide">
        Loading UIKEY AI Studio...
      </p>
      <p className="text-[11px] text-studio-muted mt-1">
        Shoot se delivery tak, photographers ka workspace
      </p>
    </div>
  );
}
