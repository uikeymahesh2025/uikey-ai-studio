"use client";

import React, { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import {
  Camera,
  Heart,
  X,
  Star,
  MessageSquare,
  Lock,
  Download,
  Share2,
  ChevronLeft,
  ChevronRight,
  Maximize2,
  CheckCircle2,
  AlertCircle,
  Eye,
  Send,
} from "lucide-react";
import { useStudio } from "@/lib/store/store-context";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { GalleryImage, PhotoSelectionState } from "@/lib/types";
import { createWhatsAppShareUrl } from "@/lib/whatsapp/templates";
import confetti from "canvas-confetti";

export default function PublicProofingGalleryPage() {
  const params = useParams();
  const galleryId = params.id as string;

  const { state, togglePhotoSelection, addPhotoComment, submitGallerySelection } = useStudio();
  const { galleries, galleryImages, studio } = state;

  const gallery = galleries.find((g) => g.id === galleryId);
  const images = galleryImages[galleryId] || [];

  const [activeCategory, setActiveCategory] = useState("all");
  const [filterMode, setFilterMode] = useState<"all" | "favorites" | "maybe" | "rejected">("all");

  // Lightbox State
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null);

  // Comment Modal State
  const [commentImage, setCommentImage] = useState<GalleryImage | null>(null);
  const [commentAuthor, setCommentAuthor] = useState("Client");
  const [commentText, setCommentText] = useState("");

  // Submit Final Selection Modal
  const [showSubmitModal, setShowSubmitModal] = useState(false);
  const [submissionSuccess, setSubmissionSuccess] = useState(gallery?.isSelectionSubmitted || false);

  const selectedPhotos = images.filter((img) => img.selectionState === "favorite");
  const maybePhotos = images.filter((img) => img.selectionState === "maybe");
  const rejectedPhotos = images.filter((img) => img.selectionState === "reject");

  // Category & selection filter
  const displayedImages = images.filter((img) => {
    // 1. Selection state filter
    if (filterMode === "favorites" && img.selectionState !== "favorite") return false;
    if (filterMode === "maybe" && img.selectionState !== "maybe") return false;
    if (filterMode === "rejected" && img.selectionState !== "reject") return false;

    // 2. Category filter
    if (activeCategory === "all") return true;
    return img.category.toLowerCase().includes(activeCategory.toLowerCase());
  });

  // Lightbox Keyboard Navigation (ArrowLeft, ArrowRight, Escape)
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (lightboxIndex === null) return;

      if (e.key === "Escape") {
        setLightboxIndex(null);
      } else if (e.key === "ArrowRight") {
        setLightboxIndex((prev) =>
          prev !== null ? (prev + 1) % displayedImages.length : 0
        );
      } else if (e.key === "ArrowLeft") {
        setLightboxIndex((prev) =>
          prev !== null
            ? (prev - 1 + displayedImages.length) % displayedImages.length
            : 0
        );
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [lightboxIndex, displayedImages]);

  // Gallery PIN Privacy Lock State
  const [isUnlocked, setIsUnlocked] = useState(!gallery?.pin);
  const [enteredPin, setEnteredPin] = useState("");
  const [pinError, setPinError] = useState(false);

  if (!gallery) {
    return (
      <div className="min-h-screen bg-studio-bg flex items-center justify-center p-4">
        <div className="text-center">
          <p className="text-sm text-studio-muted">Gallery not found or invalid link.</p>
        </div>
      </div>
    );
  }

  if (gallery.pin && !isUnlocked) {
    const handlePinSubmit = (e: React.FormEvent) => {
      e.preventDefault();
      if (enteredPin.trim() === gallery.pin) {
        setIsUnlocked(true);
        setPinError(false);
      } else {
        setPinError(true);
      }
    };

    return (
      <div className="min-h-screen bg-studio-bg flex items-center justify-center p-4">
        <div className="w-full max-w-sm rounded-xl border border-studio-border bg-studio-card p-6 shadow-2xl text-center">
          <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-studio-surface text-studio-accent border border-studio-border">
            <Lock className="h-6 w-6" />
          </div>
          <span className="text-[11px] font-mono text-studio-accent uppercase tracking-wider font-semibold">
            PIN Protected
          </span>
          <h1 className="text-lg font-bold text-studio-primary mt-1">
            Private Proofing Gallery
          </h1>
          <p className="mt-1.5 text-xs text-studio-secondary leading-relaxed">
            This proofing gallery for <strong>{gallery.clientName}</strong> is secured with a PIN by {studio.name}.
          </p>

          <form onSubmit={handlePinSubmit} className="mt-5 space-y-4">
            <div>
              <Input
                type="password"
                maxLength={6}
                placeholder="Enter 4-digit PIN"
                value={enteredPin}
                onChange={(e) => {
                  setEnteredPin(e.target.value);
                  setPinError(false);
                }}
                className="text-center text-lg tracking-widest font-mono font-semibold"
                autoFocus
              />
              {pinError && (
                <p className="text-[11px] text-studio-error mt-1.5 font-medium">
                  Incorrect PIN. Please check and try again.
                </p>
              )}
            </div>

            <Button type="submit" variant="accent" className="w-full font-semibold">
              Unlock Gallery
            </Button>
          </form>

          <div className="mt-4 p-2.5 rounded-lg bg-studio-surface/50 border border-studio-border/50 text-left">
            <div className="flex items-center justify-between text-[11px] text-studio-muted">
              <span>Demo Security PIN:</span>
              <span className="font-mono font-bold text-studio-primary bg-studio-card px-1.5 py-0.5 rounded border border-studio-border">
                {gallery.pin}
              </span>
            </div>
          </div>
        </div>
      </div>
    );
  }

  const handleSelection = (imgId: string, state: PhotoSelectionState) => {
    togglePhotoSelection(gallery.id, imgId, state);
  };

  const handleAddComment = (e: React.FormEvent) => {
    e.preventDefault();
    if (!commentImage || !commentText.trim()) return;

    addPhotoComment(gallery.id, commentImage.id, commentAuthor, commentText.trim());
    setCommentText("");
    setCommentImage(null);
  };

  const handleFinalSubmit = () => {
    submitGallerySelection(gallery.id);
    setShowSubmitModal(false);
    setSubmissionSuccess(true);
    confetti({
      particleCount: 120,
      spread: 80,
      origin: { y: 0.6 },
    });
  };

  const contactStudioMsg = `Hi ${studio.ownerName} ji! Reviewing the proofing gallery for *${gallery.projectName}*. We have selected ${selectedPhotos.length} photos so far.`;

  return (
    <div className="min-h-screen bg-studio-bg text-studio-primary pb-28 selection:bg-studio-accent selection:text-studio-bg">
      {/* Top Client Header */}
      <header className="sticky top-0 z-30 border-b border-studio-border bg-studio-bg/85 backdrop-blur-md px-4 sm:px-6 py-3">
        <div className="mx-auto max-w-7xl flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-studio-card border border-studio-border flex items-center justify-center text-studio-accent shadow-sm">
              <Camera className="w-4 h-4" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-bold text-sm text-studio-primary">
                  {gallery.projectName}
                </span>
                <Badge variant="accent" className="text-[10px] py-0">
                  Proofing
                </Badge>
              </div>
              <p className="text-[11px] text-studio-muted">
                {studio.name} · {images.length} Watermarked Photographs
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <a
              href={createWhatsAppShareUrl(studio.whatsappNumber, contactStudioMsg)}
              target="_blank"
              rel="noreferrer"
            >
              <Button variant="whatsapp" size="sm" className="h-8 text-xs gap-1.5">
                <MessageSquare className="w-3.5 h-3.5" />
                <span>Message Studio</span>
              </Button>
            </a>

            {gallery.downloadsUnlocked ? (
              <Button
                variant="accent"
                size="sm"
                className="h-8 text-xs gap-1.5"
                onClick={() => alert("Downloading High-Resolution Master Archive...")}
              >
                <Download className="w-3.5 h-3.5" />
                <span>Download All Originals</span>
              </Button>
            ) : (
              <div className="flex items-center gap-1.5 bg-studio-surface border border-studio-border/60 rounded-md px-2.5 py-1 text-[11px] text-studio-muted">
                <Lock className="w-3 h-3 text-studio-warning" />
                <span>Master Downloads Locked</span>
              </div>
            )}
          </div>
        </div>
      </header>

      {/* Submission Success Notice */}
      {submissionSuccess && (
        <div className="mx-auto max-w-7xl px-4 sm:px-6 pt-4">
          <div className="rounded-xl border border-studio-success/40 bg-studio-success/10 p-4 flex items-center gap-3 text-xs text-studio-success">
            <CheckCircle2 className="w-5 h-5 shrink-0" />
            <div>
              <strong className="font-bold">Selection Submitted!</strong>
              <p className="text-studio-secondary mt-0.5">
                Thank you, {gallery.clientName}! Your {selectedPhotos.length} selected photos have been sent to {studio.name}&apos;s editing team.
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Category Tabs & Filter Pills */}
      <div className="mx-auto max-w-7xl px-4 sm:px-6 pt-6">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 border-b border-studio-border/60 pb-3">
          {/* Category Tabs */}
          <div className="flex items-center gap-1.5 overflow-x-auto pb-1 sm:pb-0 w-full sm:w-auto">
            {gallery.categories.map((cat) => (
              <button
                key={cat.id}
                onClick={() => setActiveCategory(cat.name === "All Photos" ? "all" : cat.name)}
                className={`px-3 py-1 rounded-md text-xs font-medium whitespace-nowrap transition-colors border ${
                  (activeCategory === "all" && cat.name === "All Photos") ||
                  activeCategory === cat.name
                    ? "bg-studio-card text-studio-primary border-studio-accent/50 shadow-sm"
                    : "border-studio-border bg-studio-surface text-studio-muted hover:text-studio-secondary"
                }`}
              >
                {cat.name}
              </button>
            ))}
          </div>

          {/* Quick Selection Filter Pills */}
          <div className="flex items-center gap-1.5 text-xs">
            <button
              onClick={() => setFilterMode("all")}
              className={`px-2.5 py-1 rounded-md text-[11px] border transition-colors ${
                filterMode === "all"
                  ? "bg-studio-card text-studio-primary border-studio-border"
                  : "text-studio-muted hover:text-studio-secondary border-transparent"
              }`}
            >
              All ({images.length})
            </button>
            <button
              onClick={() => setFilterMode("favorites")}
              className={`flex items-center gap-1 px-2.5 py-1 rounded-md text-[11px] border transition-colors ${
                filterMode === "favorites"
                  ? "bg-studio-accentMuted text-studio-accent border-studio-accent/40 font-bold"
                  : "text-studio-muted hover:text-studio-secondary border-transparent"
              }`}
            >
              ❤️ Favorites ({selectedPhotos.length})
            </button>
            <button
              onClick={() => setFilterMode("maybe")}
              className={`flex items-center gap-1 px-2.5 py-1 rounded-md text-[11px] border transition-colors ${
                filterMode === "maybe"
                  ? "bg-studio-warning/20 text-studio-warning border-studio-warning/40 font-bold"
                  : "text-studio-muted hover:text-studio-secondary border-transparent"
              }`}
            >
              ⭐ Maybe ({maybePhotos.length})
            </button>
          </div>
        </div>
      </div>

      {/* Responsive Masonry Grid of Proofing Photos */}
      <main className="mx-auto max-w-7xl px-4 sm:px-6 pt-6">
        <div className="columns-1 sm:columns-2 lg:columns-3 xl:columns-4 gap-4 space-y-4">
          {displayedImages.map((img, index) => {
            const isFav = img.selectionState === "favorite";
            const isReject = img.selectionState === "reject";
            const isMaybe = img.selectionState === "maybe";

            return (
              <div
                key={img.id}
                className="relative break-inside-avoid rounded-xl overflow-hidden border border-studio-border bg-studio-card group transition-all hover:border-studio-borderHover shadow-md"
              >
                {/* Image Container with Watermark Overlay */}
                <div
                  className="relative cursor-pointer overflow-hidden"
                  onClick={() => setLightboxIndex(index)}
                >
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={img.previewUrl}
                    alt={img.filename}
                    loading="lazy"
                    className="w-full h-auto object-cover transition-transform duration-300 group-hover:scale-[1.02]"
                  />

                  {/* Diagonal Watermark Overlay */}
                  <div className="watermark-overlay opacity-35 watermark-pattern">
                    <span className="watermark-text text-xs sm:text-sm text-white/70 font-mono">
                      {gallery.watermarkText}
                    </span>
                  </div>

                  {/* Fullscreen Magnifier Hover Hint */}
                  <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                    <div className="p-2.5 rounded-full bg-studio-card/80 text-studio-primary backdrop-blur border border-white/20">
                      <Maximize2 className="w-4 h-4" />
                    </div>
                  </div>
                </div>

                {/* Photo Action Bar at bottom of card */}
                <div className="p-3 bg-studio-card border-t border-studio-border/60 flex items-center justify-between">
                  <span className="text-[10px] font-mono text-studio-muted truncate max-w-[120px]">
                    {img.filename}
                  </span>

                  <div className="flex items-center gap-1">
                    {/* Comment button */}
                    <button
                      type="button"
                      onClick={() => setCommentImage(img)}
                      title="Add note to photo"
                      className={`p-1.5 rounded hover:bg-studio-surface transition-colors ${
                        img.comments.length > 0 ? "text-studio-accent font-bold" : "text-studio-muted"
                      }`}
                    >
                      <MessageSquare className="w-4 h-4" />
                    </button>

                    {/* Maybe ⭐ */}
                    <button
                      type="button"
                      onClick={() => handleSelection(img.id, isMaybe ? "unrated" : "maybe")}
                      title="Maybe"
                      className={`p-1.5 rounded hover:bg-studio-surface transition-colors ${
                        isMaybe ? "text-studio-warning font-bold" : "text-studio-muted"
                      }`}
                    >
                      <Star className={`w-4 h-4 ${isMaybe ? "fill-studio-warning" : ""}`} />
                    </button>

                    {/* Reject ✖ */}
                    <button
                      type="button"
                      onClick={() => handleSelection(img.id, isReject ? "unrated" : "reject")}
                      title="Reject"
                      className={`p-1.5 rounded hover:bg-studio-surface transition-colors ${
                        isReject ? "text-studio-error font-bold" : "text-studio-muted"
                      }`}
                    >
                      <X className="w-4 h-4" />
                    </button>

                    {/* Favorite ❤️ */}
                    <button
                      type="button"
                      onClick={() => handleSelection(img.id, isFav ? "unrated" : "favorite")}
                      title="Favorite"
                      className={`p-1.5 rounded hover:bg-studio-surface transition-colors ${
                        isFav ? "text-studio-accent font-bold" : "text-studio-muted"
                      }`}
                    >
                      <Heart className={`w-4 h-4 ${isFav ? "fill-studio-accent text-studio-accent" : ""}`} />
                    </button>
                  </div>
                </div>

                {/* Show comment snippet if exists */}
                {img.comments.length > 0 && (
                  <div className="px-3 pb-2 pt-0 text-[10px] text-studio-secondary bg-studio-card/80 border-t border-studio-border/30 italic">
                    &quot;{img.comments[img.comments.length - 1].text}&quot;
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </main>

      {/* Sticky Bottom Selection Bar for Mobile & Desktop */}
      <div className="fixed bottom-0 inset-x-0 z-40 bg-studio-card/95 backdrop-blur-md border-t border-studio-border p-3 sm:p-4 shadow-2xl">
        <div className="mx-auto max-w-7xl flex items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-1 text-sm font-bold text-studio-primary">
              <Heart className="w-4 h-4 fill-studio-accent text-studio-accent" />
              <span>{selectedPhotos.length}</span>
              <span className="text-xs text-studio-muted font-normal">
                / {gallery.requiredSelectionCount || 50} required picks
              </span>
            </div>

            <button
              onClick={() => setFilterMode(filterMode === "favorites" ? "all" : "favorites")}
              className="hidden sm:inline-flex text-xs text-studio-accent hover:underline font-medium"
            >
              {filterMode === "favorites" ? "View All Photos" : "Review Selections"}
            </button>
          </div>

          <div className="flex items-center gap-2">
            <Button
              onClick={() => setShowSubmitModal(true)}
              variant="accent"
              size="sm"
              className="gap-1.5 font-semibold shadow-md"
            >
              <Send className="w-3.5 h-3.5" />
              <span>Submit Selection</span>
            </Button>
          </div>
        </div>
      </div>

      {/* Full-Screen Lightbox Modal */}
      {lightboxIndex !== null && displayedImages[lightboxIndex] && (
        <div className="fixed inset-0 z-50 bg-black/95 flex flex-col justify-between select-none animate-fade-in">
          {/* Top Lightbox Bar */}
          <div className="p-4 flex items-center justify-between text-white border-b border-white/10">
            <span className="text-xs font-mono text-white/70">
              {displayedImages[lightboxIndex].filename} ({lightboxIndex + 1} / {displayedImages.length})
            </span>
            <button
              onClick={() => setLightboxIndex(null)}
              className="p-1.5 rounded-full hover:bg-white/10 text-white transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Main Image with Diagonal Watermark Overlay */}
          <div className="relative flex-1 flex items-center justify-center p-4 overflow-hidden">
            {/* Left navigation arrow */}
            <button
              onClick={() =>
                setLightboxIndex(
                  (lightboxIndex - 1 + displayedImages.length) % displayedImages.length
                )
              }
              className="absolute left-4 z-20 p-2.5 rounded-full bg-black/60 text-white hover:bg-black/90 transition-colors"
            >
              <ChevronLeft className="w-6 h-6" />
            </button>

            {/* Image + Watermark */}
            <div className="relative max-h-[80vh] max-w-[90vw] flex items-center justify-center">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={displayedImages[lightboxIndex].previewUrl}
                alt={displayedImages[lightboxIndex].filename}
                className="max-h-[80vh] max-w-[90vw] object-contain rounded shadow-2xl"
              />

              {/* Watermark diagonal overlay in lightbox */}
              <div className="watermark-overlay opacity-30">
                <span className="watermark-text text-base sm:text-2xl text-white/70 font-mono font-black">
                  {gallery.watermarkText}
                </span>
              </div>
            </div>

            {/* Right navigation arrow */}
            <button
              onClick={() =>
                setLightboxIndex((lightboxIndex + 1) % displayedImages.length)
              }
              className="absolute right-4 z-20 p-2.5 rounded-full bg-black/60 text-white hover:bg-black/90 transition-colors"
            >
              <ChevronRight className="w-6 h-6" />
            </button>
          </div>

          {/* Bottom Lightbox Controls */}
          <div className="p-4 bg-black/80 border-t border-white/10 flex items-center justify-center gap-4">
            <Button
              variant={
                displayedImages[lightboxIndex].selectionState === "favorite"
                  ? "accent"
                  : "outline"
              }
              size="sm"
              onClick={() =>
                handleSelection(
                  displayedImages[lightboxIndex].id,
                  displayedImages[lightboxIndex].selectionState === "favorite"
                    ? "unrated"
                    : "favorite"
                )
              }
              className="gap-1.5"
            >
              <Heart className="w-4 h-4" />
              <span>Favorite</span>
            </Button>

            <Button
              variant={
                displayedImages[lightboxIndex].selectionState === "maybe"
                  ? "default"
                  : "outline"
              }
              size="sm"
              onClick={() =>
                handleSelection(
                  displayedImages[lightboxIndex].id,
                  displayedImages[lightboxIndex].selectionState === "maybe"
                    ? "unrated"
                    : "maybe"
                )
              }
              className="gap-1.5"
            >
              <Star className="w-4 h-4" />
              <span>Maybe</span>
            </Button>

            <Button
              variant="outline"
              size="sm"
              onClick={() => setCommentImage(displayedImages[lightboxIndex])}
              className="gap-1.5"
            >
              <MessageSquare className="w-4 h-4" />
              <span>Add Note</span>
            </Button>
          </div>
        </div>
      )}

      {/* Add Photo Note Modal */}
      <Dialog open={Boolean(commentImage)} onOpenChange={(open) => !open && setCommentImage(null)}>
        <DialogContent onClose={() => setCommentImage(null)} className="max-w-md">
          <DialogHeader>
            <DialogTitle>Add Note for Photo</DialogTitle>
            <DialogDescription>
              {commentImage?.filename} — Tell your photographer or editor about album placement, retouching, or crops.
            </DialogDescription>
          </DialogHeader>

          <form onSubmit={handleAddComment} className="space-y-3">
            <div>
              <label className="block text-xs font-medium text-studio-secondary mb-1">
                Your Name
              </label>
              <Input
                value={commentAuthor}
                onChange={(e) => setCommentAuthor(e.target.value)}
                required
              />
            </div>

            <div>
              <label className="block text-xs font-medium text-studio-secondary mb-1">
                Note / Instructions
              </label>
              <Textarea
                value={commentText}
                onChange={(e) => setCommentText(e.target.value)}
                placeholder="e.g. Please retouch glare on glasses and include in opening album spread..."
                required
              />
            </div>

            <DialogFooter>
              <Button
                type="button"
                variant="outline"
                onClick={() => setCommentImage(null)}
              >
                Cancel
              </Button>
              <Button type="submit" variant="accent">
                Save Note
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      {/* Confirmation Modal Before Final Submission */}
      <Dialog open={showSubmitModal} onOpenChange={setShowSubmitModal}>
        <DialogContent onClose={() => setShowSubmitModal(false)} className="max-w-md">
          <DialogHeader>
            <DialogTitle>Submit Final Selection?</DialogTitle>
            <DialogDescription>
              You have selected {selectedPhotos.length} favorite photos out of {gallery.totalImages}.
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-3 text-xs text-studio-secondary">
            <p>
              Once submitted, {studio.name}&apos;s editing team will be immediately notified to begin color grading and album preparation.
            </p>
            <div className="p-3 rounded-lg border border-studio-border bg-studio-surface/50 font-mono text-studio-primary flex items-center justify-between">
              <span>Selected Must-Haves:</span>
              <span className="font-bold text-studio-accent">{selectedPhotos.length} photos</span>
            </div>
          </div>

          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={() => setShowSubmitModal(false)}
            >
              Keep Selecting
            </Button>
            <Button onClick={handleFinalSubmit} variant="accent" className="gap-1.5">
              <CheckCircle2 className="w-4 h-4" />
              <span>Confirm & Send to Studio</span>
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
