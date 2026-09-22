"use client";

import React, { useState } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import {
  Camera,
  CheckCircle2,
  XCircle,
  MessageSquare,
  Printer,
  Shield,
  CreditCard,
  ExternalLink,
} from "lucide-react";
import { useStudio } from "@/lib/store/store-context";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { formatINR, formatDate } from "@/lib/utils";
import { createWhatsAppShareUrl } from "@/lib/whatsapp/templates";
import confetti from "canvas-confetti";

export default function PublicClientQuotationPage() {
  const params = useParams();
  const quoteId = params.id as string;

  const { state, updateQuotationStatus } = useStudio();
  const { quotations, studio } = state;

  const quote = quotations.find((q) => q.id === quoteId);

  const [accepted, setAccepted] = useState(quote?.status === "Accepted");
  const [rejected, setRejected] = useState(quote?.status === "Rejected");

  if (!quote) {
    return (
      <div className="min-h-screen bg-studio-bg flex items-center justify-center p-4">
        <div className="text-center">
          <p className="text-sm text-studio-muted">Proposal not found or link expired.</p>
        </div>
      </div>
    );
  }

  const handleAccept = () => {
    updateQuotationStatus(quote.id, "Accepted");
    setAccepted(true);
    confetti({
      particleCount: 100,
      spread: 70,
      origin: { y: 0.6 },
    });
  };

  const handleReject = () => {
    if (confirm("Are you sure you want to decline this proposal?")) {
      updateQuotationStatus(quote.id, "Rejected");
      setRejected(true);
    }
  };

  const askQuestionMsg = `Namaste ${studio.ownerName} ji, I have a question regarding proposal #${quote.id.toUpperCase()} for ${quote.projectName}:`;

  return (
    <div className="min-h-screen bg-studio-bg text-studio-primary py-8 sm:py-12 px-4 sm:px-6">
      <div className="max-w-3xl mx-auto space-y-6">
        {/* Top Floating Client Action Bar */}
        <div className="rounded-xl border border-studio-border bg-studio-card/90 backdrop-blur p-4 flex flex-col sm:flex-row items-center justify-between gap-3 shadow-xl">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-studio-surface border border-studio-border flex items-center justify-center text-studio-accent">
              <Camera className="w-4 h-4" />
            </div>
            <div>
              <span className="font-bold text-xs text-studio-primary block">
                {studio.name}
              </span>
              <span className="text-[11px] text-studio-muted">
                Official Photography Proposal
              </span>
            </div>
          </div>

          <div className="flex items-center gap-2 w-full sm:w-auto justify-end">
            <Button
              onClick={() => window.print()}
              variant="outline"
              size="sm"
              className="text-xs gap-1"
            >
              <Printer className="w-3.5 h-3.5" />
              <span>PDF</span>
            </Button>

            <a
              href={createWhatsAppShareUrl(studio.whatsappNumber, askQuestionMsg)}
              target="_blank"
              rel="noreferrer"
            >
              <Button variant="whatsapp" size="sm" className="text-xs gap-1">
                <MessageSquare className="w-3.5 h-3.5" />
                <span>Ask Question</span>
              </Button>
            </a>

            {!accepted && !rejected && (
              <Button
                onClick={handleAccept}
                variant="accent"
                size="sm"
                className="text-xs gap-1 font-semibold"
              >
                <CheckCircle2 className="w-3.5 h-3.5" />
                <span>Accept Proposal</span>
              </Button>
            )}
          </div>
        </div>

        {/* Accepted Banner */}
        {accepted && (
          <div className="p-4 rounded-xl border border-studio-success/40 bg-studio-success/15 flex items-center gap-3 text-studio-success text-xs">
            <CheckCircle2 className="w-5 h-5 shrink-0" />
            <div>
              <p className="font-bold">Proposal Accepted!</p>
              <p className="text-studio-secondary mt-0.5">
                Thank you! Your shoot date is reserved. Please proceed with the booking advance via Bharat UPI to finalize dates.
              </p>
            </div>
          </div>
        )}

        {/* Main Clean Document */}
        <Card className="border-studio-border bg-studio-card p-6 sm:p-10 shadow-2xl space-y-8">
          {/* Header */}
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-studio-border/60 pb-6">
            <div>
              <h1 className="text-2xl font-bold text-studio-primary">{studio.name}</h1>
              <p className="text-xs text-studio-secondary mt-1">
                {studio.ownerName} · {studio.serviceArea}
              </p>
              <p className="text-xs text-studio-muted">WhatsApp: {studio.whatsappNumber}</p>
            </div>

            <div className="sm:text-right">
              <span className="text-xs font-mono text-studio-accent font-semibold block">
                PROPOSAL #{quote.id.toUpperCase()}
              </span>
              <span className="text-xs text-studio-muted block mt-1">
                Valid Until: {formatDate(quote.validUntil)}
              </span>
            </div>
          </div>

          {/* Client & Event Info Box */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 bg-studio-surface/50 p-4 rounded-lg border border-studio-border/50 text-xs">
            <div>
              <span className="text-studio-muted block mb-1">Prepared For:</span>
              <strong className="text-sm text-studio-primary block">{quote.clientName}</strong>
              <span className="text-studio-secondary block mt-0.5">{quote.clientPhone}</span>
            </div>
            <div>
              <span className="text-studio-muted block mb-1">Event Particulars:</span>
              <strong className="text-sm text-studio-primary block">{quote.eventType}</strong>
              <span className="text-studio-secondary block mt-0.5">Date: {formatDate(quote.eventDate)}</span>
              <span className="text-studio-secondary block">Venue: {quote.venue}</span>
            </div>
          </div>

          {/* Line items table */}
          <div>
            <h3 className="text-xs font-semibold text-studio-primary uppercase tracking-wider mb-3">
              Included Deliverables & Scope
            </h3>
            <div className="border border-studio-border rounded-lg overflow-hidden">
              <table className="w-full text-left text-xs">
                <thead className="bg-studio-surface/80 border-b border-studio-border text-studio-muted font-medium">
                  <tr>
                    <th className="py-2.5 px-4">Deliverable</th>
                    <th className="py-2.5 px-3 text-center">Category</th>
                    <th className="py-2.5 px-3 text-center">Qty</th>
                    <th className="py-2.5 px-4 text-right">Investment</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-studio-border/50 text-studio-primary">
                  {quote.items.map((item) => (
                    <tr key={item.id}>
                      <td className="py-3 px-4 font-medium">{item.description}</td>
                      <td className="py-3 px-3 text-center text-studio-secondary">{item.category}</td>
                      <td className="py-3 px-3 text-center text-studio-secondary">{item.quantity}</td>
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

              <div className="flex justify-between text-base font-bold text-studio-primary border-t border-studio-border pt-2">
                <span>Grand Total:</span>
                <span className="font-mono text-studio-accent">{formatINR(quote.grandTotal)}</span>
              </div>

              <div className="flex justify-between text-xs font-semibold text-studio-success border-t border-studio-border/50 pt-2">
                <span>Advance to Confirm Date:</span>
                <span className="font-mono">{formatINR(quote.advanceAmount)}</span>
              </div>
            </div>
          </div>

          {/* Payment Milestones */}
          <div>
            <h3 className="text-xs font-semibold text-studio-primary uppercase tracking-wider mb-3">
              Payment Milestones
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
                </div>
              ))}
            </div>
          </div>

          {/* Terms */}
          {quote.terms && (
            <div className="border-t border-studio-border/60 pt-4 text-xs text-studio-muted">
              <span className="font-semibold text-studio-secondary block mb-1">
                Terms of Engagement
              </span>
              <p className="whitespace-pre-line leading-relaxed">{quote.terms}</p>
            </div>
          )}

          {/* Bottom Accept CTA */}
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-6 border-t border-studio-border">
            <div className="text-xs text-studio-muted">
              Have a special request or customization? Message directly on WhatsApp.
            </div>

            <div className="flex items-center gap-3">
              {!accepted && !rejected && (
                <>
                  <Button onClick={handleReject} variant="ghost" size="sm" className="text-studio-muted hover:text-studio-error">
                    Decline
                  </Button>
                  <Button onClick={handleAccept} variant="accent" size="sm" className="gap-1.5 shadow-md">
                    <CheckCircle2 className="w-3.5 h-3.5" />
                    <span>Accept Proposal</span>
                  </Button>
                </>
              )}
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
}
