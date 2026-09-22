"use client";

import React, { useState } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import {
  Camera,
  MapPin,
  MessageSquare,
  Sparkles,
  Calendar,
  CheckCircle2,
  Star,
  ArrowRight,
  Instagram,
  Send,
} from "lucide-react";
import { useStudio } from "@/lib/store/store-context";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { formatINR } from "@/lib/utils";
import { createWhatsAppShareUrl } from "@/lib/whatsapp/templates";
import confetti from "canvas-confetti";

export default function PublicPortfolioPage() {
  const params = useParams();
  const username = params.username as string;

  const { state, addInquiryLead } = useStudio();
  const { portfolio, studio } = state;

  const [activeCategory, setActiveCategory] = useState("All");

  // Inquiry Form State
  const [inquiryName, setInquiryName] = useState("");
  const [inquiryPhone, setInquiryPhone] = useState("");
  const [inquiryEmail, setInquiryEmail] = useState("");
  const [inquiryType, setInquiryType] = useState("Wedding");
  const [inquiryDate, setInquiryDate] = useState("2026-12-10");
  const [inquiryVenue, setInquiryVenue] = useState("");
  const [inquiryBudget, setInquiryBudget] = useState<number>(185000);
  const [inquiryMessage, setInquiryMessage] = useState("");
  const [inquirySent, setInquirySent] = useState(false);

  const handleInquirySubmit = (e: React.FormEvent) => {
    e.preventDefault();
    addInquiryLead({
      name: inquiryName,
      phone: inquiryPhone,
      email: inquiryEmail,
      eventType: inquiryType,
      eventDate: inquiryDate,
      venue: inquiryVenue,
      budget: Number(inquiryBudget),
      message: inquiryMessage,
    });

    setInquirySent(true);
    confetti({
      particleCount: 100,
      spread: 70,
      origin: { y: 0.6 },
    });
  };

  const whatsappDirectMsg = `Namaste ${portfolio.photographerName} ji! Discovered your portfolio on UIKEY AI Studio. We would love to discuss photography coverage for our upcoming event.`;

  // Curated showcase gallery items
  const portfolioPhotos = [
    {
      id: "pf-1",
      category: "Weddings",
      title: "Royal Mandap Ceremony · Udaipur",
      url: "https://images.unsplash.com/photo-1519741497674-611481863552?w=800&auto=format&fit=crop&q=80",
    },
    {
      id: "pf-2",
      category: "Weddings",
      title: "Vibrant Sangeet Euphoria",
      url: "https://images.unsplash.com/photo-1520854221256-17451cc331bf?w=800&auto=format&fit=crop&q=80",
    },
    {
      id: "pf-3",
      category: "Pre-weddings",
      title: "Sunset Serenade on Goa Coast",
      url: "https://images.unsplash.com/photo-1511285560929-80b456fea0bc?w=800&auto=format&fit=crop&q=80",
    },
    {
      id: "pf-4",
      category: "Portraits",
      title: "Editorial Bridal Portraiture",
      url: "https://images.unsplash.com/photo-1583939003579-730e3918a45a?w=800&auto=format&fit=crop&q=80",
    },
    {
      id: "pf-5",
      category: "Weddings",
      title: "Intimate Vow Exchanges",
      url: "https://images.unsplash.com/photo-1610030469983-98e550d6193c?w=800&auto=format&fit=crop&q=80",
    },
    {
      id: "pf-6",
      category: "Fashion",
      title: "Contemporary Couture Series",
      url: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=800&auto=format&fit=crop&q=80",
    },
  ];

  const filteredPhotos = portfolioPhotos.filter((p) => {
    if (activeCategory === "All") return true;
    return p.category === activeCategory;
  });

  return (
    <div className="min-h-screen bg-studio-bg text-studio-primary selection:bg-studio-accent selection:text-studio-bg">
      {/* Portfolio Header */}
      <header className="sticky top-0 z-30 border-b border-studio-border bg-studio-bg/85 backdrop-blur-md px-4 sm:px-8 py-3.5">
        <div className="mx-auto max-w-7xl flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-studio-card border border-studio-border flex items-center justify-center text-studio-accent">
              <Camera className="w-4 h-4" />
            </div>
            <span className="font-bold text-sm text-studio-primary tracking-tight">
              {portfolio.studioName}
            </span>
          </div>

          <div className="flex items-center gap-3">
            <a
              href={createWhatsAppShareUrl(portfolio.whatsappNumber, whatsappDirectMsg)}
              target="_blank"
              rel="noreferrer"
            >
              <Button variant="whatsapp" size="sm" className="gap-1.5 text-xs">
                <MessageSquare className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">WhatsApp</span>
              </Button>
            </a>
            <a href="#inquiry">
              <Button variant="accent" size="sm" className="text-xs font-semibold">
                Inquire Dates
              </Button>
            </a>
          </div>
        </div>
      </header>

      {/* Hero Showcase */}
      <section className="relative h-[65vh] sm:h-[75vh] w-full overflow-hidden flex items-end">
        {/* Hero Background Image */}
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={portfolio.heroImageUrl}
          alt={portfolio.studioName}
          className="absolute inset-0 w-full h-full object-cover object-center"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-studio-bg via-studio-bg/60 to-transparent" />

        <div className="relative z-10 mx-auto max-w-7xl px-4 sm:px-8 pb-12 w-full">
          <Badge variant="accent" className="mb-3 text-[11px]">
            {portfolio.serviceArea}
          </Badge>
          <h1 className="text-3xl sm:text-5xl lg:text-6xl font-bold tracking-tight text-white max-w-3xl leading-tight">
            {portfolio.photographerName}
          </h1>
          <p className="mt-3 text-xs sm:text-sm text-zinc-300 max-w-2xl leading-relaxed">
            {portfolio.bio}
          </p>

          <div className="mt-6 flex flex-wrap items-center gap-4 text-xs">
            <span className="flex items-center gap-1.5 text-zinc-300">
              <MapPin className="w-3.5 h-3.5 text-studio-accent" />
              Based in {portfolio.city}
            </span>
            <span className="text-zinc-500">·</span>
            <span className="text-zinc-300">
              Starting from {formatINR(portfolio.startingPrice)}
            </span>
            <span className="text-zinc-500">·</span>
            <span className="text-studio-success">
              Available for Destination Travel
            </span>
          </div>
        </div>
      </section>

      {/* Category Tabs & Visual Work Grid */}
      <section className="py-16 max-w-7xl mx-auto px-4 sm:px-8">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-studio-border/60 pb-4 mb-8">
          <div>
            <h2 className="text-xl font-bold text-studio-primary">Selected Works</h2>
            <p className="text-xs text-studio-secondary mt-0.5">
              Curated stories documented across India and worldwide.
            </p>
          </div>

          <div className="flex items-center gap-1.5 overflow-x-auto pb-1 sm:pb-0">
            {["All", ...portfolio.categories].map((cat) => (
              <button
                key={cat}
                onClick={() => setActiveCategory(cat)}
                className={`px-3 py-1 rounded-md text-xs font-medium transition-colors border ${
                  activeCategory === cat
                    ? "bg-studio-card text-studio-primary border-studio-accent/50 shadow-sm"
                    : "border-studio-border bg-studio-surface text-studio-muted hover:text-studio-secondary"
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

        {/* Portfolio Masonry Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredPhotos.map((photo) => (
            <div
              key={photo.id}
              className="group relative rounded-xl overflow-hidden border border-studio-border bg-studio-card aspect-[4/3] shadow-lg hover:border-studio-borderHover transition-all"
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={photo.url}
                alt={photo.title}
                className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                loading="lazy"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-80 group-hover:opacity-95 transition-opacity" />
              <div className="absolute bottom-4 left-4 right-4 text-white">
                <span className="text-[10px] font-mono text-studio-accent block uppercase tracking-wider">
                  {photo.category}
                </span>
                <h3 className="text-sm font-semibold mt-0.5">{photo.title}</h3>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-16 border-t border-studio-border/60 bg-studio-surface/30">
        <div className="max-w-7xl mx-auto px-4 sm:px-8">
          <h2 className="text-xl font-bold text-center text-studio-primary mb-10">
            Kind Words from Couples
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {portfolio.testimonials.map((t) => (
              <Card key={t.clientName} className="p-5 border-studio-border bg-studio-card">
                <div className="flex items-center gap-1 text-studio-warning mb-3">
                  {[...Array(t.rating)].map((_, i) => (
                    <Star key={i} className="w-3.5 h-3.5 fill-studio-warning" />
                  ))}
                </div>
                <p className="text-xs text-studio-secondary leading-relaxed italic">
                  &quot;{t.quote}&quot;
                </p>
                <div className="mt-4 pt-3 border-t border-studio-border/50">
                  <span className="text-xs font-bold text-studio-primary block">
                    {t.clientName}
                  </span>
                  <span className="text-[10px] text-studio-muted">{t.event}</span>
                </div>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Services & Pricing Tiers */}
      <section className="py-16 max-w-7xl mx-auto px-4 sm:px-8 border-t border-studio-border/60">
        <div className="text-center max-w-2xl mx-auto mb-12">
          <h2 className="text-2xl font-bold text-studio-primary">
            Curated Photography Collections
          </h2>
          <p className="text-xs text-studio-secondary mt-1">
            Every collection includes color grading, online proofing, and private delivery.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {portfolio.services.map((srv) => (
            <Card key={srv.title} className="p-6 border-studio-border bg-studio-card flex flex-col justify-between">
              <div>
                <h3 className="text-base font-bold text-studio-primary">{srv.title}</h3>
                <div className="text-2xl font-extrabold text-studio-primary font-mono mt-2">
                  {srv.price}
                </div>
                <p className="text-xs text-studio-secondary mt-2 leading-relaxed">
                  {srv.description}
                </p>
                <ul className="mt-5 space-y-2 text-xs text-studio-muted">
                  {srv.features.map((f) => (
                    <li key={f} className="flex items-center gap-2">
                      <CheckCircle2 className="w-3.5 h-3.5 text-studio-accent shrink-0" />
                      <span>{f}</span>
                    </li>
                  ))}
                </ul>
              </div>
              <div className="mt-6">
                <a href="#inquiry">
                  <Button variant="secondary" className="w-full text-xs">
                    Inquire for this Package
                  </Button>
                </a>
              </div>
            </Card>
          ))}
        </div>
      </section>

      {/* Booking Inquiry Form */}
      <section id="inquiry" className="py-20 border-t border-studio-border/60 bg-studio-card/60">
        <div className="max-w-xl mx-auto px-4 sm:px-6">
          <div className="text-center mb-8">
            <Badge variant="accent" className="mb-2 text-[10px]">
              Reserve Your Dates
            </Badge>
            <h2 className="text-2xl font-bold text-studio-primary">
              Let&apos;s Create Something Timeless
            </h2>
            <p className="text-xs text-studio-secondary mt-1">
              Submit your wedding details below. Your inquiry is directly routed to {portfolio.photographerName}&apos;s studio desk.
            </p>
          </div>

          {inquirySent ? (
            <div className="p-6 rounded-xl border border-studio-success/40 bg-studio-success/10 text-center space-y-3">
              <CheckCircle2 className="w-10 h-10 text-studio-success mx-auto" />
              <h3 className="text-base font-bold text-studio-primary">
                Inquiry Received!
              </h3>
              <p className="text-xs text-studio-secondary leading-relaxed">
                Thank you, {inquiryName}. Your inquiry has been created in our CRM. We will reach out via WhatsApp at <strong>{inquiryPhone}</strong> within 24 hours.
              </p>
            </div>
          ) : (
            <form onSubmit={handleInquirySubmit} className="space-y-4 rounded-xl border border-studio-border bg-studio-card p-6 sm:p-8 shadow-2xl">
              <div>
                <label className="block text-xs font-medium text-studio-secondary mb-1">
                  Your Name(s)
                </label>
                <Input
                  value={inquiryName}
                  onChange={(e) => setInquiryName(e.target.value)}
                  placeholder="e.g. Ananya & Rishabh"
                  required
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-medium text-studio-secondary mb-1">
                    WhatsApp Phone Number
                  </label>
                  <Input
                    value={inquiryPhone}
                    onChange={(e) => setInquiryPhone(e.target.value)}
                    placeholder="+91 98200 98200"
                    required
                  />
                </div>

                <div>
                  <label className="block text-xs font-medium text-studio-secondary mb-1">
                    Email Address
                  </label>
                  <Input
                    type="email"
                    value={inquiryEmail}
                    onChange={(e) => setInquiryEmail(e.target.value)}
                    placeholder="you@gmail.com"
                    required
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-medium text-studio-secondary mb-1">
                    Event Type
                  </label>
                  <Input
                    value={inquiryType}
                    onChange={(e) => setInquiryType(e.target.value)}
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
                    value={inquiryDate}
                    onChange={(e) => setInquiryDate(e.target.value)}
                    required
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-medium text-studio-secondary mb-1">
                    Venue / Destination City
                  </label>
                  <Input
                    value={inquiryVenue}
                    onChange={(e) => setInquiryVenue(e.target.value)}
                    placeholder="e.g. The Leela Palace, Udaipur"
                    required
                  />
                </div>

                <div>
                  <label className="block text-xs font-medium text-studio-secondary mb-1">
                    Estimated Budget (₹)
                  </label>
                  <Input
                    type="number"
                    value={inquiryBudget}
                    onChange={(e) => setInquiryBudget(Number(e.target.value))}
                    required
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-medium text-studio-secondary mb-1">
                  Tell Us About Your Vision
                </label>
                <Textarea
                  value={inquiryMessage}
                  onChange={(e) => setInquiryMessage(e.target.value)}
                  placeholder="Tell us about your events, special rituals, or aesthetic preferences..."
                  className="min-h-[80px]"
                />
              </div>

              <Button type="submit" variant="accent" className="w-full gap-2 font-semibold shadow-md">
                <Send className="w-4 h-4" />
                <span>Submit Booking Inquiry</span>
              </Button>
            </form>
          )}
        </div>
      </section>

      {/* Footer */}
      <footer className="py-10 border-t border-studio-border/60 text-center text-xs text-studio-muted">
        <p>© {new Date().getFullYear()} {portfolio.studioName} · Powered by UIKEY AI Studio</p>
      </footer>
    </div>
  );
}
