-- ============================================================================
-- UIKEY AI Studio - Migration 002: Contracts & Tax Invoices
-- Target: Indian Photographers, Studios, Editors
-- ============================================================================

-- 1. CONTRACTS TABLE
CREATE TABLE IF NOT EXISTS contracts (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    studio_id UUID NOT NULL REFERENCES studios(id) ON DELETE CASCADE,
    contract_number VARCHAR(50) NOT NULL UNIQUE,
    project_id UUID REFERENCES projects(id) ON DELETE SET NULL,
    project_name VARCHAR(255) NOT NULL,
    client_id UUID REFERENCES clients(id) ON DELETE SET NULL,
    client_name VARCHAR(255) NOT NULL,
    client_phone VARCHAR(20) NOT NULL,
    client_email VARCHAR(255),
    status VARCHAR(50) NOT NULL DEFAULT 'draft', -- draft, sent, signed, declined
    total_amount NUMERIC(12,2) NOT NULL DEFAULT 0,
    advance_amount NUMERIC(12,2) NOT NULL DEFAULT 0,
    event_dates TEXT[] DEFAULT '{}',
    venues TEXT[] DEFAULT '{}',
    deliverables TEXT[] DEFAULT '{}',
    raw_files_policy TEXT,
    travel_terms TEXT,
    cancellation_policy TEXT,
    clauses JSONB DEFAULT '[]'::jsonb,
    signed_by_name VARCHAR(255),
    signed_at TIMESTAMP WITH TIME ZONE,
    signature_data_url TEXT,
    client_ip VARCHAR(100),
    rejection_reason TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Indexes on contracts
CREATE INDEX IF NOT EXISTS idx_contracts_studio_id ON contracts(studio_id);
CREATE INDEX IF NOT EXISTS idx_contracts_project_id ON contracts(project_id);
CREATE INDEX IF NOT EXISTS idx_contracts_client_id ON contracts(client_id);
CREATE INDEX IF NOT EXISTS idx_contracts_status ON contracts(status);

-- Enable RLS
ALTER TABLE contracts ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Studios can view their own contracts"
    ON contracts FOR SELECT
    USING (studio_id IN (
        SELECT studio_id FROM team_members WHERE user_id = auth.uid()
    ));

CREATE POLICY "Studios can insert contracts"
    ON contracts FOR INSERT
    WITH CHECK (studio_id IN (
        SELECT studio_id FROM team_members WHERE user_id = auth.uid()
    ));

CREATE POLICY "Studios can update their contracts"
    ON contracts FOR UPDATE
    USING (studio_id IN (
        SELECT studio_id FROM team_members WHERE user_id = auth.uid()
    ));

-- Public read/sign policy for clients via unique contract ID
CREATE POLICY "Clients can view and sign their specific contract"
    ON contracts FOR SELECT
    USING (true);

-- 2. TAX INVOICES TABLE (GST SAC 998381)
CREATE TABLE IF NOT EXISTS invoices (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    studio_id UUID NOT NULL REFERENCES studios(id) ON DELETE CASCADE,
    invoice_number VARCHAR(50) NOT NULL UNIQUE,
    project_id UUID REFERENCES projects(id) ON DELETE SET NULL,
    project_name VARCHAR(255) NOT NULL,
    client_id UUID REFERENCES clients(id) ON DELETE SET NULL,
    client_name VARCHAR(255) NOT NULL,
    client_phone VARCHAR(20) NOT NULL,
    client_email VARCHAR(255),
    client_gstin VARCHAR(50),
    client_address TEXT,
    items JSONB DEFAULT '[]'::jsonb, -- Array of { description, sacCode, quantity, unitPrice, totalPrice }
    subtotal NUMERIC(12,2) NOT NULL DEFAULT 0,
    include_gst BOOLEAN DEFAULT TRUE,
    gst_rate NUMERIC(4,2) DEFAULT 18.00,
    cgst_amount NUMERIC(12,2) DEFAULT 0,
    sgst_amount NUMERIC(12,2) DEFAULT 0,
    igst_amount NUMERIC(12,2) DEFAULT 0,
    grand_total NUMERIC(12,2) NOT NULL DEFAULT 0,
    paid_amount NUMERIC(12,2) NOT NULL DEFAULT 0,
    balance_due NUMERIC(12,2) NOT NULL DEFAULT 0,
    due_date DATE,
    status VARCHAR(50) NOT NULL DEFAULT 'draft', -- draft, issued, paid, partially_paid, cancelled
    upi_id VARCHAR(100) NOT NULL DEFAULT 'uikeystudio@upi',
    bank_details JSONB DEFAULT '{}'::jsonb,
    notes TEXT,
    terms TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Indexes on invoices
CREATE INDEX IF NOT EXISTS idx_invoices_studio_id ON invoices(studio_id);
CREATE INDEX IF NOT EXISTS idx_invoices_project_id ON invoices(project_id);
CREATE INDEX IF NOT EXISTS idx_invoices_status ON invoices(status);

-- Enable RLS
ALTER TABLE invoices ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Studios can view their own invoices"
    ON invoices FOR SELECT
    USING (studio_id IN (
        SELECT studio_id FROM team_members WHERE user_id = auth.uid()
    ));

CREATE POLICY "Studios can manage their invoices"
    ON invoices FOR ALL
    USING (studio_id IN (
        SELECT studio_id FROM team_members WHERE user_id = auth.uid()
    ));

-- Public read policy for clients via invoice link
CREATE POLICY "Clients can view their specific invoice"
    ON invoices FOR SELECT
    USING (true);
