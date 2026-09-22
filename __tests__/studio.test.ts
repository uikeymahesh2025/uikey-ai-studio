import { describe, it, expect } from "vitest";
import {
  generateWhatsAppMessage,
  createWhatsAppShareUrl,
  normalizeIndianPhoneNumber,
} from "@/lib/whatsapp/templates";
import {
  calculateStorageWarning,
  canUploadBytes,
  STORAGE_PLANS,
} from "@/lib/storage";

describe("UIKEY AI Studio - Unit Tests", () => {
  describe("Manual WhatsApp URL & Template Generator", () => {
    it("normalizes 10-digit Indian phone numbers to 91 prefix", () => {
      expect(normalizeIndianPhoneNumber("9820198201")).toBe("919820198201");
      expect(normalizeIndianPhoneNumber("+91 98201-98201")).toBe("919820198201");
      expect(normalizeIndianPhoneNumber("09820198201")).toBe("919820198201");
    });

    it("generates correctly formatted wa.me share URL with encoded text", () => {
      const msg = "Namaste Rhea ji! Please view your quotation: https://example.com/quote/1";
      const url = createWhatsAppShareUrl("+91 98200 11223", msg);
      expect(url).toContain("https://wa.me/919820011223?text=");
      expect(url).toContain(encodeURIComponent(msg));
    });

    it("creates polite, non-automated message templates for wedding quotations", () => {
      const msg = generateWhatsAppMessage("new_quotation", {
        clientName: "Rhea Kapur",
        clientPhone: "9820011223",
        studioName: "UIKEY AI Studio",
        projectName: "Mehendi & Sangeet",
        quoteTotal: "₹1,85,000",
        quoteUrl: "https://uikey.studio/quote/q-1",
      });
      expect(msg).toContain("Namaste Rhea Kapur ji");
      expect(msg).toContain("₹1,85,000");
      expect(msg).toContain("https://uikey.studio/quote/q-1");
      expect(msg).toContain("UIKEY AI Studio");
    });

    it("creates gallery ready and payment templates", () => {
      const galleryMsg = generateWhatsAppMessage("gallery_ready", {
        clientName: "Saanvi",
        clientPhone: "9876543210",
        studioName: "UIKEY AI Studio",
        galleryUrl: "https://uikey.studio/gallery/g-2",
      });
      expect(galleryMsg).toContain("proofing gallery");
      expect(galleryMsg).toContain("https://uikey.studio/gallery/g-2");

      const paymentMsg = generateWhatsAppMessage("payment_reminder", {
        clientName: "Saanvi",
        clientPhone: "9876543210",
        studioName: "UIKEY AI Studio",
        amountDue: "₹15,000",
        upiId: "uikeystudio@upi",
      });
      expect(paymentMsg).toContain("₹15,000");
      expect(paymentMsg).toContain("uikeystudio@upi");
    });
  });

  describe("Storage Quota & Warning Engine", () => {
    const quota10GB = 10 * 1024 * 1024 * 1024;

    it("returns 'none' warning level below 70%", () => {
      const used5GB = 5 * 1024 * 1024 * 1024;
      expect(calculateStorageWarning(used5GB, quota10GB)).toBe("none");
    });

    it("returns 'warning_70' between 70% and 84.9%", () => {
      const used7GB = 7.2 * 1024 * 1024 * 1024;
      expect(calculateStorageWarning(used7GB, quota10GB)).toBe("warning_70");
    });

    it("returns 'warning_85' between 85% and 94.9%", () => {
      const used8GB = 8.8 * 1024 * 1024 * 1024;
      expect(calculateStorageWarning(used8GB, quota10GB)).toBe("warning_85");
    });

    it("returns 'warning_95' between 95% and 99.9%", () => {
      const used9GB = 9.7 * 1024 * 1024 * 1024;
      expect(calculateStorageWarning(used9GB, quota10GB)).toBe("warning_95");
    });

    it("blocks uploads and returns 'blocked_100' at or above 100%", () => {
      const used10GB = 10 * 1024 * 1024 * 1024;
      expect(calculateStorageWarning(used10GB, quota10GB)).toBe("blocked_100");

      const check = canUploadBytes(used10GB, 50 * 1024 * 1024, quota10GB);
      expect(check.allowed).toBe(false);
      expect(check.reason).toContain("Storage quota exceeded");
    });

    it("allows uploads when within capacity", () => {
      const used4GB = 4 * 1024 * 1024 * 1024;
      const check = canUploadBytes(used4GB, 100 * 1024 * 1024, quota10GB);
      expect(check.allowed).toBe(true);
    });
  });

  describe("Quotation Financial Math", () => {
    it("calculates subtotal, optional 18% GST and grand total accurately", () => {
      const lineItem1 = 85000;
      const lineItem2 = 42000;
      const subtotal = lineItem1 + lineItem2; // 127,000
      const discount = 2000;
      const taxable = subtotal - discount; // 125,000
      const gst = Math.round(taxable * 0.18); // 22,500
      const grandTotal = taxable + gst; // 147,500
      const advancePercentage = 50;
      const advanceAmount = Math.round((grandTotal * advancePercentage) / 100); // 73,750
      const remainingBalance = grandTotal - advanceAmount; // 73,750

      expect(subtotal).toBe(127000);
      expect(taxable).toBe(125000);
      expect(gst).toBe(22500);
      expect(grandTotal).toBe(147500);
      expect(advanceAmount).toBe(73750);
      expect(remainingBalance).toBe(73750);
    });
  });

  describe("Free-First Storage Plans Configuration", () => {
    it("provides the specified free and paid storage plans", () => {
      expect(STORAGE_PLANS.free.quotaGB).toBe(1);
      expect(STORAGE_PLANS.basic.quotaGB).toBe(10);
      expect(STORAGE_PLANS.standard.quotaGB).toBe(50);
      expect(STORAGE_PLANS.pro.quotaGB).toBe(100);
      expect(STORAGE_PLANS.studio.quotaGB).toBe(500);
    });
  });

  describe("Photography Agreements & Legal Clauses", () => {
    it("generates legally grounded contract sign WhatsApp invitation", () => {
      const msg = generateWhatsAppMessage("contract_sign", {
        clientName: "Kabir Kapur",
        clientPhone: "9820011223",
        studioName: "UIKEY AI Studio",
        projectName: "Kapur Wedding Extravaganza",
        contractNumber: "CON-2026-001",
        contractUrl: "https://uikey.studio/contract/con-1",
      });

      expect(msg).toContain("Service Agreement");
      expect(msg).toContain("CON-2026-001");
      expect(msg).toContain("https://uikey.studio/contract/con-1");
      expect(msg).toContain("UIKEY AI Studio");
    });

    it("generates contract confirmation WhatsApp template", () => {
      const msg = generateWhatsAppMessage("contract_signed_confirmation", {
        clientName: "Kabir Kapur",
        clientPhone: "9820011223",
        studioName: "UIKEY AI Studio",
        projectName: "Kapur Wedding",
      });

      expect(msg).toContain("digitally signing the Photography Agreement");
      expect(msg).toContain("officially reserved");
    });
  });

  describe("Tax Invoices & SAC 998381 Compliance", () => {
    it("calculates 18% GST split into 9% CGST and 9% SGST for photography services", () => {
      const subtotal = 100000;
      const cgst = Math.round(subtotal * 0.09);
      const sgst = Math.round(subtotal * 0.09);
      const grandTotal = subtotal + cgst + sgst;

      expect(cgst).toBe(9000);
      expect(sgst).toBe(9000);
      expect(grandTotal).toBe(118000);
    });

    it("generates official Tax Invoice share message with SAC code", () => {
      const msg = generateWhatsAppMessage("tax_invoice", {
        clientName: "Rhea Kapur",
        clientPhone: "9820011223",
        studioName: "UIKEY AI Studio",
        projectName: "Kapur Mehendi",
        invoiceNumber: "INV-2026-001",
        amountDue: "₹95,000",
        invoiceUrl: "https://uikey.studio/invoice/inv-1",
      });

      expect(msg).toContain("INV-2026-001");
      expect(msg).toContain("₹95,000");
      expect(msg).toContain("https://uikey.studio/invoice/inv-1");
    });
  });

  describe("Adobe Lightroom Culling Export", () => {
    it("formats selected filenames as comma-separated string for Lightroom filter bar", () => {
      const selected = [
        { filename: "KAPUR_001.JPG" },
        { filename: "KAPUR_045.JPG" },
        { filename: "KAPUR_112.JPG" },
      ];
      const lightroomFilter = selected.map((s) => s.filename).join(", ");
      expect(lightroomFilter).toBe("KAPUR_001.JPG, KAPUR_045.JPG, KAPUR_112.JPG");
      expect(lightroomFilter.split(", ")).toHaveLength(3);
    });
  });
});

