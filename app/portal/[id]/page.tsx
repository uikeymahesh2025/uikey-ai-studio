"use client";

import React, { useState } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import {
  Camera,
  Calendar,
  IndianRupee,
  Images,
  FileText,
  FileCheck,
  CreditCard,
  Download,
  Share2,
  Clock,
  CheckCircle2,
  Lock,
  ArrowRight,
  ExternalLink,
  MessageSquare,
  Sparkles,
} from "lucide-react";
import { useStudio } from "@/lib/store/store-context";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { formatCurrency, formatDate } from "@/lib/utils";
import { createWhatsAppShareUrl } from "@/lib/whatsapp/templates";

export default function ClientPortalHubPage() {
  const params = useParams();
  const id = params.id as string;
  const { state } = useStudio();
  const { projects, clients, quotations, contracts, payments, galleries, studio } = state;

  // Find project by id or by clientId
  const project =
    projects.find((p) => p.id === id || p.clientId === id) || projects[0];
  const client = clients.find((c) => c.id === project?.clientId);
  const quotation = quotations.find((q) => q.projectId === project?.id);
  const contract = contracts.find((c) => c.projectId === project?.id);
  const gallery = galleries.find((g) => g.projectId === project?.id);
  const projectPayments = payments.filter((p) => p.projectId === project?.id);

  if (!project) {
    return (
      <div className="min-h-screen bg-studio-bg flex items-center justify-center p-4">
        <div className="text-center space-y-3 max-w-md">
          <Camera className="w-12 h-12 text-studio-muted mx-auto opacity-50" />
          <h2 className="text-lg font-bold text-studio-primary">Client Portal Not Found</h2>
          <p className="text-xs text-studio-secondary">
            Please check the link provided by {studio.name}.
          </p>
        </div>
      </div>
    );
  }

  // Calculate days to event or days since shoot
  const eventDateObj = new Date(project.eventDate);
  const now = new Date();
  const diffTime = eventDateObj.getTime() - now.getTime();
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

  const totalPaid = projectPayments
    .filter((p) => p.status === "Verified")
    .reduce((acc, p) => acc + p.amount, 0);
  const balanceDue = Math.max(0, (project.quotationAmount || 0) - totalPaid);

  const pendingPayment = projectPayments.find((p) => p.status !== "Verified");

  const waStudioChatUrl = createWhatsAppShareUrl(
    studio.whatsappNumber || studio.phone,
    `Hi ${studio.ownerName} ji! Reaching out from my client portal regarding ${project.name}.`
  );

  return (
    <div className="min-h-screen bg-studio-bg text-studio-primary py-8 px-4 sm:px-6">
      <div className="max-w-4xl mx-auto space-y-6">
        {/* Top Studio Brand Header */}
        <div className="flex items-center justify-between border-b border-studio-border/70 pb-4">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-lg bg-studio-card border border-studio-border flex items-center justify-center text-studio-accent shadow-sm">
              <Camera className="w-4 h-4" />
            </div>
            <div>
              <h2 className="text-sm font-bold text-studio-primary">{studio.name}</h2>
              <p className="text-[11px] text-studio-secondary">Client Experience Portal</p>
            </div>
          </div>

          <a href={waStudioChatUrl} target="_blank" rel="noopener noreferrer">
            <Button size="sm" className="bg-emerald-600 hover:bg-emerald-500 text-white text-xs gap-1.5 h-8">
              <MessageSquare className="w-3.5 h-3.5" />
              <span>Chat on WhatsApp</span>
            </Button>
          </a>
        </div>

        {/* Welcome Hero Banner */}
        <div className="p-6 sm:p-8 rounded-2xl bg-gradient-to-r from-studio-card via-studio-card/80 to-studio-surface border border-studio-border/80 shadow-lg relative overflow-hidden">
          <div className="absolute top-0 right-0 p-8 opacity-10 pointer-events-none">
            <Sparkles className="w-32 h-32 text-studio-accent" />
          </div>

          <div className="space-y-3 relative z-10 max-w-xl">
            <Badge variant="outline" className="border-studio-accent/30 text-studio-accent text-[10px]">
              {project.eventType}
            </Badge>

            <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-studio-primary">
              Namaste, {project.clientName}! 🙏
            </h1>

            <p className="text-xs sm:text-sm text-studio-secondary leading-relaxed">
              Welcome to your private studio workspace for <strong className="text-studio-primary">{project.name}</strong>. Access your proposals, contracts, proofing selections, and delivery files in one place.
            </p>

            <div className="flex items-center gap-4 text-xs text-studio-secondary pt-2 flex-wrap">
              <span className="flex items-center gap-1.5">
                <Calendar className="w-3.5 h-3.5 text-studio-accent" />
                <span>{project.eventDate}</span>
              </span>
              <span>•</span>
              <span>{project.venue}</span>
              {diffDays > 0 && (
                <>
                  <span>•</span>
                  <span className="text-studio-accent font-semibold">{diffDays} days to go! ✨</span>
                </>
              )}
            </div>
          </div>
        </div>

        {/* Project Progress Steps */}
        <Card className="bg-studio-card/60 border-studio-border/80">
          <CardHeader className="pb-3">
            <CardTitle className="text-xs font-bold uppercase tracking-wider text-studio-muted">
              Live Shoot & Delivery Progress
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 sm:grid-cols-5 gap-3 text-center">
              <div
                className={`p-3 rounded-xl border ${
                  project.checklist.advanceReceived
                    ? "bg-emerald-500/10 border-emerald-500/30 text-emerald-400"
                    : "bg-studio-surface border-studio-border text-studio-muted"
                }`}
              >
                <div className="text-base mb-1">💳</div>
                <p className="text-xs font-semibold">1. Advance</p>
                <p className="text-[10px] mt-0.5">{project.checklist.advanceReceived ? "Received" : "Pending"}</p>
              </div>

              <div
                className={`p-3 rounded-xl border ${
                  project.checklist.contractAccepted
                    ? "bg-emerald-500/10 border-emerald-500/30 text-emerald-400"
                    : "bg-studio-surface border-studio-border text-studio-muted"
                }`}
              >
                <div className="text-base mb-1">📜</div>
                <p className="text-xs font-semibold">2. Agreement</p>
                <p className="text-[10px] mt-0.5">{project.checklist.contractAccepted ? "Signed" : "Pending Sign"}</p>
              </div>

              <div
                className={`p-3 rounded-xl border ${
                  project.checklist.shootCompleted
                    ? "bg-emerald-500/10 border-emerald-500/30 text-emerald-400"
                    : "bg-studio-surface border-studio-border text-studio-muted"
                }`}
              >
                <div className="text-base mb-1">📸</div>
                <p className="text-xs font-semibold">3. Shoot Day</p>
                <p className="text-[10px] mt-0.5">{project.checklist.shootCompleted ? "Completed" : "Scheduled"}</p>
              </div>

              <div
                className={`p-3 rounded-xl border ${
                  project.checklist.clientSelectionReceived
                    ? "bg-emerald-500/10 border-emerald-500/30 text-emerald-400"
                    : gallery
                    ? "bg-amber-500/10 border-amber-500/30 text-amber-400"
                    : "bg-studio-surface border-studio-border text-studio-muted"
                }`}
              >
                <div className="text-base mb-1">🖼️</div>
                <p className="text-xs font-semibold">4. Selection</p>
                <p className="text-[10px] mt-0.5">
                  {project.checklist.clientSelectionReceived
                    ? "Submitted"
                    : gallery
                    ? "Proofing Live"
                    : "Upcoming"}
                </p>
              </div>

              <div
                className={`p-3 rounded-xl border ${
                  project.checklist.originalsDelivered
                    ? "bg-emerald-500/10 border-emerald-500/30 text-emerald-400"
                    : "bg-studio-surface border-studio-border text-studio-muted"
                }`}
              >
                <div className="text-base mb-1">🎁</div>
                <p className="text-xs font-semibold">5. Handover</p>
                <p className="text-[10px] mt-0.5">
                  {project.checklist.originalsDelivered ? "Delivered" : "In Progress"}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Action Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Card 1: Proofing Gallery */}
          <Card className="bg-studio-card/60 border-studio-border/80 hover:border-studio-accent/40 transition-colors">
            <CardHeader className="pb-2">
              <div className="flex items-center justify-between">
                <span className="p-2 rounded-lg bg-studio-surface text-studio-accent border border-studio-border">
                  <Images className="w-4 h-4" />
                </span>
                <Badge variant={gallery ? "outline" : "default"} className="text-[10px]">
                  {gallery ? (gallery.isSelectionSubmitted ? "Selection Received" : "Proofing Active") : "Generating"}
                </Badge>
              </div>
              <CardTitle className="text-sm font-bold text-studio-primary mt-2">
                Photo Selection Gallery
              </CardTitle>
              <CardDescription className="text-xs text-studio-secondary">
                {gallery
                  ? `Review watermarked proofs, tap ❤️ favorites, and submit selections for final editing.`
                  : `Your proofing gallery will be published within 14 days of shoot completion.`}
              </CardDescription>
            </CardHeader>
            <CardContent className="pt-2">
              {gallery ? (
                <Link href={`/gallery/${gallery.id}`} target="_blank">
                  <Button size="sm" className="w-full bg-studio-accent text-studio-bg hover:bg-studio-accent/90 text-xs gap-1.5 h-8 font-medium">
                    <span>Open Proofing Gallery</span>
                    <ExternalLink className="w-3 h-3" />
                  </Button>
                </Link>
              ) : (
                <Button size="sm" disabled variant="outline" className="w-full text-xs h-8 border-studio-border text-studio-muted">
                  Gallery Upload Pending
                </Button>
              )}
            </CardContent>
          </Card>

          {/* Card 2: Agreement & Contract */}
          <Card className="bg-studio-card/60 border-studio-border/80 hover:border-studio-accent/40 transition-colors">
            <CardHeader className="pb-2">
              <div className="flex items-center justify-between">
                <span className="p-2 rounded-lg bg-studio-surface text-studio-accent border border-studio-border">
                  <FileCheck className="w-4 h-4" />
                </span>
                <Badge
                  variant={contract?.status === "signed" ? "success" : "warning"}
                  className="text-[10px]"
                >
                  {contract?.status === "signed" ? "Signed & Valid" : "Awaiting Signature"}
                </Badge>
              </div>
              <CardTitle className="text-sm font-bold text-studio-primary mt-2">
                Photography Agreement
              </CardTitle>
              <CardDescription className="text-xs text-studio-secondary">
                {contract
                  ? contract.status === "signed"
                    ? `Digitally signed by ${contract.signedByName}. View or print your copy.`
                    : `Please review deliverables, 14-day delivery timeline, and digitally sign.`
                  : `Formal service contract with shoot terms and deliverables.`}
              </CardDescription>
            </CardHeader>
            <CardContent className="pt-2">
              {contract ? (
                <Link href={`/contract/${contract.id}`} target="_blank">
                  <Button
                    size="sm"
                    variant={contract.status === "signed" ? "outline" : "default"}
                    className={`w-full text-xs gap-1.5 h-8 font-medium ${
                      contract.status === "signed"
                        ? "border-studio-border text-studio-primary"
                        : "bg-studio-accent text-studio-bg hover:bg-studio-accent/90"
                    }`}
                  >
                    <span>{contract.status === "signed" ? "View Signed Agreement" : "Review & Digitally Sign"}</span>
                    <ExternalLink className="w-3 h-3" />
                  </Button>
                </Link>
              ) : (
                <Button size="sm" disabled variant="outline" className="w-full text-xs h-8 border-studio-border text-studio-muted">
                  Agreement In Draft
                </Button>
              )}
            </CardContent>
          </Card>

          {/* Card 3: Payments & Balance */}
          <Card className="bg-studio-card/60 border-studio-border/80 hover:border-studio-accent/40 transition-colors">
            <CardHeader className="pb-2">
              <div className="flex items-center justify-between">
                <span className="p-2 rounded-lg bg-studio-surface text-studio-accent border border-studio-border">
                  <CreditCard className="w-4 h-4" />
                </span>
                <Badge variant={balanceDue === 0 ? "success" : "warning"} className="text-[10px]">
                  {balanceDue === 0 ? "Fully Paid" : `Due: ${formatCurrency(balanceDue)}`}
                </Badge>
              </div>
              <CardTitle className="text-sm font-bold text-studio-primary mt-2">
                Bharat UPI Payments
              </CardTitle>
              <CardDescription className="text-xs text-studio-secondary">
                Total: {formatCurrency(project.quotationAmount || 0)} · Paid: {formatCurrency(totalPaid)}
              </CardDescription>
            </CardHeader>
            <CardContent className="pt-2">
              {pendingPayment ? (
                <Link href={`/payment/${pendingPayment.id}`} target="_blank">
                  <Button size="sm" className="w-full bg-emerald-600 hover:bg-emerald-500 text-white text-xs gap-1.5 h-8 font-medium">
                    <span>Pay via UPI / Submit UTR</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </Button>
                </Link>
              ) : (
                <Link href={`/payment/${projectPayments[0]?.id || "pay-1"}`} target="_blank">
                  <Button size="sm" variant="outline" className="w-full text-xs h-8 border-studio-border text-studio-secondary hover:text-studio-primary">
                    <span>View Payment Receipts</span>
                  </Button>
                </Link>
              )}
            </CardContent>
          </Card>

          {/* Card 4: Master High-Res Downloads */}
          <Card className="bg-studio-card/60 border-studio-border/80 hover:border-studio-accent/40 transition-colors">
            <CardHeader className="pb-2">
              <div className="flex items-center justify-between">
                <span className="p-2 rounded-lg bg-studio-surface text-studio-accent border border-studio-border">
                  <Download className="w-4 h-4" />
                </span>
                <Badge
                  variant={project.checklist.finalPaymentReceived ? "success" : "outline"}
                  className="text-[10px]"
                >
                  {project.checklist.finalPaymentReceived ? "Unlocked" : "Locked"}
                </Badge>
              </div>
              <CardTitle className="text-sm font-bold text-studio-primary mt-2">
                High-Res Master Originals
              </CardTitle>
              <CardDescription className="text-xs text-studio-secondary">
                {project.checklist.finalPaymentReceived
                  ? "Full resolution color-graded original master images unlocked for download."
                  : "Original print-ready files unlock automatically upon final payment settlement."}
              </CardDescription>
            </CardHeader>
            <CardContent className="pt-2">
              {project.checklist.finalPaymentReceived ? (
                <Button size="sm" className="w-full bg-emerald-600 hover:bg-emerald-500 text-white text-xs gap-1.5 h-8 font-medium">
                  <Download className="w-3.5 h-3.5" />
                  <span>Download Master ZIP (4.2 GB)</span>
                </Button>
              ) : (
                <div className="flex items-center justify-center gap-1.5 text-xs text-studio-muted py-1.5 bg-studio-surface/50 rounded-lg border border-studio-border">
                  <Lock className="w-3.5 h-3.5" />
                  <span>Pending Final Payment Settlement</span>
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Studio Contact Footer */}
        <div className="p-4 rounded-xl bg-studio-card/40 border border-studio-border/60 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-studio-secondary">
          <div>
            <p className="font-semibold text-studio-primary">{studio.name}</p>
            <p>{studio.city} · {studio.email} · {studio.phone}</p>
          </div>

          <a href={waStudioChatUrl} target="_blank" rel="noopener noreferrer">
            <Button size="sm" variant="outline" className="text-xs border-studio-border h-8 gap-1.5">
              <Share2 className="w-3 h-3 text-emerald-400" />
              <span>Contact Studio on WhatsApp</span>
            </Button>
          </a>
        </div>
      </div>
    </div>
  );
}
