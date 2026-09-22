"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import {
  Camera,
  CheckCircle2,
  ArrowRight,
  ArrowLeft,
  Sparkles,
  Shield,
  Upload,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { useStudio } from "@/lib/store/store-context";

export default function OnboardingPage() {
  const router = useRouter();
  const { updateStudio } = useStudio();

  const [step, setStep] = useState(1);
  const totalSteps = 4;

  // Form State
  const [studioName, setStudioName] = useState("UIKEY AI Studio");
  const [ownerName, setOwnerName] = useState("Arjun Mehta");
  const [city, setCity] = useState("Mumbai");
  const [serviceArea, setServiceArea] = useState("Mumbai · Goa · Worldwide");
  const [whatsappNumber, setWhatsappNumber] = useState("+91 98201 98201");
  const [categories, setCategories] = useState<string[]>([
    "Weddings",
    "Pre-weddings",
    "Portraits",
  ]);
  const [upiId, setUpiId] = useState("uikeystudio@upi");
  const [watermarkText, setWatermarkText] = useState("PROOF ONLY · UIKEY AI STUDIO");
  const [storagePlan, setStoragePlan] = useState<"free" | "basic" | "standard">("standard");

  const allCategories = [
    "Weddings",
    "Pre-weddings",
    "Portraits",
    "Fashion",
    "Events",
    "Editorial",
    "Maternity",
    "Architecture",
  ];

  const toggleCategory = (cat: string) => {
    if (categories.includes(cat)) {
      setCategories(categories.filter((c) => c !== cat));
    } else {
      setCategories([...categories, cat]);
    }
  };

  const handleComplete = () => {
    updateStudio({
      name: studioName,
      ownerName,
      city,
      serviceArea,
      whatsappNumber,
      upiId,
      defaultWatermark: watermarkText,
      planId: storagePlan,
    });
    router.push("/dashboard");
  };

  return (
    <div className="min-h-screen bg-studio-bg flex flex-col justify-between p-4 sm:p-8">
      {/* Top Brand Header */}
      <div className="max-w-xl w-full mx-auto flex items-center justify-between pb-6">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-studio-card border border-studio-border flex items-center justify-center text-studio-accent">
            <Camera className="w-4 h-4" />
          </div>
          <span className="font-bold text-sm text-studio-primary">UIKEY AI Studio</span>
        </div>
        <div className="text-xs text-studio-muted">
          Step {step} of {totalSteps}
        </div>
      </div>

      {/* Main Form Container */}
      <div className="max-w-xl w-full mx-auto rounded-xl border border-studio-border bg-studio-card p-6 sm:p-8 shadow-2xl space-y-6">
        <Progress value={step} max={totalSteps} className="h-1" />

        {/* Step 1: Studio & Owner Identity */}
        {step === 1 && (
          <div className="space-y-4 animate-fade-in">
            <div>
              <h2 className="text-lg font-bold text-studio-primary">
                Studio Identity & Location
              </h2>
              <p className="text-xs text-studio-secondary mt-1">
                Tell us about your brand name and where you shoot.
              </p>
            </div>

            <div>
              <label className="block text-xs font-medium text-studio-secondary mb-1">
                Studio / Brand Name
              </label>
              <Input
                value={studioName}
                onChange={(e) => setStudioName(e.target.value)}
                placeholder="e.g. UIKEY AI Studio"
              />
            </div>

            <div>
              <label className="block text-xs font-medium text-studio-secondary mb-1">
                Lead Photographer / Owner
              </label>
              <Input
                value={ownerName}
                onChange={(e) => setOwnerName(e.target.value)}
                placeholder="e.g. Arjun Mehta"
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-medium text-studio-secondary mb-1">
                  Primary Base City
                </label>
                <Input
                  value={city}
                  onChange={(e) => setCity(e.target.value)}
                  placeholder="e.g. Mumbai"
                />
              </div>
              <div>
                <label className="block text-xs font-medium text-studio-secondary mb-1">
                  Service Area
                </label>
                <Input
                  value={serviceArea}
                  onChange={(e) => setServiceArea(e.target.value)}
                  placeholder="e.g. Mumbai · Goa · Worldwide"
                />
              </div>
            </div>
          </div>
        )}

        {/* Step 2: Photography Niches & WhatsApp */}
        {step === 2 && (
          <div className="space-y-4 animate-fade-in">
            <div>
              <h2 className="text-lg font-bold text-studio-primary">
                Categories & WhatsApp Communication
              </h2>
              <p className="text-xs text-studio-secondary mt-1">
                Select your photography genres and WhatsApp number for client sharing.
              </p>
            </div>

            <div>
              <label className="block text-xs font-medium text-studio-secondary mb-2">
                Photography Niches
              </label>
              <div className="flex flex-wrap gap-2">
                {allCategories.map((cat) => {
                  const isSelected = categories.includes(cat);
                  return (
                    <button
                      key={cat}
                      type="button"
                      onClick={() => toggleCategory(cat)}
                      className={`px-3 py-1 rounded-md text-xs font-medium border transition-colors ${
                        isSelected
                          ? "bg-studio-accentMuted border-studio-accent text-studio-accent"
                          : "border-studio-border bg-studio-surface text-studio-secondary hover:text-studio-primary"
                      }`}
                    >
                      {cat}
                    </button>
                  );
                })}
              </div>
            </div>

            <div>
              <label className="block text-xs font-medium text-studio-secondary mb-1">
                Studio WhatsApp Number
              </label>
              <Input
                value={whatsappNumber}
                onChange={(e) => setWhatsappNumber(e.target.value)}
                placeholder="+91 98201 98201"
              />
              <p className="text-[10px] text-studio-muted mt-1">
                Used strictly for generating manual wa.me links for quotations & galleries.
              </p>
            </div>
          </div>
        )}

        {/* Step 3: Payment UPI & Watermarking */}
        {step === 3 && (
          <div className="space-y-4 animate-fade-in">
            <div>
              <h2 className="text-lg font-bold text-studio-primary">
                Bharat UPI ID & Proofing Watermark
              </h2>
              <p className="text-xs text-studio-secondary mt-1">
                Configure instant zero-commission payments and proofing protection.
              </p>
            </div>

            <div>
              <label className="block text-xs font-medium text-studio-secondary mb-1">
                Studio UPI ID (VPA)
              </label>
              <Input
                value={upiId}
                onChange={(e) => setUpiId(e.target.value)}
                placeholder="uikeystudio@upi"
              />
              <p className="text-[10px] text-studio-muted mt-1">
                Clients will scan this dynamic QR code or pay via GPay / PhonePe / Paytm.
              </p>
            </div>

            <div>
              <label className="block text-xs font-medium text-studio-secondary mb-1">
                Default Watermark Text
              </label>
              <Input
                value={watermarkText}
                onChange={(e) => setWatermarkText(e.target.value)}
                placeholder="PROOF ONLY · YOUR STUDIO"
              />
              <div className="mt-2 p-3 rounded-md border border-dashed border-studio-border bg-studio-surface/50 text-center">
                <span className="text-xs font-mono font-bold tracking-widest text-studio-accent/70 uppercase">
                  {watermarkText}
                </span>
              </div>
            </div>
          </div>
        )}

        {/* Step 4: Storage Plan Selection */}
        {step === 4 && (
          <div className="space-y-4 animate-fade-in">
            <div>
              <h2 className="text-lg font-bold text-studio-primary">
                Select Your Initial Storage Tier
              </h2>
              <p className="text-xs text-studio-secondary mt-1">
                You can change this anytime from Studio Settings.
              </p>
            </div>

            <div className="space-y-2.5">
              {[
                {
                  id: "free",
                  name: "Free Starter",
                  storage: "1 GB",
                  projects: "1 Active Shoot",
                  price: "Free",
                },
                {
                  id: "basic",
                  name: "Solo Pro",
                  storage: "10 GB",
                  projects: "5 Active Shoots",
                  price: "₹799 / mo",
                },
                {
                  id: "standard",
                  name: "Studio Standard (Recommended)",
                  storage: "50 GB",
                  projects: "20 Active Shoots",
                  price: "₹1,499 / mo",
                },
              ].map((p) => {
                const isSelected = storagePlan === p.id;
                return (
                  <div
                    key={p.id}
                    onClick={() => setStoragePlan(p.id as any)}
                    className={`p-3.5 rounded-lg border cursor-pointer transition-all flex items-center justify-between ${
                      isSelected
                        ? "border-studio-accent bg-studio-accentMuted/30"
                        : "border-studio-border bg-studio-surface/40 hover:border-studio-borderHover"
                    }`}
                  >
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-bold text-studio-primary">
                          {p.name}
                        </span>
                        {p.id === "standard" && (
                          <Badge variant="accent" className="text-[9px] py-0">
                            Demo Choice
                          </Badge>
                        )}
                      </div>
                      <p className="text-[11px] text-studio-muted mt-0.5">
                        {p.storage} · {p.projects}
                      </p>
                    </div>
                    <span className="text-xs font-bold text-studio-primary">
                      {p.price}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* Navigation Buttons */}
        <div className="flex items-center justify-between pt-4 border-t border-studio-border/60">
          {step > 1 ? (
            <Button
              variant="outline"
              size="sm"
              onClick={() => setStep(step - 1)}
              className="gap-1.5"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>Back</span>
            </Button>
          ) : (
            <div />
          )}

          {step < totalSteps ? (
            <Button
              variant="accent"
              size="sm"
              onClick={() => setStep(step + 1)}
              className="gap-1.5"
            >
              <span>Continue</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Button>
          ) : (
            <Button
              variant="accent"
              size="sm"
              onClick={handleComplete}
              className="gap-1.5 shadow-md"
            >
              <span>Enter Workspace</span>
              <CheckCircle2 className="w-3.5 h-3.5" />
            </Button>
          )}
        </div>
      </div>

      <div className="text-center text-[11px] text-studio-muted pt-6">
        UIKEY AI Studio · Free-First Architecture
      </div>
    </div>
  );
}
