"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import {
  ArrowLeft,
  Plus,
  Trash2,
  FilePlus2,
  Percent,
  CheckCircle2,
  Sparkles,
} from "lucide-react";
import { DashboardLayout } from "@/components/layout/dashboard-layout";
import { useStudio } from "@/lib/store/store-context";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { formatINR } from "@/lib/utils";
import { QuotationItem, PaymentMilestone } from "@/lib/types";

export default function NewQuotationPage() {
  const router = useRouter();
  const { state, addQuotation } = useStudio();
  const { clients } = state;

  const presets = [
    { title: "Wedding Day Coverage", price: 85000, category: "Photography" },
    { title: "Pre-wedding Session", price: 18000, category: "Photography" },
    { title: "Engagement Session", price: 18000, category: "Photography" },
    { title: "Cinematic Highlight Film", price: 42000, category: "Cinematography" },
    { title: "Fine Art Heirloom Album", price: 28000, category: "Album" },
    { title: "Drone Aerial Coverage", price: 12000, category: "Drone" },
    { title: "Additional Photographer", price: 25000, category: "Crew" },
    { title: "Same-Day Social Edit", price: 20000, category: "Social" },
  ];

  const [clientId, setClientId] = useState(clients[0]?.id || "");
  const [projectName, setProjectName] = useState("");
  const [eventType, setEventType] = useState("Wedding");
  const [eventDate, setEventDate] = useState("2026-11-20");
  const [venue, setVenue] = useState("");
  const [validDays, setValidDays] = useState(14);
  const [includeGst, setIncludeGst] = useState(false);
  const [discountAmount, setDiscountAmount] = useState<number>(0);
  const [advancePercentage, setAdvancePercentage] = useState<number>(50);

  const [items, setItems] = useState<QuotationItem[]>([
    {
      id: "item-1",
      description: "Wedding Day Signature Candid Photography Coverage",
      category: "Photography",
      quantity: 1,
      unitPrice: 85000,
      totalPrice: 85000,
    },
    {
      id: "item-2",
      description: "Cinematic 4K Highlight Film (3-5 mins + Teaser)",
      category: "Cinematography",
      quantity: 1,
      unitPrice: 42000,
      totalPrice: 42000,
    },
  ]);

  const [terms, setTerms] = useState(
    "1. 50% advance to confirm booking.\n2. Raw footages remain archive of studio; curated master JPEGs delivered after final milestone.\n3. Travel and lodging covered by client outside city limits."
  );
  const [notes, setNotes] = useState("Includes personalized private proofing gallery.");

  // Computations
  const subtotal = items.reduce((acc, item) => acc + item.totalPrice, 0);
  const discount = Math.min(subtotal, Math.max(0, Number(discountAmount)));
  const taxableAmount = Math.max(0, subtotal - discount);
  const gstAmount = includeGst ? Math.round(taxableAmount * 0.18) : 0;
  const grandTotal = taxableAmount + gstAmount;
  const advanceAmount = Math.round((grandTotal * advancePercentage) / 100);
  const remainingBalance = Math.max(0, grandTotal - advanceAmount);

  const addPreset = (preset: { title: string; price: number; category: string }) => {
    const newItem: QuotationItem = {
      id: `item-${Date.now()}`,
      description: preset.title,
      category: preset.category,
      quantity: 1,
      unitPrice: preset.price,
      totalPrice: preset.price,
    };
    setItems([...items, newItem]);
  };

  const addCustomItem = () => {
    const newItem: QuotationItem = {
      id: `item-${Date.now()}`,
      description: "Custom Service / Add-on",
      category: "Custom",
      quantity: 1,
      unitPrice: 10000,
      totalPrice: 10000,
    };
    setItems([...items, newItem]);
  };

  const removeItem = (id: string) => {
    setItems(items.filter((i) => i.id !== id));
  };

  const updateItem = (id: string, field: keyof QuotationItem, value: any) => {
    setItems(
      items.map((i) => {
        if (i.id !== id) return i;
        const updated = { ...i, [field]: value };
        if (field === "quantity" || field === "unitPrice") {
          updated.totalPrice = Number(updated.quantity) * Number(updated.unitPrice);
        }
        return updated;
      })
    );
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const selectedClient = clients.find((c) => c.id === clientId);

    const validUntilDate = new Date();
    validUntilDate.setDate(validUntilDate.getDate() + validDays);

    const milestones: PaymentMilestone[] = [
      {
        title: "Booking Advance to Reserve Dates",
        percentage: advancePercentage,
        amount: advanceAmount,
        dueDate: new Date().toISOString().split("T")[0],
        status: "pending",
      },
      {
        title: "On Completion of Shoot & Proofing Gallery Release",
        percentage: Math.round((100 - advancePercentage) * 0.6),
        amount: Math.round(remainingBalance * 0.6),
        dueDate: eventDate,
        status: "pending",
      },
      {
        title: "Prior to Final High-Res Deliverables & Album Handover",
        percentage: Math.round((100 - advancePercentage) * 0.4),
        amount: Math.round(remainingBalance * 0.4),
        dueDate: eventDate,
        status: "pending",
      },
    ];

    const newQuote = addQuotation({
      clientId,
      clientName: selectedClient?.name || "Client",
      clientPhone: selectedClient?.phone || "",
      clientEmail: selectedClient?.email || "",
      projectName: projectName || `${selectedClient?.name || "Client"} · ${eventType}`,
      eventType,
      eventDate,
      venue,
      items,
      subtotal,
      discountPercentage: 0,
      discountAmount: discount,
      includeGst,
      gstRate: 18,
      gstAmount,
      grandTotal,
      advanceAmount,
      remainingBalance,
      milestones,
      status: "Sent",
      validUntil: validUntilDate.toISOString().split("T")[0],
      terms,
      notes,
    });

    router.push(`/dashboard/quotations/${newQuote.id}`);
  };

  return (
    <DashboardLayout>
      <div className="max-w-4xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex items-center gap-3">
          <Link href="/dashboard/quotations">
            <Button variant="outline" size="iconSm">
              <ArrowLeft className="w-3.5 h-3.5" />
            </Button>
          </Link>
          <div>
            <h1 className="text-xl font-bold tracking-tight text-studio-primary">
              Quotation Builder
            </h1>
            <p className="text-xs text-studio-secondary">
              Calculate line items, optional 18% GST, advance percentages, and milestone schedules.
            </p>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Client & Event Meta */}
          <Card>
            <CardHeader className="p-5 pb-3">
              <CardTitle className="text-xs font-semibold">Client & Event Info</CardTitle>
            </CardHeader>
            <CardContent className="p-5 pt-0 grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-medium text-studio-secondary mb-1">
                  Client
                </label>
                <select
                  value={clientId}
                  onChange={(e) => setClientId(e.target.value)}
                  className="w-full h-9 rounded-md border border-studio-border bg-studio-surface px-3 text-xs text-studio-primary focus:outline-none focus:border-studio-accent"
                >
                  {clients.map((c) => (
                    <option key={c.id} value={c.id}>
                      {c.name} ({c.phone})
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-medium text-studio-secondary mb-1">
                  Project / Proposal Title
                </label>
                <Input
                  value={projectName}
                  onChange={(e) => setProjectName(e.target.value)}
                  placeholder="e.g. Kapur Mehendi & Wedding Coverage"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-studio-secondary mb-1">
                  Event Date
                </label>
                <Input
                  type="date"
                  value={eventDate}
                  onChange={(e) => setEventDate(e.target.value)}
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-studio-secondary mb-1">
                  Venue
                </label>
                <Input
                  value={venue}
                  onChange={(e) => setVenue(e.target.value)}
                  placeholder="e.g. Taj Mahal Palace, Mumbai"
                  required
                />
              </div>
            </CardContent>
          </Card>

          {/* Preset Buttons Bar */}
          <Card>
            <CardHeader className="p-5 pb-2">
              <div className="flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5 text-studio-accent" />
                <CardTitle className="text-xs font-semibold">
                  Indian Photography Presets (1-Click Add)
                </CardTitle>
              </div>
              <CardDescription>
                Quickly add standardized wedding services to line items.
              </CardDescription>
            </CardHeader>
            <CardContent className="p-5 pt-0">
              <div className="flex flex-wrap gap-2">
                {presets.map((preset) => (
                  <button
                    key={preset.title}
                    type="button"
                    onClick={() => addPreset(preset)}
                    className="flex items-center gap-1.5 px-2.5 py-1 rounded-md text-xs border border-studio-border bg-studio-surface hover:bg-studio-card hover:border-studio-accent/40 text-studio-secondary hover:text-studio-primary transition-colors"
                  >
                    <Plus className="w-3 h-3 text-studio-accent" />
                    <span>{preset.title}</span>
                    <span className="font-mono text-[10px] text-studio-muted">
                      ({formatINR(preset.price)})
                    </span>
                  </button>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Line Items Table */}
          <Card>
            <CardHeader className="p-5 pb-3">
              <div className="flex items-center justify-between">
                <CardTitle className="text-xs font-semibold">Quotation Line Items</CardTitle>
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={addCustomItem}
                  className="h-7 text-[11px] gap-1"
                >
                  <Plus className="w-3 h-3" />
                  <span>Add Line Item</span>
                </Button>
              </div>
            </CardHeader>
            <CardContent className="p-5 pt-0 space-y-3">
              {items.map((item, index) => (
                <div
                  key={item.id}
                  className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2 p-3 rounded-lg border border-studio-border bg-studio-surface/50"
                >
                  <div className="flex-1">
                    <Input
                      value={item.description}
                      onChange={(e) => updateItem(item.id, "description", e.target.value)}
                      placeholder="Service description"
                    />
                  </div>

                  <div className="flex items-center gap-2">
                    <div className="w-20">
                      <Input
                        type="number"
                        min="1"
                        value={item.quantity}
                        onChange={(e) => updateItem(item.id, "quantity", Number(e.target.value))}
                        placeholder="Qty"
                      />
                    </div>

                    <div className="w-28">
                      <Input
                        type="number"
                        value={item.unitPrice}
                        onChange={(e) => updateItem(item.id, "unitPrice", Number(e.target.value))}
                        placeholder="Price"
                      />
                    </div>

                    <div className="w-28 text-right font-mono font-medium text-xs text-studio-primary">
                      {formatINR(item.totalPrice)}
                    </div>

                    <button
                      type="button"
                      onClick={() => removeItem(item.id)}
                      className="p-1.5 text-studio-muted hover:text-studio-error rounded"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>

          {/* Pricing Calculations & GST Toggle */}
          <Card>
            <CardHeader className="p-5 pb-2">
              <CardTitle className="text-xs font-semibold">Financial Breakdown</CardTitle>
            </CardHeader>
            <CardContent className="p-5 pt-0 space-y-3 text-xs">
              <div className="flex items-center justify-between border-b border-studio-border/50 pb-2">
                <span className="text-studio-muted">Subtotal:</span>
                <span className="font-mono font-medium text-studio-primary">
                  {formatINR(subtotal)}
                </span>
              </div>

              <div className="flex items-center justify-between border-b border-studio-border/50 pb-2">
                <span className="text-studio-muted">Courtesy Discount (₹):</span>
                <div className="w-32">
                  <Input
                    type="number"
                    value={discountAmount}
                    onChange={(e) => setDiscountAmount(Number(e.target.value))}
                  />
                </div>
              </div>

              {/* 18% GST Switch */}
              <div className="flex items-center justify-between border-b border-studio-border/50 pb-2">
                <div className="flex items-center gap-2">
                  <span className="text-studio-secondary font-medium">Apply 18% GST (CGST + SGST)</span>
                  <Badge variant="outline" className="text-[9px]">Optional</Badge>
                </div>
                <input
                  type="checkbox"
                  checked={includeGst}
                  onChange={(e) => setIncludeGst(e.target.checked)}
                  className="w-4 h-4 rounded border-studio-border bg-studio-surface accent-studio-accent cursor-pointer"
                />
              </div>

              {includeGst && (
                <div className="flex items-center justify-between text-studio-accent font-mono border-b border-studio-border/50 pb-2">
                  <span>18% GST Amount:</span>
                  <span>+{formatINR(gstAmount)}</span>
                </div>
              )}

              <div className="flex items-center justify-between text-base font-bold text-studio-primary border-b border-studio-border/50 pb-2">
                <span>Grand Total:</span>
                <span className="font-mono text-studio-accent">{formatINR(grandTotal)}</span>
              </div>

              <div className="grid grid-cols-2 gap-4 pt-2">
                <div>
                  <label className="block text-[11px] text-studio-muted mb-1">
                    Advance Booking (%)
                  </label>
                  <Input
                    type="number"
                    value={advancePercentage}
                    onChange={(e) => setAdvancePercentage(Number(e.target.value))}
                    min="10"
                    max="100"
                  />
                </div>
                <div className="text-right">
                  <span className="block text-[11px] text-studio-muted mb-1">
                    Advance Payable Now:
                  </span>
                  <span className="text-sm font-mono font-bold text-studio-success">
                    {formatINR(advanceAmount)}
                  </span>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Terms & Notes */}
          <Card>
            <CardHeader className="p-5 pb-2">
              <CardTitle className="text-xs font-semibold">Terms, Validity & Notes</CardTitle>
            </CardHeader>
            <CardContent className="p-5 pt-0 space-y-3">
              <div>
                <label className="block text-xs font-medium text-studio-secondary mb-1">
                  Terms & Conditions
                </label>
                <Textarea
                  value={terms}
                  onChange={(e) => setTerms(e.target.value)}
                  className="min-h-[70px]"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-studio-secondary mb-1">
                  Notes for Client
                </label>
                <Input
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  placeholder="Special note..."
                />
              </div>
            </CardContent>
          </Card>

          {/* Submit */}
          <div className="flex items-center justify-end gap-3 pt-2">
            <Link href="/dashboard/quotations">
              <Button type="button" variant="outline">
                Cancel
              </Button>
            </Link>
            <Button type="submit" variant="accent" className="gap-1.5 shadow-md">
              <FilePlus2 className="w-3.5 h-3.5" />
              <span>Generate & Save Quotation</span>
            </Button>
          </div>
        </form>
      </div>
    </DashboardLayout>
  );
}
