"use client";

import React from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import {
  ArrowLeft,
  ExternalLink,
  MessageSquare,
  Printer,
  Share2,
  CheckCircle2,
  XCircle,
  Clock,
  FileText,
  Copy,
} from "lucide-react";
import { DashboardLayout } from "@/components/layout/dashboard-layout";
import { useStudio } from "@/lib/store/store-context";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { formatINR, formatDate } from "@/lib/utils";
import { QuotationStatus } from "@/lib/types";
import { createWhatsAppShareUrl, generateWhatsAppMessage } from "@/lib/whatsapp/templates";

export default function QuotationDetailPage() {
  const params = useParams();
  const quoteId = params.id as string;

  const { state, updateQuotationStatus } = useStudio();
  const { quotations, studio } = state;

  const quote = quotations.find((q) => q.id === quoteId);

  if (!quote) {
    return (
      <DashboardLayout>
        <div className="text-center py-20">
          <p className="text-sm text-studio-muted">Quotation not found.</p>
          <Link href="/dashboard/quotations" className="mt-4 inline-block">
            <Button variant="outline" size="sm">
              Back to Quotations
            </Button>
          </Link>
        </div>
      </DashboardLayout>
    );
  }

  const appUrl = typeof window !== "undefined" ? window.location.origin : "http://localhost:3000";
  const publicQuoteUrl = `${appUrl}/quote/${quote.id}`;

  const waMessage = generateWhatsAppMessage("new_quotation", {
    clientName: quote.clientName,
    clientPhone: quote.clientPhone,
    studioName: studio.name,
    projectName: quote.projectName,
    quoteTotal: formatINR(quote.grandTotal),
    quoteUrl: publicQuoteUrl,
  });

  const handlePrintPdf = () => {
    window.print();
  };

  const copyPublicLink = () => {
    navigator.clipboard.writeText(publicQuoteUrl);
    alert("Quotation link copied to clipboard!");
  };

  return (
    <DashboardLayout>
      <div className="max-w-4xl mx-auto space-y-6">
        {/* Header & Actions */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 border-b border-studio-border/60 pb-5">
          <div className="flex items-center gap-3">
            <Link href="/dashboard/quotations">
              <Button variant="outline" size="iconSm">
                <ArrowLeft className="w-3.5 h-3.5" />
              </Button>
            </Link>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-xl font-bold tracking-tight text-studio-primary">
                  {quote.projectName}
                </h1>
                <Badge variant={quote.status === "Accepted" ? "success" : "accent"}>
                  {quote.status}
                </Badge>
              </div>
              <p className="text-xs text-studio-secondary mt-0.5">
                Client: {quote.clientName} ({quote.clientPhone}) · Valid until {formatDate(quote.validUntil)}
              </p>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <Button onClick={copyPublicLink} variant="outline" size="sm" className="gap-1.5 text-xs">
              <Copy className="w-3.5 h-3.5" />
              <span>Copy Link</span>
            </Button>

            <Button onClick={handlePrintPdf} variant="outline" size="sm" className="gap-1.5 text-xs">
              <Printer className="w-3.5 h-3.5" />
              <span>Download PDF</span>
            </Button>

            <a
              href={createWhatsAppShareUrl(quote.clientPhone, waMessage)}
              target="_blank"
              rel="noreferrer"
            >
              <Button variant="whatsapp" size="sm" className="gap-1.5 text-xs">
                <MessageSquare className="w-3.5 h-3.5" />
                <span>Share on WhatsApp</span>
              </Button>
            </a>

            <Link href={`/quote/${quote.id}`} target="_blank">
              <Button variant="accent" size="sm" className="gap-1 text-xs">
                <span>Client View</span>
                <ExternalLink className="w-3 h-3" />
              </Button>
            </Link>
          </div>
        </div>

        {/* Printable Proposal Card */}
        <Card className="border-studio-border bg-studio-card shadow-2xl p-6 sm:p-10 space-y-8">
          {/* Studio Brand & Quote Meta */}
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-studio-border/60 pb-6">
            <div>
              <h2 className="text-lg font-bold text-studio-primary">{studio.name}</h2>
              <p className="text-xs text-studio-secondary mt-0.5">
                {studio.ownerName} · {studio.city} · {studio.phone}
              </p>
              <p className="text-[11px] text-studio-muted mt-0.5">UPI ID: {studio.upiId}</p>
            </div>

            <div className="sm:text-right">
              <span className="text-xs font-mono text-studio-accent font-semibold block">
                PROPOSAL #{quote.id.toUpperCase()}
              </span>
              <p className="text-xs text-studio-secondary mt-0.5">
                Date: {formatDate(quote.createdAt)}
              </p>
              <p className="text-[11px] text-studio-muted">
                Valid Until: {formatDate(quote.validUntil)}
              </p>
            </div>
          </div>

          {/* Client & Event Info Box */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 bg-studio-surface/50 p-4 rounded-lg border border-studio-border/50 text-xs">
            <div>
              <span className="text-studio-muted block mb-1">Prepared For:</span>
              <strong className="text-sm text-studio-primary block">{quote.clientName}</strong>
              <span className="text-studio-secondary block mt-0.5">{quote.clientPhone}</span>
              <span className="text-studio-secondary block">{quote.clientEmail}</span>
            </div>
            <div>
              <span className="text-studio-muted block mb-1">Event Details:</span>
              <strong className="text-sm text-studio-primary block">{quote.eventType}</strong>
              <span className="text-studio-secondary block mt-0.5">Date: {formatDate(quote.eventDate)}</span>
              <span className="text-studio-secondary block">Venue: {quote.venue}</span>
            </div>
          </div>

          {/* Line items table */}
          <div>
            <h3 className="text-xs font-semibold text-studio-primary uppercase tracking-wider mb-3">
              Deliverables & Inclusions
            </h3>
            <div className="border border-studio-border rounded-lg overflow-hidden">
              <table className="w-full text-left text-xs">
                <thead className="bg-studio-surface/80 border-b border-studio-border text-studio-muted font-medium">
                  <tr>
                    <th className="py-2.5 px-4">Item & Description</th>
                    <th className="py-2.5 px-3 text-center">Category</th>
                    <th className="py-2.5 px-3 text-center">Qty</th>
                    <th className="py-2.5 px-3 text-right">Price</th>
                    <th className="py-2.5 px-4 text-right">Total</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-studio-border/50 text-studio-primary">
                  {quote.items.map((item) => (
                    <tr key={item.id} className="hover:bg-studio-surface/30">
                      <td className="py-3 px-4 font-medium">{item.description}</td>
                      <td className="py-3 px-3 text-center text-studio-secondary">{item.category}</td>
                      <td className="py-3 px-3 text-center text-studio-secondary">{item.quantity}</td>
                      <td className="py-3 px-3 text-right font-mono text-studio-secondary">
                        {formatINR(item.unitPrice)}
                      </td>
                      <td className="py-3 px-4 text-right font-mono font-medium">
                        {formatINR(item.totalPrice)}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Pricing Totals */}
          <div className="flex justify-end">
            <div className="w-full sm:w-72 space-y-2 text-xs">
              <div className="flex justify-between text-studio-secondary">
                <span>Subtotal:</span>
                <span className="font-mono text-studio-primary">{formatINR(quote.subtotal)}</span>
              </div>

              {quote.discountAmount > 0 && (
                <div className="flex justify-between text-studio-success">
                  <span>Courtesy Discount:</span>
                  <span className="font-mono">-{formatINR(quote.discountAmount)}</span>
                </div>
              )}

              {quote.includeGst && (
                <div className="flex justify-between text-studio-secondary">
                  <span>18% GST (CGST + SGST):</span>
                  <span className="font-mono">+{formatINR(quote.gstAmount)}</span>
                </div>
              )}

              <div className="flex justify-between text-sm font-bold text-studio-primary border-t border-studio-border pt-2">
                <span>Grand Total:</span>
                <span className="font-mono text-studio-accent">{formatINR(quote.grandTotal)}</span>
              </div>

              <div className="flex justify-between text-xs font-semibold text-studio-success border-t border-studio-border/50 pt-2">
                <span>Booking Advance:</span>
                <span className="font-mono">{formatINR(quote.advanceAmount)}</span>
              </div>
            </div>
          </div>

          {/* Milestones Schedule */}
          <div>
            <h3 className="text-xs font-semibold text-studio-primary uppercase tracking-wider mb-3">
              Payment Schedule & Milestones
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              {quote.milestones.map((m, idx) => (
                <div
                  key={m.title}
                  className="p-3 rounded-lg border border-studio-border bg-studio-surface/50 text-xs space-y-1"
                >
                  <span className="text-[10px] text-studio-accent font-mono font-bold block">
                    MILESTONE {idx + 1} ({m.percentage}%)
                  </span>
                  <p className="font-medium text-studio-primary">{m.title}</p>
                  <p className="text-sm font-bold font-mono text-studio-primary mt-1">
                    {formatINR(m.amount)}
                  </p>
                  <span className="text-[10px] text-studio-muted block">
                    Status: {m.status === "paid" ? "✅ Received" : "Pending"}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Terms */}
          {quote.terms && (
            <div className="border-t border-studio-border/60 pt-4 text-xs text-studio-muted">
              <span className="font-semibold text-studio-secondary block mb-1">
                Terms & Conditions
              </span>
              <p className="whitespace-pre-line leading-relaxed">{quote.terms}</p>
            </div>
          )}
        </Card>
      </div>
    </DashboardLayout>
  );
}
