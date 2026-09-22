"use client";

import React, { useState } from "react";
import Link from "next/link";
import {
  Camera,
  CheckCircle2,
  ArrowRight,
  Shield,
  Zap,
  HardDrive,
  FileText,
  Images,
  CreditCard,
  MessageSquare,
  Sparkles,
  Heart,
  Copy,
  Lock,
  Calendar,
  Check,
  ChevronRight,
  Eye,
  Download,
  AlertCircle,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { formatINR } from "@/lib/utils";

export default function LandingPage() {
  const [copiedLightroom, setCopiedLightroom] = useState(false);
  const [activeTab, setActiveTab] = useState<"all" | "bridal" | "couple">("all");
  const [likedPhotos, setLikedPhotos] = useState<Record<string, boolean>>({
    "photo-1": true,
    "photo-2": true,
    "photo-3": false,
    "photo-4": true,
  });

  const toggleLike = (id: string) => {
    setLikedPhotos((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  const handleCopyLightroom = () => {
    setCopiedLightroom(true);
    navigator.clipboard?.writeText(
      "KAPUR_001.JPG, KAPUR_004.JPG, KAPUR_012.JPG, KAPUR_018.JPG, KAPUR_025.JPG"
    );
    setTimeout(() => setCopiedLightroom(false), 2000);
  };

  const plans = [
    {
      id: "free",
      name: "Free Explorer",
      price: "₹0",
      period: "forever free",
      quotaGB: 1,
      maxProjects: 2,
      popular: false,
      description: "Ideal for solo photographers to test client proofing and GST quotes.",
      features: [
        "1 GB watermarked proofing storage",
        "Up to 2 active projects",
        "Instant Bharat UPI payment QR",
        "Manual WhatsApp wa.me links",
        "GST quotation generator (SAC 998381)",
        "Zero payment gateway fees",
      ],
    },
    {
      id: "standard",
      name: "Studio Standard",
      price: "₹1,499",
      period: "per month",
      quotaGB: 50,
      maxProjects: 15,
      popular: true,
      description: "Complete studio operating system for busy Indian wedding photographers.",
      features: [
        "50 GB optimized proofing storage",
        "Up to 15 concurrent active shoots",
        "Adobe Lightroom culling filter exporter",
        "Digital contract generator & e-signatures",
        "GST tax invoice & receipt generator",
        "Automated master download locking",
        "Public studio portfolio page",
      ],
    },
    {
      id: "studio",
      name: "High-Volume Collective",
      price: "₹3,999",
      period: "per month",
      quotaGB: 500,
      maxProjects: 60,
      popular: false,
      description: "Designed for production houses, multi-crew studios, and editing agencies.",
      features: [
        "500 GB dedicated cloud storage",
        "Up to 60 concurrent wedding projects",
        "Team crew & editor assignments",
        "Multi-city shoot calendar & travel guard",
        "Custom branding & white-label portals",
        "Client selection audit logs",
        "Priority VIP onboarding assistance",
      ],
    },
  ];

  return (
    <div className="min-h-screen bg-studio-bg text-studio-primary selection:bg-studio-accent selection:text-studio-bg overflow-x-hidden font-sans">
      {/* Editorial Soft Vignette Overlay */}
      <div 
        aria-hidden="true"
        className="pointer-events-none fixed inset-0 z-0 opacity-40 bg-[radial-gradient(circle_at_top,_rgba(196,181,253,0.06)_0%,_transparent_65%)]" 
      />

      {/* Header Navigation */}
      <header className="sticky top-0 z-40 w-full border-b border-studio-border bg-studio-bg/85 backdrop-blur-md">
        <div className="mx-auto flex h-16 max-w-[1240px] items-center justify-between px-6">
          {/* Brand Lockup */}
          <Link href="/" className="flex items-center gap-2.5 group">
            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-studio-card border border-studio-border text-studio-accent shadow-sm group-hover:border-studio-accent/60 transition-colors">
              <Camera className="h-4.5 w-4.5" />
            </div>
            <div className="flex items-center gap-2">
              <span className="text-sm font-bold tracking-tight text-studio-primary">
                UIKEY AI
              </span>
              <span className="rounded bg-studio-surface px-1.5 py-0.5 text-[10px] font-mono font-medium text-studio-accent border border-studio-border">
                STUDIO
              </span>
            </div>
          </Link>

          {/* Navigation Links */}
          <nav className="hidden md:flex items-center gap-7 text-sm font-medium text-studio-secondary">
            <a href="#workflow" className="hover:text-studio-primary transition-colors">
              Workflow
            </a>
            <a href="#gallery-proofing" className="hover:text-studio-primary transition-colors">
              Proofing
            </a>
            <a href="#quotations" className="hover:text-studio-primary transition-colors">
              Quotes & GST
            </a>
            <a href="#storage" className="hover:text-studio-primary transition-colors">
              Storage
            </a>
            <Link href="/p/arjun-mehta" className="hover:text-studio-primary transition-colors">
              Sample Portfolio
            </Link>
          </nav>

          {/* Auth & CTA Actions */}
          <div className="flex items-center gap-3">
            <Link href="/login">
              <Button variant="ghost" size="sm" className="text-xs text-studio-secondary hover:text-studio-primary">
                Sign In
              </Button>
            </Link>
            <Link href="/dashboard">
              <Button variant="accent" size="sm" className="gap-1.5 shadow-sm text-xs font-semibold">
                <Sparkles className="h-3.5 w-3.5" />
                <span>Explore Demo</span>
              </Button>
            </Link>
          </div>
        </div>
      </header>

      {/* Hero Section: 2-Column Desktop, Clean Stacked Mobile */}
      <section className="relative z-10 pt-14 pb-20 lg:pt-20 lg:pb-28 border-b border-studio-border/60">
        <div className="mx-auto max-w-[1240px] px-6">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8 items-center">
            {/* Left Column: Headline, Description, CTAs, Trust Row */}
            <div className="lg:col-span-6 flex flex-col justify-center text-left">
              <div className="inline-flex items-center gap-2 rounded-full border border-studio-border bg-studio-card px-3 py-1 text-xs text-studio-secondary mb-6 w-fit shadow-sm">
                <span className="h-1.5 w-1.5 rounded-full bg-studio-accent animate-pulse" />
                <span className="font-medium text-studio-primary">The Intelligent Workspace for Indian Photographers</span>
              </div>

              {/* Controlled Heading Size & Line Wrapping */}
              <h1 className="text-3xl sm:text-4xl lg:text-[42px] font-bold tracking-tight text-studio-primary leading-[1.2] max-w-xl">
                Shoot se delivery tak,{" "}
                <span className="text-studio-accent font-normal italic">
                  sab ek workspace mein.
                </span>
              </h1>

              {/* Subtitle */}
              <p className="mt-4 text-base sm:text-lg text-studio-secondary max-w-lg leading-relaxed font-medium">
                Projects, quotations, galleries and payments — in one calm workspace.
              </p>

              {/* Concrete Description */}
              <p className="mt-2 text-xs sm:text-sm text-studio-muted max-w-md leading-relaxed">
                Replace scattered WhatsApp folders, Google Drive storage bills, and manual Excel billing.
                Built for wedding photographers, portrait creators, and editor teams.
              </p>

              {/* Action Buttons: Strict Hierarchy */}
              <div className="mt-8 flex flex-col sm:flex-row items-stretch sm:items-center gap-3 max-w-md">
                <Link href="/dashboard" className="flex-1">
                  <Button
                    variant="accent"
                    size="lg"
                    className="w-full gap-2 shadow-md shadow-studio-accent/5 font-semibold text-sm h-11"
                  >
                    <span>Explore Demo</span>
                    <ArrowRight className="h-4 w-4" />
                  </Button>
                </Link>
                <Link href="/signup" className="flex-1">
                  <Button
                    variant="outline"
                    size="lg"
                    className="w-full text-sm font-medium h-11 border-studio-border hover:bg-studio-surface hover:text-studio-primary"
                  >
                    Set Up Your Studio
                  </Button>
                </Link>
              </div>

              {/* Trust Row */}
              <div className="mt-8 pt-6 border-t border-studio-border/60 flex flex-wrap items-center gap-x-6 gap-y-2.5 text-xs text-studio-muted">
                <div className="flex items-center gap-1.5">
                  <CheckCircle2 className="h-3.5 w-3.5 text-studio-accent shrink-0" />
                  <span>Free during testing</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <CheckCircle2 className="h-3.5 w-3.5 text-studio-accent shrink-0" />
                  <span>Manual UPI + UTR</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <CheckCircle2 className="h-3.5 w-3.5 text-studio-accent shrink-0" />
                  <span>Manual WhatsApp sharing</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <CheckCircle2 className="h-3.5 w-3.5 text-studio-accent shrink-0" />
                  <span>No credit card required</span>
                </div>
              </div>
            </div>

            {/* Right Column: Realistic UIKEY AI Studio Dashboard Preview */}
            <div className="lg:col-span-6 w-full">
              <div className="rounded-xl border border-studio-border bg-studio-card p-5 sm:p-6 shadow-2xl relative">
                {/* Simulated Studio Browser Header */}
                <div className="flex items-center justify-between pb-4 mb-4 border-b border-studio-border/60">
                  <div className="flex items-center gap-2">
                    <div className="h-2.5 w-2.5 rounded-full bg-studio-border" />
                    <div className="h-2.5 w-2.5 rounded-full bg-studio-border" />
                    <div className="h-2.5 w-2.5 rounded-full bg-studio-border" />
                    <span className="text-xs font-semibold text-studio-primary ml-2">
                      Arjun Mehta · UIKEY AI Studio
                    </span>
                  </div>
                  <Badge variant="accent" className="text-[10px] py-0 px-2 font-medium">
                    Demo Mode · Mumbai
                  </Badge>
                </div>

                {/* 4 Quick Metric KPIs */}
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 mb-4">
                  <div className="rounded-lg bg-studio-surface/60 border border-studio-border p-3">
                    <span className="text-[10px] text-studio-muted block uppercase tracking-wider font-mono">
                      Active Shoots
                    </span>
                    <span className="text-base font-bold text-studio-primary mt-0.5 block">
                      4 Projects
                    </span>
                  </div>
                  <div className="rounded-lg bg-studio-surface/60 border border-studio-border p-3">
                    <span className="text-[10px] text-studio-muted block uppercase tracking-wider font-mono">
                      Selections
                    </span>
                    <span className="text-base font-bold text-studio-accent mt-0.5 block">
                      2 Pending
                    </span>
                  </div>
                  <div className="rounded-lg bg-studio-surface/60 border border-studio-border p-3">
                    <span className="text-[10px] text-studio-muted block uppercase tracking-wider font-mono">
                      This Month
                    </span>
                    <span className="text-base font-bold text-studio-primary font-mono mt-0.5 block">
                      ₹3.20 L
                    </span>
                  </div>
                  <div className="rounded-lg bg-studio-surface/60 border border-studio-border p-3">
                    <span className="text-[10px] text-studio-muted block uppercase tracking-wider font-mono">
                      Storage
                    </span>
                    <span className="text-base font-bold text-studio-primary font-mono mt-0.5 block">
                      14.8 / 50 GB
                    </span>
                  </div>
                </div>

                {/* Active Shoot Showcase Card */}
                <div className="rounded-lg border border-studio-border bg-studio-surface/40 p-4 mb-4">
                  <div className="flex items-start justify-between">
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-bold text-studio-primary">
                          Kapur · Mehendi & Sangeet
                        </span>
                        <Badge variant="accent" className="text-[9px] py-0">
                          Proofing Stage
                        </Badge>
                      </div>
                      <p className="text-[11px] text-studio-secondary mt-0.5">
                        Rhea & Kabir Kapur · The St. Regis Mumbai
                      </p>
                    </div>
                    <div className="text-right">
                      <span className="text-xs font-mono font-bold text-studio-primary block">
                        ₹1,85,000
                      </span>
                      <span className="text-[10px] text-studio-success">
                        ₹95,000 Paid via UPI
                      </span>
                    </div>
                  </div>

                  {/* Proofing Progress */}
                  <div className="mt-3 pt-3 border-t border-studio-border/50">
                    <div className="flex items-center justify-between text-[11px] mb-1.5">
                      <span className="text-studio-muted">Client Selection Progress</span>
                      <span className="font-mono font-medium text-studio-primary">
                        42 of 80 Photos Picked (52%)
                      </span>
                    </div>
                    <div className="h-1.5 w-full bg-studio-surface rounded-full overflow-hidden border border-studio-border/40">
                      <div className="h-full bg-studio-accent rounded-full w-[52%]" />
                    </div>
                  </div>
                </div>

                {/* Proofing Gallery Mini-Strip with Watermark and Culling Exporter */}
                <div className="rounded-lg border border-studio-border bg-studio-surface/30 p-3 mb-4">
                  <div className="flex items-center justify-between mb-2.5">
                    <span className="text-[11px] font-semibold text-studio-primary flex items-center gap-1.5">
                      <Images className="w-3.5 h-3.5 text-studio-accent" />
                      <span>Watermarked Client Proofing</span>
                    </span>
                    <button
                      onClick={handleCopyLightroom}
                      className="text-[10px] font-medium text-studio-accent hover:underline flex items-center gap-1"
                    >
                      <Copy className="w-3 h-3" />
                      <span>{copiedLightroom ? "Copied for Lightroom!" : "Copy Lightroom Filter"}</span>
                    </button>
                  </div>

                  <div className="grid grid-cols-4 gap-2">
                    {[
                      {
                        name: "KAPUR_001.JPG",
                        img: "https://images.unsplash.com/photo-1583939003579-730e3918a45a?w=200&auto=format&fit=crop&q=80",
                        picked: true,
                      },
                      {
                        name: "KAPUR_004.JPG",
                        img: "https://images.unsplash.com/photo-1519741497674-611481863552?w=200&auto=format&fit=crop&q=80",
                        picked: true,
                      },
                      {
                        name: "KAPUR_012.JPG",
                        img: "https://images.unsplash.com/photo-1511285560929-80b456fea0bc?w=200&auto=format&fit=crop&q=80",
                        picked: false,
                      },
                      {
                        name: "KAPUR_018.JPG",
                        img: "https://images.unsplash.com/photo-1596704017254-9b121068fb31?w=200&auto=format&fit=crop&q=80",
                        picked: true,
                      },
                    ].map((thumb, idx) => (
                      <div
                        key={thumb.name}
                        className="relative rounded-md overflow-hidden aspect-[4/3] border border-studio-border group bg-studio-surface"
                      >
                        <img
                          src={thumb.img}
                          alt={thumb.name}
                          className="h-full w-full object-cover"
                        />
                        {/* Diagonal SVG watermark overlay */}
                        <div className="absolute inset-0 flex items-center justify-center pointer-events-none bg-black/25">
                          <span className="text-[7px] font-mono font-bold text-white/50 tracking-wider -rotate-12 select-none">
                            PROOF ONLY
                          </span>
                        </div>
                        {thumb.picked && (
                          <div className="absolute top-1 right-1 h-4 w-4 rounded-full bg-studio-accent text-studio-bg flex items-center justify-center">
                            <Heart className="w-2.5 h-2.5 fill-current" />
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                </div>

                {/* Bharat UPI & UTR Settlement Card */}
                <div className="rounded-lg border border-studio-border bg-studio-surface/50 p-3 flex items-center justify-between">
                  <div className="flex items-center gap-2.5">
                    <div className="h-7 w-7 rounded-md bg-studio-success/10 border border-studio-success/30 text-studio-success flex items-center justify-center">
                      <CreditCard className="w-3.5 h-3.5" />
                    </div>
                    <div>
                      <p className="text-[11px] font-medium text-studio-primary">
                        Saanvi Portraits · Final ₹15,000 Milestone
                      </p>
                      <p className="text-[10px] font-mono text-studio-muted">
                        UTR: 426189033412 · Bharat UPI
                      </p>
                    </div>
                  </div>
                  <Badge variant="success" className="text-[9px] py-0.5 px-2 font-medium">
                    Verified & Unlocked
                  </Badge>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Section: Built around the real photographer workflow */}
      <section id="workflow" className="py-20 border-b border-studio-border/60">
        <div className="mx-auto max-w-[1240px] px-6">
          <div className="text-center max-w-xl mx-auto mb-14">
            <h2 className="text-2xl sm:text-3xl font-bold tracking-tight text-studio-primary">
              Built around the real photographer workflow
            </h2>
            <p className="mt-2.5 text-xs sm:text-sm text-studio-secondary leading-relaxed">
              Designed specifically for how Indian freelance photographers, wedding studios, and cinematographers run their day-to-day operations.
            </p>
          </div>

          {/* Workflow Sequence Strip: Inquiry → Quote → Shoot → Proof → Payment → Delivery */}
          <div className="mb-14 rounded-xl border border-studio-border bg-studio-card/80 p-5 shadow-sm">
            <div className="flex items-center justify-between pb-3 mb-3 border-b border-studio-border/60">
              <span className="text-xs font-mono font-medium text-studio-muted uppercase tracking-wider">
                End-to-End Client Lifecycle
              </span>
              <span className="text-xs font-semibold text-studio-accent">
                6-Stage Studio Flow
              </span>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-2.5">
              {[
                { step: "1. Inquiry", desc: "CRM & WhatsApp Lead" },
                { step: "2. Quote", desc: "GST & Milestones" },
                { step: "3. Shoot", desc: "Calendar & Crew" },
                { step: "4. Proof", desc: "Watermarked Gallery" },
                { step: "5. Payment", desc: "Bharat UPI & UTR" },
                { step: "6. Delivery", desc: "Master Files Unlocked" },
              ].map((s, idx) => (
                <div
                  key={s.step}
                  className="rounded-lg border border-studio-border/70 bg-studio-surface/50 p-3 text-left hover:border-studio-accent/40 transition-colors"
                >
                  <span className="text-xs font-bold text-studio-primary block">
                    {s.step}
                  </span>
                  <span className="text-[10px] text-studio-muted mt-0.5 block leading-tight">
                    {s.desc}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* 4 Compact Feature Cards: Get Booked, Get Approved, Get Paid, Get Delivered */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {/* 1. Get Booked */}
            <div className="rounded-xl border border-studio-border bg-studio-card p-6 flex flex-col justify-between hover:border-studio-borderHover transition-all">
              <div>
                <div className="h-9 w-9 rounded-lg bg-studio-surface border border-studio-border flex items-center justify-center text-studio-accent mb-4">
                  <Calendar className="h-4.5 w-4.5" />
                </div>
                <h3 className="text-base font-bold text-studio-primary">Get booked</h3>
                <p className="mt-2 text-xs text-studio-secondary leading-relaxed">
                  Capture inquiries from your public portfolio. Prevent double-booking auspicious muhurat dates with our studio calendar.
                </p>
              </div>
              <div className="mt-5 pt-3 border-t border-studio-border/50 text-[11px] text-studio-muted flex items-center gap-1.5">
                <Check className="w-3 h-3 text-studio-accent" />
                <span>Client CRM & lead tracking</span>
              </div>
            </div>

            {/* 2. Get Approved */}
            <div className="rounded-xl border border-studio-border bg-studio-card p-6 flex flex-col justify-between hover:border-studio-borderHover transition-all">
              <div>
                <div className="h-9 w-9 rounded-lg bg-studio-surface border border-studio-border flex items-center justify-center text-studio-accent mb-4">
                  <FileText className="h-4.5 w-4.5" />
                </div>
                <h3 className="text-base font-bold text-studio-primary">Get approved</h3>
                <p className="mt-2 text-xs text-studio-secondary leading-relaxed">
                  Send itemized GST quotes (SAC 998381) and digital agreements with standard clauses for RAW retention, drone safety, and postponement.
                </p>
              </div>
              <div className="mt-5 pt-3 border-t border-studio-border/50 text-[11px] text-studio-muted flex items-center gap-1.5">
                <Check className="w-3 h-3 text-studio-accent" />
                <span>Legally binding e-signatures</span>
              </div>
            </div>

            {/* 3. Get Paid */}
            <div className="rounded-xl border border-studio-border bg-studio-card p-6 flex flex-col justify-between hover:border-studio-borderHover transition-all">
              <div>
                <div className="h-9 w-9 rounded-lg bg-studio-surface border border-studio-border flex items-center justify-center text-studio-accent mb-4">
                  <CreditCard className="h-4.5 w-4.5" />
                </div>
                <h3 className="text-base font-bold text-studio-primary">Get paid</h3>
                <p className="mt-2 text-xs text-studio-secondary leading-relaxed">
                  Zero commission gateway fees. Clients scan your Bharat UPI QR code or tap to pay via GPay/PhonePe and submit their 12-digit bank UTR.
                </p>
              </div>
              <div className="mt-5 pt-3 border-t border-studio-border/50 text-[11px] text-studio-muted flex items-center gap-1.5">
                <Check className="w-3 h-3 text-studio-accent" />
                <span>1-click UTR verification desk</span>
              </div>
            </div>

            {/* 4. Get Delivered */}
            <div className="rounded-xl border border-studio-border bg-studio-card p-6 flex flex-col justify-between hover:border-studio-borderHover transition-all">
              <div>
                <div className="h-9 w-9 rounded-lg bg-studio-surface border border-studio-border flex items-center justify-center text-studio-accent mb-4">
                  <Images className="h-4.5 w-4.5" />
                </div>
                <h3 className="text-base font-bold text-studio-primary">Get delivered</h3>
                <p className="mt-2 text-xs text-studio-secondary leading-relaxed">
                  Share watermarked proofing galleries with optional PIN privacy. Export selections directly into Adobe Lightroom Classic in 1 second.
                </p>
              </div>
              <div className="mt-5 pt-3 border-t border-studio-border/50 text-[11px] text-studio-muted flex items-center gap-1.5">
                <Check className="w-3 h-3 text-studio-accent" />
                <span>Automated master file unlock</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Section: Gallery Proofing Deep-Dive */}
      <section id="gallery-proofing" className="py-20 border-b border-studio-border/60 bg-studio-card/30">
        <div className="mx-auto max-w-[1240px] px-6">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
            {/* Left Description */}
            <div className="lg:col-span-5 text-left">
              <Badge variant="accent" className="text-[10px] mb-3 font-medium">
                Client Proofing Engine
              </Badge>
              <h2 className="text-2xl sm:text-3xl font-bold tracking-tight text-studio-primary leading-tight">
                High-speed mobile proofing that protects your work
              </h2>
              <p className="mt-3 text-xs sm:text-sm text-studio-secondary leading-relaxed">
                Clients select their favorite album photos on their smartphones. Automated anti-theft watermarks prevent screenshot theft before final payment.
              </p>

              <div className="mt-6 space-y-3 text-xs text-studio-secondary">
                <div className="flex items-start gap-2.5">
                  <div className="h-5 w-5 rounded bg-studio-surface border border-studio-border flex items-center justify-center shrink-0 mt-0.5 text-studio-accent">
                    <Lock className="w-3 h-3" />
                  </div>
                  <span><strong>4-Digit PIN Protection:</strong> Keep private bridal shoots and confidential family galleries locked from the public.</span>
                </div>
                <div className="flex items-start gap-2.5">
                  <div className="h-5 w-5 rounded bg-studio-surface border border-studio-border flex items-center justify-center shrink-0 mt-0.5 text-studio-accent">
                    <Copy className="w-3 h-3" />
                  </div>
                  <span><strong>Adobe Lightroom Integration:</strong> 1-click copy exports selected filenames straight into Lightroom Classic filter bar.</span>
                </div>
                <div className="flex items-start gap-2.5">
                  <div className="h-5 w-5 rounded bg-studio-surface border border-studio-border flex items-center justify-center shrink-0 mt-0.5 text-studio-accent">
                    <Shield className="w-3 h-3" />
                  </div>
                  <span><strong>Custom Watermark Density:</strong> Control opacity and text to guarantee your studio brand is always credited.</span>
                </div>
              </div>

              <div className="mt-8">
                <Link href="/gallery/g-1">
                  <Button variant="accent" size="sm" className="gap-1.5 font-semibold text-xs">
                    <Eye className="w-3.5 h-3.5" />
                    <span>View Live Client Proofing Gallery</span>
                  </Button>
                </Link>
              </div>
            </div>

            {/* Right Interactive Proofing Showcase */}
            <div className="lg:col-span-7">
              <div className="rounded-xl border border-studio-border bg-studio-card p-5 sm:p-6 shadow-xl">
                {/* Gallery Topbar */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 mb-4 border-b border-studio-border/60">
                  <div>
                    <div className="flex items-center gap-2">
                      <h4 className="text-sm font-bold text-studio-primary">
                        Kapur · Mehendi & Sangeet
                      </h4>
                      <Badge variant="default" className="text-[9px] gap-1 py-0 font-mono">
                        <Lock className="w-2.5 h-2.5" /> PIN Protected
                      </Badge>
                    </div>
                    <span className="text-[11px] text-studio-secondary">
                      Rhea Kapur · 238 Photographs
                    </span>
                  </div>

                  <div className="flex items-center gap-2">
                    <Badge variant="accent" className="text-[10px] font-mono">
                      {Object.values(likedPhotos).filter(Boolean).length} / 80 Selected
                    </Badge>
                    <Button
                      onClick={handleCopyLightroom}
                      variant="outline"
                      size="sm"
                      className="text-xs h-7 gap-1"
                    >
                      <Copy className="w-3 h-3" />
                      <span>{copiedLightroom ? "Copied!" : "Copy Filter"}</span>
                    </Button>
                  </div>
                </div>

                {/* Categories Tab */}
                <div className="flex items-center gap-2 mb-4 text-xs">
                  <button
                    onClick={() => setActiveTab("all")}
                    className={`px-2.5 py-1 rounded-md transition-colors border ${
                      activeTab === "all"
                        ? "bg-studio-surface text-studio-primary border-studio-accent/40 font-medium"
                        : "border-studio-border text-studio-muted hover:text-studio-secondary"
                    }`}
                  >
                    All Photos (238)
                  </button>
                  <button
                    onClick={() => setActiveTab("bridal")}
                    className={`px-2.5 py-1 rounded-md transition-colors border ${
                      activeTab === "bridal"
                        ? "bg-studio-surface text-studio-primary border-studio-accent/40 font-medium"
                        : "border-studio-border text-studio-muted hover:text-studio-secondary"
                    }`}
                  >
                    Bridal Details (42)
                  </button>
                  <button
                    onClick={() => setActiveTab("couple")}
                    className={`px-2.5 py-1 rounded-md transition-colors border ${
                      activeTab === "couple"
                        ? "bg-studio-surface text-studio-primary border-studio-accent/40 font-medium"
                        : "border-studio-border text-studio-muted hover:text-studio-secondary"
                    }`}
                  >
                    Couple Portraits (68)
                  </button>
                </div>

                {/* Photo Grid with Interactive Heart Action & Anti-theft watermark */}
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                  {[
                    {
                      id: "photo-1",
                      filename: "KAPUR_001.JPG",
                      img: "https://images.unsplash.com/photo-1583939003579-730e3918a45a?w=400&auto=format&fit=crop&q=80",
                    },
                    {
                      id: "photo-2",
                      filename: "KAPUR_004.JPG",
                      img: "https://images.unsplash.com/photo-1519741497674-611481863552?w=400&auto=format&fit=crop&q=80",
                    },
                    {
                      id: "photo-3",
                      filename: "KAPUR_012.JPG",
                      img: "https://images.unsplash.com/photo-1511285560929-80b456fea0bc?w=400&auto=format&fit=crop&q=80",
                    },
                    {
                      id: "photo-4",
                      filename: "KAPUR_018.JPG",
                      img: "https://images.unsplash.com/photo-1596704017254-9b121068fb31?w=400&auto=format&fit=crop&q=80",
                    },
                  ].map((photo) => {
                    const isLiked = likedPhotos[photo.id];
                    return (
                      <div
                        key={photo.id}
                        className="group relative rounded-lg overflow-hidden aspect-[3/4] border border-studio-border bg-studio-surface"
                      >
                        <img
                          src={photo.img}
                          alt={photo.filename}
                          className="h-full w-full object-cover group-hover:scale-105 transition-transform duration-300"
                        />
                        {/* Diagonal Watermark Text */}
                        <div className="absolute inset-0 flex items-center justify-center pointer-events-none bg-black/20">
                          <span className="text-[8px] font-mono font-bold text-white/50 tracking-wider -rotate-12 select-none">
                            PROOF ONLY · UIKEY
                          </span>
                        </div>

                        {/* Interactive Favorite Action Button */}
                        <button
                          onClick={() => toggleLike(photo.id)}
                          className={`absolute bottom-2 right-2 h-7 w-7 rounded-full flex items-center justify-center transition-all ${
                            isLiked
                              ? "bg-studio-accent text-studio-bg shadow-sm"
                              : "bg-black/60 text-white/80 hover:bg-black/80"
                          }`}
                          title="Select / Favorite photo"
                        >
                          <Heart className={`w-3.5 h-3.5 ${isLiked ? "fill-current" : ""}`} />
                        </button>

                        <div className="absolute bottom-2 left-2 pointer-events-none">
                          <span className="text-[9px] font-mono bg-black/70 text-white/90 px-1.5 py-0.5 rounded">
                            {photo.filename}
                          </span>
                        </div>
                      </div>
                    );
                  })}
                </div>

                {/* Lightroom Culling String Preview */}
                <div className="mt-4 p-3 rounded-lg bg-studio-surface/60 border border-studio-border/60 flex items-center justify-between text-xs">
                  <div className="truncate mr-3">
                    <span className="text-[10px] text-studio-muted block">Lightroom Text Filter Format:</span>
                    <span className="font-mono text-[11px] text-studio-primary truncate block">
                      KAPUR_001.JPG, KAPUR_004.JPG, KAPUR_018.JPG
                    </span>
                  </div>
                  <Button
                    onClick={handleCopyLightroom}
                    variant="secondary"
                    size="sm"
                    className="h-7 text-[11px] shrink-0 gap-1"
                  >
                    <Copy className="w-3 h-3" />
                    <span>{copiedLightroom ? "Copied" : "Copy"}</span>
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Section: Quotations & GST Engine Preview */}
      <section id="quotations" className="py-20 border-b border-studio-border/60">
        <div className="mx-auto max-w-[1240px] px-6">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
            {/* Left Interactive Quote Mockup */}
            <div className="lg:col-span-7 order-2 lg:order-1">
              <div className="rounded-xl border border-studio-border bg-studio-card p-6 shadow-xl text-left">
                {/* Formal Quote Header */}
                <div className="flex items-start justify-between pb-4 mb-4 border-b border-studio-border/60">
                  <div>
                    <span className="text-[10px] font-mono font-semibold text-studio-accent uppercase tracking-wider block">
                      TAX ESTIMATE · EST-2026-001
                    </span>
                    <h4 className="text-base font-bold text-studio-primary mt-0.5">
                      Rhea & Kabir Kapur · 2-Day Wedding Coverage
                    </h4>
                    <p className="text-xs text-studio-secondary mt-0.5">
                      The St. Regis Mumbai · 14-15 Nov 2026
                    </p>
                  </div>
                  <Badge variant="accent" className="text-[10px] py-0.5 px-2">
                    SAC 998381 (Photography)
                  </Badge>
                </div>

                {/* Line Items Table */}
                <div className="space-y-2 mb-4 text-xs">
                  <div className="flex justify-between py-1.5 border-b border-studio-border/40 text-studio-muted font-mono text-[11px]">
                    <span>Service Description</span>
                    <span>Amount</span>
                  </div>
                  <div className="flex justify-between py-1 text-studio-secondary">
                    <span>Candid Photography (2 Photographers · 2 Days)</span>
                    <span className="font-mono text-studio-primary">₹85,000</span>
                  </div>
                  <div className="flex justify-between py-1 text-studio-secondary">
                    <span>Cinematic 4K Wedding Film (3–5 min teaser + 45 min film)</span>
                    <span className="font-mono text-studio-primary">₹42,000</span>
                  </div>
                  <div className="flex justify-between py-1 text-studio-secondary">
                    <span>Licensed Drone Aerial Coverage (DGCA Permitted)</span>
                    <span className="font-mono text-studio-primary">₹12,000</span>
                  </div>
                </div>

                {/* Calculations & GST */}
                <div className="p-3.5 rounded-lg bg-studio-surface/50 border border-studio-border/60 space-y-1.5 text-xs">
                  <div className="flex justify-between text-studio-muted">
                    <span>Subtotal:</span>
                    <span className="font-mono">₹1,39,000</span>
                  </div>
                  <div className="flex justify-between text-studio-muted">
                    <span>GST (CGST 9% + SGST 9%):</span>
                    <span className="font-mono text-studio-secondary">+ ₹25,020</span>
                  </div>
                  <div className="flex justify-between font-bold text-sm text-studio-primary pt-1.5 border-t border-studio-border/60">
                    <span>Grand Total:</span>
                    <span className="font-mono text-studio-accent">₹1,64,020</span>
                  </div>
                </div>

                {/* Milestones Schedule */}
                <div className="mt-4 grid grid-cols-2 gap-2 text-xs">
                  <div className="p-2.5 rounded border border-studio-border bg-studio-card">
                    <span className="text-[10px] text-studio-muted block font-mono">1. Date Advance (50%)</span>
                    <span className="font-mono font-bold text-studio-primary text-xs">₹82,010</span>
                    <span className="text-[10px] text-studio-success block mt-0.5">Paid via Bharat UPI</span>
                  </div>
                  <div className="p-2.5 rounded border border-studio-border bg-studio-card">
                    <span className="text-[10px] text-studio-muted block font-mono">2. On Delivery (50%)</span>
                    <span className="font-mono font-bold text-studio-primary text-xs">₹82,010</span>
                    <span className="text-[10px] text-studio-warning block mt-0.5">Due before master unlock</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Right Explanation */}
            <div className="lg:col-span-5 text-left order-1 lg:order-2">
              <Badge variant="accent" className="text-[10px] mb-3 font-medium">
                Indian Business Standards
              </Badge>
              <h2 className="text-2xl sm:text-3xl font-bold tracking-tight text-studio-primary leading-tight">
                Clear quotations and legally binding digital contracts
              </h2>
              <p className="mt-3 text-xs sm:text-sm text-studio-secondary leading-relaxed">
                Win high-value wedding clients with polished estimates, milestone payment schedules, and clear terms on RAW files and postponement.
              </p>

              <div className="mt-6 space-y-3 text-xs text-studio-secondary">
                <div className="flex items-start gap-2.5">
                  <div className="h-5 w-5 rounded bg-studio-surface border border-studio-border flex items-center justify-center shrink-0 mt-0.5 text-studio-accent">
                    <Check className="w-3 h-3" />
                  </div>
                  <span><strong>1-Click GST Calculation:</strong> Generates compliant tax invoices with SAC 998381 and CGST/SGST splits.</span>
                </div>
                <div className="flex items-start gap-2.5">
                  <div className="h-5 w-5 rounded bg-studio-surface border border-studio-border flex items-center justify-center shrink-0 mt-0.5 text-studio-accent">
                    <Check className="w-3 h-3" />
                  </div>
                  <span><strong>Digital Canvas Signatures:</strong> Clients review and sign agreements on their mobile screens with timestamp auditing.</span>
                </div>
                <div className="flex items-start gap-2.5">
                  <div className="h-5 w-5 rounded bg-studio-surface border border-studio-border flex items-center justify-center shrink-0 mt-0.5 text-studio-accent">
                    <Check className="w-3 h-3" />
                  </div>
                  <span><strong>Printable PDF Letterheads:</strong> Clean print styling for clients requiring physical receipts or corporate vouchers.</span>
                </div>
              </div>

              <div className="mt-8">
                <Link href="/dashboard/quotations">
                  <Button variant="accent" size="sm" className="gap-1.5 font-semibold text-xs">
                    <FileText className="w-3.5 h-3.5" />
                    <span>Explore Quotation Creator</span>
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Section: Honest Storage & Cost Control */}
      <section id="storage" className="py-20 border-b border-studio-border/60">
        <div className="mx-auto max-w-[1240px] px-6">
          <div className="text-center max-w-xl mx-auto mb-14">
            <Badge variant="accent" className="text-[10px] mb-3 font-medium">
              Storage-Conscious Architecture
            </Badge>
            <h2 className="text-2xl sm:text-3xl font-bold tracking-tight text-studio-primary">
              Honest, predictable storage pricing
            </h2>
            <p className="mt-2.5 text-xs sm:text-sm text-studio-secondary leading-relaxed">
              No unlimited storage promises that result in surprise account bans. Free access during open testing with clear quota meters.
            </p>
          </div>

          {/* Three Architecture Highlight Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-5 mb-14">
            <div className="rounded-xl border border-studio-border bg-studio-card p-5 text-left">
              <div className="h-8 w-8 rounded-lg bg-studio-surface border border-studio-border flex items-center justify-center text-studio-accent mb-3">
                <Images className="w-4 h-4" />
              </div>
              <h4 className="text-sm font-bold text-studio-primary">Preview / Master Separation</h4>
              <p className="mt-1.5 text-xs text-studio-secondary leading-relaxed">
                Client proofing runs on lightweight, watermarked WebP compressed files, saving 95% bandwidth. Master high-resolution files remain safely locked until settlement.
              </p>
            </div>

            <div className="rounded-xl border border-studio-border bg-studio-card p-5 text-left">
              <div className="h-8 w-8 rounded-lg bg-studio-surface border border-studio-border flex items-center justify-center text-studio-accent mb-3">
                <HardDrive className="w-4 h-4" />
              </div>
              <h4 className="text-sm font-bold text-studio-primary">Proactive Quota Warnings</h4>
              <p className="mt-1.5 text-xs text-studio-secondary leading-relaxed">
                Multi-tier alerts at 70%, 85%, and 95% ensure your studio never experiences sudden halts. Hard upload blocking at 100% prevents surprise cloud bills.
              </p>
            </div>

            <div className="rounded-xl border border-studio-border bg-studio-card p-5 text-left">
              <div className="h-8 w-8 rounded-lg bg-studio-surface border border-studio-border flex items-center justify-center text-studio-accent mb-3">
                <CreditCard className="w-4 h-4" />
              </div>
              <h4 className="text-sm font-bold text-studio-primary">Zero Gateway Fees</h4>
              <p className="mt-1.5 text-xs text-studio-secondary leading-relaxed">
                Receive payments straight into your current bank account via Bharat UPI. Save 2% to 3% in payment gateway commissions on every wedding shoot.
              </p>
            </div>
          </div>

          {/* Plans Comparison */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {plans.map((plan) => (
              <div
                key={plan.id}
                className={`rounded-xl border p-6 flex flex-col justify-between transition-all ${
                  plan.popular
                    ? "border-studio-accent/70 bg-studio-card shadow-lg shadow-studio-accent/5 relative"
                    : "border-studio-border bg-studio-surface/40"
                }`}
              >
                <div>
                  {plan.popular && (
                    <span className="inline-block rounded-full bg-studio-accent px-2.5 py-0.5 text-[9px] font-semibold text-studio-bg uppercase tracking-wider mb-3">
                      Recommended for Studios
                    </span>
                  )}
                  <h3 className="text-base font-bold text-studio-primary">{plan.name}</h3>
                  <div className="mt-3 flex items-baseline gap-1">
                    <span className="text-3xl font-extrabold text-studio-primary font-mono">{plan.price}</span>
                    <span className="text-xs text-studio-muted">/{plan.period}</span>
                  </div>
                  <p className="mt-2 text-xs text-studio-accent font-medium">
                    {plan.quotaGB} GB Storage · Up to {plan.maxProjects} active shoots
                  </p>
                  <p className="mt-2 text-xs text-studio-secondary leading-relaxed">
                    {plan.description}
                  </p>

                  <ul className="mt-5 space-y-2 text-xs text-studio-secondary pt-4 border-t border-studio-border/50">
                    {plan.features.map((feat) => (
                      <li key={feat} className="flex items-center gap-2">
                        <CheckCircle2 className="h-3.5 w-3.5 text-studio-accent shrink-0" />
                        <span>{feat}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="mt-6 pt-4 border-t border-studio-border/40">
                  <Link href="/dashboard">
                    <Button
                      variant={plan.popular ? "accent" : "outline"}
                      className="w-full text-xs font-semibold h-9"
                    >
                      {plan.id === "free" ? "Start Free" : "Explore in Demo"}
                    </Button>
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Banner & Footer */}
      <footer className="py-16 text-center border-t border-studio-border/60 bg-studio-card/20">
        <div className="mx-auto max-w-[1240px] px-6">
          <div className="max-w-xl mx-auto">
            <h2 className="text-2xl sm:text-3xl font-bold text-studio-primary">
              Ready to elevate your studio operations?
            </h2>
            <p className="mt-2 text-xs sm:text-sm text-studio-secondary leading-relaxed">
              Explore the interactive demo with real Indian wedding sample projects, or set up your own studio in 2 minutes.
            </p>
            <div className="mt-6 flex flex-col sm:flex-row justify-center gap-3">
              <Link href="/dashboard">
                <Button variant="accent" size="lg" className="gap-2 font-semibold text-xs h-10 px-6">
                  <span>Explore Demo Workspace</span>
                  <ArrowRight className="h-3.5 w-3.5" />
                </Button>
              </Link>
              <Link href="/signup">
                <Button variant="outline" size="lg" className="text-xs font-medium h-10 px-6">
                  Create Studio Account
                </Button>
              </Link>
            </div>

            <div className="mt-12 pt-6 border-t border-studio-border/50 flex flex-col sm:flex-row items-center justify-between text-xs text-studio-muted gap-4">
              <div className="flex items-center gap-2">
                <div className="h-6 w-6 rounded bg-studio-card border border-studio-border flex items-center justify-center text-studio-accent">
                  <Camera className="h-3.5 w-3.5" />
                </div>
                <span className="font-semibold text-studio-primary">UIKEY AI Studio</span>
                <span>· Shoot se delivery tak, photographers ka intelligent workspace.</span>
              </div>
              <div className="flex items-center gap-4 text-studio-secondary">
                <Link href="/dashboard" className="hover:text-studio-primary transition-colors">
                  Dashboard
                </Link>
                <Link href="/p/arjun-mehta" className="hover:text-studio-primary transition-colors">
                  Portfolio
                </Link>
                <Link href="/login" className="hover:text-studio-primary transition-colors">
                  Sign In
                </Link>
                <a
                  href="https://github.com/uikeymahesh2025/uikey-ai-studio"
                  target="_blank"
                  rel="noreferrer"
                  className="hover:text-studio-primary transition-colors"
                >
                  GitHub
                </a>
              </div>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
