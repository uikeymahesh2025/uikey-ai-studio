"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import {
  FileCheck,
  ArrowLeft,
  Calendar,
  IndianRupee,
  ShieldCheck,
  Plus,
  Trash2,
  Send,
  Building,
} from "lucide-react";
import { useStudio } from "@/lib/store/store-context";
import { DEFAULT_CONTRACT_CLAUSES } from "@/lib/store/demo-store";
import { ContractClause } from "@/lib/types";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

export default function NewContractPage() {
  const router = useRouter();
  const { state, addContract } = useStudio();
  const { projects, clients } = state;

  const [selectedProjectId, setSelectedProjectId] = useState<string>(projects[0]?.id || "");
  const [contractNumber, setContractNumber] = useState(`CON-${new Date().getFullYear()}-${String(state.contracts.length + 1).padStart(3, "0")}`);
  const [totalAmount, setTotalAmount] = useState<number>(180000);
  const [advanceAmount, setAdvanceAmount] = useState<number>(36000);
  const [eventDatesText, setEventDatesText] = useState("2026-11-20, 2026-11-21");
  const [venuesText, setVenuesText] = useState("JW Marriott, Juhu, Mumbai");
  const [deliverablesText, setDeliverablesText] = useState(
    "Traditional & Candid Photography (2 Photographers)\nCinematic 4K Wedding Highlight Film (3-5 mins)\nFull Length Wedding Film (45 mins)\nFlush-Mount Premium Leatherette Album (40 sheets, 12x36)\nHigh-Resolution Color Graded Master JPEGs on Cloud Drive\nWatermarked Online Proofing Gallery for Selection"
  );
  const [rawFilesPolicy, setRawFilesPolicy] = useState(
    "Uncompressed RAW camera digital negative files are proprietary archival assets of the Studio. Only color-corrected, high-resolution master JPEGs are provided to the Client."
  );
  const [travelTerms, setTravelTerms] = useState(
    "Hot meals and drinking water to be provided by Client for all crew members during events exceeding 4 continuous hours."
  );
  const [cancellationPolicy, setCancellationPolicy] = useState(
    "The 20% booking advance is strictly non-refundable. Rescheduling is permitted once with 30-day prior written notice, subject to date availability."
  );
  const [clauses, setClauses] = useState<ContractClause[]>(DEFAULT_CONTRACT_CLAUSES);

  const selectedProject = projects.find((p) => p.id === selectedProjectId);
  const selectedClient = clients.find((c) => c.id === selectedProject?.clientId);

  const handleProjectChange = (projId: string) => {
    setSelectedProjectId(projId);
    const proj = projects.find((p) => p.id === projId);
    if (proj) {
      setTotalAmount(proj.quotationAmount || 150000);
      setAdvanceAmount(Math.round((proj.quotationAmount || 150000) * 0.2));
      setEventDatesText(proj.eventDate);
      setVenuesText(proj.venue);
    }
  };

  const handleCreate = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedProject || !selectedClient) return;

    const deliverables = deliverablesText
      .split("\n")
      .map((d) => d.trim())
      .filter(Boolean);

    const eventDates = eventDatesText
      .split(",")
      .map((d) => d.trim())
      .filter(Boolean);

    const venues = venuesText
      .split(",")
      .map((v) => v.trim())
      .filter(Boolean);

    const created = addContract({
      contractNumber,
      projectId: selectedProject.id,
      projectName: selectedProject.name,
      clientId: selectedClient.id,
      clientName: selectedClient.name,
      clientPhone: selectedClient.whatsappNumber || selectedClient.phone,
      clientEmail: selectedClient.email,
      status: "sent",
      totalAmount: Number(totalAmount),
      advanceAmount: Number(advanceAmount),
      eventDates,
      venues,
      deliverables,
      rawFilesPolicy,
      travelTerms,
      cancellationPolicy,
      clauses,
    });

    router.push(`/dashboard/contracts/${created.id}`);
  };

  return (
    <div className="space-y-6 max-w-4xl mx-auto pb-12">
      {/* Top Header */}
      <div className="flex items-center gap-3">
        <Link
          href="/dashboard/contracts"
          className="p-1.5 rounded-lg border border-studio-border bg-studio-card/60 hover:bg-studio-card text-studio-secondary hover:text-studio-primary transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
        </Link>
        <div>
          <h1 className="text-xl font-bold tracking-tight text-studio-primary flex items-center gap-2">
            <FileCheck className="w-5 h-5 text-studio-accent" />
            <span>Generate Photography Service Agreement</span>
          </h1>
          <p className="text-xs text-studio-secondary">
            Draft a clear contract with standard Indian wedding clauses and send for client digital signature.
          </p>
        </div>
      </div>

      <form onSubmit={handleCreate} className="space-y-6">
        {/* Project & Client Selection */}
        <Card className="bg-studio-card/60 border-studio-border/80">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-semibold text-studio-primary">
              1. Project & Client Association
            </CardTitle>
            <CardDescription className="text-xs text-studio-muted">
              Select the shoot or project this agreement applies to.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="text-xs font-medium text-studio-secondary mb-1.5 block">
                  Select Project / Shoot
                </label>
                <select
                  value={selectedProjectId}
                  onChange={(e) => handleProjectChange(e.target.value)}
                  className="w-full h-9 rounded-lg bg-studio-surface border border-studio-border px-3 text-xs text-studio-primary focus:outline-none focus:border-studio-accent"
                  required
                >
                  {projects.map((p) => (
                    <option key={p.id} value={p.id}>
                      {p.name} ({p.clientName} · {p.eventType})
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="text-xs font-medium text-studio-secondary mb-1.5 block">
                  Agreement Number
                </label>
                <Input
                  value={contractNumber}
                  onChange={(e) => setContractNumber(e.target.value)}
                  className="bg-studio-surface border-studio-border text-xs h-9 font-mono"
                  required
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="text-xs font-medium text-studio-secondary mb-1.5 block">
                  Shoot Dates (Comma separated)
                </label>
                <Input
                  value={eventDatesText}
                  onChange={(e) => setEventDatesText(e.target.value)}
                  placeholder="2026-11-20, 2026-11-21"
                  className="bg-studio-surface border-studio-border text-xs h-9"
                  required
                />
              </div>

              <div>
                <label className="text-xs font-medium text-studio-secondary mb-1.5 block">
                  Venues & Locations
                </label>
                <Input
                  value={venuesText}
                  onChange={(e) => setVenuesText(e.target.value)}
                  placeholder="The Taj Mahal Palace, Mumbai"
                  className="bg-studio-surface border-studio-border text-xs h-9"
                  required
                />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Commercials & Advance */}
        <Card className="bg-studio-card/60 border-studio-border/80">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-semibold text-studio-primary">
              2. Commercials & Advance Requirement
            </CardTitle>
            <CardDescription className="text-xs text-studio-muted">
              Define the total agreed fee and advance milestone required to confirm dates.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="text-xs font-medium text-studio-secondary mb-1.5 block">
                  Total Agreed Contract Value (₹)
                </label>
                <Input
                  type="number"
                  value={totalAmount}
                  onChange={(e) => {
                    const val = Number(e.target.value);
                    setTotalAmount(val);
                    setAdvanceAmount(Math.round(val * 0.2));
                  }}
                  className="bg-studio-surface border-studio-border text-xs h-9 font-semibold"
                  required
                />
              </div>

              <div>
                <label className="text-xs font-medium text-studio-secondary mb-1.5 block">
                  Booking Advance Required (₹)
                </label>
                <Input
                  type="number"
                  value={advanceAmount}
                  onChange={(e) => setAdvanceAmount(Number(e.target.value))}
                  className="bg-studio-surface border-studio-border text-xs h-9 font-semibold text-emerald-400"
                  required
                />
                <span className="text-[10px] text-studio-muted mt-1 block">
                  Recommended: 20% to lock reservation on studio calendar.
                </span>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Deliverables Scope */}
        <Card className="bg-studio-card/60 border-studio-border/80">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-semibold text-studio-primary">
              3. Deliverables Scope
            </CardTitle>
            <CardDescription className="text-xs text-studio-muted">
              List all deliverables line-by-line that the client will receive.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Textarea
              rows={6}
              value={deliverablesText}
              onChange={(e) => setDeliverablesText(e.target.value)}
              className="bg-studio-surface border-studio-border text-xs leading-relaxed"
              required
            />
          </CardContent>
        </Card>

        {/* Standard Indian Wedding Policies */}
        <Card className="bg-studio-card/60 border-studio-border/80">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-semibold text-studio-primary flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-studio-accent" />
              <span>4. Essential Policies & Terms</span>
            </CardTitle>
            <CardDescription className="text-xs text-studio-muted">
              Pre-composed standard clauses protecting both the studio and the client.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <label className="text-xs font-medium text-studio-secondary mb-1.5 block">
                RAW Files Policy
              </label>
              <Textarea
                rows={2}
                value={rawFilesPolicy}
                onChange={(e) => setRawFilesPolicy(e.target.value)}
                className="bg-studio-surface border-studio-border text-xs"
              />
            </div>

            <div>
              <label className="text-xs font-medium text-studio-secondary mb-1.5 block">
                Crew Hospitality & Meals
              </label>
              <Textarea
                rows={2}
                value={travelTerms}
                onChange={(e) => setTravelTerms(e.target.value)}
                className="bg-studio-surface border-studio-border text-xs"
              />
            </div>

            <div>
              <label className="text-xs font-medium text-studio-secondary mb-1.5 block">
                Postponement & Cancellation Terms
              </label>
              <Textarea
                rows={2}
                value={cancellationPolicy}
                onChange={(e) => setCancellationPolicy(e.target.value)}
                className="bg-studio-surface border-studio-border text-xs"
              />
            </div>
          </CardContent>
        </Card>

        {/* Standard Clauses List */}
        <Card className="bg-studio-card/60 border-studio-border/80">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-semibold text-studio-primary">
              5. Legal Clauses ({clauses.length} Included)
            </CardTitle>
            <CardDescription className="text-xs text-studio-muted">
              Included in the digital agreement document presented to client.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            {clauses.map((clause, index) => (
              <div
                key={clause.id}
                className="p-3 rounded-lg bg-studio-surface/60 border border-studio-border/60 space-y-1"
              >
                <div className="flex items-center justify-between">
                  <span className="text-xs font-semibold text-studio-primary">
                    {clause.title}
                  </span>
                  {clause.isRequired && (
                    <Badge variant="outline" className="text-[9px] border-studio-accent/30 text-studio-accent">
                      Mandatory
                    </Badge>
                  )}
                </div>
                <p className="text-[11px] text-studio-secondary leading-relaxed">
                  {clause.content}
                </p>
              </div>
            ))}
          </CardContent>
        </Card>

        {/* Submit Button */}
        <div className="flex items-center justify-end gap-3 pt-2">
          <Link href="/dashboard/contracts">
            <Button type="button" variant="outline" size="sm" className="text-xs border-studio-border">
              Cancel
            </Button>
          </Link>
          <Button
            type="submit"
            size="sm"
            className="bg-studio-accent text-studio-bg hover:bg-studio-accent/90 gap-1.5 font-medium text-xs px-5 shadow-sm"
          >
            <Send className="w-3.5 h-3.5" />
            <span>Save & Generate Agreement</span>
          </Button>
        </div>
      </form>
    </div>
  );
}
