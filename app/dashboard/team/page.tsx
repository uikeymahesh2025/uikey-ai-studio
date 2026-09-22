"use client";

import React, { useState } from "react";
import {
  UserCheck,
  UserPlus,
  Shield,
  Check,
  X,
  Mail,
  Phone,
  Camera,
} from "lucide-react";
import { DashboardLayout } from "@/components/layout/dashboard-layout";
import { useStudio } from "@/lib/store/store-context";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { UserRole, TeamMember } from "@/lib/types";

export default function TeamManagementPage() {
  const { state } = useStudio();
  const { team, studio } = state;

  const [selectedMember, setSelectedMember] = useState<TeamMember>(team[0]);

  const permissionsList = [
    { key: "canViewProjects", label: "View Shoots & Projects" },
    { key: "canEditProjects", label: "Edit Shoot Checklists & Timelines" },
    { key: "canUploadPhotos", label: "Upload & Manage Proofing Galleries" },
    { key: "canManageClients", label: "CRM & Client Communication" },
    { key: "canCreateQuotations", label: "Generate & Send Quotations" },
    { key: "canVerifyPayments", label: "Verify Client UPI UTR & Payments" },
    { key: "canViewAnalytics", label: "Access Studio Financial Analytics" },
    { key: "canManageTeam", label: "Invite & Manage Team Seats" },
  ];

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 border-b border-studio-border/60 pb-5">
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-xl font-bold tracking-tight text-studio-primary">
                Team & Role Permissions
              </h1>
              <Badge variant="accent" className="text-[10px]">
                {team.length} Members Active
              </Badge>
            </div>
            <p className="text-xs text-studio-secondary mt-1">
              Collaborate securely with assistant photographers, colorist editors, and studio finance managers.
            </p>
          </div>

          <Button
            variant="accent"
            size="sm"
            className="gap-1.5 shadow-sm"
            onClick={() => alert("Invite link copied to clipboard for team members!")}
          >
            <UserPlus className="w-3.5 h-3.5" />
            <span>Invite Team Member</span>
          </Button>
        </div>

        {/* Team Members List and Permission Matrix */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Members List */}
          <div className="lg:col-span-6 space-y-3">
            {team.map((member) => {
              const isSelected = selectedMember.id === member.id;
              return (
                <Card
                  key={member.id}
                  onClick={() => setSelectedMember(member)}
                  className={`cursor-pointer transition-all ${
                    isSelected
                      ? "border-studio-accent bg-studio-card shadow-md"
                      : "border-studio-border bg-studio-surface/40 hover:bg-studio-surface"
                  }`}
                >
                  <CardContent className="p-4 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img
                        src={member.avatarUrl}
                        alt={member.name}
                        className="w-10 h-10 rounded-full object-cover border border-studio-border"
                      />
                      <div>
                        <div className="flex items-center gap-2">
                          <h4 className="text-sm font-bold text-studio-primary">
                            {member.name}
                          </h4>
                          <Badge variant={member.role === "Owner" ? "accent" : "outline"} className="text-[9px] py-0">
                            {member.role}
                          </Badge>
                        </div>
                        <p className="text-xs text-studio-secondary mt-0.5">{member.email}</p>
                      </div>
                    </div>

                    <span className="text-[10px] text-studio-muted">
                      Joined {member.joinedDate}
                    </span>
                  </CardContent>
                </Card>
              );
            })}
          </div>

          {/* Detailed Permissions Matrix for Selected Member */}
          <div className="lg:col-span-6">
            <Card>
              <CardHeader className="p-5 pb-3">
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle className="text-sm font-semibold">
                      Permissions for {selectedMember.name}
                    </CardTitle>
                    <CardDescription>
                      Role: <strong className="text-studio-accent">{selectedMember.role}</strong>
                    </CardDescription>
                  </div>
                  <Badge variant="success" className="text-[10px]">
                    {selectedMember.status}
                  </Badge>
                </div>
              </CardHeader>

              <CardContent className="p-5 pt-0 space-y-3">
                <div className="space-y-2 border border-studio-border/60 rounded-lg p-3 bg-studio-surface/40">
                  {permissionsList.map((perm) => {
                    const hasPerm =
                      selectedMember.role === "Owner" ||
                      selectedMember.permissions[perm.key as keyof typeof selectedMember.permissions];
                    return (
                      <div
                        key={perm.key}
                        className="flex items-center justify-between py-1.5 border-b border-studio-border/30 last:border-none text-xs"
                      >
                        <span className={hasPerm ? "text-studio-primary" : "text-studio-muted"}>
                          {perm.label}
                        </span>
                        {hasPerm ? (
                          <div className="flex items-center gap-1 text-[11px] font-bold text-studio-success">
                            <Check className="w-3.5 h-3.5" />
                            <span>Allowed</span>
                          </div>
                        ) : (
                          <div className="flex items-center gap-1 text-[11px] text-studio-muted">
                            <X className="w-3.5 h-3.5 text-studio-error/70" />
                            <span>Restricted</span>
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>

                <p className="text-[11px] text-studio-muted leading-relaxed">
                  Studio data is partitioned at the studio tenant layer. Editors cannot view private financial records unless granted Finance Manager permissions.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
