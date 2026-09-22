"use client";

import React from "react";
import {
  BarChart3,
  TrendingUp,
  CreditCard,
  Users,
  FileCheck,
  Images,
  HardDrive,
  MessageSquare,
  Clock,
  ArrowUpRight,
} from "lucide-react";
import { DashboardLayout } from "@/components/layout/dashboard-layout";
import { useStudio } from "@/lib/store/store-context";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { formatINR } from "@/lib/utils";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
  PieChart,
  Pie,
  Cell,
} from "recharts";

export default function AnalyticsPage() {
  const { state } = useStudio();
  const { studio, projects, quotations, clients, storageUsage } = state;

  const totalRevenue = projects.reduce((acc, p) => acc + p.paidAmount, 0);
  const totalBookingsValue = projects.reduce((acc, p) => acc + p.quotationAmount, 0);
  const avgBookingValue = Math.round(totalBookingsValue / (projects.length || 1));

  const quoteAcceptanceRate = Math.round(
    (quotations.filter((q) => q.status === "Accepted").length / (quotations.length || 1)) * 100
  );

  const servicesBreakdown = [
    { name: "Wedding Day Signature", share: 45, color: "#C4B5FD" },
    { name: "Cinematic Films", share: 25, color: "#6EE7B7" },
    { name: "Fine Art Albums", share: 15, color: "#FCD34D" },
    { name: "Pre-Weddings & Drone", share: 15, color: "#A1A1AA" },
  ];

  const leadSourcesData = [
    { source: "Instagram Portfolio", leads: 18, booked: 7 },
    { source: "Client Referrals", leads: 12, booked: 8 },
    { source: "Wedding Planners", leads: 8, booked: 5 },
    { source: "Public Portfolio", leads: 14, booked: 4 },
  ];

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 border-b border-studio-border/60 pb-5">
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-xl font-bold tracking-tight text-studio-primary">
                Studio Performance & Analytics
              </h1>
              <Badge variant="accent" className="text-[10px]">
                Season 2026
              </Badge>
            </div>
            <p className="text-xs text-studio-secondary mt-1">
              Data-backed business intelligence for Indian wedding & portrait studios.
            </p>
          </div>
        </div>

        {/* 4 Core KPIs */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          <Card>
            <CardContent className="p-4">
              <span className="text-[11px] text-studio-muted">Verified Collections</span>
              <div className="text-2xl font-bold text-studio-primary font-mono mt-1">
                {formatINR(totalRevenue)}
              </div>
              <span className="text-[10px] text-studio-success flex items-center gap-1 mt-1">
                <TrendingUp className="w-3 h-3" /> +38% from last season
              </span>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4">
              <span className="text-[11px] text-studio-muted">Avg Booking Value</span>
              <div className="text-2xl font-bold text-studio-primary font-mono mt-1">
                {formatINR(avgBookingValue)}
              </div>
              <span className="text-[10px] text-studio-muted mt-1 block">
                Across {projects.length} active shoots
              </span>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4">
              <span className="text-[11px] text-studio-muted">Proposal Win Rate</span>
              <div className="text-2xl font-bold text-studio-accent font-mono mt-1">
                {quoteAcceptanceRate}%
              </div>
              <span className="text-[10px] text-studio-muted mt-1 block">
                Above Indian industry avg (45%)
              </span>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4">
              <span className="text-[11px] text-studio-muted">Avg Delivery Speed</span>
              <div className="text-2xl font-bold text-studio-primary font-mono mt-1">
                18 Days
              </div>
              <span className="text-[10px] text-studio-success mt-1 block">
                Proofing gallery in 7 days
              </span>
            </CardContent>
          </Card>
        </div>

        {/* Middle Charts Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Lead Conversion by Source */}
          <div className="lg:col-span-7">
            <Card className="h-full">
              <CardHeader className="p-5 pb-2">
                <CardTitle className="text-sm font-semibold">
                  Leads vs Bookings by Source
                </CardTitle>
                <CardDescription>
                  Where your highest-paying wedding clients discover you.
                </CardDescription>
              </CardHeader>
              <CardContent className="p-5 pt-2">
                <div className="h-60 w-full">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={leadSourcesData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                      <CartesianGrid strokeDasharray="3 3" stroke="#27272A" vertical={false} />
                      <XAxis dataKey="source" stroke="#71717A" fontSize={10} tickLine={false} axisLine={false} />
                      <YAxis stroke="#71717A" fontSize={11} tickLine={false} axisLine={false} />
                      <Tooltip
                        content={({ active, payload }) => {
                          if (active && payload && payload.length) {
                            return (
                              <div className="rounded-lg border border-studio-border bg-studio-card p-2 text-xs shadow-xl">
                                <p className="font-semibold text-studio-primary">{payload[0].payload.source}</p>
                                <p className="text-studio-secondary">Inquiries: {payload[0].value}</p>
                                <p className="text-studio-accent">Booked Shoots: {payload[1]?.value}</p>
                              </div>
                            );
                          }
                          return null;
                        }}
                      />
                      <Bar dataKey="leads" fill="#27272A" radius={[4, 4, 0, 0]} name="Inquiries" />
                      <Bar dataKey="booked" fill="#C4B5FD" radius={[4, 4, 0, 0]} name="Bookings" />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Revenue Contribution by Service */}
          <div className="lg:col-span-5">
            <Card className="h-full">
              <CardHeader className="p-5 pb-2">
                <CardTitle className="text-sm font-semibold">
                  Revenue Breakdown by Service
                </CardTitle>
                <CardDescription>
                  Share of collections by photography package.
                </CardDescription>
              </CardHeader>
              <CardContent className="p-5 pt-0 space-y-4">
                <div className="h-44 w-full flex items-center justify-center">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={servicesBreakdown}
                        innerRadius={45}
                        outerRadius={70}
                        paddingAngle={4}
                        dataKey="share"
                      >
                        {servicesBreakdown.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={entry.color} />
                        ))}
                      </Pie>
                      <Tooltip />
                    </PieChart>
                  </ResponsiveContainer>
                </div>

                <div className="space-y-2 text-xs">
                  {servicesBreakdown.map((srv) => (
                    <div key={srv.name} className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <div className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: srv.color }} />
                        <span className="text-studio-secondary">{srv.name}</span>
                      </div>
                      <span className="font-mono font-bold text-studio-primary">{srv.share}%</span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
