"use client";

import React, { useState } from "react";
import Link from "next/link";
import {
  FolderKanban,
  Plus,
  Search,
  Filter,
  Calendar,
  Camera,
  CheckCircle2,
  Clock,
  ArrowUpRight,
  ExternalLink,
} from "lucide-react";
import { DashboardLayout } from "@/components/layout/dashboard-layout";
import { useStudio } from "@/lib/store/store-context";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { formatINR, formatDate } from "@/lib/utils";
import { ProjectStatus } from "@/lib/types";

export default function ProjectsPage() {
  const { state } = useStudio();
  const { projects } = state;

  const [searchQuery, setSearchQuery] = useState("");
  const [selectedStatus, setSelectedStatus] = useState<string>("all");

  const statuses: { label: string; value: string }[] = [
    { label: "All Projects", value: "all" },
    { label: "Booked", value: "Booked" },
    { label: "Shooting", value: "Shooting" },
    { label: "Editing", value: "Editing" },
    { label: "Proofing", value: "Proofing" },
    { label: "Awaiting payment", value: "Awaiting payment" },
    { label: "Delivered", value: "Delivered" },
  ];

  const filteredProjects = projects.filter((p) => {
    const matchesSearch =
      p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.clientName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.venue.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesStatus = selectedStatus === "all" || p.status === selectedStatus;
    return matchesSearch && matchesStatus;
  });

  const getStatusBadge = (status: ProjectStatus) => {
    switch (status) {
      case "Delivered":
        return <Badge variant="success">Delivered</Badge>;
      case "Proofing":
        return <Badge variant="warning">Proofing</Badge>;
      case "Awaiting payment":
        return <Badge variant="error">Awaiting Payment</Badge>;
      case "Editing":
        return <Badge variant="accent">Editing</Badge>;
      case "Shooting":
        return <Badge variant="accent">Shooting</Badge>;
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
                Projects Pipeline
              </h1>
              <Badge variant="default" className="text-[10px]">
                {projects.length} Total
              </Badge>
            </div>
            <p className="text-xs text-studio-secondary mt-1">
              Track shoots from contract signing and RAW backups to proofing selections and final handover.
            </p>
          </div>

          <Link href="/dashboard/projects/new">
            <Button variant="accent" size="sm" className="gap-1.5 shadow-sm">
              <Plus className="w-3.5 h-3.5" />
              <span>Create Project</span>
            </Button>
          </Link>
        </div>

        {/* Filter bar */}
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
          <div className="relative flex-1 max-w-sm">
            <Search className="absolute left-3 top-2.5 h-3.5 w-3.5 text-studio-muted" />
            <Input
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search by project, client, or venue..."
              className="pl-9"
            />
          </div>

          <div className="flex items-center gap-1.5 overflow-x-auto pb-1 sm:pb-0">
            {statuses.map((st) => (
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

        {/* Projects Cards List */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {filteredProjects.map((p) => {
            const completedChecks = Object.values(p.checklist).filter(Boolean).length;
            return (
              <Card
                key={p.id}
                className="hover:border-studio-borderHover transition-all flex flex-col justify-between group"
              >
                <CardHeader className="p-5 pb-3">
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <div className="flex items-center gap-2">
                        <Link
                          href={`/dashboard/projects/${p.id}`}
                          className="text-sm font-bold text-studio-primary hover:text-studio-accent transition-colors group-hover:underline"
                        >
                          {p.name}
                        </Link>
                        {getStatusBadge(p.status)}
                      </div>
                      <p className="text-xs text-studio-secondary mt-1">
                        Client: <strong className="text-studio-primary">{p.clientName}</strong> · {p.eventType}
                      </p>
                    </div>

                    <div className="text-right">
                      <span className="text-xs font-bold text-studio-primary font-mono">
                        {formatINR(p.quotationAmount)}
                      </span>
                      <p className="text-[10px] text-studio-muted mt-0.5">
                        {p.balanceAmount > 0 ? (
                          <span className="text-studio-warning font-mono">
                            {formatINR(p.balanceAmount)} pending
                          </span>
                        ) : (
                          <span className="text-studio-success">Fully Paid</span>
                        )}
                      </p>
                    </div>
                  </div>
                </CardHeader>

                <CardContent className="p-5 pt-0 space-y-3">
                  <div className="text-xs text-studio-muted space-y-1 bg-studio-surface/50 p-2.5 rounded-md border border-studio-border/50">
                    <div className="flex items-center justify-between">
                      <span>Venue:</span>
                      <span className="text-studio-secondary truncate max-w-[220px]">
                        {p.venue}
                      </span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span>Shoot Date:</span>
                      <span className="text-studio-secondary">{formatDate(p.eventDate)}</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span>Assigned Crew:</span>
                      <span className="text-studio-secondary">
                        {p.assignedPhotographer} (Photo) · {p.assignedEditor} (Edit)
                      </span>
                    </div>
                  </div>

                  {/* Checklist summary bar */}
                  <div>
                    <div className="flex items-center justify-between text-[11px] mb-1">
                      <span className="text-studio-muted">Deliverables Checklist</span>
                      <span className="text-studio-accent font-mono font-medium">
                        {completedChecks}/10 completed
                      </span>
                    </div>
                    <div className="h-1.5 w-full rounded-full bg-studio-surface border border-studio-border/50 overflow-hidden">
                      <div
                        className="h-full bg-studio-accent transition-all"
                        style={{ width: `${(completedChecks / 10) * 100}%` }}
                      />
                    </div>
                  </div>

                  {/* Action row */}
                  <div className="flex items-center justify-between pt-2 border-t border-studio-border/60 text-xs">
                    <div className="flex items-center gap-2">
                      {p.galleryId && (
                        <Link
                          href={`/gallery/${p.galleryId}`}
                          target="_blank"
                          className="text-[11px] text-studio-muted hover:text-studio-accent transition-colors flex items-center gap-1"
                        >
                          <span>Client Gallery</span>
                          <ExternalLink className="w-3 h-3" />
                        </Link>
                      )}
                    </div>

                    <Link href={`/dashboard/projects/${p.id}`}>
                      <Button variant="secondary" size="sm" className="h-7 text-[11px] gap-1">
                        <span>Manage Shoot</span>
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
    </DashboardLayout>
  );
}
