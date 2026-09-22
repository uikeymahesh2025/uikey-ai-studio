import { StoragePlan, StorageUsage } from "@/lib/types";

export const STORAGE_PLANS: Record<StoragePlan["id"], StoragePlan> = {
  free: {
    id: "free",
    name: "Free Starter",
    quotaBytes: 1 * 1024 * 1024 * 1024, // 1 GB
    quotaGB: 1,
    maxActiveProjects: 1,
    features: [
      "1 GB Cloud Proofing Storage",
      "1 Active Project at a time",
      "Manual UPI QR & UTR verification",
      "Manual WhatsApp sharing (wa.me)",
      "Standard UIKEY AI Watermark",
    ],
  },
  basic: {
    id: "basic",
    name: "Solo Pro",
    quotaBytes: 10 * 1024 * 1024 * 1024, // 10 GB
    quotaGB: 10,
    maxActiveProjects: 5,
    features: [
      "10 GB Cloud Proofing Storage",
      "Up to 5 Active Projects",
      "Custom Studio Watermark",
      "Client Selection & Commenting",
      "Quotation PDF & Payment Tracking",
    ],
  },
  standard: {
    id: "standard",
    name: "Studio Standard",
    quotaBytes: 50 * 1024 * 1024 * 1024, // 50 GB
    quotaGB: 50,
    maxActiveProjects: 20,
    features: [
      "50 GB Optimized Storage",
      "20 Active Projects",
      "Full CRM & Client Timeline",
      "Public Photographer Portfolio",
      "High-res Download Unlocks",
    ],
  },
  pro: {
    id: "pro",
    name: "Production Pro",
    quotaBytes: 100 * 1024 * 1024 * 1024, // 100 GB
    quotaGB: 100,
    maxActiveProjects: 50,
    features: [
      "100 GB High-Performance Storage",
      "50 Active Projects",
      "Advanced Revenue & Funnel Analytics",
      "Custom Subdomains / Domain Connect",
      "Priority WhatsApp Inquiries",
    ],
  },
  studio: {
    id: "studio",
    name: "Studio Agency",
    quotaBytes: 500 * 1024 * 1024 * 1024, // 500 GB
    quotaGB: 500,
    maxActiveProjects: 250,
    features: [
      "500 GB Agency Cloud Storage",
      "Unlimited Active Projects",
      "Multi-editor & Team Roles (5+ seats)",
      "Dedicated High-Speed Bandwidth",
      "Double-Booking Calendar Guard",
    ],
  },
};

export function calculateStorageWarning(
  usedBytes: number,
  quotaBytes: number
): StorageUsage["warningLevel"] {
  if (quotaBytes <= 0) return "none";
  const ratio = usedBytes / quotaBytes;
  if (ratio >= 1.0) return "blocked_100";
  if (ratio >= 0.95) return "warning_95";
  if (ratio >= 0.85) return "warning_85";
  if (ratio >= 0.7) return "warning_70";
  return "none";
}

export function canUploadBytes(
  currentUsedBytes: number,
  additionalBytes: number,
  quotaBytes: number
): { allowed: boolean; reason?: string } {
  if (currentUsedBytes + additionalBytes > quotaBytes) {
    return {
      allowed: false,
      reason: `Storage quota exceeded. Your current plan allows ${Math.round(
        quotaBytes / (1024 * 1024 * 1024)
      )} GB. Please upgrade to a higher tier or archive completed galleries.`,
    };
  }
  return { allowed: true };
}

export interface StorageProvider {
  name: "supabase" | "cloudinary" | "s3" | "r2" | "demo";
  uploadFile(
    bucket: "thumbnails" | "previews" | "originals" | "receipts" | "avatars",
    path: string,
    file: File | Blob
  ): Promise<{ url: string; path: string; sizeBytes: number }>;
  deleteFile(
    bucket: "thumbnails" | "previews" | "originals" | "receipts" | "avatars",
    path: string
  ): Promise<boolean>;
  getPublicUrl(
    bucket: "thumbnails" | "previews" | "originals" | "receipts" | "avatars",
    path: string
  ): string;
}

export class DemoStorageProvider implements StorageProvider {
  name = "demo" as const;

  async uploadFile(
    bucket: "thumbnails" | "previews" | "originals" | "receipts" | "avatars",
    path: string,
    file: File | Blob
  ): Promise<{ url: string; path: string; sizeBytes: number }> {
    // In demo mode, generate a temporary object URL or realistic placeholder
    const sizeBytes = file.size || 2 * 1024 * 1024;
    return {
      url: typeof URL !== "undefined" ? URL.createObjectURL(file) : `/mock-uploads/${path}`,
      path: `${bucket}/${path}`,
      sizeBytes,
    };
  }

  async deleteFile(): Promise<boolean> {
    return true;
  }

  getPublicUrl(
    bucket: "thumbnails" | "previews" | "originals" | "receipts" | "avatars",
    path: string
  ): string {
    return `/demo-storage/${bucket}/${path}`;
  }
}
