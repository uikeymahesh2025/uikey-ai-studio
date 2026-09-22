"use client";

import React, { useState } from "react";
import Link from "next/link";
import {
  Receipt,
  Search,
  ExternalLink,
  Share2,
  Printer,
  CheckCircle2,
  Clock,
  IndianRupee,
  Calendar,
  Building,
} from "lucide-react";
import { useStudio } from "@/lib/store/store-context";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { createWhatsAppShareUrl, generateWhatsAppMessage } from "@/lib/whatsapp/templates";
import { formatCurrency, formatDate } from "@/lib/utils";

export default function InvoicesPage() {
  const { state } = useStudio();
  const { invoices, studio } = state;

  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");

  const filteredInvoices = invoices.filter((inv) => {
    const matchesSearch =
      inv.invoiceNumber.toLowerCase().includes(search.toLowerCase()) ||
      inv.clientName.toLowerCase().includes(search.toLowerCase()) ||
      inv.projectName.toLowerCase().includes(search.toLowerCase());
    const matchesStatus = statusFilter === "all" || inv.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const totalInvoiced = invoices.reduce((acc, inv) => acc + inv.grandTotal, 0);
  const totalCollected = invoices.reduce((acc, inv) => acc + inv.paidAmount, 0);
  const totalPending = invoices.reduce((acc, inv) => acc + inv.balanceDue, 0);

  return (
    <div className="space-y-6">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl font-bold tracking-tight text-studio-primary flex items-center gap-2">
            <Receipt className="w-5 h-5 text-studio-accent" />
            <span>Tax Invoices & Payment Receipts</span>
          </h1>
          <p className="text-xs text-studio-secondary mt-0.5">
            GST compliant invoices (SAC 998381) with CGST, SGST, bank NEFT, and Bharat UPI integration.
          </p>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <Card className="bg-studio-card/60 border-studio-border/70 backdrop-blur-sm">
          <CardContent className="p-4 flex items-center justify-between">
            <div>
              <p className="text-[11px] font-medium text-studio-muted uppercase tracking-wider">
                Total Invoiced
              </p>
              <h3 className="text-lg font-bold text-studio-primary mt-0.5">
                {formatCurrency(totalInvoiced)}
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
                Total Collected
              </p>
              <h3 className="text-lg font-bold text-emerald-400 mt-0.5">
                {formatCurrency(totalCollected)}
              </h3>
            </div>
            <div className="w-9 h-9 rounded-lg bg-emerald-500/10 flex items-center justify-center text-emerald-400">
              <CheckCircle2 className="w-4 h-4" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-studio-card/60 border-studio-border/70 backdrop-blur-sm">
          <CardContent className="p-4 flex items-center justify-between">
            <div>
              <p className="text-[11px] font-medium text-studio-muted uppercase tracking-wider">
                Balance Due
              </p>
              <h3 className="text-lg font-bold text-amber-400 mt-0.5">
                {formatCurrency(totalPending)}
              </h3>
            </div>
            <div className="w-9 h-9 rounded-lg bg-amber-500/10 flex items-center justify-center text-amber-400">
              <Clock className="w-4 h-4" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Search & Filter */}
      <div className="flex flex-col sm:flex-row items-center gap-3">
        <div className="relative flex-1 w-full">
          <Search className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-studio-muted" />
          <Input
            placeholder="Search by invoice number, client, or project..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-8 bg-studio-card/60 border-studio-border/80 text-xs h-9 w-full"
          />
        </div>

        <div className="flex items-center gap-1.5 w-full sm:w-auto">
          {["all", "paid", "partially_paid", "issued"].map((st) => (
            <button
              key={st}
              onClick={() => setStatusFilter(st)}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium capitalize transition-colors ${
                statusFilter === st
                  ? "bg-studio-card border border-studio-accent/40 text-studio-accent"
                  : "text-studio-muted hover:text-studio-primary hover:bg-studio-card/40"
              }`}
            >
              {st.replace("_", " ")}
            </button>
          ))}
        </div>
      </div>

      {/* Invoices List */}
      <div className="space-y-3">
        {filteredInvoices.length === 0 ? (
          <div className="text-center py-12 border border-dashed border-studio-border rounded-xl bg-studio-card/20">
            <Receipt className="w-8 h-8 text-studio-muted mx-auto mb-2 opacity-50" />
            <p className="text-xs text-studio-muted">No tax invoices found.</p>
          </div>
        ) : (
          filteredInvoices.map((inv) => {
            const publicInvoiceUrl = `${typeof window !== "undefined" ? window.location.origin : ""}/invoice/${inv.id}`;
            const waShareUrl = createWhatsAppShareUrl(
              inv.clientPhone,
              generateWhatsAppMessage("tax_invoice", {
                clientName: inv.clientName,
                clientPhone: inv.clientPhone,
                studioName: studio.name,
                projectName: inv.projectName,
                invoiceNumber: inv.invoiceNumber,
                amountDue: formatCurrency(inv.grandTotal),
                invoiceUrl: publicInvoiceUrl,
              })
            );

            return (
              <Card
                key={inv.id}
                className="bg-studio-card/60 hover:bg-studio-card border-studio-border/80 transition-all hover:border-studio-accent/40"
              >
                <CardContent className="p-4 sm:p-5">
                  <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                    <div className="space-y-1.5 flex-1 min-w-0">
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className="font-mono text-[11px] font-semibold text-studio-accent bg-studio-accentMuted px-2 py-0.5 rounded border border-studio-accent/20">
                          {inv.invoiceNumber}
                        </span>
                        <Badge
                          variant={inv.status === "paid" ? "success" : "warning"}
                          className="text-[10px] capitalize"
                        >
                          {inv.status.replace("_", " ")}
                        </Badge>
                        <span className="text-[11px] text-studio-muted">
                          SAC Code: <strong className="text-studio-secondary font-mono">998381</strong>
                        </span>
                        <span className="text-[11px] text-studio-muted flex items-center gap-1">
                          <Calendar className="w-3 h-3" />
                          <span>{formatDate(inv.createdAt)}</span>
                        </span>
                      </div>

                      <h3 className="font-semibold text-sm text-studio-primary truncate">
                        {inv.projectName} · {inv.clientName}
                      </h3>

                      <p className="text-xs text-studio-secondary truncate">
                        {inv.items[0]?.description}
                      </p>
                    </div>

                    <div className="flex items-center gap-6 justify-between md:justify-end border-t md:border-t-0 pt-3 md:pt-0 border-studio-border/50">
                      <div className="text-left md:text-right">
                        <p className="text-[10px] text-studio-muted uppercase tracking-wider">Grand Total (Incl. GST)</p>
                        <p className="font-bold text-sm text-studio-primary">
                          {formatCurrency(inv.grandTotal)}
                        </p>
                        <p className="text-[10px] text-emerald-400">
                          Paid: {formatCurrency(inv.paidAmount)}
                        </p>
                      </div>

                      <div className="flex items-center gap-2">
                        <a
                          href={waShareUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="p-2 rounded-lg bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-400 border border-emerald-500/20 transition-colors"
                          title="Share Tax Invoice via WhatsApp"
                        >
                          <Share2 className="w-4 h-4" />
                        </a>

                        <Link
                          href={`/invoice/${inv.id}`}
                          target="_blank"
                          className="p-2 rounded-lg bg-studio-surface hover:bg-studio-surface/80 text-studio-secondary hover:text-studio-primary border border-studio-border transition-colors"
                          title="View / Print Tax Invoice"
                        >
                          <ExternalLink className="w-4 h-4" />
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
