import JSZip from 'jszip';

export interface FileTreeItem {
  path: string;
  type: 'file' | 'directory';
  size?: string;
  description: string;
}

export const MONOREPO_STRUCTURE: FileTreeItem[] = [
  { path: 'apps/storefront/src/App.tsx', type: 'file', description: 'Customer Storefront entrypoint & shopping UI' },
  { path: 'apps/storefront/package.json', type: 'file', description: 'Storefront dependencies and Vite scripts' },
  { path: 'apps/storefront/README.md', type: 'file', description: 'Storefront documentation' },
  { path: 'apps/admin/src/App.tsx', type: 'file', description: 'Admin operations & inventory portal' },
  { path: 'apps/admin/package.json', type: 'file', description: 'Admin dependencies and Vite scripts' },
  { path: 'apps/admin/README.md', type: 'file', description: 'Admin documentation' },
  { path: 'server/index.ts', type: 'file', description: 'Shared Node.js Express REST API & WhatsApp generator' },
  { path: 'prisma/schema.prisma', type: 'file', description: 'Prisma schema for PostgreSQL / MongoDB' },
  { path: 'packages/shared/index.ts', type: 'file', description: 'Shared TypeScript types & currency/WhatsApp helpers' },
  { path: 'README.md', type: 'file', description: 'Complete monorepo setup instructions' },
  { path: '.env.example', type: 'file', description: 'Environment variables template' },
];

export async function generateStarterZip(): Promise<Blob> {
  const zip = new JSZip();

  // Root files
  zip.file('.env.example', `# Phethagatsa Solutions Environment Configuration
APP_URL="http://localhost:3000"

# Database Configuration (Free PostgreSQL: Neon/Supabase OR MongoDB Atlas M0)
DATABASE_URL="postgresql://user:password@localhost:5432/phethagatsa_db"

# WhatsApp Business Concierge
VITE_WHATSAPP_NUMBER="27723819402"
WHATSAPP_NUMBER="27723819402"
WHATSAPP_CARE_NAME="Phethagatsa Botanical Concierge"
PORT=3000
`);

  zip.file('README.md', `# Phethagatsa Solutions — Modern African Skincare Web App Starter

A full-stack South African botanical skincare & wellness e-commerce monorepo.

## Project Structure
\`\`\`
phethagatsa-webapp/
├── apps/
│   ├── storefront/     # Customer website (Shopping, Cart, EFT Checkout, WhatsApp)
│   └── admin/          # Admin portal (Products, Orders, Tracking, Analytics)
├── server/             # Shared Node/Express API
├── prisma/             # Database schema (PostgreSQL / MongoDB)
├── packages/shared/    # Shared types & WhatsApp link generator
└── README.md
\`\`\`

## Quick Start
1. Install dependencies:
   \`npm install\`
2. Configure \`.env\`:
   \`cp .env.example .env\`
3. Generate Prisma client & migrate:
   \`npx prisma db push\`
4. Run development server:
   \`npm run dev\`
`);

  // prisma/schema.prisma
  zip.file('prisma/schema.prisma', `datasource db {
  provider = "postgresql" // or "mongodb"
  url      = env("DATABASE_URL")
}

generator client {
  provider = "prisma-client-js"
}

enum Role {
  CUSTOMER
  ADMIN
  STAFF
}

enum OrderStatus {
  PENDING
  PROCESSING
  SHIPPED
  DELIVERED
  CANCELLED
}

model User {
  id            String   @id @default(uuid())
  email         String   @unique
  name          String
  phone         String?
  role          Role     @default(CUSTOMER)
  loyaltyPoints Int      @default(50)
  createdAt     DateTime @default(now())
  orders        Order[]
}

model Product {
  id          String   @id @default(uuid())
  name        String
  tagline     String
  category    String
  priceZAR    Decimal  @db.Decimal(10, 2)
  stock       Int      @default(50)
  rating      Float    @default(5.0)
  image       String
  description String
  benefits    String[]
  createdAt   DateTime @default(now())
}

model Order {
  id              String      @id @default(uuid())
  orderNumber     String      @unique
  customerName    String
  customerEmail   String
  customerPhone   String
  shippingAddress String
  total           Decimal     @db.Decimal(10, 2)
  status          OrderStatus @default(PENDING)
  trackingNumber  String?
  createdAt       DateTime    @default(now())
}
`);

  // packages/shared/index.ts
  zip.file('packages/shared/index.ts', `export function formatZAR(amount: number): string {
  return new Intl.NumberFormat('en-ZA', {
    style: 'currency',
    currency: 'ZAR',
    minimumFractionDigits: 0,
  }).format(amount);
}

export function generateWhatsAppOrderUrl(orderId: string, totalZAR: number, customerName: string): string {
  const phone = "27723819402";
  const text = encodeURIComponent(
    \`*Dumela Phethagatsa Solutions!* 🇿🇦\\n\\nI placed order *#\${orderId}* for *R\${totalZAR}* (\${customerName}).\\nPlease confirm banking & delivery details!\`
  );
  return \`https://wa.me/\${phone}?text=\${text}\`;
}
`);

  // apps/storefront
  zip.file('apps/storefront/package.json', JSON.stringify({
    name: '@phethagatsa/storefront',
    version: '1.0.0',
    private: true,
    scripts: { dev: 'vite --port 3001', build: 'vite build' }
  }, null, 2));

  zip.file('apps/storefront/README.md', '# Phethagatsa Customer Storefront\nCustomer browsing, cart, Instant EFT and WhatsApp ordering.\n');

  // apps/admin
  zip.file('apps/admin/package.json', JSON.stringify({
    name: '@phethagatsa/admin',
    version: '1.0.0',
    private: true,
    scripts: { dev: 'vite --port 3002', build: 'vite build' }
  }, null, 2));

  zip.file('apps/admin/README.md', '# Phethagatsa Admin Dashboard\nOperations portal for orders, stock, Courier Guy tracking and analytics.\n');

  // server/index.ts
  zip.file('server/index.ts', `import express from 'express';
import dotenv from 'dotenv';
dotenv.config();

const app = express();
app.use(express.json());

app.get('/api/health', (req, res) => res.json({ status: 'online', app: 'Phethagatsa API' }));

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(\`Server running on \${PORT}\`));
`);

  return await zip.generateAsync({ type: 'blob' });
}

export function triggerDownloadBlob(blob: Blob, filename: string) {
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}
