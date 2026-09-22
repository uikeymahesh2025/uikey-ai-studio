"use client";

import React, { useState } from "react";
import Link from "next/link";
import {
  Users,
  Plus,
  Search,
  MessageSquare,
  Mail,
  Calendar,
  IndianRupee,
  ExternalLink,
  Clock,
  ArrowUpRight,
} from "lucide-react";
import { DashboardLayout } from "@/components/layout/dashboard-layout";
import { useStudio } from "@/lib/store/store-context";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";
import { formatINR, formatDate } from "@/lib/utils";
import { LeadStatus } from "@/lib/types";
import { createWhatsAppShareUrl } from "@/lib/whatsapp/templates";

export default function ClientsPage() {
  const { state, addClient } = useStudio();
  const { clients, studio } = state;

  const [searchQuery, setSearchQuery] = useState("");
  const [selectedStatus, setSelectedStatus] = useState<string>("all");
  const [showAddModal, setShowAddModal] = useState(false);

  // New Client Form
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [eventType, setEventType] = useState("Wedding");
  const [eventDate, setEventDate] = useState("2026-11-20");
  const [venue, setVenue] = useState("");
  const [budget, setBudget] = useState<number>(150000);
  const [leadSource, setLeadSource] = useState("Instagram");
  const [notes, setNotes] = useState("");

  const allStatuses: { label: string; value: string }[] = [
    { label: "All Leads", value: "all" },
    { label: "New inquiry", value: "New inquiry" },
    { label: "Contacted", value: "Contacted" },
    { label: "Quotation sent", value: "Quotation sent" },
    { label: "Follow-up required", value: "Follow-up required" },
    { label: "Booked", value: "Booked" },
    { label: "Completed", value: "Completed" },
  ];

  const filteredClients = clients.filter((c) => {
    const matchesSearch =
      c.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      c.phone.includes(searchQuery) ||
      c.eventType.toLowerCase().includes(searchQuery.toLowerCase()) ||
      c.venue.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesStatus = selectedStatus === "all" || c.status === selectedStatus;
    return matchesSearch && matchesStatus;
  });

  const handleCreateClient = (e: React.FormEvent) => {
    e.preventDefault();
    addClient({
      name,
      phone,
      whatsappNumber: phone,
      email,
      eventType,
      eventDate,
      venue,
      budget: Number(budget),
      leadSource,
      status: "New inquiry" as LeadStatus,
      notes,
      totalProjectValue: Number(budget),
      paidAmount: 0,
      pendingAmount: Number(budget),
    });

    setName("");
    setPhone("");
    setEmail("");
    setVenue("");
    setNotes("");
    setShowAddModal(false);
  };

  const getStatusBadge = (status: LeadStatus) => {
    switch (status) {
      case "Booked":
        return <Badge variant="success">Booked</Badge>;
      case "Completed":
        return <Badge variant="accent">Completed</Badge>;
      case "New inquiry":
        return <Badge variant="warning">New Inquiry</Badge>;
      case "Quotation sent":
        return <Badge variant="accent">Quote Sent</Badge>;
      case "Follow-up required":
        return <Badge variant="error">Follow-up</Badge>;
      default:
        return <Badge variant="default">{status}</Badge>;
    }
  };

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 border-b border-studio-border/60 pb-5">
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-xl font-bold tracking-tight text-studio-primary">
                Client CRM & Leads
              </h1>
              <Badge variant="default" className="text-[10px]">
                {clients.length} Clients
              </Badge>
            </div>
            <p className="text-xs text-studio-secondary mt-1">
              Organize photographer inquiries, venue dates, manual WhatsApp conversations, and lifetime client values.
            </p>
          </div>

          <Button
            onClick={() => setShowAddModal(true)}
            variant="accent"
            size="sm"
            className="gap-1.5 shadow-sm"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Add Client / Lead</span>
          </Button>
        </div>

        {/* Filter & Search Bar */}
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
          <div className="relative flex-1 max-w-sm">
            <Search className="absolute left-3 top-2.5 h-3.5 w-3.5 text-studio-muted" />
            <Input
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search by client name, phone, or venue..."
              className="pl-9"
            />
          </div>

          <div className="flex items-center gap-1.5 overflow-x-auto pb-1 sm:pb-0">
            {allStatuses.map((st) => (
              <button
                key={st.value}
                onClick={() => setSelectedStatus(st.value)}
                className={`px-2.5 py-1 rounded-md text-xs whitespace-nowrap transition-colors border ${
                  selectedStatus === st.value
                    ? "bg-studio-card text-studio-primary border-studio-accent/40 font-medium"
                    : "border-studio-border bg-studio-surface text-studio-muted hover:text-studio-secondary"
                }`}
              >
                {st.label}
              </button>
            ))}
          </div>
        </div>

        {/* Client Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredClients.map((c) => {
            const defaultMsg = `Namaste ${c.name} ji! Reaching out from ${studio.name} regarding your ${c.eventType}. How can we assist you today?`;
            return (
              <Card
                key={c.id}
                className="hover:border-studio-borderHover transition-all flex flex-col justify-between"
              >
                <CardHeader className="p-5 pb-3">
                  <div className="flex items-start justify-between">
                    <div>
                      <div className="flex items-center gap-2">
                        <Link
                          href={`/dashboard/clients/${c.id}`}
                          className="text-sm font-bold text-studio-primary hover:text-studio-accent transition-colors"
                        >
                          {c.name}
                        </Link>
                        {getStatusBadge(c.status)}
                      </div>
                      <p className="text-xs text-studio-secondary mt-0.5">
                        {c.eventType} · {c.phone}
                      </p>
                    </div>
                  </div>
                </CardHeader>

                <CardContent className="p-5 pt-0 space-y-3">
                  <div className="text-xs text-studio-muted space-y-1 bg-studio-surface/50 p-2.5 rounded-md border border-studio-border/50">
                    <div className="flex items-center justify-between">
                      <span>Event Date:</span>
                      <span className="text-studio-secondary font-medium">
                        {formatDate(c.eventDate)}
                      </span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span>Venue:</span>
                      <span className="text-studio-secondary truncate max-w-[180px]">
                        {c.venue || "To be confirmed"}
                      </span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span>Estimated Value:</span>
                      <span className="text-studio-primary font-mono font-medium">
                        {formatINR(c.totalProjectValue)}
                      </span>
                    </div>
                  </div>

                  {c.notes && (
                    <p className="text-[11px] text-studio-muted line-clamp-2 italic">
                      &quot;{c.notes}&quot;
                    </p>
                  )}

                  {/* Actions: Manual WhatsApp wa.me & View Profile */}
                  <div className="flex items-center justify-between pt-3 border-t border-studio-border/60">
                    <a
                      href={createWhatsAppShareUrl(c.whatsappNumber, defaultMsg)}
                      target="_blank"
                      rel="noreferrer"
                    >
                      <Button
                        variant="whatsapp"
                        size="sm"
                        className="h-7 text-[11px] gap-1 px-2.5"
                      >
                        <MessageSquare className="w-3 h-3" />
                        <span>WhatsApp</span>
                      </Button>
                    </a>

                    <Link href={`/dashboard/clients/${c.id}`}>
                      <Button variant="secondary" size="sm" className="h-7 text-[11px] gap-1">
                        <span>Profile & History</span>
                        <ArrowUpRight className="w-3 h-3" />
                      </Button>
                    </Link>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      </div>

      {/* Add Client Dialog Modal */}
      <Dialog open={showAddModal} onOpenChange={setShowAddModal}>
        <DialogContent onClose={() => setShowAddModal(false)} className="max-w-md">
          <DialogHeader>
            <DialogTitle>Add New Client / Lead</DialogTitle>
            <DialogDescription>
              Record an inquiry into your CRM with event details and estimated budget.
            </DialogDescription>
          </DialogHeader>

          <form onSubmit={handleCreateClient} className="space-y-3.5">
            <div>
              <label className="block text-xs font-medium text-studio-secondary mb-1">
                Client Full Name
              </label>
              <Input
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="e.g. Priyanshu & Neha Shah"
                required
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-medium text-studio-secondary mb-1">
                  WhatsApp Number
                </label>
                <Input
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder="+91 98200 98200"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-studio-secondary mb-1">
                  Email
                </label>
                <Input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="client@gmail.com"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-medium text-studio-secondary mb-1">
                  Event Type
                </label>
                <Input
                  value={eventType}
                  onChange={(e) => setEventType(e.target.value)}
                  placeholder="Wedding, Pre-wedding..."
                  required
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
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-medium text-studio-secondary mb-1">
                  Venue / City
                </label>
                <Input
                  value={venue}
                  onChange={(e) => setVenue(e.target.value)}
                  placeholder="e.g. Alila Diwa, Goa"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-studio-secondary mb-1">
                  Estimated Budget (₹)
                </label>
                <Input
                  type="number"
                  value={budget}
                  onChange={(e) => setBudget(Number(e.target.value))}
                  required
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-medium text-studio-secondary mb-1">
                Lead Source
              </label>
              <select
                value={leadSource}
                onChange={(e) => setLeadSource(e.target.value)}
                className="w-full h-9 rounded-md border border-studio-border bg-studio-surface px-3 text-xs text-studio-primary focus:outline-none focus:border-studio-accent"
              >
                <option value="Instagram">Instagram</option>
                <option value="Referral">Client Referral</option>
                <option value="Wedding Planner">Wedding Planner</option>
                <option value="Public Portfolio">Public Portfolio</option>
                <option value="Google Search">Google Search</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-medium text-studio-secondary mb-1">
                Client Notes & Vision
              </label>
              <Textarea
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                placeholder="Couple preferences, drone requests, special song preferences..."
              />
            </div>

            <DialogFooter>
              <Button
                type="button"
                variant="outline"
                onClick={() => setShowAddModal(false)}
              >
                Cancel
              </Button>
              <Button type="submit" variant="accent">
                Save Client to CRM
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </DashboardLayout>
  );
}
