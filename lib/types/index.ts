export type UserRole = "Owner" | "Photographer" | "Editor" | "Finance Manager" | "Assistant" | "Client";

export type ProjectStatus =
  | "Inquiry"
  | "Quotation sent"
  | "Booked"
  | "Upcoming"
  | "Shooting"
  | "Editing"
  | "Proofing"
  | "Awaiting payment"
  | "Delivered"
  | "Archived";

export type LeadStatus =
  | "New inquiry"
  | "Contacted"
  | "Quotation sent"
  | "Follow-up required"
  | "Negotiation"
  | "Booked"
  | "Completed"
  | "Lost";

export type QuotationStatus =
  | "Draft"
  | "Sent"
  | "Viewed"
  | "Accepted"
  | "Rejected"
  | "Expired";

export type PaymentStatus =
  | "Pending"
  | "UTR submitted"
  | "Under review"
  | "Verified"
  | "Rejected"
  | "Refunded";

export type GalleryStatus =
  | "Draft"
  | "Published"
  | "Client viewing"
  | "Selection in progress"
  | "Selection submitted"
  | "Revision requested"
  | "Approved"
  | "Locked"
  | "Archived";

export type PhotoSelectionState = "favorite" | "reject" | "maybe" | "unrated";

export interface Studio {
  id: string;
  name: string;
  ownerName: string;
  city: string;
  serviceArea: string;
  phone: string;
  whatsappNumber: string;
  email: string;
  upiId: string;
  defaultWatermark: string;
  watermarkOpacity: number;
  planId: "free" | "basic" | "standard" | "pro" | "studio";
  createdAt: string;
}

export interface TeamMember {
  id: string;
  studioId: string;
  name: string;
  email: string;
  role: UserRole;
  phone?: string;
  avatarUrl?: string;
  status: "Active" | "Invited" | "Suspended";
  joinedDate: string;
  permissions: {
    canViewProjects: boolean;
    canEditProjects: boolean;
    canUploadPhotos: boolean;
    canManageClients: boolean;
    canCreateQuotations: boolean;
    canVerifyPayments: boolean;
    canViewAnalytics: boolean;
    canManageTeam: boolean;
  };
}

export interface Client {
  id: string;
  studioId: string;
  name: string;
  email: string;
  phone: string;
  whatsappNumber: string;
  eventType: string;
  eventDate: string;
  venue: string;
  budget: number;
  leadSource: string;
  status: LeadStatus;
  notes: string;
  totalProjectValue: number;
  paidAmount: number;
  pendingAmount: number;
  createdAt: string;
  updatedAt: string;
}

export interface ProjectChecklist {
  contractAccepted: boolean;
  advanceReceived: boolean;
  shootCompleted: boolean;
  photosBackedUp: boolean;
  cullingCompleted: boolean;
  editingCompleted: boolean;
  galleryUploaded: boolean;
  clientSelectionReceived: boolean;
  finalPaymentReceived: boolean;
  originalsDelivered: boolean;
}

export interface Project {
  id: string;
  studioId: string;
  name: string;
  clientId: string;
  clientName: string;
  clientEmail: string;
  clientPhone: string;
  eventType: string;
  eventDate: string;
  venue: string;
  status: ProjectStatus;
  assignedPhotographer: string;
  assignedEditor: string;
  quotationId?: string;
  quotationAmount: number;
  paidAmount: number;
  balanceAmount: number;
  galleryId?: string;
  deliveryDeadline: string;
  notes: string;
  checklist: ProjectChecklist;
  photoCount: number;
  createdAt: string;
  updatedAt: string;
}

export interface QuotationItem {
  id: string;
  description: string;
  category: string;
  quantity: number;
  unitPrice: number;
  totalPrice: number;
}

export interface PaymentMilestone {
  title: string;
  percentage: number;
  amount: number;
  dueDate: string;
  status: "pending" | "paid";
}

export interface Quotation {
  id: string;
  studioId: string;
  clientId: string;
  clientName: string;
  clientPhone: string;
  clientEmail: string;
  projectId?: string;
  projectName: string;
  eventType: string;
  eventDate: string;
  venue: string;
  items: QuotationItem[];
  subtotal: number;
  discountPercentage: number;
  discountAmount: number;
  includeGst: boolean;
  gstRate: number; // 18%
  gstAmount: number;
  grandTotal: number;
  advanceAmount: number;
  remainingBalance: number;
  milestones: PaymentMilestone[];
  status: QuotationStatus;
  validUntil: string;
  terms: string;
  notes: string;
  createdAt: string;
  viewedAt?: string;
  acceptedAt?: string;
  rejectedAt?: string;
}

export interface Payment {
  id: string;
  studioId: string;
  projectId: string;
  projectName: string;
  clientId: string;
  clientName: string;
  clientPhone: string;
  amount: number;
  milestoneTitle: string;
  upiId: string;
  utrNumber?: string;
  receiptUrl?: string;
  status: PaymentStatus;
  submittedAt?: string;
  verifiedAt?: string;
  rejectedAt?: string;
  internalNote?: string;
  downloadsUnlocked: boolean;
  createdAt: string;
}

export interface GalleryCategory {
  id: string;
  name: string;
  count: number;
}

export interface GalleryComment {
  id: string;
  imageId: string;
  authorName: string;
  text: string;
  createdAt: string;
}

export interface GalleryImage {
  id: string;
  galleryId: string;
  filename: string;
  thumbnailUrl: string;
  previewUrl: string;
  originalUrl: string;
  category: string;
  selectionState: PhotoSelectionState;
  comments: GalleryComment[];
  width: number;
  height: number;
  aspectRatio: number;
  fileSizeBytes: number;
  hidden: boolean;
}

export interface Gallery {
  id: string;
  studioId: string;
  projectId: string;
  projectName: string;
  clientName: string;
  clientEmail: string;
  clientToken: string;
  status: GalleryStatus;
  watermarkText: string;
  watermarkOpacity: number;
  categories: GalleryCategory[];
  totalImages: number;
  selectedCount: number;
  rejectedCount: number;
  maybeCount: number;
  requiredSelectionCount?: number;
  isSelectionSubmitted: boolean;
  submittedAt?: string;
  downloadsUnlocked: boolean;
  expiryDate: string;
  createdAt: string;
}

export interface StoragePlan {
  id: "free" | "basic" | "standard" | "pro" | "studio";
  name: string;
  quotaBytes: number;
  quotaGB: number;
  maxActiveProjects: number;
  features: string[];
}

export interface StorageUsage {
  totalBytes: number;
  quotaBytes: number;
  percentage: number;
  warningLevel: "none" | "warning_70" | "warning_85" | "warning_95" | "blocked_100";
  previewBytes: number;
  originalBytes: number;
  thumbnailsBytes: number;
  receiptsBytes: number;
  bandwidthBytes: number;
}

export interface CalendarEvent {
  id: string;
  studioId: string;
  title: string;
  type: "shoot" | "meeting" | "editing_deadline" | "payment_deadline" | "gallery_deadline" | "delivery_deadline";
  date: string;
  endDate?: string;
  venue?: string;
  clientName: string;
  projectId?: string;
  assignedTo?: string;
  status: "Available" | "Tentative" | "Booked" | "Unavailable" | "Travel day";
}

export interface PortfolioProfile {
  username: string;
  studioName: string;
  photographerName: string;
  bio: string;
  city: string;
  serviceArea: string;
  heroImageUrl: string;
  instagramUrl?: string;
  whatsappNumber: string;
  startingPrice: number;
  availableForTravel: boolean;
  categories: string[];
  testimonials: {
    clientName: string;
    event: string;
    quote: string;
    rating: number;
  }[];
  services: {
    title: string;
    price: string;
    description: string;
    features: string[];
  }[];
}

export interface Notification {
  id: string;
  studioId: string;
  title: string;
  message: string;
  type: "inquiry" | "quote" | "payment" | "gallery" | "system" | "contract" | "invoice";
  linkUrl?: string;
  read: boolean;
  createdAt: string;
}

export interface ActivityLog {
  id: string;
  studioId: string;
  actorName: string;
  action: string;
  target: string;
  timestamp: string;
}

// ============================================================================
// CONTRACTS & SERVICE AGREEMENTS
// ============================================================================

export type ContractStatus = "draft" | "sent" | "signed" | "declined";

export interface ContractClause {
  id: string;
  title: string;
  content: string;
  isRequired: boolean;
}

export interface Contract {
  id: string;
  contractNumber: string; // e.g. "CON-2024-001"
  studioId: string;
  projectId: string;
  projectName: string;
  clientId: string;
  clientName: string;
  clientPhone: string;
  clientEmail: string;
  status: ContractStatus;
  totalAmount: number;
  advanceAmount: number;
  eventDates: string[];
  venues: string[];
  deliverables: string[];
  rawFilesPolicy: string;
  travelTerms: string;
  cancellationPolicy: string;
  clauses: ContractClause[];
  signedByName?: string;
  signedAt?: string;
  signatureDataUrl?: string;
  clientIp?: string;
  rejectionReason?: string;
  createdAt: string;
  updatedAt: string;
}

// ============================================================================
// TAX INVOICES & PAYMENT RECEIPTS (GST / SAC 998381)
// ============================================================================

export type InvoiceStatus = "draft" | "issued" | "paid" | "partially_paid" | "cancelled";

export interface InvoiceItem {
  id: string;
  description: string;
  sacCode: string; // "998381"
  quantity: number;
  unitPrice: number;
  totalPrice: number;
}

export interface Invoice {
  id: string;
  invoiceNumber: string; // e.g. "INV-2024-001"
  studioId: string;
  projectId: string;
  projectName: string;
  clientId: string;
  clientName: string;
  clientPhone: string;
  clientEmail: string;
  clientGstin?: string;
  clientAddress?: string;
  items: InvoiceItem[];
  subtotal: number;
  includeGst: boolean;
  gstRate: number; // 18%
  cgstAmount: number; // 9%
  sgstAmount: number; // 9%
  igstAmount: number;
  grandTotal: number;
  paidAmount: number;
  balanceDue: number;
  dueDate: string;
  status: InvoiceStatus;
  upiId: string;
  bankDetails: {
    bankName: string;
    accountNumber: string;
    ifscCode: string;
    accountName: string;
    branch: string;
  };
  notes: string;
  terms: string;
  createdAt: string;
}

