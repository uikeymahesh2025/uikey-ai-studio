"use client";

import React, { useState, useRef } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import {
  FileCheck,
  Calendar,
  IndianRupee,
  ShieldCheck,
  CheckCircle2,
  Lock,
  Camera,
  Share2,
  Printer,
  ChevronDown,
  ChevronUp,
} from "lucide-react";
import { useStudio } from "@/lib/store/store-context";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { formatCurrency, formatDate } from "@/lib/utils";
import { createWhatsAppShareUrl } from "@/lib/whatsapp/templates";
import confetti from "canvas-confetti";

export default function PublicContractSignPage() {
  const params = useParams();
  const contractId = params.id as string;
  const { state, signContract } = useStudio();
  const { contracts, studio } = state;

  const contract = contracts.find((c) => c.id === contractId);

  const [signMethod, setSignMethod] = useState<"typed" | "drawn">("typed");
  const [typedName, setTypedName] = useState(contract?.clientName || "");
  const [phoneConfirm, setPhoneConfirm] = useState(contract?.clientPhone || "");
  const [agreedToTerms, setAgreedToTerms] = useState(false);
  const [isSigning, setIsSigning] = useState(false);
  const [justSigned, setJustSigned] = useState(false);
  const [showAllClauses, setShowAllClauses] = useState(false);

  // Canvas drawing state
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [isDrawing, setIsDrawing] = useState(false);

  if (!contract) {
    return (
      <div className="min-h-screen bg-studio-bg flex items-center justify-center p-4">
        <div className="text-center space-y-3 max-w-md">
          <FileCheck className="w-12 h-12 text-studio-muted mx-auto opacity-50" />
          <h2 className="text-lg font-bold text-studio-primary">Agreement Not Found</h2>
          <p className="text-xs text-studio-secondary">
            This agreement link is invalid, expired, or has been removed. Please contact {studio.name}.
          </p>
        </div>
      </div>
    );
  }

  const isSigned = contract.status === "signed" || justSigned;

  const handleStartDraw = (e: React.MouseEvent<HTMLCanvasElement> | React.TouchEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    setIsDrawing(true);
    ctx.strokeStyle = "#C4B5FD";
    ctx.lineWidth = 2.5;
    ctx.lineCap = "round";

    const rect = canvas.getBoundingClientRect();
    const x = "touches" in e ? e.touches[0].clientX - rect.left : e.clientX - rect.left;
    const y = "touches" in e ? e.touches[0].clientY - rect.top : e.clientY - rect.top;
    ctx.beginPath();
    ctx.moveTo(x, y);
  };

  const handleDraw = (e: React.MouseEvent<HTMLCanvasElement> | React.TouchEvent<HTMLCanvasElement>) => {
    if (!isDrawing) return;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const rect = canvas.getBoundingClientRect();
    const x = "touches" in e ? e.touches[0].clientX - rect.left : e.clientX - rect.left;
    const y = "touches" in e ? e.touches[0].clientY - rect.top : e.clientY - rect.top;
    ctx.lineTo(x, y);
    ctx.stroke();
  };

  const handleEndDraw = () => {
    setIsDrawing(false);
  };

  const clearCanvas = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (ctx) {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
    }
  };

  const handleSignSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!agreedToTerms) return;

    setIsSigning(true);

    let signatureDataUrl = "";
    if (signMethod === "drawn" && canvasRef.current) {
      signatureDataUrl = canvasRef.current.toDataURL("image/png");
    } else {
      // Generate typed SVG data URL
      signatureDataUrl = `data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='250' height='60'><text x='10' y='42' font-family='serif' font-style='italic' font-size='26' fill='%23C4B5FD'>${encodeURIComponent(typedName)}</text></svg>`;
    }

    signContract(contract.id, {
      signedByName: typedName || contract.clientName,
      signatureDataUrl,
      clientIp: "Verified Client Browser Session",
    });

    setJustSigned(true);
    setIsSigning(false);

    confetti({
      particleCount: 120,
      spread: 80,
      origin: { y: 0.6 },
    });
  };

  const waNotifyPhotographerMsg = `Hi ${studio.ownerName} ji! 👋\n\nI have reviewed and digitally signed the Photography Agreement for *${contract.projectName}*.\n\nLooking forward to working together!\n\nBest regards,\n${contract.signedByName || typedName || contract.clientName}`;
  const waNotifyPhotographerUrl = createWhatsAppShareUrl(studio.whatsappNumber || studio.phone, waNotifyPhotographerMsg);

  return (
    <div className="min-h-screen bg-studio-bg text-studio-primary py-8 px-4 sm:px-6">
      <div className="max-w-3xl mx-auto space-y-6">
        {/* Studio Brand Header */}
        <div className="flex items-center justify-between border-b border-studio-border/70 pb-4">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-studio-card border border-studio-border flex items-center justify-center text-studio-accent">
              <Camera className="w-4 h-4" />
            </div>
            <div>
              <h2 className="text-sm font-bold text-studio-primary">{studio.name}</h2>
              <p className="text-[11px] text-studio-secondary">{studio.city} · {studio.serviceArea}</p>
            </div>
          </div>

          <Badge variant={isSigned ? "success" : "warning"} className="text-[10px]">
            {isSigned ? "Agreement Signed" : "Signature Required"}
          </Badge>
        </div>

        {/* Signed Success Banner */}
        {isSigned && (
          <div className="p-5 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-center space-y-3">
            <div className="w-12 h-12 rounded-full bg-emerald-500/20 flex items-center justify-center text-emerald-400 mx-auto">
              <CheckCircle2 className="w-6 h-6" />
            </div>
            <div>
              <h3 className="text-base font-bold text-emerald-400">
                Agreement Officially Executed & Confirmed
              </h3>
              <p className="text-xs text-studio-secondary mt-1">
                Thank you, {contract.signedByName || typedName}! Your shoot dates are officially confirmed on the studio calendar.
              </p>
            </div>

            <div className="pt-2 flex items-center justify-center gap-3 flex-wrap">
              <a href={waNotifyPhotographerUrl} target="_blank" rel="noopener noreferrer">
                <Button size="sm" className="bg-emerald-600 hover:bg-emerald-500 text-white text-xs gap-1.5 h-8">
                  <Share2 className="w-3.5 h-3.5" />
                  <span>Notify Photographer on WhatsApp</span>
                </Button>
              </a>

              <Button
                size="sm"
                variant="outline"
                onClick={() => window.print()}
                className="text-xs border-studio-border gap-1.5 h-8"
              >
                <Printer className="w-3.5 h-3.5" />
                <span>Print Agreement</span>
              </Button>
            </div>
          </div>
        )}

        {/* Main Agreement Card */}
        <Card className="bg-studio-card/70 border-studio-border/80 shadow-md">
          <CardContent className="p-6 sm:p-8 space-y-6">
            {/* Title */}
            <div className="space-y-1">
              <span className="text-[10px] font-mono tracking-wider uppercase text-studio-accent font-semibold">
                Contract Ref: {contract.contractNumber}
              </span>
              <h1 className="text-xl sm:text-2xl font-bold text-studio-primary">
                Photography & Videography Agreement
              </h1>
              <p className="text-xs text-studio-secondary">
                Prepared by <strong className="text-studio-primary">{studio.name}</strong> for{" "}
                <strong className="text-studio-primary">{contract.clientName}</strong>.
              </p>
            </div>

            {/* Shoot Overview Box */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 p-4 rounded-xl bg-studio-surface/60 border border-studio-border/70">
              <div>
                <p className="text-[10px] font-medium text-studio-muted uppercase">Shoot Dates</p>
                <p className="text-xs font-semibold text-studio-primary mt-0.5 flex items-center gap-1">
                  <Calendar className="w-3 h-3 text-studio-accent" />
                  <span>{contract.eventDates.join(", ")}</span>
                </p>
              </div>

              <div>
                <p className="text-[10px] font-medium text-studio-muted uppercase">Agreed Fee</p>
                <p className="text-xs font-bold text-studio-primary mt-0.5">
                  {formatCurrency(contract.totalAmount)}
                </p>
              </div>

              <div>
                <p className="text-[10px] font-medium text-studio-muted uppercase">Booking Advance</p>
                <p className="text-xs font-bold text-emerald-400 mt-0.5">
                  {formatCurrency(contract.advanceAmount)}
                </p>
              </div>
            </div>

            {/* Deliverables Scope */}
            <div className="space-y-2">
              <h3 className="text-xs font-bold uppercase tracking-wider text-studio-primary">
                Contracted Deliverables
              </h3>
              <div className="space-y-1.5">
                {contract.deliverables.map((item, idx) => (
                  <div key={idx} className="flex items-start gap-2 text-xs text-studio-secondary">
                    <CheckCircle2 className="w-3.5 h-3.5 text-studio-accent shrink-0 mt-0.5" />
                    <span>{item}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Essential Policies */}
            <div className="space-y-3 pt-2">
              <h3 className="text-xs font-bold uppercase tracking-wider text-studio-primary">
                Key Policies & Delivery Stipulations
              </h3>
              <div className="space-y-2 text-xs">
                <div className="p-3 rounded-lg bg-studio-surface/40 border border-studio-border/60">
                  <strong className="text-studio-primary block mb-0.5">RAW Files Policy:</strong>
                  <p className="text-studio-secondary leading-relaxed">{contract.rawFilesPolicy}</p>
                </div>

                <div className="p-3 rounded-lg bg-studio-surface/40 border border-studio-border/60">
                  <strong className="text-studio-primary block mb-0.5">Crew Hospitality:</strong>
                  <p className="text-studio-secondary leading-relaxed">{contract.travelTerms}</p>
                </div>

                <div className="p-3 rounded-lg bg-studio-surface/40 border border-studio-border/60">
                  <strong className="text-studio-primary block mb-0.5">Cancellation Policy:</strong>
                  <p className="text-studio-secondary leading-relaxed">{contract.cancellationPolicy}</p>
                </div>
              </div>
            </div>

            {/* Expandable Terms & Conditions */}
            <div className="space-y-2 pt-2">
              <button
                type="button"
                onClick={() => setShowAllClauses(!showAllClauses)}
                className="w-full flex items-center justify-between p-3 rounded-lg bg-studio-surface/40 border border-studio-border/60 text-xs font-semibold text-studio-primary hover:bg-studio-surface/70 transition-colors"
              >
                <span>Full Terms & General Legal Clauses ({contract.clauses.length})</span>
                {showAllClauses ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
              </button>

              {showAllClauses && (
                <div className="space-y-2 pt-1 text-xs">
                  {contract.clauses.map((clause) => (
                    <div key={clause.id} className="p-3 rounded-lg bg-studio-surface/20 border border-studio-border/40 space-y-1">
                      <span className="font-semibold text-studio-primary block text-[11px]">{clause.title}</span>
                      <p className="text-studio-secondary text-[11px] leading-relaxed">{clause.content}</p>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Signature Section */}
            {!isSigned ? (
              <form onSubmit={handleSignSubmit} className="pt-6 border-t border-studio-border/80 space-y-5">
                <div>
                  <h3 className="text-sm font-bold text-studio-primary flex items-center gap-2">
                    <ShieldCheck className="w-4 h-4 text-studio-accent" />
                    <span>Digital Signature & Execution</span>
                  </h3>
                  <p className="text-xs text-studio-secondary mt-0.5">
                    Legally valid electronic signature in accordance with the Information Technology Act.
                  </p>
                </div>

                {/* Method selector */}
                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => setSignMethod("typed")}
                    className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${
                      signMethod === "typed"
                        ? "bg-studio-accent text-studio-bg font-semibold"
                        : "bg-studio-surface text-studio-secondary border border-studio-border"
                    }`}
                  >
                    Type Legal Name
                  </button>
                  <button
                    type="button"
                    onClick={() => setSignMethod("drawn")}
                    className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${
                      signMethod === "drawn"
                        ? "bg-studio-accent text-studio-bg font-semibold"
                        : "bg-studio-surface text-studio-secondary border border-studio-border"
                    }`}
                  >
                    Draw Signature
                  </button>
                </div>

                {signMethod === "typed" ? (
                  <div className="space-y-2">
                    <label className="text-xs font-medium text-studio-secondary block">
                      Type Your Full Legal Name
                    </label>
                    <Input
                      value={typedName}
                      onChange={(e) => setTypedName(e.target.value)}
                      placeholder="e.g. Rohan Kapoor"
                      className="bg-studio-surface border-studio-border text-sm h-10"
                      required
                    />
                    {typedName && (
                      <div className="p-3 rounded-lg bg-studio-surface border border-dashed border-studio-accent/40 text-center">
                        <span className="font-serif italic text-2xl text-studio-accent tracking-wide">
                          {typedName}
                        </span>
                        <p className="text-[10px] text-studio-muted mt-1">Generated digital sign representation</p>
                      </div>
                    )}
                  </div>
                ) : (
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <label className="text-xs font-medium text-studio-secondary block">
                        Draw signature with your mouse or fingertip
                      </label>
                      <button
                        type="button"
                        onClick={clearCanvas}
                        className="text-[11px] text-rose-400 hover:underline"
                      >
                        Clear Canvas
                      </button>
                    </div>
                    <canvas
                      ref={canvasRef}
                      width={500}
                      height={120}
                      onMouseDown={handleStartDraw}
                      onMouseMove={handleDraw}
                      onMouseUp={handleEndDraw}
                      onMouseLeave={handleEndDraw}
                      onTouchStart={handleStartDraw}
                      onTouchMove={handleDraw}
                      onTouchEnd={handleEndDraw}
                      className="w-full h-28 bg-studio-surface rounded-lg border border-studio-border cursor-crosshair touch-none"
                    />
                  </div>
                )}

                {/* Phone Confirmation */}
                <div className="space-y-1.5">
                  <label className="text-xs font-medium text-studio-secondary block">
                    Mobile Number for OTP / Audit Record
                  </label>
                  <Input
                    value={phoneConfirm}
                    onChange={(e) => setPhoneConfirm(e.target.value)}
                    placeholder="+91 98200 11223"
                    className="bg-studio-surface border-studio-border text-xs h-9"
                    required
                  />
                </div>

                {/* Checkbox */}
                <label className="flex items-start gap-2.5 text-xs text-studio-secondary cursor-pointer select-none">
                  <input
                    type="checkbox"
                    checked={agreedToTerms}
                    onChange={(e) => setAgreedToTerms(e.target.checked)}
                    className="rounded border-studio-border bg-studio-surface text-studio-accent mt-0.5"
                    required
                  />
                  <span>
                    I confirm that I am authorized to enter this agreement. I have reviewed and agree to the deliverables, 14-day proofing timeline, and RAW files policy.
                  </span>
                </label>

                {/* Submit button */}
                <Button
                  type="submit"
                  disabled={!agreedToTerms || isSigning}
                  className="w-full bg-studio-accent text-studio-bg hover:bg-studio-accent/90 font-semibold text-xs h-10 shadow-sm disabled:opacity-50"
                >
                  {isSigning ? "Recording Electronic Signature..." : "Accept & Digitally Sign Agreement"}
                </Button>
              </form>
            ) : (
              <div className="pt-6 border-t border-studio-border/80 flex flex-col sm:flex-row items-center justify-between gap-4">
                <div className="space-y-0.5">
                  <p className="text-[10px] text-studio-muted uppercase">Digital Execution Audit</p>
                  <p className="text-xs font-semibold text-studio-primary">
                    Signed by: {contract.signedByName || typedName}
                  </p>
                  <p className="text-[11px] text-studio-secondary">
                    Timestamp: {contract.signedAt ? formatDate(contract.signedAt) : formatDate(new Date().toISOString())}
                  </p>
                </div>

                <div className="p-2 rounded-lg bg-studio-surface border border-studio-border">
                  {contract.signatureDataUrl ? (
                    <img src={contract.signatureDataUrl} alt="Signature" className="h-9 object-contain" />
                  ) : (
                    <span className="font-serif italic text-studio-accent text-xl px-2">
                      {contract.signedByName || typedName}
                    </span>
                  )}
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
