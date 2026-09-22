"use client";

import React, { useState } from "react";
import Link from "next/link";
import {
  FileText,
  Plus,
  Search,
  ExternalLink,
  Share2,
  Calendar,
  CheckCircle2,
  Clock,
  ArrowUpRight,
} from "lucide-react";
import { DashboardLayout } from "@/components/layout/dashboard-layout";
import { useStudio } from "@/lib/store/store-context";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { formatINR, formatDate } from "@/lib/utils";
import { QuotationStatus } from "@/lib/types";

export default function QuotationsPage() {
  const { state } = useStudio();
  const { quotations } = state;

  const [searchQuery, setSearchQuery] = useState("");
  const [selectedStatus, setSelectedStatus] = useState<string>("all");

  const statuses = [
    { label: "All Proposals", value: "all" },
    { label: "Draft", value: "Draft" },
    { label: "Sent", value: "Sent" },
    { label: "Viewed", value: "Viewed" },
    { label: "Accepted", value: "Accepted" },
  ];

  const filteredQuotes = quotations.filter((q) => {
    const matchesSearch =
      q.clientName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      q.projectName.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = selectedStatus === "all" || q.status === selectedStatus;
    return matchesSearch && matchesStatus;
  });

  const getStatusBadge = (status: QuotationStatus) => {
    switch (status) {
      case "Accepted":
        return <Badge variant="success">Accepted</Badge>;
      case "Sent":
        return <Badge variant="accent">Sent</Badge>;
      case "Viewed":
        return <Badge variant="warning">Client Viewed</Badge>;
      case "Draft":
        return <Badge variant="default">Draft</Badge>;
      default:
        return <Badge variant="default">{status}</Badge>;
    }
  };

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 border-b border-studio-border/60 pb-5">
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-xl font-bold tracking-tight text-studio-primary">
                Quotations & Proposals
              </h1>
              <Badge variant="default" className="text-[10px]">
                {quotations.length} Total
              </Badge>
            </div>
            <p className="text-xs text-studio-secondary mt-1">
              Create professional Indian wedding photography proposals with presets, GST, and milestone payment schedules.
            </p>
          </div>

          <Link href="/dashboard/quotations/new">
            <Button variant="accent" size="sm" className="gap-1.5 shadow-sm">
              <Plus className="w-3.5 h-3.5" />
              <span>Create Quotation</span>
            </Button>
          </Link>
        </div>

        {/* Filter bar */}
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
          <div className="relative flex-1 max-w-sm">
            <Search className="absolute left-3 top-2.5 h-3.5 w-3.5 text-studio-muted" />
            <Input
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search by client or project name..."
              className="pl-9"
            />
          </div>

          <div className="flex items-center gap-1.5 overflow-x-auto pb-1 sm:pb-0">
            {statuses.map((st) => (
              <button
                key={st.value}
                onClick={() => setSelectedStatus(st.value)}
                className={`px-2.5 py-1 rounded-md text-xs whitespace-nowrap transition-colors border ${
                  selectedStatus === st.value
                    ? "bg-studio-card text-studio-primary border-studio-accent/40 font-medium"
                    : "border-studio-border bg-studio-surface text-studio-muted hover:text-studio-secondary"
                }`}
              >
                {st.label}
              </button>
            ))}
          </div>
        </div>

        {/* Quotations List Cards */}
        <div className="space-y-3">
          {filteredQuotes.map((q) => (
            <Card key={q.id} className="hover:border-studio-borderHover transition-all">
              <CardContent className="p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div className="space-y-1">
                  <div className="flex items-center gap-2.5">
                    <Link
                      href={`/dashboard/quotations/${q.id}`}
                      className="text-sm font-bold text-studio-primary hover:text-studio-accent transition-colors"
                    >
                      {q.projectName}
                    </Link>
                    {getStatusBadge(q.status)}
                    {q.includeGst && (
                      <span className="text-[10px] font-mono text-studio-muted border border-studio-border px-1.5 py-0.2 rounded">
                        18% GST
                      </span>
                    )}
                  </div>
                  <p className="text-xs text-studio-secondary">
                    Client: <strong className="text-studio-primary">{q.clientName}</strong> · {q.items.length} Line items · Valid till {formatDate(q.validUntil)}
                  </p>
                </div>

                <div className="flex items-center justify-between sm:justify-end gap-5">
                  <div className="text-left sm:text-right">
                    <span className="text-sm font-bold text-studio-primary font-mono block">
                      {formatINR(q.grandTotal)}
                    </span>
                    <span className="text-[11px] text-studio-muted">
                      Advance: {formatINR(q.advanceAmount)}
                    </span>
                  </div>

                  <div className="flex items-center gap-2">
                    <Link href={`/quote/${q.id}`} target="_blank">
                      <Button variant="outline" size="sm" className="h-8 text-xs gap-1">
                        <span>Client View</span>
                        <ExternalLink className="w-3 h-3 text-studio-muted" />
                      </Button>
                    </Link>
                    <Link href={`/dashboard/quotations/${q.id}`}>
                      <Button variant="secondary" size="sm" className="h-8 text-xs gap-1">
                        <span>Manage</span>
                        <ArrowUpRight className="w-3 h-3" />
                      </Button>
                    </Link>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </DashboardLayout>
  );
}
