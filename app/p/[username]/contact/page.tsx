"use client";

import React, { useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import { Camera, ArrowLeft, Send, CheckCircle2, MessageSquare } from "lucide-react";
import { useStudio } from "@/lib/store/store-context";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { createWhatsAppShareUrl } from "@/lib/whatsapp/templates";
import confetti from "canvas-confetti";

export default function PublicContactPage() {
  const params = useParams();
  const username = params.username as string;

  const { state, addInquiryLead } = useStudio();
  const { portfolio, studio } = state;

  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [eventType, setEventType] = useState("Wedding");
  const [eventDate, setEventDate] = useState("2026-11-20");
  const [venue, setVenue] = useState("");
  const [budget, setBudget] = useState<number>(185000);
  const [message, setMessage] = useState("");
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    addInquiryLead({
      name,
      phone,
      email,
      eventType,
      eventDate,
      venue,
      budget: Number(budget),
      message,
    });
    setSubmitted(true);
    confetti({
      particleCount: 100,
      spread: 70,
      origin: { y: 0.6 },
    });
  };

  const whatsappMsg = `Hi ${portfolio.photographerName} ji! Reaching out via your contact form regarding photography for our ${eventType} on ${eventDate}.`;

  return (
    <div className="min-h-screen bg-studio-bg text-studio-primary py-12 px-4 sm:px-6">
      <div className="max-w-xl mx-auto space-y-6">
        <Link
          href={`/p/${username}`}
          className="inline-flex items-center gap-2 text-xs text-studio-muted hover:text-studio-primary transition-colors"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>Back to Portfolio</span>
        </Link>

        <div className="text-center space-y-2">
          <h1 className="text-2xl font-bold text-studio-primary">
            Connect with {portfolio.photographerName}
          </h1>
          <p className="text-xs text-studio-secondary">
            {portfolio.studioName} · {portfolio.serviceArea}
          </p>
        </div>

        <Card className="border-studio-border bg-studio-card p-6 sm:p-8 shadow-2xl">
          {submitted ? (
            <div className="text-center py-6 space-y-3">
              <CheckCircle2 className="w-12 h-12 text-studio-success mx-auto" />
              <h2 className="text-lg font-bold text-studio-primary">Thank You!</h2>
              <p className="text-xs text-studio-secondary leading-relaxed">
                Your inquiry has been submitted directly to our studio management CRM. We will review availability for {eventDate} and follow up via WhatsApp at <strong>{phone}</strong>.
              </p>
              <div className="pt-4">
                <Link href={`/p/${username}`}>
                  <Button variant="outline" size="sm">
                    Return to Portfolio
                  </Button>
                </Link>
              </div>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-medium text-studio-secondary mb-1">
                  Your Full Name
                </label>
                <Input
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="e.g. Neha & Priyanshu"
                  required
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-medium text-studio-secondary mb-1">
                    WhatsApp Phone
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
                    value={eventType}
                    onChange={(e) => setEventType(e.target.value)}
                    placeholder="Wedding, Sangeet..."
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

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-medium text-studio-secondary mb-1">
                    Destination Venue / City
                  </label>
                  <Input
                    value={venue}
                    onChange={(e) => setVenue(e.target.value)}
                    placeholder="e.g. Goa, Udaipur, Mumbai"
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
                  Message / Special Notes
                </label>
                <Textarea
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  placeholder="Share details regarding your celebration..."
                />
              </div>

              <Button type="submit" variant="accent" className="w-full gap-2 font-semibold">
                <Send className="w-4 h-4" />
                <span>Submit Inquiry</span>
              </Button>

              <div className="pt-2 text-center">
                <a
                  href={createWhatsAppShareUrl(portfolio.whatsappNumber, whatsappMsg)}
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex items-center gap-1.5 text-xs text-[#25D366] hover:underline"
                >
                  <MessageSquare className="w-3.5 h-3.5" />
                  <span>Or message directly on WhatsApp</span>
                </a>
              </div>
            </form>
          )}
        </Card>
      </div>
    </div>
  );
}
