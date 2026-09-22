"use client";

import React, { useState } from "react";
import {
  Settings,
  HardDrive,
  Shield,
  CreditCard,
  Camera,
  CheckCircle2,
  AlertTriangle,
  RotateCcw,
  Sparkles,
} from "lucide-react";
import { DashboardLayout } from "@/components/layout/dashboard-layout";
import { useStudio } from "@/lib/store/store-context";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { formatBytes } from "@/lib/utils";
import { STORAGE_PLANS } from "@/lib/storage";

export default function StudioSettingsPage() {
  const { state, updateStudio, resetToDemo } = useStudio();
  const { studio, storageUsage } = state;

  const [name, setName] = useState(studio.name);
  const [ownerName, setOwnerName] = useState(studio.ownerName);
  const [city, setCity] = useState(studio.city);
  const [serviceArea, setServiceArea] = useState(studio.serviceArea);
  const [whatsappNumber, setWhatsappNumber] = useState(studio.whatsappNumber);
  const [upiId, setUpiId] = useState(studio.upiId);
  const [watermarkText, setWatermarkText] = useState(studio.defaultWatermark);
  const [watermarkOpacity, setWatermarkOpacity] = useState(studio.watermarkOpacity);

  const [savedSuccess, setSavedSuccess] = useState(false);

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    updateStudio({
      name,
      ownerName,
      city,
      serviceArea,
      whatsappNumber,
      upiId,
      defaultWatermark: watermarkText,
      watermarkOpacity,
    });
    setSavedSuccess(true);
    setTimeout(() => setSavedSuccess(false), 2500);
  };

  const handleSelectPlan = (planId: "free" | "basic" | "standard" | "pro" | "studio") => {
    updateStudio({ planId });
  };

  const currentPlan = STORAGE_PLANS[studio.planId] || STORAGE_PLANS.standard;
  const usedGB = (storageUsage.totalBytes / (1024 * 1024 * 1024)).toFixed(1);

  return (
    <DashboardLayout>
      <div className="max-w-4xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 border-b border-studio-border/60 pb-5">
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-xl font-bold tracking-tight text-studio-primary">
                Studio Settings & Storage Ledger
              </h1>
              <Badge variant="accent" className="text-[10px]">
                {studio.name}
              </Badge>
            </div>
            <p className="text-xs text-studio-secondary mt-1">
              Configure studio branding, Bharat UPI VPA, diagonal proofing watermarks, and cloud quotas.
            </p>
          </div>

          <Button
            onClick={() => {
              if (confirm("Reset studio demo data back to default state?")) {
                resetToDemo();
              }
            }}
            variant="outline"
            size="sm"
            className="text-xs gap-1.5 text-studio-muted hover:text-studio-warning"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Reset Demo Store</span>
          </Button>
        </div>

        {savedSuccess && (
          <div className="p-3 rounded-lg border border-studio-success/40 bg-studio-success/10 text-xs text-studio-success flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4" />
            <span>Studio profile and watermark settings saved successfully!</span>
          </div>
        )}

        <form onSubmit={handleSave} className="space-y-6">
          {/* General Profile */}
          <Card>
            <CardHeader className="p-5 pb-3">
              <CardTitle className="text-sm font-semibold">Studio Profile</CardTitle>
              <CardDescription>Details shown on quotations and public client portals.</CardDescription>
            </CardHeader>
            <CardContent className="p-5 pt-0 grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-medium text-studio-secondary mb-1">
                  Studio Name
                </label>
                <Input value={name} onChange={(e) => setName(e.target.value)} required />
              </div>

              <div>
                <label className="block text-xs font-medium text-studio-secondary mb-1">
                  Lead Photographer / Founder
                </label>
                <Input value={ownerName} onChange={(e) => setOwnerName(e.target.value)} required />
              </div>

              <div>
                <label className="block text-xs font-medium text-studio-secondary mb-1">
                  Primary City
                </label>
                <Input value={city} onChange={(e) => setCity(e.target.value)} required />
              </div>

              <div>
                <label className="block text-xs font-medium text-studio-secondary mb-1">
                  Service Area
                </label>
                <Input value={serviceArea} onChange={(e) => setServiceArea(e.target.value)} required />
              </div>

              <div>
                <label className="block text-xs font-medium text-studio-secondary mb-1">
                  WhatsApp Number
                </label>
                <Input value={whatsappNumber} onChange={(e) => setWhatsappNumber(e.target.value)} required />
              </div>

              <div>
                <label className="block text-xs font-medium text-studio-secondary mb-1">
                  Studio UPI VPA (Direct Payments)
                </label>
                <Input value={upiId} onChange={(e) => setUpiId(e.target.value)} required />
              </div>
            </CardContent>
          </Card>

          {/* Watermark Configuration & Live Preview */}
          <Card>
            <CardHeader className="p-5 pb-3">
              <CardTitle className="text-sm font-semibold">Proofing Watermark Overlay</CardTitle>
              <CardDescription>
                Protects unpurchased proofs. Applied dynamically with diagonal rotation.
              </CardDescription>
            </CardHeader>
            <CardContent className="p-5 pt-0 space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-medium text-studio-secondary mb-1">
                    Watermark Text
                  </label>
                  <Input
                    value={watermarkText}
                    onChange={(e) => setWatermarkText(e.target.value)}
                    required
                  />
                </div>

                <div>
                  <label className="block text-xs font-medium text-studio-secondary mb-1">
                    Opacity ({Math.round(watermarkOpacity * 100)}%)
                  </label>
                  <input
                    type="range"
                    min="0.1"
                    max="0.8"
                    step="0.05"
                    value={watermarkOpacity}
                    onChange={(e) => setWatermarkOpacity(Number(e.target.value))}
                    className="w-full accent-studio-accent cursor-pointer mt-2"
                  />
                </div>
              </div>

              {/* Live Preview Box */}
              <div>
                <span className="text-[11px] text-studio-muted block mb-1.5">
                  Live Watermark Canvas Preview:
                </span>
                <div className="relative h-32 rounded-lg border border-studio-border bg-zinc-900 overflow-hidden flex items-center justify-center">
                  <div
                    className="watermark-overlay"
                    style={{ opacity: watermarkOpacity }}
                  >
                    <span className="watermark-text text-sm font-mono font-black text-white">
                      {watermarkText}
                    </span>
                  </div>
                  <span className="text-xs text-zinc-600 font-mono select-none">
                    [Proofing Photo Background]
                  </span>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Storage Quota Ledger & Tiers */}
          <Card id="storage">
            <CardHeader className="p-5 pb-3">
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle className="text-sm font-semibold">
                    Storage Usage & Cost Controls
                  </CardTitle>
                  <CardDescription>
                    Current Plan: <strong className="text-studio-accent">{currentPlan.name}</strong> ({currentPlan.quotaGB} GB)
                  </CardDescription>
                </div>
                <Badge variant="accent">{usedGB} / {currentPlan.quotaGB} GB Used</Badge>
              </div>
            </CardHeader>

            <CardContent className="p-5 pt-0 space-y-5">
              {/* Storage breakdown bars */}
              <div className="space-y-2">
                <Progress
                  value={storageUsage.totalBytes}
                  max={currentPlan.quotaBytes}
                  className="h-2.5"
                />
                <div className="flex flex-wrap items-center justify-between text-xs text-studio-muted pt-1">
                  <span>Previews: {formatBytes(storageUsage.previewBytes)}</span>
                  <span>Master RAW/Originals: {formatBytes(storageUsage.originalBytes)}</span>
                  <span>Receipts: {formatBytes(storageUsage.receiptsBytes)}</span>
                  <span>Bandwidth: {formatBytes(storageUsage.bandwidthBytes)}</span>
                </div>
              </div>

              {/* Plans Switcher */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-2">
                {[
                  STORAGE_PLANS.free,
                  STORAGE_PLANS.standard,
                  STORAGE_PLANS.studio,
                ].map((plan) => {
                  const isCurrent = studio.planId === plan.id;
                  return (
                    <div
                      key={plan.id}
                      onClick={() => handleSelectPlan(plan.id)}
                      className={`p-3.5 rounded-lg border cursor-pointer transition-all ${
                        isCurrent
                          ? "border-studio-accent bg-studio-accentMuted/30"
                          : "border-studio-border bg-studio-surface/40 hover:border-studio-borderHover"
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-bold text-studio-primary">
                          {plan.name}
                        </span>
                        {isCurrent && (
                          <Badge variant="accent" className="text-[9px] py-0">
                            Active
                          </Badge>
                        )}
                      </div>
                      <p className="text-sm font-bold font-mono text-studio-primary mt-1">
                        {plan.quotaGB} GB
                      </p>
                      <p className="text-[10px] text-studio-muted mt-0.5">
                        {plan.maxActiveProjects} active shoots allowed
                      </p>
                    </div>
                  );
                })}
              </div>
            </CardContent>
          </Card>

          {/* Submit */}
          <div className="flex items-center justify-end gap-3 pt-2">
            <Button type="submit" variant="accent" className="shadow-md font-semibold">
              Save Studio Configuration
            </Button>
          </div>
        </form>
      </div>
    </DashboardLayout>
  );
}
