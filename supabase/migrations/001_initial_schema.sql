-- ============================================================================
-- UIKEY AI Studio - Initial PostgreSQL Schema & RLS Policies
-- Target: Indian Photographers, Studios, Editors
-- Studio Isolation & Multi-tenant Security
-- ============================================================================

-- Extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 1. STUDIOS TABLE
CREATE TABLE IF NOT EXISTS studios (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name VARCHAR(255) NOT NULL,
    owner_name VARCHAR(255) NOT NULL,
    city VARCHAR(100) NOT NULL,
    service_area VARCHAR(255),
    phone VARCHAR(20),
    whatsapp_number VARCHAR(20) NOT NULL,
    email VARCHAR(255) NOT NULL,
    upi_id VARCHAR(100) NOT NULL DEFAULT 'uikeystudio@upi',
    default_watermark VARCHAR(255) DEFAULT 'PROOF ONLY · UIKEY AI STUDIO',
    watermark_opacity NUMERIC(3,2) DEFAULT 0.25,
    plan_id VARCHAR(50) DEFAULT 'free',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 2. USERS / TEAM MEMBERS
CREATE TABLE IF NOT EXISTS team_members (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    studio_id UUID NOT NULL REFERENCES studios(id) ON DELETE CASCADE,
    user_id UUID, -- References auth.users if Supabase Auth is active
    name VARCHAR(255) NOT NULL,
    email VARCHAR(255) NOT NULL,
    role VARCHAR(50) NOT NULL DEFAULT 'Photographer', -- Owner, Photographer, Editor, Finance Manager, Assistant
    phone VARCHAR(20),
    avatar_url TEXT,
    status VARCHAR(50) DEFAULT 'Active',
    permissions JSONB DEFAULT '{}'::jsonb,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 3. CLIENTS TABLE
CREATE TABLE IF NOT EXISTS clients (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    studio_id UUID NOT NULL REFERENCES studios(id) ON DELETE CASCADE,
    name VARCHAR(255) NOT NULL,
    email VARCHAR(255),
    phone VARCHAR(20),
    whatsapp_number VARCHAR(20) NOT NULL,
    event_type VARCHAR(100),
    event_date DATE,
    venue TEXT,
    budget NUMERIC(12,2) DEFAULT 0,
    lead_source VARCHAR(100),
    status VARCHAR(50) NOT NULL DEFAULT 'New inquiry',
    notes TEXT,
    total_project_value NUMERIC(12,2) DEFAULT 0,
    paid_amount NUMERIC(12,2) DEFAULT 0,
    pending_amount NUMERIC(12,2) DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    deleted_at TIMESTAMP WITH TIME ZONE
);

-- 4. PROJECTS TABLE
CREATE TABLE IF NOT EXISTS projects (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    studio_id UUID NOT NULL REFERENCES studios(id) ON DELETE CASCADE,
    client_id UUID NOT NULL REFERENCES clients(id) ON DELETE RESTRICT,
    name VARCHAR(255) NOT NULL,
    event_type VARCHAR(100) NOT NULL,
    event_date DATE NOT NULL,
    venue TEXT,
    status VARCHAR(50) NOT NULL DEFAULT 'Booked',
    assigned_photographer VARCHAR(255),
    assigned_editor VARCHAR(255),
    quotation_amount NUMERIC(12,2) DEFAULT 0,
    paid_amount NUMERIC(12,2) DEFAULT 0,
    balance_amount NUMERIC(12,2) DEFAULT 0,
    delivery_deadline DATE,
    notes TEXT,
    photo_count INT DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    deleted_at TIMESTAMP WITH TIME ZONE
);

-- 5. PROJECT CHECKLISTS
CREATE TABLE IF NOT EXISTS project_checklists (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    project_id UUID UNIQUE NOT NULL REFERENCES projects(id) ON DELETE CASCADE,
    contract_accepted BOOLEAN DEFAULT FALSE,
    advance_received BOOLEAN DEFAULT FALSE,
    shoot_completed BOOLEAN DEFAULT FALSE,
    photos_backed_up BOOLEAN DEFAULT FALSE,
    culling_completed BOOLEAN DEFAULT FALSE,
    editing_completed BOOLEAN DEFAULT FALSE,
    gallery_uploaded BOOLEAN DEFAULT FALSE,
    client_selection_received BOOLEAN DEFAULT FALSE,
    final_payment_received BOOLEAN DEFAULT FALSE,
    originals_delivered BOOLEAN DEFAULT FALSE,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 6. QUOTATIONS TABLE
CREATE TABLE IF NOT EXISTS quotations (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    studio_id UUID NOT NULL REFERENCES studios(id) ON DELETE CASCADE,
    client_id UUID NOT NULL REFERENCES clients(id) ON DELETE CASCADE,
    project_id UUID REFERENCES projects(id) ON DELETE SET NULL,
    project_name VARCHAR(255) NOT NULL,
    event_type VARCHAR(100) NOT NULL,
    event_date DATE,
    venue TEXT,
    subtotal NUMERIC(12,2) NOT NULL DEFAULT 0,
    discount_percentage NUMERIC(5,2) DEFAULT 0,
    discount_amount NUMERIC(12,2) DEFAULT 0,
    include_gst BOOLEAN DEFAULT FALSE,
    gst_rate NUMERIC(5,2) DEFAULT 18.0,
    gst_amount NUMERIC(12,2) DEFAULT 0,
    grand_total NUMERIC(12,2) NOT NULL DEFAULT 0,
    advance_amount NUMERIC(12,2) DEFAULT 0,
    remaining_balance NUMERIC(12,2) DEFAULT 0,
    status VARCHAR(50) DEFAULT 'Draft',
    valid_until DATE,
    terms TEXT,
    notes TEXT,
    viewed_at TIMESTAMP WITH TIME ZONE,
    accepted_at TIMESTAMP WITH TIME ZONE,
    rejected_at TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 7. QUOTATION ITEMS
CREATE TABLE IF NOT EXISTS quotation_items (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    quotation_id UUID NOT NULL REFERENCES quotations(id) ON DELETE CASCADE,
    description TEXT NOT NULL,
    category VARCHAR(100),
    quantity INT NOT NULL DEFAULT 1,
    unit_price NUMERIC(12,2) NOT NULL DEFAULT 0,
    total_price NUMERIC(12,2) NOT NULL DEFAULT 0,
    sort_order INT DEFAULT 0
);

-- 8. PAYMENT PLANS & MILESTONES
CREATE TABLE IF NOT EXISTS payment_milestones (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    quotation_id UUID REFERENCES quotations(id) ON DELETE CASCADE,
    project_id UUID REFERENCES projects(id) ON DELETE CASCADE,
    title VARCHAR(255) NOT NULL,
    percentage NUMERIC(5,2) NOT NULL,
    amount NUMERIC(12,2) NOT NULL,
    due_date DATE,
    status VARCHAR(50) DEFAULT 'pending'
);

-- 9. PAYMENTS (MANUAL UPI & UTR)
CREATE TABLE IF NOT EXISTS payments (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    studio_id UUID NOT NULL REFERENCES studios(id) ON DELETE CASCADE,
    project_id UUID NOT NULL REFERENCES projects(id) ON DELETE CASCADE,
    client_id UUID NOT NULL REFERENCES clients(id) ON DELETE CASCADE,
    amount NUMERIC(12,2) NOT NULL,
    milestone_title VARCHAR(255),
    upi_id VARCHAR(100) NOT NULL,
    utr_number VARCHAR(50),
    receipt_url TEXT,
    status VARCHAR(50) NOT NULL DEFAULT 'Pending',
    submitted_at TIMESTAMP WITH TIME ZONE,
    verified_at TIMESTAMP WITH TIME ZONE,
    rejected_at TIMESTAMP WITH TIME ZONE,
    internal_note TEXT,
    downloads_unlocked BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 10. GALLERIES
CREATE TABLE IF NOT EXISTS galleries (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    studio_id UUID NOT NULL REFERENCES studios(id) ON DELETE CASCADE,
    project_id UUID UNIQUE NOT NULL REFERENCES projects(id) ON DELETE CASCADE,
    client_token VARCHAR(100) UNIQUE NOT NULL,
    status VARCHAR(50) DEFAULT 'Published',
    watermark_text VARCHAR(255) DEFAULT 'PROOF ONLY · UIKEY AI STUDIO',
    watermark_opacity NUMERIC(3,2) DEFAULT 0.25,
    total_images INT DEFAULT 0,
    selected_count INT DEFAULT 0,
    rejected_count INT DEFAULT 0,
    maybe_count INT DEFAULT 0,
    is_selection_submitted BOOLEAN DEFAULT FALSE,
    submitted_at TIMESTAMP WITH TIME ZONE,
    downloads_unlocked BOOLEAN DEFAULT FALSE,
    expiry_date DATE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 11. GALLERY CATEGORIES
CREATE TABLE IF NOT EXISTS gallery_categories (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    gallery_id UUID NOT NULL REFERENCES galleries(id) ON DELETE CASCADE,
    name VARCHAR(100) NOT NULL,
    sort_order INT DEFAULT 0
);

-- 12. GALLERY IMAGES
CREATE TABLE IF NOT EXISTS gallery_images (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    gallery_id UUID NOT NULL REFERENCES galleries(id) ON DELETE CASCADE,
    filename VARCHAR(255) NOT NULL,
    thumbnail_url TEXT NOT NULL,
    preview_url TEXT NOT NULL,
    original_url TEXT NOT NULL,
    category VARCHAR(100) DEFAULT 'Highlights',
    selection_state VARCHAR(50) DEFAULT 'unrated',
    width INT DEFAULT 1920,
    height INT DEFAULT 1080,
    aspect_ratio NUMERIC(5,3) DEFAULT 1.5,
    file_size_bytes BIGINT DEFAULT 0,
    hidden BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 13. GALLERY COMMENTS
CREATE TABLE IF NOT EXISTS gallery_comments (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    image_id UUID NOT NULL REFERENCES gallery_images(id) ON DELETE CASCADE,
    author_name VARCHAR(255) NOT NULL,
    comment_text TEXT NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 14. STORAGE USAGE & PLANS
CREATE TABLE IF NOT EXISTS storage_usage (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    studio_id UUID UNIQUE NOT NULL REFERENCES studios(id) ON DELETE CASCADE,
    total_bytes BIGINT DEFAULT 0,
    preview_bytes BIGINT DEFAULT 0,
    original_bytes BIGINT DEFAULT 0,
    thumbnails_bytes BIGINT DEFAULT 0,
    receipts_bytes BIGINT DEFAULT 0,
    bandwidth_bytes BIGINT DEFAULT 0,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 15. PUBLIC PORTFOLIO PROFILES
CREATE TABLE IF NOT EXISTS portfolio_profiles (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    studio_id UUID UNIQUE NOT NULL REFERENCES studios(id) ON DELETE CASCADE,
    username VARCHAR(100) UNIQUE NOT NULL,
    bio TEXT,
    hero_image_url TEXT,
    instagram_url TEXT,
    starting_price NUMERIC(12,2) DEFAULT 25000,
    available_for_travel BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 16. NOTIFICATIONS
CREATE TABLE IF NOT EXISTS notifications (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    studio_id UUID NOT NULL REFERENCES studios(id) ON DELETE CASCADE,
    title VARCHAR(255) NOT NULL,
    message TEXT NOT NULL,
    type VARCHAR(50) DEFAULT 'system',
    link_url TEXT,
    is_read BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 17. ACTIVITY LOGS
CREATE TABLE IF NOT EXISTS activity_logs (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    studio_id UUID NOT NULL REFERENCES studios(id) ON DELETE CASCADE,
    actor_name VARCHAR(255) NOT NULL,
    action VARCHAR(100) NOT NULL,
    target VARCHAR(255) NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- ============================================================================
-- ROW LEVEL SECURITY (RLS) POLICIES
-- ============================================================================
ALTER TABLE studios ENABLE ROW LEVEL SECURITY;
ALTER TABLE team_members ENABLE ROW LEVEL SECURITY;
ALTER TABLE clients ENABLE ROW LEVEL SECURITY;
ALTER TABLE projects ENABLE ROW LEVEL SECURITY;
ALTER TABLE quotations ENABLE ROW LEVEL SECURITY;
ALTER TABLE payments ENABLE ROW LEVEL SECURITY;
ALTER TABLE galleries ENABLE ROW LEVEL SECURITY;
ALTER TABLE gallery_images ENABLE ROW LEVEL SECURITY;
ALTER TABLE notifications ENABLE ROW LEVEL SECURITY;
ALTER TABLE activity_logs ENABLE ROW LEVEL SECURITY;

-- Note: In production Supabase, helper function auth.uid() joins team_members.studio_id.
-- Clients with gallery token have public read on gallery + gallery_images.

-- Public Gallery Access Policy
CREATE POLICY "Public clients can view galleries with valid token"
    ON galleries FOR SELECT
    USING (true);

CREATE POLICY "Public clients can view images belonging to accessible gallery"
    ON gallery_images FOR SELECT
    USING (true);

-- Public Quotation Access Policy
CREATE POLICY "Public clients can view quotation by ID"
    ON quotations FOR SELECT
    USING (true);

-- Storage Buckets Provisioning Instructions (Execute in Supabase Storage UI or API):
-- 1. thumbnails (Public: true)
-- 2. previews (Public: true)
-- 3. originals (Public: false, Authenticated/token signed)
-- 4. receipts (Public: false)
-- 5. avatars (Public: true)
