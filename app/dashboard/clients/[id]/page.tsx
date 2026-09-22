"use client";

import React, { useState } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import {
  ArrowLeft,
  Calendar,
  CreditCard,
  ExternalLink,
  FileText,
  FolderKanban,
  Mail,
  MessageSquare,
  Phone,
  User,
  Clock,
  Sparkles,
  CheckCircle2,
} from "lucide-react";
import { DashboardLayout } from "@/components/layout/dashboard-layout";
import { useStudio } from "@/lib/store/store-context";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { formatINR, formatDate } from "@/lib/utils";
import { LeadStatus } from "@/lib/types";
import { createWhatsAppShareUrl } from "@/lib/whatsapp/templates";

export default function ClientProfilePage() {
  const params = useParams();
  const clientId = params.id as string;

  const { state, updateClient } = useStudio();
  const { clients, projects, quotations, payments, studio } = state;

  const client = clients.find((c) => c.id === clientId);

  if (!client) {
    return (
      <DashboardLayout>
        <div className="text-center py-20">
          <p className="text-sm text-studio-muted">Client profile not found.</p>
          <Link href="/dashboard/clients" className="mt-4 inline-block">
            <Button variant="outline" size="sm">
              Back to Clients
            </Button>
          </Link>
        </div>
      </DashboardLayout>
    );
  }

  const clientProjects = projects.filter((p) => p.clientId === client.id);
  const clientQuotations = quotations.filter((q) => q.clientId === client.id);
  const clientPayments = payments.filter((p) => p.clientId === client.id);

  const handleStatusChange = (newStatus: LeadStatus) => {
    updateClient(client.id, { status: newStatus });
  };

  const defaultWhatsAppMsg = `Namaste ${client.name} ji! Reaching out from ${studio.name} regarding your upcoming ${client.eventType} at ${client.venue || "your venue"}. Please let us know if you need any assistance with your dates or proposal!`;

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 border-b border-studio-border/60 pb-5">
          <div className="flex items-center gap-3">
            <Link href="/dashboard/clients">
              <Button variant="outline" size="iconSm">
                <ArrowLeft className="w-3.5 h-3.5" />
              </Button>
            </Link>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-xl font-bold tracking-tight text-studio-primary">
                  {client.name}
                </h1>
                <Badge variant="accent">{client.status}</Badge>
              </div>
              <p className="text-xs text-studio-secondary mt-0.5">
                {client.eventType} · Client since {formatDate(client.createdAt)}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <label className="text-xs text-studio-muted">Lead Status:</label>
            <select
              value={client.status}
              onChange={(e) => handleStatusChange(e.target.value as LeadStatus)}
              className="h-8 rounded-md border border-studio-border bg-studio-surface px-2.5 text-xs text-studio-primary focus:outline-none focus:border-studio-accent"
            >
              {[
                "New inquiry",
                "Contacted",
                "Quotation sent",
                "Follow-up required",
                "Negotiation",
                "Booked",
                "Completed",
                "Lost",
              ].map((st) => (
                <option key={st} value={st}>
                  {st}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* 3 Overview Metric Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Card>
            <CardContent className="p-4">
              <span className="text-[11px] text-studio-muted">Total Lifetime Value</span>
              <div className="text-xl font-bold text-studio-primary font-mono mt-1">
                {formatINR(client.totalProjectValue)}
              </div>
              <span className="text-[10px] text-studio-muted">
                Budget: {formatINR(client.budget)}
              </span>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4">
              <span className="text-[11px] text-studio-muted">Paid to Date</span>
              <div className="text-xl font-bold text-studio-success font-mono mt-1">
                {formatINR(client.paidAmount)}
              </div>
              <span className="text-[10px] text-studio-success">
                Verified via Bharat UPI
              </span>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4">
              <span className="text-[11px] text-studio-muted">Pending Balance</span>
              <div className="text-xl font-bold text-studio-warning font-mono mt-1">
                {formatINR(client.pendingAmount)}
              </div>
              <span className="text-[10px] text-studio-muted">
                Lead Source: {client.leadSource}
              </span>
            </CardContent>
          </Card>
        </div>

        {/* Client Metadata and Contact Actions */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Left Column: Details & Communication */}
          <div className="lg:col-span-5 space-y-4">
            <Card>
              <CardHeader className="p-5 pb-3">
                <CardTitle className="text-sm font-semibold">Contact & Event Info</CardTitle>
              </CardHeader>
              <CardContent className="p-5 pt-0 space-y-3 text-xs">
                <div className="flex items-center justify-between border-b border-studio-border/50 pb-2">
                  <span className="text-studio-muted">WhatsApp:</span>
                  <span className="text-studio-primary font-medium">{client.whatsappNumber}</span>
                </div>
                <div className="flex items-center justify-between border-b border-studio-border/50 pb-2">
                  <span className="text-studio-muted">Email:</span>
                  <span className="text-studio-primary font-medium">{client.email || "Not specified"}</span>
                </div>
                <div className="flex items-center justify-between border-b border-studio-border/50 pb-2">
                  <span className="text-studio-muted">Event Date:</span>
                  <span className="text-studio-primary font-medium">{formatDate(client.eventDate)}</span>
                </div>
                <div className="flex items-center justify-between border-b border-studio-border/50 pb-2">
                  <span className="text-studio-muted">Venue:</span>
                  <span className="text-studio-primary font-medium text-right max-w-[220px]">
                    {client.venue || "To be confirmed"}
                  </span>
                </div>

                {client.notes && (
                  <div className="pt-2">
                    <span className="text-studio-muted block mb-1">Notes:</span>
                    <p className="bg-studio-surface/60 p-2.5 rounded-md border border-studio-border/60 text-studio-secondary italic">
                      &quot;{client.notes}&quot;
                    </p>
                  </div>
                )}

                {/* Direct Action Buttons */}
                <div className="pt-3 space-y-2">
                  <a
                    href={createWhatsAppShareUrl(client.whatsappNumber, defaultWhatsAppMsg)}
                    target="_blank"
                    rel="noreferrer"
                    className="block"
                  >
                    <Button variant="whatsapp" className="w-full gap-2 text-xs">
                      <MessageSquare className="w-3.5 h-3.5" />
                      <span>Open WhatsApp Chat (wa.me)</span>
                    </Button>
                  </a>

                  {client.email && (
                    <a href={`mailto:${client.email}?subject=${encodeURIComponent(`Photography Consultation - ${studio.name}`)}`} className="block">
                      <Button variant="outline" className="w-full gap-2 text-xs">
                        <Mail className="w-3.5 h-3.5" />
                        <span>Send Email</span>
                      </Button>
                    </a>
                  )}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Right Column: Projects & Quotation History */}
          <div className="lg:col-span-7 space-y-4">
            {/* Linked Projects */}
            <Card>
              <CardHeader className="p-5 pb-3">
                <CardTitle className="text-sm font-semibold">Projects ({clientProjects.length})</CardTitle>
                <CardDescription>Shoots booked with this client.</CardDescription>
              </CardHeader>
              <CardContent className="p-5 pt-0">
                {clientProjects.length === 0 ? (
                  <p className="text-xs text-studio-muted py-3">No active projects yet.</p>
                ) : (
                  <div className="space-y-2">
                    {clientProjects.map((p) => (
                      <Link
                        key={p.id}
                        href={`/dashboard/projects/${p.id}`}
                        className="flex items-center justify-between p-3 rounded-lg border border-studio-border bg-studio-surface/40 hover:bg-studio-surface hover:border-studio-borderHover text-xs transition-colors"
                      >
                        <div>
                          <p className="font-semibold text-studio-primary">{p.name}</p>
                          <span className="text-[11px] text-studio-muted">{formatDate(p.eventDate)} · {p.venue}</span>
                        </div>
                        <div className="text-right">
                          <span className="font-mono font-medium text-studio-primary">{formatINR(p.quotationAmount)}</span>
                          <p className="text-[10px] text-studio-accent">{p.status}</p>
                        </div>
                      </Link>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Linked Quotations */}
            <Card>
              <CardHeader className="p-5 pb-3">
                <CardTitle className="text-sm font-semibold">Quotations ({clientQuotations.length})</CardTitle>
                <CardDescription>Proposals generated for {client.name}.</CardDescription>
              </CardHeader>
              <CardContent className="p-5 pt-0">
                {clientQuotations.length === 0 ? (
                  <p className="text-xs text-studio-muted py-3">No quotations sent yet.</p>
                ) : (
                  <div className="space-y-2">
                    {clientQuotations.map((q) => (
                      <Link
                        key={q.id}
                        href={`/dashboard/quotations/${q.id}`}
                        className="flex items-center justify-between p-3 rounded-lg border border-studio-border bg-studio-surface/40 hover:bg-studio-surface hover:border-studio-borderHover text-xs transition-colors"
                      >
                        <div>
                          <p className="font-semibold text-studio-primary">{q.projectName}</p>
                          <span className="text-[11px] text-studio-muted">Valid until {formatDate(q.validUntil)}</span>
                        </div>
                        <div className="text-right">
                          <span className="font-mono font-medium text-studio-primary">{formatINR(q.grandTotal)}</span>
                          <p className="text-[10px] text-studio-success">{q.status}</p>
                        </div>
                      </Link>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
