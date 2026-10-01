// apps/admin/src/App.tsx
// Independent entry point for Phethagatsa Admin Dashboard
import React from 'react';
import { AdminDashboard } from '../../../src/components/admin/AdminDashboard';

export default function AdminApp() {
  return (
    <div className="min-h-screen bg-[#0f1713] text-stone-100 flex flex-col font-sans">
      <AdminDashboard />
    </div>
  );
}
