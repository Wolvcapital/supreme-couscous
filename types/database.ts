export type Shipment = {
  id: string;
  tracking_number: string;
  sender_name: string;
  sender_phone: string;
  sender_address: string;
  receiver_name: string;
  receiver_phone: string;
  receiver_address: string;
  origin: string;
  destination: string;
  current_status: string;
  weight: number;
  length: number;
  width: number;
  height: number;
  estimated_delivery: string | null;
  created_at: string;
  updated_at: string;
};

export type ShipmentInsert = {
  tracking_number: string;
  sender_name: string;
  sender_phone: string;
  sender_address: string;
  receiver_name: string;
  receiver_phone: string;
  receiver_address: string;
  origin: string;
  destination: string;
  current_status?: string;
  weight: number;
  length?: number;
  width?: number;
  height?: number;
  estimated_delivery?: string | null;
};

export type ShipmentStatusLog = {
  id: string;
  shipment_id: string;
  status: string;
  location: string;
  notes: string;
  created_at: string;
};

export type ShipmentStatusLogInsert = {
  shipment_id: string;
  status: string;
  location: string;
  notes?: string;
};

export type Quote = {
  id: string;
  name: string;
  email: string;
  phone: string;
  service_type: string;
  origin: string;
  destination: string;
  weight: number;
  message: string;
  status: string;
  created_at: string;
};

export type QuoteInsert = {
  name: string;
  email: string;
  phone: string;
  service_type: string;
  origin: string;
  destination: string;
  weight: number;
  message?: string;
  status?: string;
};

export type QuoteUpdate = {
  name?: string;
  email?: string;
  phone?: string;
  service_type?: string;
  origin?: string;
  destination?: string;
  weight?: number;
  message?: string;
  status?: string;
};

export const SHIPMENT_STATUSES = [
  'registered',
  'picked_up',
  'in_transit',
  'out_for_delivery',
  'delivered',
  'cancelled',
] as const;

export type ShipmentStatus = typeof SHIPMENT_STATUSES[number];

export const QUOTE_STATUSES = ['pending', 'contacted', 'completed'] as const;
export type QuoteStatus = typeof QUOTE_STATUSES[number];
