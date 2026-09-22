"use client";

import React from "react";
import Link from "next/link";
import {
  Camera,
  CheckCircle2,
  ArrowRight,
  Shield,
  Smartphone,
  Zap,
  HardDrive,
  FileText,
  Images,
  CreditCard,
  MessageSquare,
  Sparkles,
  Users,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { STORAGE_PLANS } from "@/lib/storage";
import { formatINR } from "@/lib/utils";

export default function LandingPage() {
  const plans = [
    {
      ...STORAGE_PLANS.free,
      price: "₹0",
      period: "forever free",
      popular: false,
    },
    {
      ...STORAGE_PLANS.standard,
      price: "₹1,499",
      period: "per month",
      popular: true,
    },
    {
      ...STORAGE_PLANS.studio,
      price: "₹3,999",
      period: "per month",
      popular: false,
    },
  ];

  return (
    <div className="min-h-screen bg-studio-bg text-studio-primary selection:bg-studio-accent selection:text-studio-bg">
      {/* Header Navigation */}
      <header className="sticky top-0 z-40 w-full border-b border-studio-border bg-studio-bg/80 backdrop-blur-md">
        <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
          <Link href="/" className="flex items-center gap-2.5">
            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-studio-card border border-studio-border text-studio-accent shadow-sm">
              <Camera className="h-5 w-5" />
            </div>
            <div className="flex items-center gap-2">
              <span className="text-sm font-semibold tracking-tight text-studio-primary">
                UIKEY AI
              </span>
              <span className="rounded bg-studio-accentMuted px-1.5 py-0.5 text-[10px] font-mono font-medium text-studio-accent border border-studio-accent/20">
                STUDIO
              </span>
            </div>
          </Link>

          <nav className="hidden md:flex items-center gap-6 text-xs text-studio-secondary">
            <a href="#workflow" className="hover:text-studio-primary transition-colors">
              Workflow
            </a>
            <a href="#features" className="hover:text-studio-primary transition-colors">
              Features
            </a>
            <a href="#storage" className="hover:text-studio-primary transition-colors">
              Storage Plans
            </a>
            <Link href="/p/arjun-mehta" className="hover:text-studio-primary transition-colors">
              Sample Portfolio
            </Link>
          </nav>

          <div className="flex items-center gap-3">
            <Link href="/login">
              <Button variant="ghost" size="sm">
                Sign In
              </Button>
            </Link>
            <Link href="/dashboard">
              <Button variant="accent" size="sm" className="gap-1.5">
                <Sparkles className="h-3.5 w-3.5" />
                <span>Explore Demo</span>
              </Button>
            </Link>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="relative overflow-hidden pt-20 pb-24 sm:pt-28 sm:pb-32 border-b border-studio-border/60">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 text-center">
          <Badge
            variant="accent"
            className="mb-6 inline-flex gap-1.5 px-3 py-1 text-xs font-medium"
          >
            <Sparkles className="h-3.5 w-3.5" />
            <span>The Intelligent Operating System for Indian Photographers</span>
          </Badge>

          <h1 className="text-4xl sm:text-6xl lg:text-7xl font-bold tracking-tight text-studio-primary max-w-4xl mx-auto leading-[1.1]">
            Shoot se delivery tak,{" "}
            <span className="text-studio-accent italic font-editorial font-normal">
              photographers ka
            </span>{" "}
            intelligent workspace.
          </h1>

          <p className="mt-6 text-base sm:text-lg text-studio-secondary max-w-2xl mx-auto leading-relaxed">
            Replace scattered WhatsApp chats, Google Drive storage bills, and Excel sheets.
            Manage leads, send GST quotations, host watermark proofing galleries, and verify manual UPI payments — all in one studio workspace.
          </p>

          <div className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link href="/dashboard" className="w-full sm:w-auto">
              <Button variant="accent" size="lg" className="w-full sm:w-auto gap-2 shadow-lg shadow-studio-accent/10">
                <span>Launch Interactive Demo</span>
                <ArrowRight className="h-4 w-4" />
              </Button>
            </Link>
            <Link href="/onboarding" className="w-full sm:w-auto">
              <Button variant="outline" size="lg" className="w-full sm:w-auto">
                Setup Your Studio (Free)
              </Button>
            </Link>
          </div>

          <div className="mt-6 flex flex-wrap items-center justify-center gap-6 text-xs text-studio-muted">
            <span className="flex items-center gap-1.5">
              <CheckCircle2 className="h-3.5 w-3.5 text-studio-success" />
              Zero paid API keys needed
            </span>
            <span className="flex items-center gap-1.5">
              <CheckCircle2 className="h-3.5 w-3.5 text-studio-success" />
              Manual Bharat UPI + UTR
            </span>
            <span className="flex items-center gap-1.5">
              <CheckCircle2 className="h-3.5 w-3.5 text-studio-success" />
              Manual WhatsApp wa.me links
            </span>
            <span className="flex items-center gap-1.5">
              <CheckCircle2 className="h-3.5 w-3.5 text-studio-success" />
              No credit card required
            </span>
          </div>
        </div>

        {/* Live Interactive Workflow Pipeline Bar */}
        <div id="workflow" className="mt-20 mx-auto max-w-6xl px-4">
          <div className="rounded-xl border border-studio-border bg-studio-card/80 p-6 backdrop-blur shadow-2xl">
            <div className="flex items-center justify-between mb-4 border-b border-studio-border/60 pb-3">
              <div className="flex items-center gap-2">
                <span className="text-xs font-semibold uppercase tracking-wider text-studio-muted">
                  End-to-End Client Journey
                </span>
              </div>
              <span className="text-xs text-studio-accent font-medium">10-Stage Pipeline</span>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-8 gap-2 text-center text-xs">
              {[
                { stage: "1. Lead", desc: "Portfolio & CRM" },
                { stage: "2. Quotation", desc: "GST & Milestones" },
                { stage: "3. Booking", desc: "Advance UPI" },
                { stage: "4. Shoot", desc: "Calendar & Crew" },
                { stage: "5. Editing", desc: "RAW Backup" },
                { stage: "6. Proofing", desc: "Watermarked" },
                { stage: "7. Payment", desc: "UTR Verification" },
                { stage: "8. Delivery", desc: "Master Unlocks" },
              ].map((item, idx) => (
                <div
                  key={item.stage}
                  className="p-2.5 rounded-lg border border-studio-border/60 bg-studio-surface/50 text-left hover:border-studio-accent/40 transition-colors"
                >
                  <span className="block font-semibold text-studio-primary text-[11px]">
                    {item.stage}
                  </span>
                  <span className="block text-[10px] text-studio-muted mt-0.5">
                    {item.desc}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Core Studio Pillars */}
      <section id="features" className="py-24 border-b border-studio-border/60">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-16">
            <h2 className="text-2xl sm:text-4xl font-bold tracking-tight text-studio-primary">
              Built specifically for Indian photography studios
            </h2>
            <p className="mt-3 text-sm text-studio-secondary">
              Everything you need to run your photography business profitably, without paying thousands in recurring software fees.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {/* 1. Indian Quotations & GST */}
            <div className="rounded-xl border border-studio-border bg-studio-card p-6 hover:border-studio-borderHover transition-all">
              <div className="h-10 w-10 rounded-lg bg-studio-surface border border-studio-border flex items-center justify-center text-studio-accent mb-4">
                <FileText className="h-5 w-5" />
              </div>
              <h3 className="text-base font-semibold text-studio-primary">
                Indian Wedding Quotations
              </h3>
              <p className="mt-2 text-xs text-studio-secondary leading-relaxed">
                Preloaded with Indian wedding presets (Cinematic film ₹42k, Wedding Day ₹85k, Drone ₹12k). 1-click 18% GST toggle, advance calculation, milestone schedules, and downloadable PDFs.
              </p>
            </div>

            {/* 2. Watermarked Proofing Gallery */}
            <div className="rounded-xl border border-studio-border bg-studio-card p-6 hover:border-studio-borderHover transition-all">
              <div className="h-10 w-10 rounded-lg bg-studio-surface border border-studio-border flex items-center justify-center text-studio-accent mb-4">
                <Images className="h-5 w-5" />
              </div>
              <h3 className="text-base font-semibold text-studio-primary">
                Proofing Galleries with Watermarks
              </h3>
              <p className="mt-2 text-xs text-studio-secondary leading-relaxed">
                High-speed mobile masonry grid. Automatic diagonal “PROOF ONLY · STUDIO” watermarks. Clients favorite, reject, and comment on photos on their phones with zero friction.
              </p>
            </div>

            {/* 3. Manual UPI & UTR Verification */}
            <div className="rounded-xl border border-studio-border bg-studio-card p-6 hover:border-studio-borderHover transition-all">
              <div className="h-10 w-10 rounded-lg bg-studio-surface border border-studio-border flex items-center justify-center text-studio-accent mb-4">
                <CreditCard className="h-5 w-5" />
              </div>
              <h3 className="text-base font-semibold text-studio-primary">
                Manual Bharat UPI & UTR Desk
              </h3>
              <p className="mt-2 text-xs text-studio-secondary leading-relaxed">
                Zero gateway commissions. Clients scan your dynamic UPI QR code or pay via GPay/PhonePe, enter their 12-digit UTR and upload receipt. 1-click verification unlocks original high-res files.
              </p>
            </div>

            {/* 4. Manual WhatsApp wa.me Templates */}
            <div className="rounded-xl border border-studio-border bg-studio-card p-6 hover:border-studio-borderHover transition-all">
              <div className="h-10 w-10 rounded-lg bg-studio-surface border border-studio-border flex items-center justify-center text-studio-accent mb-4">
                <MessageSquare className="h-5 w-5" />
              </div>
              <h3 className="text-base font-semibold text-studio-primary">
                WhatsApp wa.me Sharing
              </h3>
              <p className="mt-2 text-xs text-studio-secondary leading-relaxed">
                No expensive WhatsApp Business APIs or banned numbers. Click to open pre-composed, polite WhatsApp messages for quotes, gallery selections, and payment reminders.
              </p>
            </div>

            {/* 5. Storage Quota & Cost Control */}
            <div className="rounded-xl border border-studio-border bg-studio-card p-6 hover:border-studio-borderHover transition-all">
              <div className="h-10 w-10 rounded-lg bg-studio-surface border border-studio-border flex items-center justify-center text-studio-accent mb-4">
                <HardDrive className="h-5 w-5" />
              </div>
              <h3 className="text-base font-semibold text-studio-primary">
                Storage & Cost Control
              </h3>
              <p className="mt-2 text-xs text-studio-secondary leading-relaxed">
                Clear storage caps from 1 GB to 500 GB. Multi-tier alerts at 70%, 85%, 95%, and upload blocking at 100%. WebP optimization ensures proofing uses negligible bandwidth.
              </p>
            </div>

            {/* 6. Calendar & Double Booking Guard */}
            <div className="rounded-xl border border-studio-border bg-studio-card p-6 hover:border-studio-borderHover transition-all">
              <div className="h-10 w-10 rounded-lg bg-studio-surface border border-studio-border flex items-center justify-center text-studio-accent mb-4">
                <Zap className="h-5 w-5" />
              </div>
              <h3 className="text-base font-semibold text-studio-primary">
                Smart Double-Booking Guard
              </h3>
              <p className="mt-2 text-xs text-studio-secondary leading-relaxed">
                Never double-book a muhurat wedding date. Track shoots, editor milestones, album print deliveries, and crew travel dates on an interactive studio calendar.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Storage Tier Plans */}
      <section id="storage" className="py-24 border-b border-studio-border/60">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-16">
            <h2 className="text-2xl sm:text-4xl font-bold tracking-tight text-studio-primary">
              Transparent, Storage-Conscious Pricing
            </h2>
            <p className="mt-3 text-sm text-studio-secondary">
              No unlimited storage lies that lead to sudden account bans. Predictable plans based on your active shoots and archive size.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {plans.map((plan) => (
              <div
                key={plan.id}
                className={`rounded-2xl border p-7 transition-all ${
                  plan.popular
                    ? "border-studio-accent bg-studio-card shadow-xl shadow-studio-accent/5 relative"
                    : "border-studio-border bg-studio-surface/40"
                }`}
              >
                {plan.popular && (
                  <span className="absolute -top-3 left-1/2 -translate-x-1/2 rounded-full bg-studio-accent px-3 py-0.5 text-[10px] font-semibold text-studio-bg uppercase tracking-wide">
                    Most Popular for Studios
                  </span>
                )}
                <h3 className="text-lg font-bold text-studio-primary">{plan.name}</h3>
                <div className="mt-4 flex items-baseline gap-1">
                  <span className="text-3xl font-extrabold text-studio-primary">{plan.price}</span>
                  <span className="text-xs text-studio-muted">/{plan.period}</span>
                </div>
                <p className="mt-2 text-xs text-studio-accent font-medium">
                  {plan.quotaGB} GB Storage · Up to {plan.maxActiveProjects} active projects
                </p>

                <ul className="mt-6 space-y-2.5 text-xs text-studio-secondary">
                  {plan.features.map((feat) => (
                    <li key={feat} className="flex items-center gap-2">
                      <CheckCircle2 className="h-3.5 w-3.5 text-studio-success shrink-0" />
                      <span>{feat}</span>
                    </li>
                  ))}
                </ul>

                <div className="mt-8">
                  <Link href="/dashboard">
                    <Button
                      variant={plan.popular ? "accent" : "secondary"}
                      className="w-full"
                    >
                      {plan.id === "free" ? "Start Free" : "Try in Demo"}
                    </Button>
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Footer */}
      <footer className="py-16 text-center">
        <div className="mx-auto max-w-4xl px-4">
          <h2 className="text-2xl sm:text-3xl font-bold text-studio-primary">
            Ready to streamline your photography business?
          </h2>
          <p className="mt-3 text-xs sm:text-sm text-studio-secondary">
            Join hundreds of Indian photographers who manage their business professionally with UIKEY AI Studio.
          </p>
          <div className="mt-8 flex justify-center gap-4">
            <Link href="/dashboard">
              <Button variant="accent" size="lg" className="gap-2">
                <span>Explore Studio Demo Now</span>
                <ArrowRight className="h-4 w-4" />
              </Button>
            </Link>
          </div>
          <p className="mt-12 text-[11px] text-studio-muted">
            © {new Date().getFullYear()} UIKEY AI Studio. Shoot se delivery tak, photographers ka intelligent workspace.
          </p>
        </div>
      </footer>
    </div>
  );
}
