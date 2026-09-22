"use client";

import React from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import {
  FileCheck,
  ArrowLeft,
  Calendar,
  IndianRupee,
  Share2,
  ExternalLink,
  Printer,
  CheckCircle2,
  Clock,
  MapPin,
  ShieldCheck,
  Building,
  User,
  Phone,
  Mail,
  Copy,
  Check,
} from "lucide-react";
import { useStudio } from "@/lib/store/store-context";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { createWhatsAppShareUrl, generateWhatsAppMessage } from "@/lib/whatsapp/templates";
import { formatCurrency, formatDate } from "@/lib/utils";

export default function ContractDetailPage() {
  const params = useParams();
  const contractId = params.id as string;
  const { state } = useStudio();
  const { contracts, studio } = state;

  const [copied, setCopied] = React.useState(false);

  const contract = contracts.find((c) => c.id === contractId);

  if (!contract) {
    return (
      <div className="text-center py-16 space-y-3">
        <FileCheck className="w-10 h-10 text-studio-muted mx-auto opacity-50" />
        <h2 className="text-base font-semibold text-studio-primary">Agreement Not Found</h2>
        <p className="text-xs text-studio-secondary">The requested contract does not exist or has been removed.</p>
        <Link href="/dashboard/contracts">
          <Button size="sm" variant="outline" className="text-xs mt-2 border-studio-border">
            Back to Contracts
          </Button>
        </Link>
      </div>
    );
  }

  const publicSignUrl = `${typeof window !== "undefined" ? window.location.origin : ""}/contract/${contract.id}`;

  const waShareUrl = createWhatsAppShareUrl(
    contract.clientPhone,
    generateWhatsAppMessage("contract_sign", {
      clientName: contract.clientName,
      clientPhone: contract.clientPhone,
      studioName: studio.name,
      projectName: contract.projectName,
      contractNumber: contract.contractNumber,
      contractUrl: publicSignUrl,
    })
  );

  const handleCopyLink = () => {
    navigator.clipboard.writeText(publicSignUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="space-y-6 max-w-4xl mx-auto pb-12">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <Link
            href="/dashboard/contracts"
            className="p-1.5 rounded-lg border border-studio-border bg-studio-card/60 hover:bg-studio-card text-studio-secondary hover:text-studio-primary transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
          </Link>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-lg font-bold tracking-tight text-studio-primary">
                {contract.contractNumber}
              </h1>
              <Badge
                variant={
                  contract.status === "signed"
                    ? "success"
                    : contract.status === "sent"
                    ? "warning"
                    : "outline"
                }
                className="text-[10px] capitalize"
              >
                {contract.status === "signed" ? "Digitally Signed" : contract.status}
              </Badge>
            </div>
            <p className="text-xs text-studio-secondary mt-0.5">
              {contract.projectName} · {contract.clientName}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2 flex-wrap">
          <Button
            size="sm"
            variant="outline"
            onClick={() => window.print()}
            className="text-xs border-studio-border gap-1.5 h-8"
          >
            <Printer className="w-3.5 h-3.5" />
            <span>Print</span>
          </Button>

          <Button
            size="sm"
            variant="outline"
            onClick={handleCopyLink}
            className="text-xs border-studio-border gap-1.5 h-8"
          >
            {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
            <span>{copied ? "Copied" : "Copy Link"}</span>
          </Button>

          <Link href={`/contract/${contract.id}`} target="_blank">
            <Button size="sm" variant="outline" className="text-xs border-studio-border gap-1.5 h-8">
              <ExternalLink className="w-3.5 h-3.5" />
              <span>Public Sign View</span>
            </Button>
          </Link>

          {contract.status !== "signed" && (
            <a href={waShareUrl} target="_blank" rel="noopener noreferrer">
              <Button size="sm" className="bg-emerald-600 hover:bg-emerald-500 text-white text-xs gap-1.5 h-8 shadow-sm">
                <Share2 className="w-3.5 h-3.5" />
                <span>Send WhatsApp</span>
              </Button>
            </a>
          )}
        </div>
      </div>

      {/* Signature Banner */}
      {contract.status === "signed" ? (
        <div className="p-4 rounded-xl bg-emerald-500/10 border border-emerald-500/20 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-lg bg-emerald-500/20 flex items-center justify-center text-emerald-400">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <div>
              <h4 className="text-xs font-semibold text-emerald-400">Digitally Executed & Validated</h4>
              <p className="text-[11px] text-studio-secondary">
                Signed by <strong className="text-studio-primary">{contract.signedByName}</strong> on{" "}
                {contract.signedAt ? formatDate(contract.signedAt) : "Verified Date"}.
              </p>
            </div>
          </div>
          {contract.signatureDataUrl && (
            <div className="bg-studio-surface p-2 rounded-lg border border-studio-border max-w-[140px]">
              <img src={contract.signatureDataUrl} alt="Signature" className="h-8 object-contain" />
            </div>
          )}
        </div>
      ) : (
        <div className="p-4 rounded-xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-lg bg-amber-500/20 flex items-center justify-center text-amber-400">
              <Clock className="w-5 h-5" />
            </div>
            <div>
              <h4 className="text-xs font-semibold text-amber-400">Awaiting Client Signature</h4>
              <p className="text-[11px] text-studio-secondary">
                Share the public link with {contract.clientName} to complete the digital signing.
              </p>
            </div>
          </div>
          <a href={waShareUrl} target="_blank" rel="noopener noreferrer">
            <Button size="sm" variant="outline" className="text-xs border-amber-500/30 text-amber-400 hover:bg-amber-500/10 h-8">
              Remind on WhatsApp
            </Button>
          </a>
        </div>
      )}

      {/* Contract Preview Card */}
      <Card className="bg-studio-card/60 border-studio-border/80">
        <CardContent className="p-6 sm:p-8 space-y-6">
          {/* Header */}
          <div className="border-b border-studio-border/80 pb-6 flex flex-col sm:flex-row sm:items-start justify-between gap-4">
            <div>
              <span className="text-[10px] font-mono tracking-wider uppercase text-studio-accent font-semibold">
                UIKEY AI Studio Service Agreement
              </span>
              <h2 className="text-xl font-bold text-studio-primary mt-1">
                Photography & Cinematography Contract
              </h2>
              <p className="text-xs text-studio-secondary mt-0.5">
                Contract Ref: <span className="font-mono text-studio-primary">{contract.contractNumber}</span>
              </p>
            </div>

            <div className="text-left sm:text-right text-xs space-y-0.5 text-studio-secondary">
              <p className="font-semibold text-studio-primary">{studio.name}</p>
              <p>{studio.city} · {studio.serviceArea}</p>
              <p>{studio.phone}</p>
              <p>{studio.email}</p>
            </div>
          </div>

          {/* Parties */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 p-4 rounded-xl bg-studio-surface/50 border border-studio-border/60">
            <div className="space-y-1">
              <p className="text-[10px] font-medium text-studio-muted uppercase tracking-wider">Service Provider</p>
              <p className="text-xs font-semibold text-studio-primary">{studio.name}</p>
              <p className="text-xs text-studio-secondary">Representative: {studio.ownerName}</p>
              <p className="text-xs text-studio-secondary">UPI: {studio.upiId}</p>
            </div>

            <div className="space-y-1">
              <p className="text-[10px] font-medium text-studio-muted uppercase tracking-wider">Client</p>
              <p className="text-xs font-semibold text-studio-primary">{contract.clientName}</p>
              <p className="text-xs text-studio-secondary">Phone: {contract.clientPhone}</p>
              <p className="text-xs text-studio-secondary">Email: {contract.clientEmail}</p>
            </div>
          </div>

          {/* Shoot Details */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="p-3.5 rounded-lg bg-studio-surface/40 border border-studio-border/60">
              <p className="text-[10px] text-studio-muted uppercase">Shoot Dates</p>
              <p className="text-xs font-semibold text-studio-primary mt-1 flex items-center gap-1.5">
                <Calendar className="w-3.5 h-3.5 text-studio-accent" />
                <span>{contract.eventDates.join(", ")}</span>
              </p>
            </div>

            <div className="p-3.5 rounded-lg bg-studio-surface/40 border border-studio-border/60">
              <p className="text-[10px] text-studio-muted uppercase">Total Agreed Fee</p>
              <p className="text-xs font-bold text-studio-primary mt-1">
                {formatCurrency(contract.totalAmount)}
              </p>
            </div>

            <div className="p-3.5 rounded-lg bg-studio-surface/40 border border-studio-border/60">
              <p className="text-[10px] text-studio-muted uppercase">Booking Advance</p>
              <p className="text-xs font-bold text-emerald-400 mt-1">
                {formatCurrency(contract.advanceAmount)}
              </p>
            </div>
          </div>

          {/* Deliverables */}
          <div className="space-y-2">
            <h4 className="text-xs font-bold uppercase tracking-wider text-studio-primary">
              Contracted Deliverables
            </h4>
            <div className="grid grid-cols-1 gap-1.5">
              {contract.deliverables.map((item, idx) => (
                <div key={idx} className="flex items-center gap-2 text-xs text-studio-secondary">
                  <CheckCircle2 className="w-3.5 h-3.5 text-studio-accent shrink-0" />
                  <span>{item}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Key Policies */}
          <div className="space-y-3 pt-2">
            <h4 className="text-xs font-bold uppercase tracking-wider text-studio-primary">
              Special Stipulations & Policies
            </h4>
            <div className="space-y-2 text-xs">
              <div className="p-3 rounded-lg bg-studio-surface/40 border border-studio-border/50">
                <strong className="text-studio-primary block mb-0.5">RAW Camera Negatives:</strong>
                <p className="text-studio-secondary leading-relaxed">{contract.rawFilesPolicy}</p>
              </div>

              <div className="p-3 rounded-lg bg-studio-surface/40 border border-studio-border/50">
                <strong className="text-studio-primary block mb-0.5">Crew Hospitality:</strong>
                <p className="text-studio-secondary leading-relaxed">{contract.travelTerms}</p>
              </div>

              <div className="p-3 rounded-lg bg-studio-surface/40 border border-studio-border/50">
                <strong className="text-studio-primary block mb-0.5">Cancellation & Postponement:</strong>
                <p className="text-studio-secondary leading-relaxed">{contract.cancellationPolicy}</p>
              </div>
            </div>
          </div>

          {/* Full Clauses */}
          <div className="space-y-3 pt-2">
            <h4 className="text-xs font-bold uppercase tracking-wider text-studio-primary">
              General Terms & Conditions
            </h4>
            <div className="space-y-2 text-xs">
              {contract.clauses.map((clause) => (
                <div key={clause.id} className="p-3 rounded-lg bg-studio-surface/20 border border-studio-border/40 space-y-1">
                  <span className="font-semibold text-studio-primary block text-[11px]">{clause.title}</span>
                  <p className="text-studio-secondary text-[11px] leading-relaxed">{clause.content}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Signatures Footer */}
          <div className="pt-6 border-t border-studio-border/80 grid grid-cols-1 sm:grid-cols-2 gap-8">
            <div className="space-y-2">
              <p className="text-[10px] text-studio-muted uppercase">For the Studio</p>
              <div className="h-14 border-b border-dashed border-studio-border flex items-end pb-1 font-serif italic text-studio-accent text-lg">
                {studio.ownerName}
              </div>
              <p className="text-[11px] text-studio-secondary">Authorized Signatory · {studio.name}</p>
            </div>

            <div className="space-y-2">
              <p className="text-[10px] text-studio-muted uppercase">For the Client</p>
              <div className="h-14 border-b border-dashed border-studio-border flex items-end pb-1">
                {contract.status === "signed" ? (
                  contract.signatureDataUrl ? (
                    <img src={contract.signatureDataUrl} alt="Signature" className="h-10 object-contain" />
                  ) : (
                    <span className="font-serif italic text-emerald-400 text-lg">
                      {contract.signedByName}
                    </span>
                  )
                ) : (
                  <span className="text-xs text-amber-400 italic">Pending Digital Signature</span>
                )}
              </div>
              <p className="text-[11px] text-studio-secondary">
                {contract.status === "signed"
                  ? `${contract.signedByName} (${contract.signedAt ? formatDate(contract.signedAt) : ""})`
                  : contract.clientName}
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
