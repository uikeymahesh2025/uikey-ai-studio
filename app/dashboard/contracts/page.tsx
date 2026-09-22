"use client";

import React, { useState } from "react";
import Link from "next/link";
import {
  FileCheck,
  Plus,
  Search,
  ExternalLink,
  Share2,
  CheckCircle2,
  Clock,
  AlertCircle,
  Calendar,
  IndianRupee,
  ChevronRight,
  ShieldCheck,
} from "lucide-react";
import { useStudio } from "@/lib/store/store-context";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { createWhatsAppShareUrl, generateWhatsAppMessage } from "@/lib/whatsapp/templates";
import { formatCurrency } from "@/lib/utils";

export default function ContractsPage() {
  const { state } = useStudio();
  const { contracts, studio } = state;

  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");

  const filteredContracts = contracts.filter((c) => {
    const matchesSearch =
      c.projectName.toLowerCase().includes(search.toLowerCase()) ||
      c.clientName.toLowerCase().includes(search.toLowerCase()) ||
      c.contractNumber.toLowerCase().includes(search.toLowerCase());
    const matchesStatus = statusFilter === "all" || c.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const totalValue = contracts.reduce((acc, c) => acc + c.totalAmount, 0);
  const signedCount = contracts.filter((c) => c.status === "signed").length;
  const pendingCount = contracts.filter((c) => c.status === "sent").length;

  return (
    <div className="space-y-6">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl font-bold tracking-tight text-studio-primary flex items-center gap-2">
            <FileCheck className="w-5 h-5 text-studio-accent" />
            <span>Photography Agreements & Contracts</span>
          </h1>
          <p className="text-xs text-studio-secondary mt-0.5">
            Legally grounded Indian wedding & portrait service contracts with digital client e-signatures.
          </p>
        </div>

        <Link href="/dashboard/contracts/new">
          <Button size="sm" className="bg-studio-accent text-studio-bg hover:bg-studio-accent/90 gap-1.5 font-medium text-xs shadow-sm">
            <Plus className="w-4 h-4" />
            <span>Create Agreement</span>
          </Button>
        </Link>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <Card className="bg-studio-card/60 border-studio-border/70 backdrop-blur-sm">
          <CardContent className="p-4 flex items-center justify-between">
            <div>
              <p className="text-[11px] font-medium text-studio-muted uppercase tracking-wider">
                Total Contracted Value
              </p>
              <h3 className="text-lg font-bold text-studio-primary mt-0.5">
                {formatCurrency(totalValue)}
              </h3>
            </div>
            <div className="w-9 h-9 rounded-lg bg-studio-accentMuted flex items-center justify-center text-studio-accent">
              <IndianRupee className="w-4 h-4" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-studio-card/60 border-studio-border/70 backdrop-blur-sm">
          <CardContent className="p-4 flex items-center justify-between">
            <div>
              <p className="text-[11px] font-medium text-studio-muted uppercase tracking-wider">
                Digitally Signed
              </p>
              <h3 className="text-lg font-bold text-emerald-400 mt-0.5">
                {signedCount} <span className="text-xs font-normal text-studio-muted">/ {contracts.length}</span>
              </h3>
            </div>
            <div className="w-9 h-9 rounded-lg bg-emerald-500/10 flex items-center justify-center text-emerald-400">
              <ShieldCheck className="w-4 h-4" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-studio-card/60 border-studio-border/70 backdrop-blur-sm">
          <CardContent className="p-4 flex items-center justify-between">
            <div>
              <p className="text-[11px] font-medium text-studio-muted uppercase tracking-wider">
                Pending Client Sign
              </p>
              <h3 className="text-lg font-bold text-amber-400 mt-0.5">
                {pendingCount}
              </h3>
            </div>
            <div className="w-9 h-9 rounded-lg bg-amber-500/10 flex items-center justify-center text-amber-400">
              <Clock className="w-4 h-4" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Filters & Search */}
      <div className="flex flex-col sm:flex-row items-center gap-3">
        <div className="relative flex-1 w-full">
          <Search className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-studio-muted" />
          <Input
            placeholder="Search by client, project, or contract number..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-8 bg-studio-card/60 border-studio-border/80 text-xs h-9 w-full"
          />
        </div>

        <div className="flex items-center gap-1.5 w-full sm:w-auto overflow-x-auto pb-1 sm:pb-0">
          {["all", "signed", "sent", "draft"].map((st) => (
            <button
              key={st}
              onClick={() => setStatusFilter(st)}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium capitalize transition-colors ${
                statusFilter === st
                  ? "bg-studio-card border border-studio-accent/40 text-studio-accent"
                  : "text-studio-muted hover:text-studio-primary hover:bg-studio-card/40"
              }`}
            >
              {st}
            </button>
          ))}
        </div>
      </div>

      {/* Contracts List */}
      <div className="space-y-3">
        {filteredContracts.length === 0 ? (
          <div className="text-center py-12 border border-dashed border-studio-border rounded-xl bg-studio-card/20">
            <FileCheck className="w-8 h-8 text-studio-muted mx-auto mb-2 opacity-50" />
            <p className="text-xs text-studio-muted">No agreements found matching your search.</p>
          </div>
        ) : (
          filteredContracts.map((c) => {
            const publicSignUrl = `${typeof window !== "undefined" ? window.location.origin : ""}/contract/${c.id}`;
            const waShareUrl = createWhatsAppShareUrl(
              c.clientPhone,
              generateWhatsAppMessage("contract_sign", {
                clientName: c.clientName,
                clientPhone: c.clientPhone,
                studioName: studio.name,
                projectName: c.projectName,
                contractNumber: c.contractNumber,
                contractUrl: publicSignUrl,
              })
            );

            return (
              <Card
                key={c.id}
                className="bg-studio-card/60 hover:bg-studio-card border-studio-border/80 transition-all hover:border-studio-accent/40 group"
              >
                <CardContent className="p-4 sm:p-5">
                  <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                    <div className="space-y-1.5 flex-1 min-w-0">
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className="font-mono text-[11px] font-semibold text-studio-accent bg-studio-accentMuted px-2 py-0.5 rounded border border-studio-accent/20">
                          {c.contractNumber}
                        </span>
                        <Badge
                          variant={
                            c.status === "signed"
                              ? "success"
                              : c.status === "sent"
                              ? "warning"
                              : "outline"
                          }
                          className="text-[10px] capitalize"
                        >
                          {c.status === "signed" ? "Digitally Signed" : c.status}
                        </Badge>
                        <span className="text-[11px] text-studio-muted flex items-center gap-1">
                          <Calendar className="w-3 h-3" />
                          <span>{c.eventDates.join(" & ")}</span>
                        </span>
                      </div>

                      <h3 className="font-semibold text-sm text-studio-primary truncate">
                        {c.projectName} · {c.clientName}
                      </h3>

                      <p className="text-xs text-studio-secondary line-clamp-1">
                        {c.deliverables.slice(0, 2).join(" · ")}
                        {c.deliverables.length > 2 && ` +${c.deliverables.length - 2} more`}
                      </p>
                    </div>

                    <div className="flex items-center gap-6 justify-between md:justify-end border-t md:border-t-0 pt-3 md:pt-0 border-studio-border/50">
                      <div className="text-left md:text-right">
                        <p className="text-[10px] text-studio-muted uppercase tracking-wider">Total Value</p>
                        <p className="font-bold text-sm text-studio-primary">
                          {formatCurrency(c.totalAmount)}
                        </p>
                        <p className="text-[10px] text-emerald-400">
                          Advance: {formatCurrency(c.advanceAmount)}
                        </p>
                      </div>

                      <div className="flex items-center gap-2">
                        {c.status !== "signed" && (
                          <a
                            href={waShareUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="p-2 rounded-lg bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-400 border border-emerald-500/20 transition-colors"
                            title="Share Sign Link via WhatsApp"
                          >
                            <Share2 className="w-4 h-4" />
                          </a>
                        )}

                        <Link
                          href={`/contract/${c.id}`}
                          target="_blank"
                          className="p-2 rounded-lg bg-studio-surface hover:bg-studio-surface/80 text-studio-secondary hover:text-studio-primary border border-studio-border transition-colors"
                          title="Open Client Signing View"
                        >
                          <ExternalLink className="w-4 h-4" />
                        </Link>

                        <Link href={`/dashboard/contracts/${c.id}`}>
                          <Button size="sm" variant="outline" className="text-xs h-8 gap-1 border-studio-border">
                            <span>Details</span>
                            <ChevronRight className="w-3.5 h-3.5 text-studio-muted" />
                          </Button>
                        </Link>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            );
          })
        )}
      </div>
    </div>
  );
}
