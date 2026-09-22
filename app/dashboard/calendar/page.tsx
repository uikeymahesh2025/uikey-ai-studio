"use client";

import React, { useState } from "react";
import Link from "next/link";
import {
  Calendar as CalendarIcon,
  ChevronLeft,
  ChevronRight,
  AlertTriangle,
  Clock,
  MapPin,
  User,
  Plus,
  Camera,
} from "lucide-react";
import { DashboardLayout } from "@/components/layout/dashboard-layout";
import { useStudio } from "@/lib/store/store-context";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { formatDate } from "@/lib/utils";
import { CalendarEvent } from "@/lib/types";

export default function CalendarPage() {
  const { state } = useStudio();
  const { calendarEvents } = state;

  const [currentMonth, setCurrentMonth] = useState("October 2026");

  // Sample check for double-booking on dates with multiple shoots
  const shootDateCounts: Record<string, number> = {};
  calendarEvents.forEach((ev) => {
    if (ev.type === "shoot") {
      shootDateCounts[ev.date] = (shootDateCounts[ev.date] || 0) + 1;
    }
  });

  const doubleBookedDates = Object.keys(shootDateCounts).filter(
    (d) => shootDateCounts[d] > 1
  );

  const getEventBadge = (type: CalendarEvent["type"]) => {
    switch (type) {
      case "shoot":
        return <Badge variant="accent">Shoot</Badge>;
      case "meeting":
        return <Badge variant="default">Meeting</Badge>;
      case "editing_deadline":
        return <Badge variant="warning">Edit Deadline</Badge>;
      case "delivery_deadline":
        return <Badge variant="success">Delivery</Badge>;
      default:
        return <Badge variant="outline">{type}</Badge>;
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
                Shoot & Delivery Calendar
              </h1>
              <Badge variant="accent" className="text-[10px]">
                {calendarEvents.length} Events Scheduled
              </Badge>
            </div>
            <p className="text-xs text-studio-secondary mt-1">
              Prevent double-booking auspicious wedding muhurat dates and synchronize crew assignments.
            </p>
          </div>

          <div className="flex items-center gap-2">
            <div className="flex items-center rounded-lg border border-studio-border bg-studio-surface p-0.5">
              <button className="p-1 text-studio-muted hover:text-studio-primary">
                <ChevronLeft className="w-4 h-4" />
              </button>
              <span className="px-3 text-xs font-semibold text-studio-primary">
                {currentMonth}
              </span>
              <button className="p-1 text-studio-muted hover:text-studio-primary">
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>

        {/* Double Booking Warning Notice */}
        {doubleBookedDates.length > 0 && (
          <div className="rounded-xl border border-studio-error/40 bg-studio-error/10 p-4 flex items-center gap-3 text-xs text-studio-error">
            <AlertTriangle className="w-5 h-5 shrink-0" />
            <div>
              <strong className="font-bold">Double-Booking Guard Alert!</strong>
              <p className="text-studio-secondary mt-0.5">
                Multiple shoot commitments detected on <strong>{doubleBookedDates.join(", ")}</strong>. Ensure secondary photographer crew is allocated.
              </p>
            </div>
          </div>
        )}

        {/* Calendar Events List View */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {calendarEvents.map((ev) => (
            <Card
              key={ev.id}
              className="hover:border-studio-borderHover transition-all flex flex-col justify-between"
            >
              <CardHeader className="p-5 pb-3">
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <div className="flex items-center gap-2">
                      <h3 className="text-sm font-bold text-studio-primary">
                        {ev.title}
                      </h3>
                      {getEventBadge(ev.type)}
                    </div>
                    <p className="text-xs text-studio-secondary mt-1">
                      Client: {ev.clientName}
                    </p>
                  </div>
                </div>
              </CardHeader>

              <CardContent className="p-5 pt-0 space-y-2.5 text-xs text-studio-muted">
                <div className="flex items-center gap-2 bg-studio-surface/50 p-2 rounded-md border border-studio-border/50">
                  <CalendarIcon className="w-3.5 h-3.5 text-studio-accent" />
                  <span className="font-medium text-studio-primary font-mono">
                    {formatDate(ev.date)}
                  </span>
                </div>

                {ev.venue && (
                  <div className="flex items-center gap-2">
                    <MapPin className="w-3.5 h-3.5 text-studio-secondary" />
                    <span className="truncate">{ev.venue}</span>
                  </div>
                )}

                {ev.assignedTo && (
                  <div className="flex items-center gap-2">
                    <User className="w-3.5 h-3.5 text-studio-secondary" />
                    <span>Crew: {ev.assignedTo}</span>
                  </div>
                )}

                <div className="pt-2 border-t border-studio-border/50 flex items-center justify-between text-[11px]">
                  <span className="text-studio-muted">Status</span>
                  <Badge variant={ev.status === "Booked" ? "success" : "default"} className="text-[10px] py-0">
                    {ev.status}
                  </Badge>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </DashboardLayout>
  );
}
