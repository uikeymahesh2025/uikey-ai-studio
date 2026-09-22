"use client";

import React, { useState } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import {
  ArrowLeft,
  CheckCircle2,
  ExternalLink,
  Eye,
  Heart,
  Lock,
  MessageSquare,
  Share2,
  Shield,
  Upload,
  XCircle,
  Clock,
  Sparkles,
  Copy,
} from "lucide-react";
import { DashboardLayout } from "@/components/layout/dashboard-layout";
import { useStudio } from "@/lib/store/store-context";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { formatDate } from "@/lib/utils";
import { createWhatsAppShareUrl, generateWhatsAppMessage } from "@/lib/whatsapp/templates";

export default function PhotographerGalleryManagePage() {
  const params = useParams();
  const galleryId = params.id as string;

  const { state } = useStudio();
  const { galleries, galleryImages, studio } = state;

  const gallery = galleries.find((g) => g.id === galleryId);
  const images = galleryImages[galleryId] || [];

  const [activeCategory, setActiveCategory] = useState("all");

  if (!gallery) {
    return (
      <DashboardLayout>
        <div className="text-center py-20">
          <p className="text-sm text-studio-muted">Gallery not found.</p>
          <Link href="/dashboard/galleries" className="mt-4 inline-block">
            <Button variant="outline" size="sm">
              Back to Galleries
            </Button>
          </Link>
        </div>
      </DashboardLayout>
    );
  }

  const appUrl = typeof window !== "undefined" ? window.location.origin : "http://localhost:3000";
  const publicGalleryUrl = `${appUrl}/gallery/${gallery.id}`;

  const waMessage = generateWhatsAppMessage("gallery_ready", {
    clientName: gallery.clientName,
    clientPhone: "+91 98200 11223",
    studioName: studio.name,
    projectName: gallery.projectName,
    galleryUrl: publicGalleryUrl,
  });

  const favorites = images.filter((img) => img.selectionState === "favorite");
  const rejections = images.filter((img) => img.selectionState === "reject");

  const filteredImages = images.filter((img) => {
    if (activeCategory === "all") return true;
    if (activeCategory === "favorites") return img.selectionState === "favorite";
    return img.category.toLowerCase().includes(activeCategory.toLowerCase());
  });

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 border-b border-studio-border/60 pb-5">
          <div className="flex items-center gap-3">
            <Link href="/dashboard/galleries">
              <Button variant="outline" size="iconSm">
                <ArrowLeft className="w-3.5 h-3.5" />
              </Button>
            </Link>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-xl font-bold tracking-tight text-studio-primary">
                  {gallery.projectName} — Gallery
                </h1>
                <Badge variant="accent">{gallery.status}</Badge>
              </div>
              <p className="text-xs text-studio-secondary mt-0.5">
                Client: {gallery.clientName} · Expiry: {formatDate(gallery.expiryDate)}
              </p>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <Button
              onClick={() => {
                navigator.clipboard.writeText(publicGalleryUrl);
                alert("Gallery URL copied!");
              }}
              variant="outline"
              size="sm"
              className="gap-1 text-xs"
            >
              <Copy className="w-3.5 h-3.5" />
              <span>Copy Link</span>
            </Button>

            <a
              href={createWhatsAppShareUrl("+91 98200 11223", waMessage)}
              target="_blank"
              rel="noreferrer"
            >
              <Button variant="whatsapp" size="sm" className="gap-1.5 text-xs">
                <MessageSquare className="w-3.5 h-3.5" />
                <span>Share Gallery wa.me</span>
              </Button>
            </a>

            <Link href={`/gallery/${gallery.id}`} target="_blank">
              <Button variant="accent" size="sm" className="gap-1 text-xs">
                <Eye className="w-3.5 h-3.5" />
                <span>Open Proofing Portal</span>
                <ExternalLink className="w-3 h-3" />
              </Button>
            </Link>
          </div>
        </div>

        {/* Overview Stats */}
        <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
          <Card>
            <CardContent className="p-4">
              <span className="text-[11px] text-studio-muted">Total Images</span>
              <div className="text-xl font-bold text-studio-primary font-mono mt-0.5">
                {gallery.totalImages}
              </div>
              <span className="text-[10px] text-studio-muted">
                Watermarked Proofs
              </span>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4">
              <span className="text-[11px] text-studio-muted">Client Favorites (❤️)</span>
              <div className="text-xl font-bold text-studio-accent font-mono mt-0.5">
                {gallery.selectedCount} / {gallery.requiredSelectionCount || 50}
              </div>
              <span className="text-[10px] text-studio-secondary">
                {gallery.isSelectionSubmitted ? "✅ Selection Submitted" : "In Progress"}
              </span>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4">
              <span className="text-[11px] text-studio-muted">Watermark</span>
              <div className="text-xs font-mono font-bold text-studio-secondary truncate mt-1">
                {gallery.watermarkText}
              </div>
              <span className="text-[10px] text-studio-muted">
                Opacity: {Math.round(gallery.watermarkOpacity * 100)}%
              </span>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4">
              <span className="text-[11px] text-studio-muted">Originals Status</span>
              <div className="text-xs font-bold mt-1">
                {gallery.downloadsUnlocked ? (
                  <span className="text-studio-success flex items-center gap-1">
                    <CheckCircle2 className="w-3.5 h-3.5" /> High-Res Unlocked
                  </span>
                ) : (
                  <span className="text-studio-warning flex items-center gap-1">
                    <Lock className="w-3.5 h-3.5" /> Locked (Pending Payment)
                  </span>
                )}
              </div>
              <span className="text-[10px] text-studio-muted">
                Unlocks automatically upon UTR verification
              </span>
            </CardContent>
          </Card>
        </div>

        {/* Category Filter Tabs */}
        <div className="flex items-center gap-2 overflow-x-auto pb-1">
          <button
            onClick={() => setActiveCategory("all")}
            className={`px-3 py-1 rounded-md text-xs font-medium border transition-colors ${
              activeCategory === "all"
                ? "bg-studio-card text-studio-primary border-studio-accent/50"
                : "border-studio-border bg-studio-surface text-studio-muted hover:text-studio-secondary"
            }`}
          >
            All Photos ({images.length})
          </button>
          <button
            onClick={() => setActiveCategory("favorites")}
            className={`px-3 py-1 rounded-md text-xs font-medium border transition-colors ${
              activeCategory === "favorites"
                ? "bg-studio-card text-studio-primary border-studio-accent/50"
                : "border-studio-border bg-studio-surface text-studio-muted hover:text-studio-secondary"
            }`}
          >
            Client Picks ❤️ ({favorites.length})
          </button>
          {gallery.categories.filter((c) => c.id !== "all").map((cat) => (
            <button
              key={cat.id}
              onClick={() => setActiveCategory(cat.name)}
              className={`px-3 py-1 rounded-md text-xs font-medium border transition-colors ${
                activeCategory === cat.name
                  ? "bg-studio-card text-studio-primary border-studio-accent/50"
                  : "border-studio-border bg-studio-surface text-studio-muted hover:text-studio-secondary"
              }`}
            >
              {cat.name} ({cat.count})
            </button>
          ))}
        </div>

        {/* Image Grid with Selection Indicators */}
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
          {filteredImages.map((img) => (
            <div
              key={img.id}
              className="relative group rounded-lg overflow-hidden border border-studio-border bg-studio-card aspect-[4/3]"
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={img.thumbnailUrl}
                alt={img.filename}
                className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                loading="lazy"
              />

              {/* Watermark diagonal overlay hint */}
              <div className="watermark-overlay opacity-30">
                <span className="watermark-text text-[10px] text-white/50">
                  {gallery.watermarkText}
                </span>
              </div>

              {/* Selection Badge */}
              <div className="absolute top-2 left-2 z-10">
                {img.selectionState === "favorite" && (
                  <span className="p-1 rounded bg-studio-card/90 text-studio-accent border border-studio-accent/40 shadow-sm flex items-center gap-1 text-[10px] font-bold">
                    ❤️ Selected
                  </span>
                )}
                {img.selectionState === "reject" && (
                  <span className="p-1 rounded bg-studio-card/90 text-studio-error border border-studio-error/40 shadow-sm flex items-center gap-1 text-[10px] font-bold">
                    ✖ Rejected
                  </span>
                )}
              </div>

              {/* Comment preview indicator */}
              {img.comments.length > 0 && (
                <div className="absolute bottom-2 left-2 z-10 bg-black/80 backdrop-blur rounded px-1.5 py-0.5 text-[10px] text-studio-primary border border-white/20 flex items-center gap-1">
                  <MessageSquare className="w-2.5 h-2.5 text-studio-accent" />
                  <span>{img.comments.length} note</span>
                </div>
              )}

              <div className="absolute bottom-2 right-2 z-10 text-[9px] font-mono bg-black/70 px-1.5 py-0.5 rounded text-studio-muted">
                {img.filename}
              </div>
            </div>
          ))}
        </div>
      </div>
    </DashboardLayout>
  );
}
