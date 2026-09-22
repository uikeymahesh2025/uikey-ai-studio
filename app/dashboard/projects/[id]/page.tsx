"use client";

import React from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import {
  ArrowLeft,
  Calendar,
  CheckCircle2,
  Clock,
  CreditCard,
  ExternalLink,
  Images,
  MessageSquare,
  Share2,
  User,
  ShieldCheck,
  Download,
} from "lucide-react";
import { DashboardLayout } from "@/components/layout/dashboard-layout";
import { useStudio } from "@/lib/store/store-context";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { formatINR, formatDate } from "@/lib/utils";
import { ProjectChecklist, ProjectStatus } from "@/lib/types";
import { createWhatsAppShareUrl, generateWhatsAppMessage } from "@/lib/whatsapp/templates";

export default function ProjectDetailPage() {
  const params = useParams();
  const router = useRouter();
  const projectId = params.id as string;

  const { state, updateProject, updateChecklist } = useStudio();
  const { projects, studio, payments } = state;

  const project = projects.find((p) => p.id === projectId);

  if (!project) {
    return (
      <DashboardLayout>
        <div className="text-center py-20">
          <p className="text-sm text-studio-muted">Project not found.</p>
          <Link href="/dashboard/projects" className="mt-4 inline-block">
            <Button variant="outline" size="sm">
              Back to Projects
            </Button>
          </Link>
        </div>
      </DashboardLayout>
    );
  }

  const checklistItems: { key: keyof ProjectChecklist; label: string }[] = [
    { key: "contractAccepted", label: "Contract & Dates Accepted" },
    { key: "advanceReceived", label: "Booking Advance Received" },
    { key: "shootCompleted", label: "Shoot Completed On-Site" },
    { key: "photosBackedUp", label: "RAW Photos Backed Up to Dual Drives" },
    { key: "cullingCompleted", label: "Initial Culling & Flagging Completed" },
    { key: "editingCompleted", label: "Color Grading & Proofing Edits Done" },
    { key: "galleryUploaded", label: "Watermark Proofing Gallery Uploaded" },
    { key: "clientSelectionReceived", label: "Client Favorite Selections Received" },
    { key: "finalPaymentReceived", label: "Final Balance Payment Verified" },
    { key: "originalsDelivered", label: "Original High-Res Masters Delivered" },
  ];

  const handleStatusChange = (newStatus: ProjectStatus) => {
    updateProject(project.id, { status: newStatus });
  };

  const handleChecklistToggle = (key: keyof ProjectChecklist) => {
    const currentVal = project.checklist[key];
    updateChecklist(project.id, key, !currentVal);
  };

  // WhatsApp wa.me quick links
  const appUrl = typeof window !== "undefined" ? window.location.origin : "http://localhost:3000";
  const galleryUrl = `${appUrl}/gallery/${project.galleryId || "g-1"}`;
  const paymentUrl = `${appUrl}/payment/pay-1`;
  const deliveryUrl = `${appUrl}/gallery/${project.galleryId || "g-1"}#delivery`;

  const waGalleryMsg = generateWhatsAppMessage("gallery_ready", {
    clientName: project.clientName,
    clientPhone: project.clientPhone,
    studioName: studio.name,
    projectName: project.name,
    galleryUrl,
  });

  const waPaymentMsg = generateWhatsAppMessage("payment_reminder", {
    clientName: project.clientName,
    clientPhone: project.clientPhone,
    studioName: studio.name,
    projectName: project.name,
    amountDue: formatINR(project.balanceAmount),
    upiId: studio.upiId,
    paymentUrl,
  });

  const waDeliveryMsg = generateWhatsAppMessage("final_delivery", {
    clientName: project.clientName,
    clientPhone: project.clientPhone,
    studioName: studio.name,
    projectName: project.name,
    deliveryUrl,
  });

  const completedCount = Object.values(project.checklist).filter(Boolean).length;

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Navigation & Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 border-b border-studio-border/60 pb-5">
          <div className="flex items-center gap-3">
            <Link href="/dashboard/projects">
              <Button variant="outline" size="iconSm">
                <ArrowLeft className="w-3.5 h-3.5" />
              </Button>
            </Link>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-xl font-bold tracking-tight text-studio-primary">
                  {project.name}
                </h1>
                <Badge variant="accent">{project.status}</Badge>
              </div>
              <p className="text-xs text-studio-secondary mt-0.5">
                Client: <strong className="text-studio-primary">{project.clientName}</strong> · Shoot date: {formatDate(project.eventDate)}
              </p>
            </div>
          </div>

          {/* Quick status dropdown */}
          <div className="flex items-center gap-2">
            <label className="text-xs text-studio-muted">Stage:</label>
            <select
              value={project.status}
              onChange={(e) => handleStatusChange(e.target.value as ProjectStatus)}
              className="h-8 rounded-md border border-studio-border bg-studio-surface px-2.5 text-xs text-studio-primary focus:outline-none focus:border-studio-accent"
            >
              {[
                "Inquiry",
                "Quotation sent",
                "Booked",
                "Upcoming",
                "Shooting",
                "Editing",
                "Proofing",
                "Awaiting payment",
                "Delivered",
                "Archived",
              ].map((s) => (
                <option key={s} value={s}>
                  {s}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Top Summary Info Row */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Card>
            <CardContent className="p-4">
              <span className="text-[11px] text-studio-muted">Agreed Project Value</span>
              <div className="text-lg font-bold text-studio-primary font-mono mt-0.5">
                {formatINR(project.quotationAmount)}
              </div>
              <span className="text-[10px] text-studio-success">
                Paid: {formatINR(project.paidAmount)}
              </span>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4">
              <span className="text-[11px] text-studio-muted">Pending Balance</span>
              <div className="text-lg font-bold text-studio-warning font-mono mt-0.5">
                {formatINR(project.balanceAmount)}
              </div>
              <span className="text-[10px] text-studio-muted">
                UPI: {studio.upiId}
              </span>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4">
              <span className="text-[11px] text-studio-muted">Assigned Crew</span>
              <div className="text-xs font-semibold text-studio-primary mt-1">
                {project.assignedPhotographer}
              </div>
              <span className="text-[10px] text-studio-muted">
                Editor: {project.assignedEditor}
              </span>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4">
              <span className="text-[11px] text-studio-muted">Delivery Deadline</span>
              <div className="text-xs font-semibold text-studio-primary mt-1">
                {formatDate(project.deliveryDeadline)}
              </div>
              <span className="text-[10px] text-studio-accent">
                {project.photoCount} Photos in Proofing
              </span>
            </CardContent>
          </Card>
        </div>

        {/* Deliverables Checklist (10 Items) & Manual WhatsApp Shortcuts */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* 10-Item Checklist */}
          <div className="lg:col-span-8">
            <Card>
              <CardHeader className="p-5 pb-3">
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle className="text-sm font-semibold">
                      Production & Delivery Checklist
                    </CardTitle>
                    <CardDescription>
                      Click each milestone as your team completes it.
                    </CardDescription>
                  </div>
                  <span className="text-xs font-mono font-medium text-studio-accent">
                    {completedCount} / 10 Completed
                  </span>
                </div>
              </CardHeader>
              <CardContent className="p-5 pt-0">
                <div className="space-y-2">
                  {checklistItems.map((item, index) => {
                    const isChecked = project.checklist[item.key];
                    return (
                      <div
                        key={item.key}
                        onClick={() => handleChecklistToggle(item.key)}
                        className={`flex items-center justify-between p-3 rounded-lg border cursor-pointer transition-colors ${
                          isChecked
                            ? "border-studio-success/30 bg-studio-success/5"
                            : "border-studio-border bg-studio-surface/40 hover:bg-studio-surface"
                        }`}
                      >
                        <div className="flex items-center gap-3">
                          <div
                            className={`w-5 h-5 rounded flex items-center justify-center border text-xs ${
                              isChecked
                                ? "bg-studio-success border-studio-success text-studio-bg font-bold"
                                : "border-studio-border bg-studio-card text-transparent"
                            }`}
                          >
                            ✓
                          </div>
                          <span
                            className={`text-xs ${
                              isChecked
                                ? "text-studio-primary font-medium line-through opacity-80"
                                : "text-studio-secondary"
                            }`}
                          >
                            {index + 1}. {item.label}
                          </span>
                        </div>

                        {isChecked && (
                          <Badge variant="success" className="text-[9px] py-0">
                            Done
                          </Badge>
                        )}
                      </div>
                    );
                  })}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Quick Manual WhatsApp & Client Portals */}
          <div className="lg:col-span-4 space-y-4">
            {/* Portals */}
            <Card>
              <CardHeader className="p-4 pb-2">
                <CardTitle className="text-xs font-semibold">Client Portals</CardTitle>
                <CardDescription>Shareable client-facing links.</CardDescription>
              </CardHeader>
              <CardContent className="p-4 pt-0 space-y-2">
                <Link
                  href={galleryUrl}
                  target="_blank"
                  className="flex items-center justify-between p-2.5 rounded-md border border-studio-border bg-studio-surface/50 hover:bg-studio-surface hover:border-studio-borderHover text-xs transition-colors"
                >
                  <div className="flex items-center gap-2 text-studio-primary">
                    <Images className="w-3.5 h-3.5 text-studio-accent" />
                    <span>Open Proofing Gallery</span>
                  </div>
                  <ExternalLink className="w-3 h-3 text-studio-muted" />
                </Link>

                <Link
                  href={paymentUrl}
                  target="_blank"
                  className="flex items-center justify-between p-2.5 rounded-md border border-studio-border bg-studio-surface/50 hover:bg-studio-surface hover:border-studio-borderHover text-xs transition-colors"
                >
                  <div className="flex items-center gap-2 text-studio-primary">
                    <CreditCard className="w-3.5 h-3.5 text-studio-success" />
                    <span>Open UPI Payment Portal</span>
                  </div>
                  <ExternalLink className="w-3 h-3 text-studio-muted" />
                </Link>

                {project.quotationId && (
                  <Link
                    href={`/quote/${project.quotationId}`}
                    target="_blank"
                    className="flex items-center justify-between p-2.5 rounded-md border border-studio-border bg-studio-surface/50 hover:bg-studio-surface hover:border-studio-borderHover text-xs transition-colors"
                  >
                    <div className="flex items-center gap-2 text-studio-primary">
                      <Share2 className="w-3.5 h-3.5 text-studio-secondary" />
                      <span>View Client Quotation</span>
                    </div>
                    <ExternalLink className="w-3 h-3 text-studio-muted" />
                  </Link>
                )}
              </CardContent>
            </Card>

            {/* Manual WhatsApp Dispatch Desk */}
            <Card>
              <CardHeader className="p-4 pb-2">
                <div className="flex items-center justify-between">
                  <CardTitle className="text-xs font-semibold">
                    Manual WhatsApp (wa.me)
                  </CardTitle>
                  <Badge variant="success" className="text-[9px]">
                    No API Cost
                  </Badge>
                </div>
                <CardDescription>
                  1-click pre-composed messages for {project.clientName}.
                </CardDescription>
              </CardHeader>
              <CardContent className="p-4 pt-0 space-y-2">
                <a
                  href={createWhatsAppShareUrl(project.clientPhone, waGalleryMsg)}
                  target="_blank"
                  rel="noreferrer"
                  className="block"
                >
                  <Button variant="whatsapp" className="w-full text-xs justify-between">
                    <span>1. Send Proofing Gallery Link</span>
                    <ExternalLink className="w-3.5 h-3.5" />
                  </Button>
                </a>

                <a
                  href={createWhatsAppShareUrl(project.clientPhone, waPaymentMsg)}
                  target="_blank"
                  rel="noreferrer"
                  className="block"
                >
                  <Button variant="whatsapp" className="w-full text-xs justify-between">
                    <span>2. Send UPI Payment Reminder</span>
                    <ExternalLink className="w-3.5 h-3.5" />
                  </Button>
                </a>

                <a
                  href={createWhatsAppShareUrl(project.clientPhone, waDeliveryMsg)}
                  target="_blank"
                  rel="noreferrer"
                  className="block"
                >
                  <Button variant="whatsapp" className="w-full text-xs justify-between">
                    <span>3. Send Master Delivery Link</span>
                    <ExternalLink className="w-3.5 h-3.5" />
                  </Button>
                </a>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
