# UIKEY AI Studio

> **“Shoot se delivery tak, photographers ka intelligent workspace.”**

UIKEY AI Studio is an intelligent, storage-conscious business management and proofing platform built specifically for Indian freelance photographers, destination wedding studios, portrait artists, editors, and photography teams.

---

## Key Highlights

- **Free-First Architecture**: Operates out of the box in interactive **Demo Mode** (`DEMO_MODE=true`) with realistic Indian photography studio data (*UIKEY AI Studio · Arjun Mehta, Mumbai · Goa · Worldwide*).
- **Zero Paid Gateway Fees**: Native **Bharat UPI (VPA)** integration with dynamic QR codes, mobile `upi://pay` deep links, client UTR transaction reference submission, and 1-click verification that unlocks master high-res deliverables.
- **Manual WhatsApp Sharing**: Pre-formatted, polite `https://wa.me` message links and one-click templates for proposals, gallery readiness, selection reminders, payment tracking, and master deliveries. Zero Meta Business API fees or spam blocks.
- **Watermarked Proofing Galleries**: Mobile-first masonry grids with custom diagonal canvas watermarks (`PROOF ONLY · UIKEY AI STUDIO`). Clients favorite (❤️), reject (✖), flag (⭐), and add photo-specific notes. Original master downloads stay locked until payment is verified.
- **Quotation Builder with GST**: Preloaded with Indian wedding photography presets (Cinematic film ₹42k, Wedding Day ₹85k, Drone ₹12k, Fine Art Album ₹28k). 1-click 18% GST toggle, advance calculation, milestone schedules, and downloadable PDFs.
- **Studio Dark Minimalist Aesthetic**: Precision-crafted dark mode (`#09090B`, `#151518`, `#C4B5FD` lavender accents, Inter typography, micro-interactions, responsive mobile layout).
- **Strict Storage Quota Controls**: 1 GB (Free), 10 GB (Solo Pro), 50 GB (Studio Standard), 100 GB (Production Pro), 500 GB (Studio Agency). Multi-tier warnings at 70%, 85%, 95%, and upload blocking at 100%.

---

## Technology Stack

- **Framework**: [Next.js 14+ (App Router)](https://nextjs.org/)
- **Language**: [TypeScript](https://www.typescriptlang.org/)
- **Styling**: [Tailwind CSS](https://tailwindcss.com/)
- **Design Tokens**: Studio Dark Minimalist (shadcn/ui compatible)
- **Icons**: [Lucide React](https://lucide.dev/)
- **Charts & Data**: [Recharts](https://recharts.org/)
- **QR Codes**: [qrcode.react](https://www.npmjs.com/package/qrcode.react)
- **Database & Storage**: [Supabase](https://supabase.com/) PostgreSQL with RLS & Storage Buckets (or Demo Store)
- **Testing**: [Vitest](https://vitest.dev/) with JSDOM

---

## Application Route Map

| Route | Purpose |
|---|---|
| `/` | Landing page showcasing product pipeline, features, storage calculator & live preview |
| `/login` | Authentication with **1-Click Demo Studio Login** |
| `/signup` | Photographer studio registration |
| `/forgot-password` | Password recovery with confirmation state |
| `/onboarding` | 4-step studio setup wizard (Brand, Niches, WhatsApp, UPI, Watermark, Storage) |
| `/dashboard` | Studio overview: attention today, revenue charts, active shoots, storage meter |
| `/dashboard/projects` | 10-stage project pipeline list & status filters |
| `/dashboard/projects/new` | Create project with team assignments and financial milestones |
| `/dashboard/projects/[id]` | 10-point deliverables checklist, client portals, and manual WhatsApp dispatch |
| `/dashboard/clients` | Client CRM with status filters, lifetime values, and quick WhatsApp links |
| `/dashboard/clients/[id]` | Client profile, event history, past projects, quotations, and payments |
| `/dashboard/quotations` | Quotations overview list with grand totals and status badges |
| `/dashboard/quotations/new` | Quotation builder with Indian wedding presets, 18% GST toggle & milestones |
| `/dashboard/quotations/[id]` | Quotation detail, printable PDF view, and manual WhatsApp sharing |
| `/quote/[id]` | **Public Client Quotation**: Accept, reject, ask questions via WhatsApp, print PDF |
| `/dashboard/galleries` | Proofing galleries management list and download lock state |
| `/dashboard/galleries/[id]` | Gallery management, category configuration, and client selection review |
| `/gallery/[id]` | **Public Client Proofing Portal**: Masonry grid, diagonal watermark, lightbox, favorites & comments |
| `/dashboard/payments` | Manual UPI & UTR verification desk with receipt preview and 1-click download unlock |
| `/payment/[id]` | **Public Client UPI Portal**: Dynamic QR code, mobile app deep link, UTR submission |
| `/dashboard/calendar` | Monthly calendar with shoot dates and double-booking warning guard |
| `/dashboard/analytics` | Revenue analytics, lead source conversion, and service contribution charts |
| `/dashboard/team` | Team members list and role-based permissions matrix (Owner, Photographer, Editor, Finance) |
| `/dashboard/settings` | Studio profile, UPI configuration, watermark opacity preview, and storage tiers |
| `/p/[username]` | **Public Photographer Portfolio**: Hero banner, curated works, testimonials, package pricing |
| `/p/[username]/contact` | Direct booking inquiry form that feeds new leads straight into studio CRM |

---

## Local Development Setup

### 1. Prerequisites
- Node.js 18.17+ or 20+
- npm or pnpm

### 2. Clone & Install
```bash
git clone https://github.com/your-username/uikey-ai-studio.git
cd uikey-ai-studio
npm install
```

### 3. Environment Configuration
Copy the sample environment file:
```bash
cp .env.example .env.local
```

Default variables in `.env.local`:
```env
NEXT_PUBLIC_APP_URL=http://localhost:3000
DEMO_MODE=true
PAYMENT_MODE=manual_upi
WHATSAPP_MODE=manual
AI_MODE=disabled
STORAGE_PROVIDER=supabase

NEXT_PUBLIC_STUDIO_NAME="UIKEY AI Studio"
NEXT_PUBLIC_STUDIO_UPI="uikeystudio@upi"
NEXT_PUBLIC_STUDIO_WATERMARK="PROOF ONLY · UIKEY AI STUDIO"
```

### 4. Run Development Server
```bash
npm run dev
```
Open [http://localhost:3000](http://localhost:3000) in your browser.

---

## Supabase Production Setup (Optional)

To connect a real Supabase database and storage buckets:

1. Create a free project at [supabase.com](https://supabase.com).
2. Run the SQL schema file:
   Navigate to the Supabase SQL Editor and execute:
   `supabase/migrations/001_initial_schema.sql`
3. Create the 5 storage buckets under Supabase Storage:
   - `thumbnails` (Public: `true`)
   - `previews` (Public: `true`)
   - `originals` (Public: `false`, authenticated or signed download URLs)
   - `receipts` (Public: `false`)
   - `avatars` (Public: `true`)
4. Add your Supabase credentials to `.env.local`:
   ```env
   NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
   NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
   SUPABASE_SERVICE_ROLE_KEY=your-service-role-key
   DEMO_MODE=false
   ```

---

## Testing & Quality Assurance

Run the Vitest test suite:
```bash
npm test
```

Run TypeScript typecheck:
```bash
npm run typecheck
```

Run production build:
```bash
npm run build
```

---

## Deployment to Vercel

1. Push your repository to GitHub:
   ```bash
   git init
   git add .
   git commit -m "Initial commit: UIKEY AI Studio"
   git branch -M main
   git remote add origin https://github.com/<your-username>/uikey-ai-studio.git
   git push -u origin main
   ```
2. Import the repository in [Vercel](https://vercel.com).
3. Set Environment Variables in Vercel project settings:
   - `DEMO_MODE=true` (or configure Supabase keys)
   - `NEXT_PUBLIC_APP_URL=https://your-app.vercel.app`
   - `PAYMENT_MODE=manual_upi`
   - `WHATSAPP_MODE=manual`
   - `AI_MODE=disabled`
   - `STORAGE_PROVIDER=supabase`
4. Click **Deploy**.

---

## License & Credits

Built with ❤️ by UIKEY AI. Dedicated to Indian wedding and freelance photographers.
