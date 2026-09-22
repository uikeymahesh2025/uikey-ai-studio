"use client";

import React, { createContext, useContext, useEffect, useState } from "react";
import {
  StudioStoreState,
  getInitialState,
  saveState,
  INITIAL_STUDIO,
  STORAGE_KEY,
} from "./demo-store";
import {
  Client,
  Project,
  ProjectChecklist,
  Quotation,
  QuotationStatus,
  PhotoSelectionState,
  Studio,
  LeadStatus,
} from "@/lib/types";

interface StudioContextType {
  state: StudioStoreState;
  addClient: (client: Omit<Client, "id" | "studioId" | "createdAt" | "updatedAt">) => Client;
  updateClient: (id: string, updates: Partial<Client>) => void;
  deleteClient: (id: string) => void;
  addProject: (project: Omit<Project, "id" | "studioId" | "createdAt" | "updatedAt">) => Project;
  updateProject: (id: string, updates: Partial<Project>) => void;
  updateChecklist: (projectId: string, item: keyof ProjectChecklist, value: boolean) => void;
  addQuotation: (quote: Omit<Quotation, "id" | "studioId" | "createdAt">) => Quotation;
  updateQuotationStatus: (id: string, status: QuotationStatus) => void;
  submitPaymentUTR: (paymentId: string, utrNumber: string, receiptUrl?: string) => void;
  verifyPayment: (paymentId: string) => void;
  rejectPayment: (paymentId: string, note?: string) => void;
  togglePhotoSelection: (galleryId: string, imageId: string, selectionState: PhotoSelectionState) => void;
  addPhotoComment: (galleryId: string, imageId: string, authorName: string, text: string) => void;
  submitGallerySelection: (galleryId: string) => void;
  updateStudio: (updates: Partial<Studio>) => void;
  addInquiryLead: (inquiry: {
    name: string;
    phone: string;
    email: string;
    eventType: string;
    eventDate: string;
    venue: string;
    budget: number;
    message: string;
  }) => void;
  resetToDemo: () => void;
}

const StudioContext = createContext<StudioContextType | undefined>(undefined);

export function StudioProvider({ children }: { children: React.ReactNode }) {
  const [state, setState] = useState<StudioStoreState>(getInitialState);

  // Sync to local storage whenever state changes
  useEffect(() => {
    saveState(state);
  }, [state]);

  const addClient = (data: Omit<Client, "id" | "studioId" | "createdAt" | "updatedAt">): Client => {
    const newClient: Client = {
      ...data,
      id: `c-${Date.now()}`,
      studioId: state.studio.id,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    setState((prev) => ({
      ...prev,
      clients: [newClient, ...prev.clients],
      activityLogs: [
        {
          id: `act-${Date.now()}`,
          studioId: prev.studio.id,
          actorName: prev.studio.ownerName,
          action: "Added new client",
          target: newClient.name,
          timestamp: new Date().toISOString(),
        },
        ...prev.activityLogs,
      ],
    }));
    return newClient;
  };

  const updateClient = (id: string, updates: Partial<Client>) => {
    setState((prev) => ({
      ...prev,
      clients: prev.clients.map((c) => (c.id === id ? { ...c, ...updates, updatedAt: new Date().toISOString() } : c)),
    }));
  };

  const deleteClient = (id: string) => {
    setState((prev) => ({
      ...prev,
      clients: prev.clients.filter((c) => c.id !== id),
    }));
  };

  const addProject = (data: Omit<Project, "id" | "studioId" | "createdAt" | "updatedAt">): Project => {
    const newProject: Project = {
      ...data,
      id: `p-${Date.now()}`,
      studioId: state.studio.id,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    setState((prev) => ({
      ...prev,
      projects: [newProject, ...prev.projects],
      activityLogs: [
        {
          id: `act-${Date.now()}`,
          studioId: prev.studio.id,
          actorName: prev.studio.ownerName,
          action: "Created project",
          target: newProject.name,
          timestamp: new Date().toISOString(),
        },
        ...prev.activityLogs,
      ],
    }));
    return newProject;
  };

  const updateProject = (id: string, updates: Partial<Project>) => {
    setState((prev) => ({
      ...prev,
      projects: prev.projects.map((p) => (p.id === id ? { ...p, ...updates, updatedAt: new Date().toISOString() } : p)),
    }));
  };

  const updateChecklist = (projectId: string, item: keyof ProjectChecklist, value: boolean) => {
    setState((prev) => ({
      ...prev,
      projects: prev.projects.map((p) => {
        if (p.id !== projectId) return p;
        const newChecklist = { ...p.checklist, [item]: value };
        return {
          ...p,
          checklist: newChecklist,
          updatedAt: new Date().toISOString(),
        };
      }),
    }));
  };

  const addQuotation = (data: Omit<Quotation, "id" | "studioId" | "createdAt">): Quotation => {
    const newQuote: Quotation = {
      ...data,
      id: `q-${Date.now()}`,
      studioId: state.studio.id,
      createdAt: new Date().toISOString(),
    };
    setState((prev) => ({
      ...prev,
      quotations: [newQuote, ...prev.quotations],
      activityLogs: [
        {
          id: `act-${Date.now()}`,
          studioId: prev.studio.id,
          actorName: prev.studio.ownerName,
          action: "Generated proposal for",
          target: `${newQuote.clientName} (₹${newQuote.grandTotal.toLocaleString("en-IN")})`,
          timestamp: new Date().toISOString(),
        },
        ...prev.activityLogs,
      ],
    }));
    return newQuote;
  };

  const updateQuotationStatus = (id: string, status: QuotationStatus) => {
    setState((prev) => ({
      ...prev,
      quotations: prev.quotations.map((q) => {
        if (q.id !== id) return q;
        const updates: Partial<Quotation> = { status };
        if (status === "Accepted") updates.acceptedAt = new Date().toISOString();
        if (status === "Rejected") updates.rejectedAt = new Date().toISOString();
        if (status === "Viewed") updates.viewedAt = new Date().toISOString();
        return { ...q, ...updates };
      }),
    }));
  };

  const submitPaymentUTR = (paymentId: string, utrNumber: string, receiptUrl?: string) => {
    setState((prev) => ({
      ...prev,
      payments: prev.payments.map((p) =>
        p.id === paymentId
          ? {
              ...p,
              utrNumber,
              receiptUrl: receiptUrl || p.receiptUrl,
              status: "UTR submitted",
              submittedAt: new Date().toISOString(),
            }
          : p
      ),
      notifications: [
        {
          id: `notif-${Date.now()}`,
          studioId: prev.studio.id,
          title: "New UTR Submitted",
          message: `Client submitted UTR ${utrNumber} for verification.`,
          type: "payment",
          linkUrl: "/dashboard/payments",
          read: false,
          createdAt: new Date().toISOString(),
        },
        ...prev.notifications,
      ],
    }));
  };

  const verifyPayment = (paymentId: string) => {
    setState((prev) => {
      const payment = prev.payments.find((p) => p.id === paymentId);
      if (!payment) return prev;

      // Unlock downloads on related gallery and project
      const updatedGalleries = prev.galleries.map((g) =>
        g.projectId === payment.projectId ? { ...g, downloadsUnlocked: true } : g
      );

      const updatedProjects = prev.projects.map((proj) => {
        if (proj.id !== payment.projectId) return proj;
        const newPaid = proj.paidAmount + payment.amount;
        const newBalance = Math.max(0, proj.quotationAmount - newPaid);
        return {
          ...proj,
          paidAmount: newPaid,
          balanceAmount: newBalance,
          checklist: {
            ...proj.checklist,
            finalPaymentReceived: newBalance === 0,
          },
        };
      });

      return {
        ...prev,
        payments: prev.payments.map((p) =>
          p.id === paymentId
            ? {
                ...p,
                status: "Verified",
                verifiedAt: new Date().toISOString(),
                downloadsUnlocked: true,
              }
            : p
        ),
        galleries: updatedGalleries,
        projects: updatedProjects,
        activityLogs: [
          {
            id: `act-${Date.now()}`,
            studioId: prev.studio.id,
            actorName: prev.studio.ownerName,
            action: `Verified ₹${payment.amount.toLocaleString("en-IN")} payment for`,
            target: payment.projectName,
            timestamp: new Date().toISOString(),
          },
          ...prev.activityLogs,
        ],
      };
    });
  };

  const rejectPayment = (paymentId: string, note?: string) => {
    setState((prev) => ({
      ...prev,
      payments: prev.payments.map((p) =>
        p.id === paymentId
          ? {
              ...p,
              status: "Rejected",
              rejectedAt: new Date().toISOString(),
              internalNote: note || p.internalNote,
            }
          : p
      ),
    }));
  };

  const togglePhotoSelection = (galleryId: string, imageId: string, selectionState: PhotoSelectionState) => {
    setState((prev) => {
      const currentImages = prev.galleryImages[galleryId] || [];
      const updatedImages = currentImages.map((img) =>
        img.id === imageId ? { ...img, selectionState } : img
      );

      // Recalculate selection counts
      const selected = updatedImages.filter((img) => img.selectionState === "favorite").length;
      const rejected = updatedImages.filter((img) => img.selectionState === "reject").length;
      const maybe = updatedImages.filter((img) => img.selectionState === "maybe").length;

      const updatedGalleries = prev.galleries.map((g) =>
        g.id === galleryId
          ? {
              ...g,
              selectedCount: selected,
              rejectedCount: rejected,
              maybeCount: maybe,
            }
          : g
      );

      return {
        ...prev,
        galleries: updatedGalleries,
        galleryImages: {
          ...prev.galleryImages,
          [galleryId]: updatedImages,
        },
      };
    });
  };

  const addPhotoComment = (galleryId: string, imageId: string, authorName: string, text: string) => {
    setState((prev) => {
      const currentImages = prev.galleryImages[galleryId] || [];
      const updatedImages = currentImages.map((img) => {
        if (img.id !== imageId) return img;
        return {
          ...img,
          comments: [
            ...img.comments,
            {
              id: `comm-${Date.now()}`,
              imageId,
              authorName,
              text,
              createdAt: new Date().toISOString(),
            },
          ],
        };
      });

      return {
        ...prev,
        galleryImages: {
          ...prev.galleryImages,
          [galleryId]: updatedImages,
        },
      };
    });
  };

  const submitGallerySelection = (galleryId: string) => {
    setState((prev) => {
      const gallery = prev.galleries.find((g) => g.id === galleryId);
      const updatedGalleries = prev.galleries.map((g) =>
        g.id === galleryId
          ? {
              ...g,
              status: "Selection submitted" as const,
              isSelectionSubmitted: true,
              submittedAt: new Date().toISOString(),
            }
          : g
      );

      // Also mark client selection received in project checklist
      const updatedProjects = prev.projects.map((p) =>
        p.id === gallery?.projectId
          ? {
              ...p,
              checklist: { ...p.checklist, clientSelectionReceived: true },
            }
          : p
      );

      return {
        ...prev,
        galleries: updatedGalleries,
        projects: updatedProjects,
        notifications: [
          {
            id: `notif-${Date.now()}`,
            studioId: prev.studio.id,
            title: "Final Selection Submitted",
            message: `${gallery?.clientName} finalized their selections (${gallery?.selectedCount} photos).`,
            type: "gallery",
            linkUrl: `/dashboard/galleries/${galleryId}`,
            read: false,
            createdAt: new Date().toISOString(),
          },
          ...prev.notifications,
        ],
        activityLogs: [
          {
            id: `act-${Date.now()}`,
            studioId: prev.studio.id,
            actorName: gallery?.clientName || "Client",
            action: `Finalized photo selection for`,
            target: gallery?.projectName || "Gallery",
            timestamp: new Date().toISOString(),
          },
          ...prev.activityLogs,
        ],
      };
    });
  };

  const updateStudio = (updates: Partial<Studio>) => {
    setState((prev) => ({
      ...prev,
      studio: { ...prev.studio, ...updates },
    }));
  };

  const addInquiryLead = (inquiry: {
    name: string;
    phone: string;
    email: string;
    eventType: string;
    eventDate: string;
    venue: string;
    budget: number;
    message: string;
  }) => {
    const newClient: Client = {
      id: `c-${Date.now()}`,
      studioId: state.studio.id,
      name: inquiry.name,
      phone: inquiry.phone,
      whatsappNumber: inquiry.phone,
      email: inquiry.email,
      eventType: inquiry.eventType,
      eventDate: inquiry.eventDate,
      venue: inquiry.venue,
      budget: inquiry.budget,
      leadSource: "Public Portfolio Website",
      status: "New inquiry" as LeadStatus,
      notes: inquiry.message,
      totalProjectValue: inquiry.budget,
      paidAmount: 0,
      pendingAmount: inquiry.budget,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    setState((prev) => ({
      ...prev,
      clients: [newClient, ...prev.clients],
      notifications: [
        {
          id: `notif-${Date.now()}`,
          studioId: prev.studio.id,
          title: "New Portfolio Inquiry Received",
          message: `${inquiry.name} submitted an inquiry for ${inquiry.eventType} (₹${inquiry.budget.toLocaleString("en-IN")})`,
          type: "inquiry",
          linkUrl: `/dashboard/clients/${newClient.id}`,
          read: false,
          createdAt: new Date().toISOString(),
        },
        ...prev.notifications,
      ],
      activityLogs: [
        {
          id: `act-${Date.now()}`,
          studioId: prev.studio.id,
          actorName: inquiry.name,
          action: "Submitted inquiry from public portfolio for",
          target: inquiry.eventType,
          timestamp: new Date().toISOString(),
        },
        ...prev.activityLogs,
      ],
    }));
  };

  const resetToDemo = () => {
    if (typeof window !== "undefined") {
      localStorage.removeItem(STORAGE_KEY);
    }
    setState(getInitialState());
  };

  return (
    <StudioContext.Provider
      value={{
        state,
        addClient,
        updateClient,
        deleteClient,
        addProject,
        updateProject,
        updateChecklist,
        addQuotation,
        updateQuotationStatus,
        submitPaymentUTR,
        verifyPayment,
        rejectPayment,
        togglePhotoSelection,
        addPhotoComment,
        submitGallerySelection,
        updateStudio,
        addInquiryLead,
        resetToDemo,
      }}
    >
      {children}
    </StudioContext.Provider>
  );
}

export function useStudio() {
  const context = useContext(StudioContext);
  if (!context) {
    throw new Error("useStudio must be used within a StudioProvider");
  }
  return context;
}
