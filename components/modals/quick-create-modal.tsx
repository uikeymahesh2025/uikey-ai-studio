"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import {
  FolderPlus,
  FilePlus2,
  UserPlus,
  ImagePlus,
  CreditCard,
  Plus,
} from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";

export function QuickCreateModal({
  open,
  onOpenChange,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}) {
  const router = useRouter();

  const actions = [
    {
      title: "New Project",
      description: "Start shoot workflow with 10-stage timeline and deliverables",
      icon: FolderPlus,
      href: "/dashboard/projects/new",
    },
    {
      title: "New Quotation",
      description: "Build Indian wedding proposal with presets, GST and milestones",
      icon: FilePlus2,
      href: "/dashboard/quotations/new",
    },
    {
      title: "Add Client",
      description: "Record new lead into CRM with budget and WhatsApp number",
      icon: UserPlus,
      href: "/dashboard/clients",
    },
    {
      title: "Upload Gallery",
      description: "Upload proofing photos with watermarking & category tabs",
      icon: ImagePlus,
      href: "/dashboard/galleries",
    },
    {
      title: "Record Payment",
      description: "Verify client UPI UTR receipt and unlock original files",
      icon: CreditCard,
      href: "/dashboard/payments",
    },
  ];

  const handleSelect = (href: string) => {
    onOpenChange(false);
    router.push(href);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent onClose={() => onOpenChange(false)} className="max-w-md">
        <DialogHeader>
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-md bg-studio-accentMuted text-studio-accent flex items-center justify-center">
              <Plus className="w-4 h-4" />
            </div>
            <DialogTitle>Quick Actions</DialogTitle>
          </div>
          <DialogDescription>
            Choose what you want to create in UIKEY AI Studio.
          </DialogDescription>
        </DialogHeader>

        <div className="grid gap-2">
          {actions.map((act) => {
            const Icon = act.icon;
            return (
              <button
                key={act.title}
                onClick={() => handleSelect(act.href)}
                className="flex items-start gap-3.5 p-3 rounded-lg border border-studio-border bg-studio-surface/50 hover:bg-studio-surface hover:border-studio-accent/40 text-left transition-all group active:scale-[0.99]"
              >
                <div className="p-2 rounded-md bg-studio-card border border-studio-border text-studio-secondary group-hover:text-studio-accent group-hover:border-studio-accent/30 transition-colors">
                  <Icon className="w-4 h-4" />
                </div>
                <div>
                  <h4 className="text-xs font-semibold text-studio-primary group-hover:text-studio-accent transition-colors">
                    {act.title}
                  </h4>
                  <p className="text-[11px] text-studio-muted mt-0.5 leading-snug">
                    {act.description}
                  </p>
                </div>
              </button>
            );
          })}
        </div>
      </DialogContent>
    </Dialog>
  );
}
