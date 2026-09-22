"use client";

import React, { useState } from "react";
import Link from "next/link";
import {
  Camera,
  CreditCard,
  Images,
  FolderKanban,
  FileText,
  AlertTriangle,
  Clock,
  ArrowUpRight,
  Plus,
  HardDrive,
  Calendar,
  CheckCircle2,
  ChevronRight,
  TrendingUp,
  MessageCircle,
} from "lucide-react";
import { DashboardLayout } from "@/components/layout/dashboard-layout";
import { useStudio } from "@/lib/store/store-context";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { formatINR, formatDate } from "@/lib/utils";
import { QuickCreateModal } from "@/components/modals/quick-create-modal";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
} from "recharts";

export default function DashboardOverviewPage() {
  const { state } = useStudio();
  const {
    studio,
    projects,
    clients,
    quotations,
    payments,
    galleries,
    activityLogs,
    storageUsage,
  } = state;

  const [showQuickCreate, setShowQuickCreate] = useState(false);

  // Computed Metrics
  const activeShoots = projects.filter(
    (p) => p.status === "Shooting" || p.status === "Upcoming" || p.status === "Booked"
  ).length;

  const pendingSelections = galleries.filter(
    (g) => g.status === "Selection submitted" || g.status === "Selection in progress"
  ).length;

  const pendingPaymentsList = payments.filter(
    (p) => p.status === "UTR submitted" || p.status === "Pending"
  );
  const pendingPaymentsCount = pendingPaymentsList.length;

  const outstandingBalance = projects.reduce((acc, p) => acc + p.balanceAmount, 0);
  const totalPaidRevenue = projects.reduce((acc, p) => acc + p.paidAmount, 0);

  // Revenue chart data (realistic monthly curve)
  const revenueChartData = [
    { month: "May", revenue: 140000, projected: 160000 },
    { month: "Jun", revenue: 185000, projected: 190000 },
    { month: "Jul", revenue: 240000, projected: 250000 },
    { month: "Aug", revenue: 215000, projected: 280000 },
    { month: "Sep", revenue: 195000, projected: 320000 },
    { month: "Oct (Proj)", revenue: 380000, projected: 420000 },
  ];

  // Urgent attention items
  const attentionItems = [
    {
      id: "att-1",
      title: "Saanvi Malhotra submitted ₹15,000 UTR",
      desc: "UTR 426189033412 needs verification to unlock master downloads.",
      actionLabel: "Verify Payment",
      href: "/dashboard/payments",
      type: "payment",
      urgent: true,
    },
    {
      id: "att-2",
      title: "Saanvi Portraits selection completed",
      desc: "Client approved 25 selections. Ready for final retouches.",
      actionLabel: "View Gallery",
      href: "/dashboard/galleries/g-2",
      type: "gallery",
      urgent: false,
    },
    {
      id: "att-3",
      title: "Ananya Deshmukh Quotation Pending",
      desc: "Quotation sent 1 day ago. Follow up via WhatsApp recommended.",
      actionLabel: "Send Reminder",
      href: "/dashboard/quotations",
      type: "quotation",
      urgent: false,
    },
  ];

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Welcome Top Banner */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 border-b border-studio-border/60 pb-5">
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-xl font-bold tracking-tight text-studio-primary">
                Good afternoon, {studio.ownerName}
              </h1>
              <Badge variant="accent" className="text-[10px]">
                Studio Active
              </Badge>
            </div>
            <p className="text-xs text-studio-secondary mt-1">
              Here is your shoot pipeline, pending payment verifications, and client deliveries today.
            </p>
          </div>

          <div className="flex items-center gap-2">
            <Link href="/p/arjun-mehta" target="_blank">
              <Button variant="outline" size="sm" className="gap-1.5 text-xs">
                <span>View Portfolio</span>
                <ArrowUpRight className="w-3 h-3 text-studio-muted" />
              </Button>
            </Link>
            <Button
              variant="accent"
              size="sm"
              onClick={() => setShowQuickCreate(true)}
              className="gap-1.5 shadow-sm"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Quick Action</span>
            </Button>
          </div>
        </div>

        {/* High-level KPI Metric Cards */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {/* Active Shoots */}
          <Card className="hover:border-studio-borderHover transition-colors">
            <CardHeader className="flex flex-row items-center justify-between pb-2 p-4">
              <CardTitle className="text-xs font-medium text-studio-secondary">
                Active Shoots
              </CardTitle>
              <div className="p-1.5 rounded-md bg-studio-surface border border-studio-border text-studio-accent">
                <Camera className="w-3.5 h-3.5" />
              </div>
            </CardHeader>
            <CardContent className="p-4 pt-0">
              <div className="text-2xl font-bold text-studio-primary">
                {activeShoots}
              </div>
              <p className="text-[10px] text-studio-muted mt-1 flex items-center gap-1">
                <span>4 upcoming next month</span>
              </p>
            </CardContent>
          </Card>

          {/* Pending Proofing Approvals */}
          <Card className="hover:border-studio-borderHover transition-colors">
            <CardHeader className="flex flex-row items-center justify-between pb-2 p-4">
              <CardTitle className="text-xs font-medium text-studio-secondary">
                Pending Selections
              </CardTitle>
              <div className="p-1.5 rounded-md bg-studio-surface border border-studio-border text-studio-warning">
                <Images className="w-3.5 h-3.5" />
              </div>
            </CardHeader>
            <CardContent className="p-4 pt-0">
              <div className="text-2xl font-bold text-studio-primary">
                {pendingSelections}
              </div>
              <p className="text-[10px] text-studio-warning mt-1">
                1 submitted, 1 selecting
              </p>
            </CardContent>
          </Card>

          {/* Pending Payments & UTR */}
          <Card className="hover:border-studio-borderHover transition-colors">
            <CardHeader className="flex flex-row items-center justify-between pb-2 p-4">
              <CardTitle className="text-xs font-medium text-studio-secondary">
                Pending UTR Verification
              </CardTitle>
              <div className="p-1.5 rounded-md bg-studio-surface border border-studio-border text-studio-success">
                <CreditCard className="w-3.5 h-3.5" />
              </div>
            </CardHeader>
            <CardContent className="p-4 pt-0">
              <div className="text-2xl font-bold text-studio-primary">
                {pendingPaymentsCount}
              </div>
              <p className="text-[10px] text-studio-secondary mt-1">
                {formatINR(15000)} awaiting your approval
              </p>
            </CardContent>
          </Card>

          {/* Outstanding Balance */}
          <Card className="hover:border-studio-borderHover transition-colors">
            <CardHeader className="flex flex-row items-center justify-between pb-2 p-4">
              <CardTitle className="text-xs font-medium text-studio-secondary">
                Outstanding Balance
              </CardTitle>
              <div className="p-1.5 rounded-md bg-studio-surface border border-studio-border text-studio-secondary">
                <TrendingUp className="w-3.5 h-3.5" />
              </div>
            </CardHeader>
            <CardContent className="p-4 pt-0">
              <div className="text-2xl font-bold text-studio-primary">
                {formatINR(outstandingBalance)}
              </div>
              <p className="text-[10px] text-studio-muted mt-1">
                Collected {formatINR(totalPaidRevenue)} this season
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Middle Section: Attention Today & Revenue Area Chart */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Needs Attention Today */}
          <div className="lg:col-span-5 space-y-4">
            <Card className="h-full">
              <CardHeader className="p-5 pb-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <AlertTriangle className="w-4 h-4 text-studio-warning" />
                    <CardTitle className="text-sm font-semibold">
                      Needs Attention Today
                    </CardTitle>
                  </div>
                  <Badge variant="warning" className="text-[9px]">
                    {attentionItems.length} Urgent
                  </Badge>
                </div>
                <CardDescription>
                  Items waiting on your confirmation or client follow-ups.
                </CardDescription>
              </CardHeader>
              <CardContent className="p-5 pt-0 space-y-3">
                {attentionItems.map((item) => (
                  <div
                    key={item.id}
                    className="p-3 rounded-lg border border-studio-border bg-studio-surface/50 flex items-start justify-between gap-3 hover:border-studio-borderHover transition-colors"
                  >
                    <div>
                      <h4 className="text-xs font-semibold text-studio-primary">
                        {item.title}
                      </h4>
                      <p className="text-[11px] text-studio-secondary mt-0.5 leading-snug">
                        {item.desc}
                      </p>
                    </div>
                    <Link href={item.href}>
                      <Button variant="outline" size="sm" className="shrink-0 text-[10px] h-7 px-2">
                        {item.actionLabel}
                      </Button>
                    </Link>
                  </div>
                ))}

                <div className="pt-2">
                  <Link href="/dashboard/payments">
                    <Button variant="secondary" className="w-full text-xs justify-between">
                      <span>Go to UPI Verification Desk</span>
                      <ChevronRight className="w-3.5 h-3.5" />
                    </Button>
                  </Link>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Revenue & Bookings Trajectory Chart */}
          <div className="lg:col-span-7">
            <Card className="h-full">
              <CardHeader className="p-5 pb-2">
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle className="text-sm font-semibold">
                      Wedding Season Revenue
                    </CardTitle>
                    <CardDescription>
                      Actual collections vs projected wedding season targets (INR).
                    </CardDescription>
                  </div>
                  <Badge variant="accent" className="text-[10px]">
                    +42% MoM Growth
                  </Badge>
                </div>
              </CardHeader>
              <CardContent className="p-5 pt-2">
                <div className="h-56 w-full">
                  <ResponsiveContainer width="100%" height="100%">
                    <AreaChart
                      data={revenueChartData}
                      margin={{ top: 10, right: 10, left: -20, bottom: 0 }}
                    >
                      <defs>
                        <linearGradient id="colorRev" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="5%" stopColor="#C4B5FD" stopOpacity={0.4} />
                          <stop offset="95%" stopColor="#C4B5FD" stopOpacity={0.0} />
                        </linearGradient>
                      </defs>
                      <CartesianGrid strokeDasharray="3 3" stroke="#27272A" vertical={false} />
                      <XAxis
                        dataKey="month"
                        stroke="#71717A"
                        fontSize={11}
                        tickLine={false}
                        axisLine={false}
                      />
                      <YAxis
                        stroke="#71717A"
                        fontSize={11}
                        tickLine={false}
                        axisLine={false}
                        tickFormatter={(value) => `₹${value / 1000}k`}
                      />
                      <Tooltip
                        content={({ active, payload }) => {
                          if (active && payload && payload.length) {
                            return (
                              <div className="rounded-lg border border-studio-border bg-studio-card p-2 text-xs shadow-xl">
                                <p className="font-semibold text-studio-primary mb-1">
                                  {payload[0].payload.month}
                                </p>
                                <p className="text-studio-accent font-mono">
                                  Collected: {formatINR(payload[0].value as number)}
                                </p>
                              </div>
                            );
                          }
                          return null;
                        }}
                      />
                      <Area
                        type="monotone"
                        dataKey="revenue"
                        stroke="#C4B5FD"
                        strokeWidth={2}
                        fillOpacity={1}
                        fill="url(#colorRev)"
                      />
                    </AreaChart>
                  </ResponsiveContainer>
                </div>

                <div className="mt-2 flex items-center justify-between text-xs text-studio-muted border-t border-studio-border/50 pt-3">
                  <span>Total Season Bookings: <strong>₹8,40,000</strong></span>
                  <span className="text-studio-success">Avg Shoot Value: ₹1,68,000</span>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Lower Section: Upcoming Projects & Recent Activity */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Active Projects Table */}
          <div className="lg:col-span-8">
            <Card>
              <CardHeader className="p-5 pb-3">
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle className="text-sm font-semibold">
                      Current Projects & Deliverables
                    </CardTitle>
                    <CardDescription>
                      10-stage workflow tracking from shoot completion to final handover.
                    </CardDescription>
                  </div>
                  <Link href="/dashboard/projects">
                    <Button variant="ghost" size="sm" className="text-xs">
                      View all ({projects.length})
                    </Button>
                  </Link>
                </div>
              </CardHeader>
              <CardContent className="p-5 pt-0">
                <div className="space-y-2.5">
                  {projects.map((proj) => (
                    <Link
                      key={proj.id}
                      href={`/dashboard/projects/${proj.id}`}
                      className="block p-3 rounded-lg border border-studio-border bg-studio-surface/40 hover:bg-studio-surface hover:border-studio-borderHover transition-colors"
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 rounded-md bg-studio-card border border-studio-border flex items-center justify-center text-studio-secondary text-xs font-bold">
                            {proj.name.substring(0, 2).toUpperCase()}
                          </div>
                          <div>
                            <div className="flex items-center gap-2">
                              <h4 className="text-xs font-semibold text-studio-primary">
                                {proj.name}
                              </h4>
                              <Badge
                                variant={
                                  proj.status === "Delivered"
                                    ? "success"
                                    : proj.status === "Proofing"
                                    ? "warning"
                                    : "accent"
                                }
                                className="text-[9px] py-0"
                              >
                                {proj.status}
                              </Badge>
                            </div>
                            <p className="text-[11px] text-studio-muted mt-0.5">
                              {proj.clientName} · {proj.venue}
                            </p>
                          </div>
                        </div>

                        <div className="text-right">
                          <span className="text-xs font-semibold text-studio-primary font-mono">
                            {formatINR(proj.quotationAmount)}
                          </span>
                          <p className="text-[10px] text-studio-muted mt-0.5">
                            {proj.photoCount} photos · Due {formatDate(proj.deliveryDeadline)}
                          </p>
                        </div>
                      </div>
                    </Link>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Activity Log */}
          <div className="lg:col-span-4">
            <Card>
              <CardHeader className="p-5 pb-3">
                <CardTitle className="text-sm font-semibold">
                  Recent Studio Activity
                </CardTitle>
                <CardDescription>Real-time audit ledger.</CardDescription>
              </CardHeader>
              <CardContent className="p-5 pt-0">
                <div className="space-y-3">
                  {activityLogs.slice(0, 5).map((log) => (
                    <div key={log.id} className="flex items-start gap-2.5 text-xs">
                      <div className="w-1.5 h-1.5 rounded-full bg-studio-accent mt-1.5 shrink-0" />
                      <div>
                        <p className="text-studio-primary leading-tight">
                          <span className="font-semibold">{log.actorName}</span>{" "}
                          <span className="text-studio-secondary">{log.action}</span>{" "}
                          <span className="font-medium text-studio-accent">{log.target}</span>
                        </p>
                        <span className="text-[10px] text-studio-muted mt-0.5 block">
                          {formatDate(log.timestamp)}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>

      <QuickCreateModal open={showQuickCreate} onOpenChange={setShowQuickCreate} />
    </DashboardLayout>
  );
}
