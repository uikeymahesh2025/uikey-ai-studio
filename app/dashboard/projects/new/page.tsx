"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, CheckCircle2, FolderPlus } from "lucide-react";
import { DashboardLayout } from "@/components/layout/dashboard-layout";
import { useStudio } from "@/lib/store/store-context";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";

export default function NewProjectPage() {
  const router = useRouter();
  const { state, addProject } = useStudio();
  const { clients, team } = state;

  const [name, setName] = useState("");
  const [clientId, setClientId] = useState(clients[0]?.id || "");
  const [eventType, setEventType] = useState("Wedding");
  const [eventDate, setEventDate] = useState("2026-11-25");
  const [venue, setVenue] = useState("");
  const [assignedPhotographer, setAssignedPhotographer] = useState("Arjun Mehta");
  const [assignedEditor, setAssignedEditor] = useState("Pooja Verma");
  const [quotationAmount, setQuotationAmount] = useState<number>(85000);
  const [paidAmount, setPaidAmount] = useState<number>(40000);
  const [deliveryDeadline, setDeliveryDeadline] = useState("2026-12-15");
  const [notes, setNotes] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const selectedClient = clients.find((c) => c.id === clientId);

    const newProj = addProject({
      name,
      clientId,
      clientName: selectedClient?.name || "Client",
      clientEmail: selectedClient?.email || "",
      clientPhone: selectedClient?.phone || "",
      eventType,
      eventDate,
      venue,
      status: "Booked",
      assignedPhotographer,
      assignedEditor,
      quotationAmount: Number(quotationAmount),
      paidAmount: Number(paidAmount),
      balanceAmount: Math.max(0, Number(quotationAmount) - Number(paidAmount)),
      deliveryDeadline,
      notes,
      photoCount: 0,
      checklist: {
        contractAccepted: true,
        advanceReceived: Number(paidAmount) > 0,
        shootCompleted: false,
        photosBackedUp: false,
        cullingCompleted: false,
        editingCompleted: false,
        galleryUploaded: false,
        clientSelectionReceived: false,
        finalPaymentReceived: false,
        originalsDelivered: false,
      },
    });

    router.push(`/dashboard/projects/${newProj.id}`);
  };

  return (
    <DashboardLayout>
      <div className="max-w-3xl mx-auto space-y-6">
        <div className="flex items-center gap-3">
          <Link href="/dashboard/projects">
            <Button variant="outline" size="iconSm">
              <ArrowLeft className="w-3.5 h-3.5" />
            </Button>
          </Link>
          <div>
            <h1 className="text-xl font-bold tracking-tight text-studio-primary">
              Create New Project
            </h1>
            <p className="text-xs text-studio-secondary">
              Initialize a shoot pipeline with 10-stage checklist and assigned team members.
            </p>
          </div>
        </div>

        <Card>
          <CardHeader className="p-6 pb-4">
            <CardTitle className="text-sm font-semibold">Project Details</CardTitle>
            <CardDescription>Enter event specifics, client, and financial milestones.</CardDescription>
          </CardHeader>
          <CardContent className="p-6 pt-0">
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-medium text-studio-secondary mb-1">
                  Project Title
                </label>
                <Input
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="e.g. Verma · Royal Udaipur Wedding"
                  required
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
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
                    Event Type
                  </label>
                  <Input
                    value={eventType}
                    onChange={(e) => setEventType(e.target.value)}
                    placeholder="e.g. Wedding, Pre-wedding, Portrait"
                    required
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-medium text-studio-secondary mb-1">
                    Shoot Date
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
                    Target Delivery Deadline
                  </label>
                  <Input
                    type="date"
                    value={deliveryDeadline}
                    onChange={(e) => setDeliveryDeadline(e.target.value)}
                    required
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-medium text-studio-secondary mb-1">
                  Venue & Location
                </label>
                <Input
                  value={venue}
                  onChange={(e) => setVenue(e.target.value)}
                  placeholder="e.g. Jagmandir Island Palace, Udaipur"
                  required
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-medium text-studio-secondary mb-1">
                    Lead Photographer
                  </label>
                  <select
                    value={assignedPhotographer}
                    onChange={(e) => setAssignedPhotographer(e.target.value)}
                    className="w-full h-9 rounded-md border border-studio-border bg-studio-surface px-3 text-xs text-studio-primary focus:outline-none focus:border-studio-accent"
                  >
                    {team.map((t) => (
                      <option key={t.id} value={t.name}>
                        {t.name} ({t.role})
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-medium text-studio-secondary mb-1">
                    Assigned Editor
                  </label>
                  <select
                    value={assignedEditor}
                    onChange={(e) => setAssignedEditor(e.target.value)}
                    className="w-full h-9 rounded-md border border-studio-border bg-studio-surface px-3 text-xs text-studio-primary focus:outline-none focus:border-studio-accent"
                  >
                    {team.map((t) => (
                      <option key={t.id} value={t.name}>
                        {t.name} ({t.role})
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-medium text-studio-secondary mb-1">
                    Agreed Project Value (₹)
                  </label>
                  <Input
                    type="number"
                    value={quotationAmount}
                    onChange={(e) => setQuotationAmount(Number(e.target.value))}
                    required
                  />
                </div>

                <div>
                  <label className="block text-xs font-medium text-studio-secondary mb-1">
                    Advance Collected (₹)
                  </label>
                  <Input
                    type="number"
                    value={paidAmount}
                    onChange={(e) => setPaidAmount(Number(e.target.value))}
                    required
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-medium text-studio-secondary mb-1">
                  Internal Notes & Client Preferences
                </label>
                <Textarea
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  placeholder="e.g. Drone entry permitted. Client requested special candid coverage of bride's grandparents."
                />
              </div>

              <div className="flex items-center justify-end gap-3 pt-4 border-t border-studio-border/60">
                <Link href="/dashboard/projects">
                  <Button type="button" variant="outline">
                    Cancel
                  </Button>
                </Link>
                <Button type="submit" variant="accent" className="gap-1.5">
                  <FolderPlus className="w-3.5 h-3.5" />
                  <span>Create Project</span>
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
}
