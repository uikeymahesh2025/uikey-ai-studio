"use client";

import React, { useState } from "react";
import Link from "next/link";
import {
  CreditCard,
  CheckCircle2,
  XCircle,
  Clock,
  Eye,
  ExternalLink,
  ShieldCheck,
  Search,
  AlertCircle,
  FileCheck,
  Lock,
  Unlock,
} from "lucide-react";
import { DashboardLayout } from "@/components/layout/dashboard-layout";
import { useStudio } from "@/lib/store/store-context";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import { formatINR, formatDate } from "@/lib/utils";
import { Payment } from "@/lib/types";

export default function PaymentsDeskPage() {
  const { state, verifyPayment, rejectPayment } = useStudio();
  const { payments, studio } = state;

  const [searchQuery, setSearchQuery] = useState("");
  const [selectedReceipt, setSelectedReceipt] = useState<Payment | null>(null);
  const [rejectingPayment, setRejectingPayment] = useState<Payment | null>(null);
  const [rejectReason, setRejectReason] = useState("");

  const pendingPayments = payments.filter((p) => p.status === "UTR submitted" || p.status === "Pending");
  const verifiedPayments = payments.filter((p) => p.status === "Verified");

  const filteredPayments = payments.filter(
    (p) =>
      p.clientName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.projectName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (p.utrNumber && p.utrNumber.includes(searchQuery))
  );

  const totalCollected = verifiedPayments.reduce((acc, p) => acc + p.amount, 0);
  const totalPendingVerification = pendingPayments.reduce((acc, p) => acc + p.amount, 0);

  const handleVerify = (paymentId: string) => {
    verifyPayment(paymentId);
    setSelectedReceipt(null);
  };

  const handleRejectConfirm = () => {
    if (!rejectingPayment) return;
    rejectPayment(rejectingPayment.id, rejectReason);
    setRejectingPayment(null);
    setRejectReason("");
  };

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 border-b border-studio-border/60 pb-5">
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-xl font-bold tracking-tight text-studio-primary">
                Manual UPI & UTR Verification Desk
              </h1>
              <Badge variant="success" className="text-[10px]">
                Zero Gateway Fees
              </Badge>
            </div>
            <p className="text-xs text-studio-secondary mt-1">
              Verify client 12-digit UTR numbers and payment receipts to automatically unlock high-resolution deliverables.
            </p>
          </div>

          <div className="flex items-center gap-2">
            <Badge variant="outline" className="font-mono text-xs py-1">
              UPI VPA: {studio.upiId}
            </Badge>
          </div>
        </div>

        {/* Top Metric Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <Card>
            <CardContent className="p-4">
              <span className="text-[11px] text-studio-muted">Pending UTR Verification</span>
              <div className="text-xl font-bold text-studio-warning font-mono mt-0.5">
                {formatINR(totalPendingVerification)}
              </div>
              <span className="text-[10px] text-studio-muted">
                {pendingPayments.length} transactions waiting for approval
              </span>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4">
              <span className="text-[11px] text-studio-muted">Verified Season Collections</span>
              <div className="text-xl font-bold text-studio-success font-mono mt-0.5">
                {formatINR(totalCollected)}
              </div>
              <span className="text-[10px] text-studio-success">
                Direct to Studio Current Account
              </span>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4">
              <span className="text-[11px] text-studio-muted">Automated Deliverables Lock</span>
              <div className="text-xs font-semibold text-studio-primary mt-1">
                Active & Enforced
              </div>
              <span className="text-[10px] text-studio-muted">
                Unlocks original master downloads on verification
              </span>
            </CardContent>
          </Card>
        </div>

        {/* Search */}
        <div className="relative max-w-sm">
          <Search className="absolute left-3 top-2.5 h-3.5 w-3.5 text-studio-muted" />
          <Input
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search by client, project, or UTR..."
            className="pl-9"
          />
        </div>

        {/* Payments Table / Cards / Empty State */}
        {filteredPayments.length === 0 ? (
          <div className="rounded-xl border border-dashed border-studio-border bg-studio-surface/40 p-12 text-center">
            <div className="mx-auto mb-3 flex h-10 w-10 items-center justify-center rounded-xl bg-studio-card text-studio-muted border border-studio-border">
              <Search className="h-5 w-5" />
            </div>
            <h3 className="text-sm font-bold text-studio-primary">No payments found</h3>
            <p className="text-xs text-studio-muted mt-1 max-w-sm mx-auto">
              No payments match &quot;{searchQuery}&quot;. Try checking the spelling, project name, or 12-digit UTR reference number.
            </p>
            {searchQuery && (
              <div className="mt-4">
                <Button
                  onClick={() => setSearchQuery("")}
                  variant="outline"
                  size="sm"
                  className="text-xs"
                >
                  Clear search
                </Button>
              </div>
            )}
          </div>
        ) : (
          <div className="space-y-3">
            {filteredPayments.map((p) => {
              const isPending = p.status === "UTR submitted" || p.status === "Pending";
              return (
                <Card
                  key={p.id}
                  className={`transition-all ${
                    isPending ? "border-studio-warning/40 bg-studio-card" : "border-studio-border bg-studio-surface/30"
                  }`}
                >
                  <CardContent className="p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                    <div className="space-y-1">
                      <div className="flex items-center gap-2.5">
                        <span className="text-sm font-bold text-studio-primary">
                          {p.projectName}
                        </span>
                        <Badge
                          variant={
                            p.status === "Verified"
                              ? "success"
                              : p.status === "Rejected"
                              ? "error"
                              : "warning"
                          }
                        >
                          {p.status}
                        </Badge>
                      </div>
                      <p className="text-xs text-studio-secondary">
                        {p.clientName} · {p.milestoneTitle}
                      </p>
                      <div className="flex flex-wrap items-center gap-3 text-[11px] text-studio-muted pt-1">
                        <span>Submitted: {formatDate(p.submittedAt || p.createdAt)}</span>
                        {p.utrNumber && (
                          <span className="font-mono bg-studio-surface px-1.5 py-0.5 rounded border border-studio-border text-studio-primary">
                            UTR: {p.utrNumber}
                          </span>
                        )}
                      </div>
                    </div>

                    <div className="flex items-center gap-4">
                      <div className="text-right">
                        <div className="text-base font-bold font-mono text-studio-primary">
                          {formatINR(p.amount)}
                        </div>
                        <span className="text-[10px] text-studio-muted">
                          {p.upiId}
                        </span>
                      </div>

                      <div className="flex items-center gap-2">
                        {p.receiptUrl && (
                          <Button
                            onClick={() => setSelectedReceipt(p)}
                            variant="outline"
                            size="sm"
                            className="h-8 text-xs gap-1 text-studio-secondary"
                          >
                            <Eye className="w-3.5 h-3.5" />
                            <span>Slip</span>
                          </Button>
                        )}

                        {isPending && (
                          <>
                            <Button
                              onClick={() => setRejectingPayment(p)}
                              variant="ghost"
                              size="sm"
                              className="h-8 text-xs text-studio-error hover:bg-studio-error/10"
                            >
                              Reject
                            </Button>
                            <Button
                              onClick={() => handleVerify(p.id)}
                              variant="accent"
                              size="sm"
                              className="h-8 text-xs gap-1 font-semibold"
                            >
                              <CheckCircle2 className="w-3.5 h-3.5" />
                              <span>Verify & Unlock</span>
                            </Button>
                          </>
                        )}

                        <Link href={`/payment/${p.id}`} target="_blank">
                          <Button variant="ghost" size="sm" className="h-8 text-xs p-2 text-studio-muted">
                            <ExternalLink className="w-3.5 h-3.5" />
                          </Button>
                        </Link>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        )}
      </div>

      {/* Receipt Screenshot Modal */}
      {selectedReceipt && (
        <Dialog open={Boolean(selectedReceipt)} onOpenChange={(open) => !open && setSelectedReceipt(null)}>
          <DialogContent onClose={() => setSelectedReceipt(null)} className="max-w-md">
            <DialogHeader>
              <DialogTitle>Payment Receipt & Verification</DialogTitle>
              <DialogDescription>
                {selectedReceipt.clientName} · {formatINR(selectedReceipt.amount)} (UTR: {selectedReceipt.utrNumber})
              </DialogDescription>
            </DialogHeader>

            <div className="space-y-3">
              <div className="rounded-lg overflow-hidden border border-studio-border bg-black aspect-[3/4] flex items-center justify-center">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={selectedReceipt.receiptUrl}
                  alt="Receipt screenshot"
                  className="w-full h-full object-contain"
                />
              </div>

              {selectedReceipt.internalNote && (
                <p className="text-xs text-studio-muted italic">
                  Note: {selectedReceipt.internalNote}
                </p>
              )}
            </div>

            <DialogFooter>
              <Button
                variant="outline"
                onClick={() => setSelectedReceipt(null)}
              >
                Close
              </Button>
              {selectedReceipt.status !== "Verified" && (
                <Button
                  variant="accent"
                  onClick={() => handleVerify(selectedReceipt.id)}
                  className="gap-1.5"
                >
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  <span>Verify Payment & Unlock</span>
                </Button>
              )}
            </DialogFooter>
          </DialogContent>
        </Dialog>
      )}

      {/* Reject Payment Modal */}
      {rejectingPayment && (
        <Dialog open={Boolean(rejectingPayment)} onOpenChange={(open) => !open && setRejectingPayment(null)}>
          <DialogContent onClose={() => setRejectingPayment(null)} className="max-w-md">
            <DialogHeader>
              <DialogTitle>Decline UTR Submission</DialogTitle>
              <DialogDescription>
                Mark this payment as rejected. The client will be asked to resubmit a valid UTR number.
              </DialogDescription>
            </DialogHeader>

            <div>
              <label className="block text-xs font-medium text-studio-secondary mb-1">
                Reason for Rejection
              </label>
              <Input
                value={rejectReason}
                onChange={(e) => setRejectReason(e.target.value)}
                placeholder="e.g. UTR not reflected in HDFC current account..."
                required
              />
            </div>

            <DialogFooter>
              <Button
                variant="outline"
                onClick={() => setRejectingPayment(null)}
              >
                Cancel
              </Button>
              <Button
                variant="danger"
                onClick={handleRejectConfirm}
              >
                Confirm Rejection
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      )}
    </DashboardLayout>
  );
}
