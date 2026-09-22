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
  Settings,
  Check,
  Plus,
} from "lucide-react";
import { DashboardLayout } from "@/components/layout/dashboard-layout";
import { useStudio } from "@/lib/store/store-context";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { formatDate } from "@/lib/utils";
import { createWhatsAppShareUrl, generateWhatsAppMessage } from "@/lib/whatsapp/templates";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";

export default function PhotographerGalleryManagePage() {
  const params = useParams();
  const galleryId = params.id as string;

  const { state, addGalleryImages, updateGallerySettings } = useStudio();
  const { galleries, galleryImages, studio } = state;

  const gallery = galleries.find((g) => g.id === galleryId);
  const images = galleryImages[galleryId] || [];

  const [activeCategory, setActiveCategory] = useState("all");
  const [copiedLink, setCopiedLink] = useState(false);
  const [copiedLightroom, setCopiedLightroom] = useState(false);

  // Upload Photos Modal
  const [isUploadOpen, setIsUploadOpen] = useState(false);
  const [uploadCategory, setUploadCategory] = useState("Ceremony & Phere");
  const [sampleUrlInput, setSampleUrlInput] = useState("");

  // Settings Modal
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [watermarkText, setWatermarkText] = useState(gallery?.watermarkText || "PROOF ONLY · UIKEY AI STUDIO");
  const [watermarkOpacity, setWatermarkOpacity] = useState(gallery?.watermarkOpacity || 0.28);

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

  const handleCopyLightroom = () => {
    if (favorites.length === 0) {
      alert("No photos have been favorited by the client yet.");
      return;
    }
    const filenameList = favorites.map((f) => f.filename).join(", ");
    navigator.clipboard.writeText(filenameList);
    setCopiedLightroom(true);
    setTimeout(() => setCopiedLightroom(false), 2500);
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    const newImgs = Array.from(files).map((file, idx) => {
      const objUrl = URL.createObjectURL(file);
      return {
        filename: file.name,
        thumbnailUrl: objUrl,
        previewUrl: objUrl,
        originalUrl: objUrl,
        category: uploadCategory,
        width: 1920,
        height: 1280,
        aspectRatio: 1.5,
        fileSizeBytes: file.size,
        hidden: false,
      };
    });

    addGalleryImages(gallery.id, newImgs);
    setIsUploadOpen(false);
  };

  const handleAddSampleUrl = () => {
    if (!sampleUrlInput.trim()) return;
    const filename = `CUSTOM_PHOTO_${Date.now()}.JPG`;
    addGalleryImages(gallery.id, [
      {
        filename,
        thumbnailUrl: sampleUrlInput.trim(),
        previewUrl: sampleUrlInput.trim(),
        originalUrl: sampleUrlInput.trim(),
        category: uploadCategory,
        width: 1920,
        height: 1280,
        aspectRatio: 1.5,
        fileSizeBytes: 2.4 * 1024 * 1024,
        hidden: false,
      },
    ]);
    setSampleUrlInput("");
    setIsUploadOpen(false);
  };

  const handleSaveSettings = (e: React.FormEvent) => {
    e.preventDefault();
    updateGallerySettings(gallery.id, {
      watermarkText,
      watermarkOpacity: Number(watermarkOpacity),
    });
    setIsSettingsOpen(false);
  };

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
              onClick={() => setIsUploadOpen(true)}
              size="sm"
              className="bg-studio-accent text-studio-bg hover:bg-studio-accent/90 gap-1 text-xs font-medium"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Add / Upload Photos</span>
            </Button>

            <Button
              onClick={handleCopyLightroom}
              variant="outline"
              size="sm"
              className="gap-1 text-xs border-studio-border"
              title="Copy selected filenames formatted for Adobe Lightroom Classic filter bar"
            >
              {copiedLightroom ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
              <span>{copiedLightroom ? "Copied Lightroom List!" : "Copy Lightroom Filter"}</span>
            </Button>

            <Button
              onClick={() => {
                navigator.clipboard.writeText(publicGalleryUrl);
                setCopiedLink(true);
                setTimeout(() => setCopiedLink(false), 2000);
              }}
              variant="outline"
              size="sm"
              className="gap-1 text-xs border-studio-border"
            >
              {copiedLink ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
              <span>{copiedLink ? "Copied" : "Copy Link"}</span>
            </Button>

            <Button
              onClick={() => setIsSettingsOpen(true)}
              variant="outline"
              size="sm"
              className="gap-1 text-xs border-studio-border"
            >
              <Settings className="w-3.5 h-3.5" />
              <span>Watermark</span>
            </Button>

            <a
              href={createWhatsAppShareUrl("+91 98200 11223", waMessage)}
              target="_blank"
              rel="noreferrer"
            >
              <Button variant="whatsapp" size="sm" className="gap-1.5 text-xs">
                <MessageSquare className="w-3.5 h-3.5" />
                <span>Share Gallery</span>
              </Button>
            </a>

            <Link href={`/gallery/${gallery.id}`} target="_blank">
              <Button variant="outline" size="sm" className="gap-1 text-xs border-studio-border">
                <Eye className="w-3.5 h-3.5" />
                <span>Client View</span>
                <ExternalLink className="w-3 h-3" />
              </Button>
            </Link>
          </div>
        </div>

        {/* Overview Stats */}
        <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
          <Card className="bg-studio-card/60 border-studio-border/70">
            <CardContent className="p-4">
              <span className="text-[11px] text-studio-muted uppercase tracking-wider">Total Images</span>
              <div className="text-xl font-bold text-studio-primary font-mono mt-0.5">
                {images.length}
              </div>
              <span className="text-[10px] text-studio-muted">Watermarked Proofs</span>
            </CardContent>
          </Card>

          <Card className="bg-studio-card/60 border-studio-border/70">
            <CardContent className="p-4">
              <span className="text-[11px] text-studio-muted uppercase tracking-wider">Client Favorites (❤️)</span>
              <div className="text-xl font-bold text-studio-accent font-mono mt-0.5">
                {favorites.length} / {gallery.requiredSelectionCount || 50}
              </div>
              <span className="text-[10px] text-studio-secondary">
                {gallery.isSelectionSubmitted ? "✅ Selection Finalized" : "Selection In Progress"}
              </span>
            </CardContent>
          </Card>

          <Card className="bg-studio-card/60 border-studio-border/70">
            <CardContent className="p-4">
              <span className="text-[11px] text-studio-muted uppercase tracking-wider">Watermark Text</span>
              <div className="text-xs font-mono font-bold text-studio-secondary truncate mt-1">
                {gallery.watermarkText}
              </div>
              <span className="text-[10px] text-studio-muted">
                Opacity: {Math.round(gallery.watermarkOpacity * 100)}%
              </span>
            </CardContent>
          </Card>

          <Card className="bg-studio-card/60 border-studio-border/70">
            <CardContent className="p-4">
              <span className="text-[11px] text-studio-muted uppercase tracking-wider">Originals Status</span>
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
                Unlocks upon Bharat UPI settlement
              </span>
            </CardContent>
          </Card>
        </div>

        {/* Category Filter Tabs */}
        <div className="flex items-center gap-2 overflow-x-auto pb-1">
          <button
            onClick={() => setActiveCategory("all")}
            className={`px-3 py-1.5 rounded-lg text-xs font-medium border transition-colors ${
              activeCategory === "all"
                ? "bg-studio-card text-studio-primary border-studio-accent/50"
                : "border-studio-border bg-studio-surface text-studio-muted hover:text-studio-secondary"
            }`}
          >
            All Photos ({images.length})
          </button>
          <button
            onClick={() => setActiveCategory("favorites")}
            className={`px-3 py-1.5 rounded-lg text-xs font-medium border transition-colors ${
              activeCategory === "favorites"
                ? "bg-studio-card text-studio-accent border-studio-accent/50 font-bold"
                : "border-studio-border bg-studio-surface text-studio-muted hover:text-studio-secondary"
            }`}
          >
            Client Picks ❤️ ({favorites.length})
          </button>
          {gallery.categories
            .filter((c) => c.id !== "all")
            .map((cat) => (
              <button
                key={cat.id}
                onClick={() => setActiveCategory(cat.name)}
                className={`px-3 py-1.5 rounded-lg text-xs font-medium border transition-colors ${
                  activeCategory === cat.name
                    ? "bg-studio-card text-studio-primary border-studio-accent/50"
                    : "border-studio-border bg-studio-surface text-studio-muted hover:text-studio-secondary"
                }`}
              >
                {cat.name}
              </button>
            ))}
        </div>

        {/* Image Grid */}
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
              <div
                className="watermark-overlay"
                style={{ opacity: gallery.watermarkOpacity }}
              >
                <span className="watermark-text text-[10px] text-white">
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

      {/* Upload Photos Modal */}
      <Dialog open={isUploadOpen} onOpenChange={setIsUploadOpen}>
        <DialogContent className="sm:max-w-md bg-studio-card border-studio-border">
          <DialogHeader>
            <DialogTitle className="text-base text-studio-primary flex items-center gap-2">
              <Upload className="w-4 h-4 text-studio-accent" />
              <span>Add Photos to Proofing Gallery</span>
            </DialogTitle>
            <DialogDescription className="text-xs text-studio-secondary">
              Upload local photos or add image links. In Demo Mode, local images are read instantly via browser memory at zero external cost.
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4 pt-2">
            <div>
              <label className="text-xs font-medium text-studio-secondary mb-1.5 block">
                Assign Category Tag
              </label>
              <select
                value={uploadCategory}
                onChange={(e) => setUploadCategory(e.target.value)}
                className="w-full h-9 rounded-lg bg-studio-surface border border-studio-border px-3 text-xs text-studio-primary focus:outline-none focus:border-studio-accent"
              >
                <option value="Ceremony & Phere">Ceremony & Phere</option>
                <option value="Bridal Details">Bridal Details</option>
                <option value="Candid Moments">Candid Moments</option>
                <option value="Decor & Venue">Decor & Venue</option>
                <option value="Portraits">Portraits</option>
                <option value="Reception">Reception</option>
              </select>
            </div>

            <div className="p-4 rounded-xl border border-dashed border-studio-border bg-studio-surface/50 text-center space-y-2">
              <Upload className="w-8 h-8 text-studio-muted mx-auto opacity-50" />
              <p className="text-xs font-semibold text-studio-primary">Select images from your device</p>
              <p className="text-[11px] text-studio-muted">JPEG, PNG, WebP supported</p>
              <input
                type="file"
                multiple
                accept="image/*"
                onChange={handleFileUpload}
                className="block w-full text-xs text-studio-secondary file:mr-2 file:py-1 file:px-3 file:rounded-md file:border-0 file:text-xs file:font-semibold file:bg-studio-accent file:text-studio-bg hover:file:bg-studio-accent/90 cursor-pointer pt-2"
              />
            </div>

            <div className="relative flex py-1 items-center">
              <div className="flex-grow border-t border-studio-border" />
              <span className="flex-shrink mx-2 text-[10px] text-studio-muted uppercase">or paste image URL</span>
              <div className="flex-grow border-t border-studio-border" />
            </div>

            <div className="flex items-center gap-2">
              <Input
                placeholder="https://images.unsplash.com/..."
                value={sampleUrlInput}
                onChange={(e) => setSampleUrlInput(e.target.value)}
                className="bg-studio-surface border-studio-border text-xs h-9"
              />
              <Button
                type="button"
                onClick={handleAddSampleUrl}
                size="sm"
                className="bg-studio-accent text-studio-bg text-xs shrink-0 h-9"
              >
                Add URL
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Watermark Settings Modal */}
      <Dialog open={isSettingsOpen} onOpenChange={setIsSettingsOpen}>
        <DialogContent className="sm:max-w-md bg-studio-card border-studio-border">
          <DialogHeader>
            <DialogTitle className="text-base text-studio-primary flex items-center gap-2">
              <Settings className="w-4 h-4 text-studio-accent" />
              <span>Gallery Watermark Protection</span>
            </DialogTitle>
            <DialogDescription className="text-xs text-studio-secondary">
              Configure diagonal anti-theft watermark text and transparency for this gallery.
            </DialogDescription>
          </DialogHeader>

          <form onSubmit={handleSaveSettings} className="space-y-4 pt-2">
            <div>
              <label className="text-xs font-medium text-studio-secondary mb-1.5 block">
                Watermark Overlay Text
              </label>
              <Input
                value={watermarkText}
                onChange={(e) => setWatermarkText(e.target.value)}
                className="bg-studio-surface border-studio-border text-xs h-9 font-mono"
                required
              />
            </div>

            <div>
              <div className="flex justify-between text-xs text-studio-secondary mb-1.5">
                <span>Watermark Opacity</span>
                <span className="font-mono">{Math.round(watermarkOpacity * 100)}%</span>
              </div>
              <input
                type="range"
                min="0.10"
                max="0.60"
                step="0.02"
                value={watermarkOpacity}
                onChange={(e) => setWatermarkOpacity(Number(e.target.value))}
                className="w-full cursor-pointer accent-studio-accent"
              />
            </div>

            <div className="flex justify-end gap-2 pt-2">
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() => setIsSettingsOpen(false)}
                className="text-xs border-studio-border"
              >
                Cancel
              </Button>
              <Button
                type="submit"
                size="sm"
                className="bg-studio-accent text-studio-bg hover:bg-studio-accent/90 text-xs"
              >
                Save Settings
              </Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>
    </DashboardLayout>
  );
}
