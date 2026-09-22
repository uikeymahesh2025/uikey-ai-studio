"use client";

import React from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import {
  Receipt,
  Printer,
  Share2,
  ArrowLeft,
  CheckCircle2,
  Calendar,
  IndianRupee,
  Building,
  Camera,
} from "lucide-react";
import { useStudio } from "@/lib/store/store-context";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { formatCurrency, formatDate } from "@/lib/utils";
import { createWhatsAppShareUrl, generateWhatsAppMessage } from "@/lib/whatsapp/templates";

export default function PublicInvoicePage() {
  const params = useParams();
  const invoiceId = params.id as string;
  const { state } = useStudio();
  const { invoices, studio } = state;

  const invoice = invoices.find((inv) => inv.id === invoiceId);

  if (!invoice) {
    return (
      <div className="min-h-screen bg-studio-bg flex items-center justify-center p-4">
        <div className="text-center space-y-3 max-w-md">
          <Receipt className="w-12 h-12 text-studio-muted mx-auto opacity-50" />
          <h2 className="text-lg font-bold text-studio-primary">Invoice Not Found</h2>
          <p className="text-xs text-studio-secondary">
            The requested invoice does not exist or has been removed.
          </p>
        </div>
      </div>
    );
  }

  const publicInvoiceUrl = `${typeof window !== "undefined" ? window.location.origin : ""}/invoice/${invoice.id}`;
  const waShareUrl = createWhatsAppShareUrl(
    invoice.clientPhone,
    generateWhatsAppMessage("tax_invoice", {
      clientName: invoice.clientName,
      clientPhone: invoice.clientPhone,
      studioName: studio.name,
      projectName: invoice.projectName,
      invoiceNumber: invoice.invoiceNumber,
      amountDue: formatCurrency(invoice.grandTotal),
      invoiceUrl: publicInvoiceUrl,
    })
  );

  return (
    <div className="min-h-screen bg-studio-bg text-studio-primary py-8 px-4 sm:px-6">
      <div className="max-w-3xl mx-auto space-y-6">
        {/* Top Action Bar (Hidden on print) */}
        <div className="print:hidden flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-studio-border/70 pb-4">
          <Link
            href="/dashboard/invoices"
            className="inline-flex items-center gap-1.5 text-xs text-studio-secondary hover:text-studio-primary transition-colors"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Back to Invoices</span>
          </Link>

          <div className="flex items-center gap-2">
            <Button
              size="sm"
              variant="outline"
              onClick={() => window.print()}
              className="text-xs border-studio-border gap-1.5 h-8 bg-studio-card"
            >
              <Printer className="w-3.5 h-3.5" />
              <span>Print / Download PDF</span>
            </Button>

            <a href={waShareUrl} target="_blank" rel="noopener noreferrer">
              <Button size="sm" className="bg-emerald-600 hover:bg-emerald-500 text-white text-xs gap-1.5 h-8">
                <Share2 className="w-3.5 h-3.5" />
                <span>Share WhatsApp</span>
              </Button>
            </a>
          </div>
        </div>

        {/* Printable Invoice Card */}
        <div className="bg-white text-zinc-900 rounded-xl p-8 sm:p-10 shadow-lg border border-zinc-200 print:border-none print:shadow-none print:p-0">
          {/* Header */}
          <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-6 border-b border-zinc-200 pb-6">
            <div>
              <div className="flex items-center gap-2 mb-2">
                <div className="w-8 h-8 rounded-lg bg-zinc-900 text-white flex items-center justify-center">
                  <Camera className="w-4 h-4" />
                </div>
                <h1 className="text-xl font-bold tracking-tight text-zinc-900">{studio.name}</h1>
              </div>
              <p className="text-xs text-zinc-600">{studio.ownerName} · {studio.city}</p>
              <p className="text-xs text-zinc-600">{studio.serviceArea}</p>
              <p className="text-xs text-zinc-600">Phone: {studio.phone}</p>
              <p className="text-xs text-zinc-600">Email: {studio.email}</p>
              <p className="text-xs text-zinc-600 font-mono mt-1">GSTIN: 27AABCU1234F1Z5 · PAN: AABCU1234F</p>
            </div>

            <div className="text-left sm:text-right space-y-1">
              <span className="inline-block px-3 py-1 rounded bg-zinc-100 font-bold text-xs uppercase tracking-wider text-zinc-800">
                Tax Invoice / Receipt
              </span>
              <h2 className="text-lg font-mono font-bold text-zinc-900 mt-1">{invoice.invoiceNumber}</h2>
              <p className="text-xs text-zinc-600">
                Date: <strong>{formatDate(invoice.createdAt)}</strong>
              </p>
              <p className="text-xs text-zinc-600">
                Status: <strong className="text-emerald-700 uppercase">{invoice.status}</strong>
              </p>
            </div>
          </div>

          {/* Billed To & Project Details */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 py-6 border-b border-zinc-200 text-xs">
            <div className="space-y-1">
              <p className="font-semibold text-zinc-500 uppercase tracking-wider text-[10px]">Billed To:</p>
              <p className="font-bold text-sm text-zinc-900">{invoice.clientName}</p>
              {invoice.clientAddress && <p className="text-zinc-600">{invoice.clientAddress}</p>}
              <p className="text-zinc-600">Phone: {invoice.clientPhone}</p>
              <p className="text-zinc-600">Email: {invoice.clientEmail}</p>
            </div>

            <div className="space-y-1 sm:text-right">
              <p className="font-semibold text-zinc-500 uppercase tracking-wider text-[10px]">Assignment Details:</p>
              <p className="font-bold text-zinc-900">{invoice.projectName}</p>
              <p className="text-zinc-600">Service Category: Photography & Cinematography</p>
              <p className="text-zinc-600 font-mono">SAC Code: 998381</p>
            </div>
          </div>

          {/* Line Items Table */}
          <div className="py-6 border-b border-zinc-200">
            <table className="w-full text-xs">
              <thead>
                <tr className="border-b border-zinc-200 text-zinc-600 text-[11px] uppercase tracking-wider">
                  <th className="text-left py-2.5 font-semibold">Description</th>
                  <th className="text-center py-2.5 font-semibold">SAC</th>
                  <th className="text-center py-2.5 font-semibold">Qty</th>
                  <th className="text-right py-2.5 font-semibold">Unit Price</th>
                  <th className="text-right py-2.5 font-semibold">Total</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-zinc-100">
                {invoice.items.map((item) => (
                  <tr key={item.id} className="text-zinc-800">
                    <td className="py-3 pr-4 font-medium">{item.description}</td>
                    <td className="py-3 text-center font-mono text-zinc-600">{item.sacCode}</td>
                    <td className="py-3 text-center">{item.quantity}</td>
                    <td className="py-3 text-right font-mono">{formatCurrency(item.unitPrice)}</td>
                    <td className="py-3 text-right font-mono font-semibold">{formatCurrency(item.totalPrice)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Calculation & Tax Summary */}
          <div className="py-6 border-b border-zinc-200 flex flex-col sm:flex-row justify-between gap-6 text-xs">
            <div className="space-y-2 flex-1">
              <p className="font-semibold text-zinc-500 uppercase tracking-wider text-[10px]">Settlement / Bank Details</p>
              <div className="p-3 rounded-lg bg-zinc-50 border border-zinc-200 space-y-1 text-zinc-700 text-[11px]">
                <p><strong>Bharat UPI VPA:</strong> <span className="font-mono">{invoice.upiId}</span></p>
                <p><strong>Bank:</strong> {invoice.bankDetails.bankName}</p>
                <p><strong>Account Name:</strong> {invoice.bankDetails.accountName}</p>
                <p><strong>Account Number:</strong> <span className="font-mono">{invoice.bankDetails.accountNumber}</span></p>
                <p><strong>IFSC Code:</strong> <span className="font-mono">{invoice.bankDetails.ifscCode}</span> ({invoice.bankDetails.branch})</p>
              </div>
            </div>

            <div className="w-full sm:w-64 space-y-2 text-zinc-800">
              <div className="flex justify-between py-1">
                <span className="text-zinc-600">Subtotal:</span>
                <span className="font-mono font-medium">{formatCurrency(invoice.subtotal)}</span>
              </div>
              {invoice.includeGst && (
                <>
                  <div className="flex justify-between py-1 text-zinc-600">
                    <span>CGST (9%):</span>
                    <span className="font-mono">{formatCurrency(invoice.cgstAmount)}</span>
                  </div>
                  <div className="flex justify-between py-1 text-zinc-600">
                    <span>SGST (9%):</span>
                    <span className="font-mono">{formatCurrency(invoice.sgstAmount)}</span>
                  </div>
                </>
              )}
              <div className="flex justify-between py-2 border-t-2 border-zinc-900 text-sm font-bold text-zinc-900">
                <span>Grand Total:</span>
                <span className="font-mono">{formatCurrency(invoice.grandTotal)}</span>
              </div>
              <div className="flex justify-between py-1 text-emerald-700 font-semibold">
                <span>Amount Paid:</span>
                <span className="font-mono">{formatCurrency(invoice.paidAmount)}</span>
              </div>
              {invoice.balanceDue > 0 ? (
                <div className="flex justify-between py-1 text-amber-700 font-bold border-t border-zinc-200">
                  <span>Balance Due:</span>
                  <span className="font-mono">{formatCurrency(invoice.balanceDue)}</span>
                </div>
              ) : (
                <div className="p-2 rounded bg-emerald-50 text-emerald-800 text-center font-bold text-[11px] mt-1 border border-emerald-200">
                  ✓ PAID IN FULL
                </div>
              )}
            </div>
          </div>

          {/* Notes & Authorized Signatory */}
          <div className="pt-6 flex flex-col sm:flex-row justify-between items-end gap-6 text-xs text-zinc-600">
            <div className="space-y-1 max-w-sm">
              <p className="font-semibold text-zinc-900">Terms & Conditions:</p>
              <p className="text-[11px] leading-relaxed">{invoice.terms}</p>
              <p className="text-[11px] text-zinc-500 mt-2 italic">{invoice.notes}</p>
            </div>

            <div className="text-center space-y-1 sm:text-right">
              <div className="h-12 border-b border-dashed border-zinc-300 flex items-end justify-center sm:justify-end pb-1 font-serif italic text-zinc-900 text-lg">
                {studio.ownerName}
              </div>
              <p className="font-semibold text-zinc-900">Authorized Signatory</p>
              <p className="text-[10px] text-zinc-500">{studio.name}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
