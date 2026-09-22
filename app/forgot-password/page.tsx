"use client";

import React, { useState } from "react";
import Link from "next/link";
import { Camera, ArrowLeft, CheckCircle2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState("");
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-studio-bg px-4 py-12">
      <div className="w-full max-w-md space-y-6">
        <div className="text-center">
          <Link href="/" className="inline-flex items-center gap-2.5 mb-4 group">
            <div className="h-10 w-10 rounded-xl bg-studio-card border border-studio-border flex items-center justify-center text-studio-accent shadow-sm">
              <Camera className="h-5 w-5" />
            </div>
            <span className="text-base font-bold text-studio-primary">
              UIKEY AI Studio
            </span>
          </Link>
          <h2 className="text-xl font-bold text-studio-primary">Reset password</h2>
          <p className="mt-1 text-xs text-studio-secondary">
            Enter your email and we will send you a reset link.
          </p>
        </div>

        <div className="rounded-xl border border-studio-border bg-studio-card p-6 shadow-xl">
          {submitted ? (
            <div className="text-center py-4 space-y-3">
              <div className="mx-auto w-10 h-10 rounded-full bg-studio-success/20 text-studio-success flex items-center justify-center">
                <CheckCircle2 className="w-6 h-6" />
              </div>
              <h3 className="text-sm font-semibold text-studio-primary">
                Check your inbox
              </h3>
              <p className="text-xs text-studio-secondary">
                If an account exists for <strong>{email}</strong>, a reset link has been dispatched.
              </p>
              <Link href="/login" className="inline-block mt-4">
                <Button variant="outline" size="sm">
                  Back to Login
                </Button>
              </Link>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-medium text-studio-secondary mb-1.5">
                  Email Address
                </label>
                <Input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="photographer@studio.com"
                  required
                />
              </div>

              <Button type="submit" variant="default" className="w-full">
                Send Reset Link
              </Button>
            </form>
          )}
        </div>

        <div className="text-center">
          <Link
            href="/login"
            className="inline-flex items-center gap-1.5 text-xs text-studio-muted hover:text-studio-primary transition-colors"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Back to Login</span>
          </Link>
        </div>
      </div>
    </div>
  );
}
