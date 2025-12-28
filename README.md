# AFGHCO Shipping and Logistics Platform

A production-ready logistics and shipment tracking platform built with Next.js, TypeScript, Supabase, and Tailwind CSS.

## Features

### Public Website
- **Landing Page**: Professional, high-trust logistics aesthetic with service highlights
- **Shipment Tracking**: Real-time tracking with full status timeline and delivery history
- **Quote Requests**: Simple form for customers to request shipping quotes
- **Responsive Design**: Mobile-friendly interface for all screen sizes

### Admin Dashboard
- **Secure Authentication**: Email/password login with Supabase Auth
- **Shipment Management**: Create, edit, and view shipments with auto-generated tracking numbers
- **Status Tracking**: Update shipment status with automatic audit trail logging
- **Quote Management**: View customer quote requests and update status (pending → contacted → completed)
- **Protected Routes**: Admin-only access with session management

## Tech Stack

- **Frontend**: Next.js 13 (App Router), React 18, TypeScript
- **UI Components**: Shadcn/UI, Lucide React icons
- **Styling**: Tailwind CSS, responsive design
- **Backend**: Supabase (PostgreSQL)
- **Authentication**: Supabase Auth
- **Hosting**: Vercel, Supabase Cloud

## Database Schema

### Tables

**shipments**
- `id`: UUID primary key
- `tracking_number`: Unique tracking ID (format: AFG-YYYY-XXXX)
- `sender_info`: Name, phone, address
- `receiver_info`: Name, phone, address
- `origin`, `destination`: Shipping locations
- `current_status`: registered, picked_up, in_transit, out_for_delivery, delivered, cancelled
- `weight`, `dimensions`: Package info
- `estimated_delivery`: Expected delivery date
- `created_at`, `updated_at`: Timestamps

**shipment_status_logs**
- `id`: UUID primary key
- `shipment_id`: Foreign key to shipments
- `status`, `location`, `notes`: Status update details
- `created_at`: Timestamp (audit trail)

**quotes**
- `id`: UUID primary key
- `name`, `email`, `phone`: Customer contact info
- `service_type`: Service requested
- `origin`, `destination`, `weight`: Shipment details
- `message`: Additional notes
- `status`: pending, contacted, completed
- `created_at`: Request timestamp

### Row Level Security

- **Public users**: Can view shipments only by matching tracking number
- **Authenticated admins**: Full access to all tables
- **Quote submissions**: Public insertion allowed

## Getting Started

### Prerequisites

- Node.js 18+
- Supabase account
- Vercel account (for deployment)

### Installation

1. Clone the repository:
```bash
git clone <repository-url>
cd project
npm install
```

2. Configure environment variables:
```bash
cp .env.example .env.local
```

3. Add Supabase credentials to `.env.local`:
```
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
```

4. Set up database:
   - Create a Supabase project
   - Run the migration: `create_logistics_schema`
   - This creates all tables, indexes, and RLS policies

5. Run development server:
```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

## Project Structure

```
/app
  /admin                  # Admin login page
    /dashboard           # Protected admin dashboard
      layout.tsx         # Dashboard layout with nav
      page.tsx          # Shipments list
      /quotes           # Quote management
        page.tsx
  /quote                 # Public quote form
  /tracking              # Public tracking page
  layout.tsx            # Root layout with auth provider
  page.tsx              # Home page

/components
  /ui                   # Shadcn UI components

/lib
  /contexts             # React contexts (Auth)
  /supabase             # Supabase client
  /utils               # Utility functions (tracking number generation)

/types
  database.ts           # TypeScript type definitions

/.env.example          # Environment variables template
/README.md             # This file
```

## Key Features

### Auto-generated Tracking Numbers
Format: `AFG-YYYY-XXXX` (e.g., AFG-2024-1234)
- Generated automatically when creating shipments
- Unique and searchable
- Used for public tracking

### Status Management
Status flow with audit trail:
- Registered → Picked Up → In Transit → Out for Delivery → Delivered
- Each status change logged with timestamp and location
- Support for cancelled status

### Quote Management
- Customers submit quotes through public form
- Admin views all quotes with contact info
- Status tracking: pending → contacted → completed

### Authentication Flow
- Supabase Auth for admin users
- Session persistence
- Protected dashboard routes
- Sign out functionality

## Deployment

### Deploy to Vercel

1. Connect repository to Vercel
2. Add environment variables in Vercel settings
3. Deploy automatically on push

```bash
vercel
```

### Configure Supabase

1. Create Supabase project at https://supabase.com
2. Run migrations to create schema
3. Enable RLS on all tables
4. Get API keys and add to environment

### Create Admin User

1. Go to Supabase Auth dashboard
2. Create user with email and password
3. Use credentials to log in at `/admin`

## API Integration

All operations use Supabase client directly from frontend:

```typescript
// Track shipment
const { data } = await supabase
  .from('shipments')
  .select('*')
  .eq('tracking_number', 'AFG-2024-1234')
  .maybeSingle();

// Update shipment status
const { error } = await supabase
  .from('shipment_status_logs')
  .insert({ shipment_id, status, location, notes });

// Submit quote
const { error } = await supabase
  .from('quotes')
  .insert({ name, email, phone, service_type, ... });
```

## Development Commands

```bash
npm run dev          # Start development server
npm run build        # Build for production
npm start           # Start production server
npm run lint        # Run ESLint
npm run typecheck   # TypeScript type checking
```

## Security

- Row Level Security enabled on all tables
- Public tracking restricted to exact tracking number match
- Admin authentication required for dashboard
- Type-safe database operations
- No sensitive data in client code
- CORS headers configured for API routes

## Environment Variables

### Required
- `NEXT_PUBLIC_SUPABASE_URL`: Your Supabase project URL
- `NEXT_PUBLIC_SUPABASE_ANON_KEY`: Your Supabase anonymous key

Both are safe to expose to the client and should be prefixed with `NEXT_PUBLIC_`

## Testing

### Tracking Page
1. Go to `/tracking`
2. Enter valid tracking number (e.g., AFG-2024-1234)
3. View shipment details and status history

### Quote Form
1. Go to `/quote`
2. Fill out form with shipping details
3. Admin can view at `/admin/dashboard/quotes`

### Admin Dashboard
1. Go to `/admin`
2. Sign in with admin credentials
3. View shipments and quotes
4. Update shipment status
5. Update quote status

## Troubleshooting

### 401 Unauthorized
- Check Supabase credentials in `.env.local`
- Verify RLS policies are properly configured
- Ensure auth token is valid

### Tracking not found
- Verify tracking number format: AFG-YYYY-XXXX
- Check shipment exists in database
- Ensure it's public (not filtered by RLS)

### Admin login fails
- Verify user exists in Supabase Auth
- Check email/password are correct
- Look for auth errors in console

## License

MIT

## Support

For issues, create a GitHub issue or contact support at AFGHCO.COM.
