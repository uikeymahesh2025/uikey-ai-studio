"use client";

import React, { useState } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import {
  Camera,
  CheckCircle2,
  Copy,
  CreditCard,
  ExternalLink,
  Lock,
  MessageSquare,
  ShieldCheck,
  Upload,
  Smartphone,
  AlertCircle,
} from "lucide-react";
import { useStudio } from "@/lib/store/store-context";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { formatINR, formatDate } from "@/lib/utils";
import { QRCodeSVG } from "qrcode.react";
import confetti from "canvas-confetti";

export default function PublicClientPaymentPage() {
  const params = useParams();
  const paymentId = params.id as string;

  const { state, submitPaymentUTR } = useStudio();
  const { payments, studio } = state;

  const payment = payments.find((p) => p.id === paymentId) || payments[0];

  const [utrInput, setUtrInput] = useState(payment?.utrNumber || "");
  const [receiptUploaded, setReceiptUploaded] = useState(Boolean(payment?.receiptUrl));
  const [submittedSuccess, setSubmittedSuccess] = useState(
    payment?.status === "UTR submitted" || payment?.status === "Verified"
  );
  const [errorMsg, setErrorMsg] = useState("");

  if (!payment) {
    return (
      <div className="min-h-screen bg-studio-bg flex items-center justify-center p-4">
        <div className="text-center">
          <p className="text-sm text-studio-muted">Payment record not found.</p>
        </div>
      </div>
    );
  }

  // Bharat UPI Deep Link Protocol
  const upiDeepLink = `upi://pay?pa=${encodeURIComponent(studio.upiId)}&pn=${encodeURIComponent(
    studio.name
  )}&am=${payment.amount}&cu=INR&tn=${encodeURIComponent(
    payment.projectName.substring(0, 20)
  )}`;

  const handleCopyUpi = () => {
    navigator.clipboard.writeText(studio.upiId);
    alert(`Copied UPI ID: ${studio.upiId}`);
  };

  const handleUtrSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const cleanUtr = utrInput.trim().replace(/[^0-9A-Za-z]/g, "");

    if (cleanUtr.length < 8) {
      setErrorMsg("Please enter a valid 12-digit UPI UTR / Transaction Reference number.");
      return;
    }

    setErrorMsg("");
    submitPaymentUTR(payment.id, cleanUtr);
    setSubmittedSuccess(true);
    confetti({
      particleCount: 90,
      spread: 60,
      origin: { y: 0.6 },
    });
  };

  return (
    <div className="min-h-screen bg-studio-bg text-studio-primary py-8 sm:py-12 px-4 sm:px-6 selection:bg-studio-accent selection:text-studio-bg">
      <div className="max-w-md mx-auto space-y-6">
        {/* Studio Branding */}
        <div className="text-center space-y-2">
          <div className="inline-flex h-10 w-10 items-center justify-center rounded-xl bg-studio-card border border-studio-border text-studio-accent shadow-sm">
            <Camera className="h-5 w-5" />
          </div>
          <div>
            <h1 className="text-lg font-bold text-studio-primary">{studio.name}</h1>
            <p className="text-xs text-studio-secondary">
              Direct Bharat UPI Payment Desk
            </p>
          </div>
        </div>

        {/* Payment Confirmation Card */}
        <Card className="border-studio-border bg-studio-card shadow-2xl p-6 space-y-6">
          {/* Amount Due Badge */}
          <div className="text-center p-4 rounded-xl bg-studio-surface/80 border border-studio-border/60">
            <span className="text-[11px] text-studio-muted block">Amount Payable</span>
            <span className="text-3xl font-extrabold text-studio-primary font-mono block mt-1">
              {formatINR(payment.amount)}
            </span>
            <span className="text-xs text-studio-accent font-medium mt-1 block">
              {payment.projectName} · {payment.milestoneTitle}
            </span>
          </div>

          {/* Dynamic UPI QR Code */}
          <div className="flex flex-col items-center justify-center p-5 rounded-xl border border-studio-border bg-white text-black shadow-inner">
            <QRCodeSVG
              value={upiDeepLink}
              size={180}
              level="H"
              includeMargin={false}
            />
            <p className="text-[11px] font-mono font-bold text-zinc-700 mt-3 text-center">
              Scan with GPay, PhonePe, Paytm or BHIM
            </p>
          </div>

          {/* Direct UPI Intent Link & Copy VPA */}
          <div className="space-y-2 text-xs">
            <div className="flex items-center justify-between p-2.5 rounded-lg border border-studio-border bg-studio-surface">
              <div>
                <span className="text-[10px] text-studio-muted block">Studio UPI VPA</span>
                <span className="font-mono font-bold text-studio-primary">
                  {studio.upiId}
                </span>
              </div>
              <Button
                onClick={handleCopyUpi}
                variant="outline"
                size="sm"
                className="h-7 text-[11px] gap-1"
              >
                <Copy className="w-3 h-3" />
                <span>Copy</span>
              </Button>
            </div>

            {/* Pay via UPI App mobile button */}
            <a href={upiDeepLink} className="block sm:hidden">
              <Button variant="accent" className="w-full gap-2 font-semibold shadow-md">
                <Smartphone className="w-4 h-4" />
                <span>Pay via UPI App (GPay / PhonePe)</span>
              </Button>
            </a>
          </div>

          {/* Submission Success Banner */}
          {submittedSuccess ? (
            <div className="p-4 rounded-xl border border-studio-success/40 bg-studio-success/15 space-y-2 text-xs text-studio-success">
              <div className="flex items-center gap-2 font-bold text-sm">
                <CheckCircle2 className="w-4 h-4" />
                <span>UTR Submitted Successfully!</span>
              </div>
              <p className="text-studio-secondary leading-relaxed">
                UTR <strong>{utrInput}</strong> has been logged. {studio.name} will verify this in their bank account and unlock your master downloads.
              </p>
            </div>
          ) : (
            /* UTR Input Form */
            <form onSubmit={handleUtrSubmit} className="space-y-4 pt-2 border-t border-studio-border/60">
              <div>
                <div className="flex items-center justify-between mb-1">
                  <label className="text-xs font-semibold text-studio-primary">
                    Enter 12-Digit UTR / Ref Number
                  </label>
                  <span className="text-[10px] text-studio-muted">From payment SMS/App</span>
                </div>
                <Input
                  value={utrInput}
                  onChange={(e) => setUtrInput(e.target.value)}
                  placeholder="e.g. 426189033412"
                  className="font-mono text-sm tracking-wider"
                  required
                />
                {errorMsg && (
                  <p className="text-[11px] text-studio-error mt-1 flex items-center gap-1">
                    <AlertCircle className="w-3 h-3" />
                    {errorMsg}
                  </p>
                )}
              </div>

              {/* Receipt screenshot upload simulator */}
              <div>
                <label className="text-xs font-medium text-studio-secondary block mb-1">
                  Upload Screenshot (Optional)
                </label>
                <div className="flex items-center justify-center p-3 rounded-lg border border-dashed border-studio-border hover:border-studio-accent/40 bg-studio-surface/40 cursor-pointer text-center text-xs text-studio-muted">
                  <label className="cursor-pointer flex items-center gap-2">
                    <Upload className="w-3.5 h-3.5 text-studio-accent" />
                    <span>{receiptUploaded ? "Receipt Attached ✅" : "Attach Payment Screenshot"}</span>
                    <input
                      type="file"
                      accept="image/*"
                      className="hidden"
                      onChange={() => setReceiptUploaded(true)}
                    />
                  </label>
                </div>
              </div>

              <Button type="submit" variant="default" className="w-full font-semibold">
                Submit UTR for Verification
              </Button>
            </form>
          )}

          {/* Trust Guarantee */}
          <div className="flex items-center gap-2 text-[11px] text-studio-muted justify-center border-t border-studio-border/40 pt-4">
            <ShieldCheck className="w-3.5 h-3.5 text-studio-success" />
            <span>100% Direct Bank Transfer · Zero Middleman Fees</span>
          </div>
        </Card>
      </div>
    </div>
  );
}
