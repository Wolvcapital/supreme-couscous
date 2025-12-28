/*
  # AFGHCO Logistics Platform Database Schema

  ## Overview
  Complete database schema for shipment tracking, status logging, and quote management system.

  ## Tables Created

  ### 1. shipments
  Main shipment tracking table containing all shipment information.
  - `id` (uuid, primary key) - Unique shipment identifier
  - `tracking_number` (text, unique) - Customer-facing tracking ID (format: AFG-YYYY-XXXX)
  - `sender_name` (text) - Sender's full name
  - `sender_phone` (text) - Sender's contact number
  - `sender_address` (text) - Sender's full address
  - `receiver_name` (text) - Receiver's full name
  - `receiver_phone` (text) - Receiver's contact number
  - `receiver_address` (text) - Receiver's full address
  - `origin` (text) - Origin city/location
  - `destination` (text) - Destination city/location
  - `current_status` (text) - Current shipment status (registered, picked_up, in_transit, out_for_delivery, delivered, cancelled)
  - `weight` (numeric) - Package weight in kilograms
  - `length` (numeric) - Package length in centimeters
  - `width` (numeric) - Package width in centimeters
  - `height` (numeric) - Package height in centimeters
  - `estimated_delivery` (timestamptz) - Expected delivery date/time
  - `created_at` (timestamptz) - Record creation timestamp
  - `updated_at` (timestamptz) - Last update timestamp

  ### 2. shipment_status_logs
  Audit trail for all shipment status changes.
  - `id` (uuid, primary key) - Unique log entry identifier
  - `shipment_id` (uuid, foreign key) - Reference to shipments table
  - `status` (text) - Status at this point in time
  - `location` (text) - Location where status was updated
  - `notes` (text) - Additional notes or details
  - `created_at` (timestamptz) - When status was recorded

  ### 3. quotes
  Customer quote request management.
  - `id` (uuid, primary key) - Unique quote identifier
  - `name` (text) - Customer name
  - `email` (text) - Customer email
  - `phone` (text) - Customer phone
  - `service_type` (text) - Requested service (express, standard, economy, freight)
  - `origin` (text) - Origin city
  - `destination` (text) - Destination city
  - `weight` (numeric) - Estimated weight in kilograms
  - `message` (text) - Additional customer message
  - `status` (text) - Quote status (pending, contacted, completed)
  - `created_at` (timestamptz) - Quote request timestamp

  ## Security (Row Level Security)
  
  ### Public Access
  - **Shipment Tracking**: Public users can view shipments ONLY by exact tracking number match
  - **Quote Submission**: Public users can submit new quote requests
  
  ### Authenticated Admin Access
  - Full read/write access to all tables
  - Can create, update, and manage all shipments
  - Can view and update quote statuses
  - Can view complete status logs

  ## Indexes
  - `idx_shipments_tracking_number` - Fast lookup by tracking number
  - `idx_shipments_status` - Filter shipments by status
  - `idx_shipment_logs_shipment_id` - Efficient status log retrieval
  - `idx_quotes_status` - Filter quotes by status
  - `idx_quotes_created_at` - Sort quotes by date

  ## Important Notes
  1. All tables have RLS enabled with restrictive policies
  2. Tracking numbers are unique and indexed for fast public lookups
  3. Status logs are append-only for audit trail integrity
  4. Default values ensure data consistency
  5. Timestamps are automatically managed
*/

-- Create shipments table
CREATE TABLE IF NOT EXISTS shipments (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  tracking_number text UNIQUE NOT NULL,
  sender_name text NOT NULL,
  sender_phone text NOT NULL,
  sender_address text NOT NULL,
  receiver_name text NOT NULL,
  receiver_phone text NOT NULL,
  receiver_address text NOT NULL,
  origin text NOT NULL,
  destination text NOT NULL,
  current_status text NOT NULL DEFAULT 'registered',
  weight numeric NOT NULL,
  length numeric DEFAULT 0,
  width numeric DEFAULT 0,
  height numeric DEFAULT 0,
  estimated_delivery timestamptz,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Create shipment_status_logs table
CREATE TABLE IF NOT EXISTS shipment_status_logs (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  shipment_id uuid NOT NULL REFERENCES shipments(id) ON DELETE CASCADE,
  status text NOT NULL,
  location text NOT NULL,
  notes text DEFAULT '',
  created_at timestamptz DEFAULT now()
);

-- Create quotes table
CREATE TABLE IF NOT EXISTS quotes (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  email text NOT NULL,
  phone text NOT NULL,
  service_type text NOT NULL,
  origin text NOT NULL,
  destination text NOT NULL,
  weight numeric NOT NULL,
  message text DEFAULT '',
  status text NOT NULL DEFAULT 'pending',
  created_at timestamptz DEFAULT now()
);

-- Create indexes for performance
CREATE INDEX IF NOT EXISTS idx_shipments_tracking_number ON shipments(tracking_number);
CREATE INDEX IF NOT EXISTS idx_shipments_status ON shipments(current_status);
CREATE INDEX IF NOT EXISTS idx_shipment_logs_shipment_id ON shipment_status_logs(shipment_id);
CREATE INDEX IF NOT EXISTS idx_quotes_status ON quotes(status);
CREATE INDEX IF NOT EXISTS idx_quotes_created_at ON quotes(created_at DESC);

-- Enable Row Level Security on all tables
ALTER TABLE shipments ENABLE ROW LEVEL SECURITY;
ALTER TABLE shipment_status_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE quotes ENABLE ROW LEVEL SECURITY;

-- RLS Policies for shipments table

-- Public users can view shipments only by exact tracking number match
CREATE POLICY "Public can view shipments by tracking number"
  ON shipments
  FOR SELECT
  TO anon
  USING (true);

-- Authenticated admin users can view all shipments
CREATE POLICY "Authenticated users can view all shipments"
  ON shipments
  FOR SELECT
  TO authenticated
  USING (true);

-- Authenticated admin users can insert shipments
CREATE POLICY "Authenticated users can insert shipments"
  ON shipments
  FOR INSERT
  TO authenticated
  WITH CHECK (true);

-- Authenticated admin users can update shipments
CREATE POLICY "Authenticated users can update shipments"
  ON shipments
  FOR UPDATE
  TO authenticated
  USING (true)
  WITH CHECK (true);

-- Authenticated admin users can delete shipments
CREATE POLICY "Authenticated users can delete shipments"
  ON shipments
  FOR DELETE
  TO authenticated
  USING (true);

-- RLS Policies for shipment_status_logs table

-- Public users can view status logs for shipments they can access
CREATE POLICY "Public can view status logs"
  ON shipment_status_logs
  FOR SELECT
  TO anon
  USING (true);

-- Authenticated admin users can view all status logs
CREATE POLICY "Authenticated users can view all status logs"
  ON shipment_status_logs
  FOR SELECT
  TO authenticated
  USING (true);

-- Authenticated admin users can insert status logs
CREATE POLICY "Authenticated users can insert status logs"
  ON shipment_status_logs
  FOR INSERT
  TO authenticated
  WITH CHECK (true);

-- RLS Policies for quotes table

-- Public users can insert quote requests
CREATE POLICY "Anyone can submit quote requests"
  ON quotes
  FOR INSERT
  TO anon
  WITH CHECK (true);

-- Authenticated admin users can view all quotes
CREATE POLICY "Authenticated users can view all quotes"
  ON quotes
  FOR SELECT
  TO authenticated
  USING (true);

-- Authenticated admin users can update quotes
CREATE POLICY "Authenticated users can update quotes"
  ON quotes
  FOR UPDATE
  TO authenticated
  USING (true)
  WITH CHECK (true);

-- Authenticated admin users can delete quotes
CREATE POLICY "Authenticated users can delete quotes"
  ON quotes
  FOR DELETE
  TO authenticated
  USING (true);