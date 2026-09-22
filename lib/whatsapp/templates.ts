/**
 * Manual WhatsApp Helper for UIKEY AI Studio
 * 
 * Strict Compliance:
 * - NO WhatsApp Business API / Meta Cloud API
 * - NO automatic background dispatch
 * - Pure wa.me link generators and clean, professional studio templates
 */

export interface WhatsAppTemplateParams {
  clientName: string;
  clientPhone: string;
  studioName: string;
  projectName?: string;
  quoteId?: string;
  quoteTotal?: string;
  quoteUrl?: string;
  galleryId?: string;
  galleryUrl?: string;
  selectionDeadline?: string;
  amountDue?: string;
  upiId?: string;
  paymentUrl?: string;
  deliveryUrl?: string;
}

export type WhatsAppTemplateType =
  | "new_quotation"
  | "quotation_reminder"
  | "gallery_ready"
  | "selection_reminder"
  | "payment_reminder"
  | "payment_verified"
  | "final_delivery";

export function normalizeIndianPhoneNumber(phone: string): string {
  // Strip spaces, dashes, parentheses
  let cleaned = phone.replace(/[^0-9]/g, "");
  // If 10 digits, prefix 91 (India)
  if (cleaned.length === 10) {
    cleaned = "91" + cleaned;
  }
  // If starts with 0 and 11 digits, replace 0 with 91
  if (cleaned.length === 11 && cleaned.startsWith("0")) {
    cleaned = "91" + cleaned.substring(1);
  }
  return cleaned;
}

export function generateWhatsAppMessage(type: WhatsAppTemplateType, params: WhatsAppTemplateParams): string {
  const {
    clientName,
    studioName,
    projectName = "your upcoming shoot",
    quoteTotal = "",
    quoteUrl = "",
    galleryUrl = "",
    amountDue = "",
    upiId = "",
    paymentUrl = "",
    deliveryUrl = "",
  } = params;

  switch (type) {
    case "new_quotation":
      return `Namaste ${clientName} ji! 🙏\n\nThank you for reaching out to *${studioName}* for ${projectName}.\n\nWe have prepared a customized proposal for you:\n💰 Total Amount: ${quoteTotal}\n📄 View Detailed Quotation: ${quoteUrl}\n\nPlease review the line items and payment milestones. Feel free to message here if you have any questions!\n\nWarm regards,\n*${studioName}*`;

    case "quotation_reminder":
      return `Hi ${clientName} ji! Hope you are having a wonderful week.\n\nJust following up regarding the photography proposal we shared for ${projectName}.\n\n📄 Quotation Link: ${quoteUrl}\n\nOur dates for the season fill up quickly. Please let us know if you'd like to confirm or modify any deliverables!\n\nBest,\n*${studioName}*`;

    case "gallery_ready":
      return `Exciting news, ${clientName} ji! ✨📸\n\nYour proofing gallery for *${projectName}* is now live!\n\n🔗 View Gallery & Make Selections:\n${galleryUrl}\n\n💡 *How to select:*\n• Tap ❤️ to Favorite your must-haves\n• Add notes/comments directly to specific photos\n• Submit your final selection when ready\n\nEnjoy reliving these memories!\n*${studioName}*`;

    case "selection_reminder":
      return `Hi ${clientName} ji! 👋\n\nQuick friendly reminder from *${studioName}* regarding your photo selection for ${projectName}.\n\n🔗 Gallery Link: ${galleryUrl}\n\nOnce you submit your favorites, our editing team will immediately begin fine-tuning your high-resolution album images.\n\nThank you!`;

    case "payment_reminder":
      return `Namaste ${clientName} ji,\n\nSharing the payment details for *${projectName}*:\n\n💵 Outstanding Balance: ${amountDue}\n🏦 UPI ID: *${upiId}*\n🔗 Instant UPI QR & Receipt Portal: ${paymentUrl}\n\nOnce you transfer via GPay / PhonePe / Paytm, please submit your 12-digit UTR on the link above so we can verify and update your ledger.\n\nThank you,\n*${studioName}*`;

    case "payment_verified":
      return `Thank you, ${clientName} ji! ✅\n\nWe have verified your payment of ${amountDue} for *${projectName}*.\n\nYour invoice and ledger have been updated in your client portal. We are thrilled to continue working on your memories!\n\nBest regards,\n*${studioName}*`;

    case "final_delivery":
      return `Heartiest congratulations ${clientName} ji! 🎉✨\n\nYour final high-resolution, professionally edited originals for *${projectName}* are ready for download!\n\n📥 Download Your Master Files:\n${deliveryUrl}\n\nIt was an absolute pleasure capturing your moments. We would deeply appreciate your feedback and hope to celebrate many more milestones together!\n\nWith warm wishes,\n*${studioName}*`;

    default:
      return `Hi ${clientName} ji, reaching out from ${studioName}.`;
  }
}

export function createWhatsAppShareUrl(phone: string, message: string): string {
  const normalized = normalizeIndianPhoneNumber(phone);
  const encoded = encodeURIComponent(message);
  return `https://wa.me/${normalized}?text=${encoded}`;
}
