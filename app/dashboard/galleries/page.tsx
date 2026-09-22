"use client";

import React, { useState } from "react";
import Link from "next/link";
import {
  Images,
  Plus,
  Search,
  ExternalLink,
  Shield,
  Eye,
  CheckCircle2,
  Lock,
  ArrowUpRight,
  UploadCloud,
} from "lucide-react";
import { DashboardLayout } from "@/components/layout/dashboard-layout";
import { useStudio } from "@/lib/store/store-context";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { formatDate } from "@/lib/utils";
import { GalleryStatus } from "@/lib/types";

export default function GalleriesListPage() {
  const { state } = useStudio();
  const { galleries } = state;

  const [searchQuery, setSearchQuery] = useState("");

  const filteredGalleries = galleries.filter((g) =>
    g.projectName.toLowerCase().includes(searchQuery.toLowerCase()) ||
    g.clientName.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const getStatusBadge = (status: GalleryStatus) => {
    switch (status) {
      case "Selection submitted":
        return <Badge variant="warning">Selection Submitted</Badge>;
      case "Approved":
        return <Badge variant="success">Approved</Badge>;
      case "Selection in progress":
        return <Badge variant="accent">Client Selecting</Badge>;
      case "Locked":
        return <Badge variant="error">Locked</Badge>;
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
                Client Proofing Galleries
              </h1>
              <Badge variant="default" className="text-[10px]">
                {galleries.length} Active
              </Badge>
            </div>
            <p className="text-xs text-studio-secondary mt-1">
              Deliver watermarked proofing collections. Clients favorite, reject, and comment directly on mobile.
            </p>
          </div>

          <Link href="/dashboard/projects">
            <Button variant="accent" size="sm" className="gap-1.5 shadow-sm">
              <UploadCloud className="w-3.5 h-3.5" />
              <span>Upload to Project</span>
            </Button>
          </Link>
        </div>

        {/* Filter bar */}
        <div className="relative max-w-sm">
          <Search className="absolute left-3 top-2.5 h-3.5 w-3.5 text-studio-muted" />
          <Input
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search galleries by shoot or client..."
            className="pl-9"
          />
        </div>

        {/* Galleries Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredGalleries.map((g) => (
            <Card
              key={g.id}
              className="hover:border-studio-borderHover transition-all flex flex-col justify-between"
            >
              <CardHeader className="p-5 pb-3">
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <div className="flex items-center gap-2">
                      <Link
                        href={`/dashboard/galleries/${g.id}`}
                        className="text-sm font-bold text-studio-primary hover:text-studio-accent transition-colors"
                      >
                        {g.projectName}
                      </Link>
                      {getStatusBadge(g.status)}
                    </div>
                    <p className="text-xs text-studio-secondary mt-1">
                      Client: {g.clientName}
                    </p>
                  </div>
                </div>
              </CardHeader>

              <CardContent className="p-5 pt-0 space-y-3">
                <div className="text-xs text-studio-muted space-y-1 bg-studio-surface/50 p-2.5 rounded-md border border-studio-border/50">
                  <div className="flex items-center justify-between">
                    <span>Uploaded Photos:</span>
                    <span className="text-studio-primary font-mono font-medium">
                      {g.totalImages} images
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span>Client Favorites:</span>
                    <span className="text-studio-accent font-mono font-medium">
                      {g.selectedCount} / {g.requiredSelectionCount || 50}
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span>Original Downloads:</span>
                    <span className={g.downloadsUnlocked ? "text-studio-success" : "text-studio-warning flex items-center gap-1"}>
                      {g.downloadsUnlocked ? "Unlocked" : <><Lock className="w-3 h-3" /> Locked (Pending Pay)</>}
                    </span>
                  </div>
                </div>

                <div className="flex items-center justify-between pt-2 border-t border-studio-border/60 text-xs">
                  <Link
                    href={`/gallery/${g.id}`}
                    target="_blank"
                    className="flex items-center gap-1 text-studio-secondary hover:text-studio-primary transition-colors"
                  >
                    <Eye className="w-3.5 h-3.5" />
                    <span>Client View</span>
                    <ExternalLink className="w-3 h-3 text-studio-muted" />
                  </Link>

                  <Link href={`/dashboard/galleries/${g.id}`}>
                    <Button variant="secondary" size="sm" className="h-7 text-[11px] gap-1">
                      <span>Manage</span>
                      <ArrowUpRight className="w-3 h-3" />
                    </Button>
                  </Link>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </DashboardLayout>
  );
}
