# Phethagatsa Solutions — Modern African Skincare & Wellness Web App

A production-grade, full-stack South African e-commerce ecosystem merging high-end botanical cosmetics storefront design with a dedicated Admin operations portal, shared Node/Express API, and free database configuration (Supabase / Neon PostgreSQL or MongoDB Atlas Free M0).

---

## Architecture Overview

```text
phethagatsa-webapp/
├── apps/
│   ├── storefront/     # Customer shopping website & account portal
│   └── admin/          # Admin management dashboard (Orders, Products, Customers, Reports)
├── server/             # Shared Node/Express REST API
├── prisma/             # Database schema (PostgreSQL & MongoDB)
├── packages/shared/    # Shared models, WhatsApp deep-link generators, utilities
├── src/                # Integrated Vite React production applet with interactive App Switcher
└── README.md           # Setup and deployment documentation
```

---

## Key Features

### 🛍️ Customer Storefront
1. **Signature Editorial Homepage**:
   - High-resolution hero campaign featuring glowing melanin skincare photography.
   - Acacia tree gold seal logo & brand wordmark.
   - 4 Provenance Trust Badges: *100% Natural Ingredients*, *Cruelty Free*, *Skin Tested*, *Fast Delivery (SA)*.
   - Best Sellers product carousel with instant cart insertion.
   - Pediatrician-tested Eczema Relief Story section featuring mother treating child's eczema.
2. **Shop / Product Catalog**:
   - Sidebar category filtering (*Face Care, Body Care, Hair Care, Bundles, Superfoods, Exfoliators*).
   - Real-time search filter and sorting (*Featured, Price Low-High, Price High-Low, Customer Rated*).
   - Tactile CSS hover transitions with smooth 700ms image zoom.
3. **Interactive Product Details (PDP)**:
   - High-res image gallery with slider and thumbnail selector.
   - Size selector (50ml / 100ml / 150ml) and quantity stepper.
   - **Direct "Order via WhatsApp"** button generating pre-formatted order message with SKU and price in ZAR.
   - Detailed tabs for Botanical Description, Pure Ingredients, and Customer Reviews.
4. **Checkout & South African Logistics**:
   - 3-Step checkout flow (*Shipping Address, Payment Method, Order Review*).
   - Door-to-door courier tracking across all 9 provinces via *The Courier Guy* and *RAM*.
   - Free courier threshold for orders over R450 (R75 flat rate for smaller orders).
   - Payment options: Instant EFT (Ozow, Capitec, FNB, Standard Bank), Visa/Mastercard, PayFast, and Cash on Delivery.
5. **Customer Account Portal ("Welcome back, Mpho!")**:
   - Overview KPI cards: Total Orders, Wishlist items, Loyalty Points.
   - **Order History & Live Timeline**: Visual tracking stages (*Order Placed → Processing → Shipped → Delivered*).
   - Saved Wishlist with quick add-to-cart.
   - Account Settings (Personal Information, Address, Password).
   - Help & Support with FAQ accordion and WhatsApp concierge hotline.

---

### ⚡ Admin Dashboard
1. **Real-time KPI Metrics**:
   - Total Orders (with % growth), Total Revenue in ZAR, Total Customers, Active Products count.
2. **Interactive Sales Overview**:
   - Visual monthly performance chart with order volumes.
3. **Manage Products**:
   - Live inventory management table showing stock levels and pricing.
   - **Add New Product Modal**: Enter name, category, price, stock, description, and custom image URL.
   - Instant edit and delete actions with database synchronization.
4. **Manage Orders**:
   - Filter by status: *All, Pending, Processing, Shipped, Delivered*.
   - Instant status switcher that updates customer delivery timelines in real-time.
   - One-click customer WhatsApp contact button.
5. **Customers & Loyalty**:
   - Customer directory with tier badges (*VIP Radiant, Gold, Silver*), accumulated points, and purchase history.
6. **Store Settings**:
   - Business contact details (Pretoria & Johannesburg headquarters), WhatsApp line (+27 72 381 9402), delivery rates, and free shipping threshold.

---

## Database Configuration

### Option A: Free Relational Database (PostgreSQL via Supabase or Neon)
1. Create a free account on [Supabase](https://supabase.com) or [Neon](https://neon.tech).
2. Create a new PostgreSQL database and copy the connection string.
3. In your `.env`:
   ```env
   DATABASE_URL="postgresql://user:password@ep-host.region.aws.neon.tech/phethagatsa?sslmode=require"
   ```
4. Run Prisma migration:
   ```bash
   npx prisma migrate dev --name init
   ```

### Option B: Free Document Database (MongoDB Atlas M0 Free Tier)
1. Create a free M0 cluster on [MongoDB Atlas](https://www.mongodb.com/atlas).
2. Change the provider in `prisma/schema.prisma`:
   ```prisma
   datasource db {
     provider = "mongodb"
     url      = env("DATABASE_URL")
   }
   ```
3. Set your connection string in `.env`:
   ```env
   DATABASE_URL="mongodb+srv://user:password@cluster0.mongodb.net/phethagatsa?retryWrites=true&w=majority"
   ```
4. Push schema to MongoDB:
   ```bash
   npx prisma db push
   ```

### Option C: Instant Zero-Cost Browser Persistence (Built-in)
The application includes `src/services/db.ts`, which provides instant reactive storage, cross-tab synchronization, and complete order/product/customer persistence with 0ms latency and zero configuration.

---

## Environment Variables (`.env.example`)

```env
# Server Configuration
PORT=3000
NODE_ENV=development

# Database Connection (PostgreSQL or MongoDB)
DATABASE_URL="postgresql://postgres:password@localhost:5432/phethagatsa_db"

# WhatsApp Business Integration
WHATSAPP_NUMBER=27723819402
VITE_WHATSAPP_NUMBER=27723819402

# Store Logistics & Currencies
DEFAULT_CURRENCY=ZAR
FREE_SHIPPING_THRESHOLD_ZAR=450
DEFAULT_SHIPPING_ZAR=75
```

---

## Running the Application

```bash
# Install dependencies
npm install

# Start development server
npm run dev

# Build for production
npm run build
```

---

## WhatsApp Customer Support Line
- **Phone**: +27 72 381 9402
- **Email**: care@phethagatsa.co.za
- **Headquarters**: 123 Main Street, Pretoria / Johannesburg, Gauteng, South Africa
