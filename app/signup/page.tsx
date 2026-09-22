"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Camera, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export default function SignupPage() {
  const router = useRouter();
  const [name, setName] = useState("");
  const [studioName, setStudioName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    router.push("/onboarding");
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
          <h2 className="text-xl font-bold text-studio-primary">
            Create your studio workspace
          </h2>
          <p className="mt-1 text-xs text-studio-secondary">
            Start free with 1 GB proofing storage. No credit card required.
          </p>
        </div>

        <div className="rounded-xl border border-studio-border bg-studio-card p-6 shadow-xl">
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-medium text-studio-secondary mb-1.5">
                Your Full Name
              </label>
              <Input
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="e.g. Arjun Mehta"
                required
              />
            </div>

            <div>
              <label className="block text-xs font-medium text-studio-secondary mb-1.5">
                Studio / Brand Name
              </label>
              <Input
                value={studioName}
                onChange={(e) => setStudioName(e.target.value)}
                placeholder="e.g. Luminary Wedding Films"
                required
              />
            </div>

            <div>
              <label className="block text-xs font-medium text-studio-secondary mb-1.5">
                Email Address
              </label>
              <Input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@yourstudio.com"
                required
              />
            </div>

            <div>
              <label className="block text-xs font-medium text-studio-secondary mb-1.5">
                Password
              </label>
              <Input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="At least 8 characters"
                required
              />
            </div>

            <Button type="submit" variant="accent" className="w-full gap-2 mt-2">
              <span>Proceed to Studio Setup</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Button>
          </form>
        </div>

        <p className="text-center text-xs text-studio-muted">
          Already have an account?{" "}
          <Link
            href="/login"
            className="font-medium text-studio-accent hover:underline"
          >
            Sign in
          </Link>
        </p>
      </div>
    </div>
  );
}
