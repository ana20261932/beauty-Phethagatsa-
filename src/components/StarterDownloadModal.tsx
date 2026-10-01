import React, { useState } from 'react';
import {
  Download,
  FolderTree,
  Database,
  Server,
  Smartphone,
  LayoutDashboard,
  CheckCircle2,
  Copy,
  Terminal,
  ExternalLink,
  X,
  FileCode,
  PackageCheck,
  Sparkles,
} from 'lucide-react';
import { generateStarterZip, triggerDownloadBlob, MONOREPO_STRUCTURE } from '../services/starterExport';

interface StarterDownloadModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const StarterDownloadModal: React.FC<StarterDownloadModalProps> = ({ isOpen, onClose }) => {
  const [isGenerating, setIsGenerating] = useState(false);
  const [downloadSuccess, setDownloadSuccess] = useState(false);
  const [copiedSection, setCopiedSection] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleDownload = async () => {
    try {
      setIsGenerating(true);
      const blob = await generateStarterZip();
      triggerDownloadBlob(blob, 'phethagatsa-webapp-starter.zip');
      setDownloadSuccess(true);
      setTimeout(() => setDownloadSuccess(false), 4000);
    } catch (err) {
      console.error('Failed to generate starter zip:', err);
    } finally {
      setIsGenerating(false);
    }
  };

  const handleCopy = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopiedSection(id);
    setTimeout(() => setCopiedSection(null), 2000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm animate-fade-in">
      <div className="bg-[#121c16] text-stone-100 border border-emerald-900/60 rounded-2xl w-full max-w-4xl max-h-[90vh] flex flex-col shadow-2xl overflow-hidden font-sans">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-emerald-900/50 bg-[#17261e]">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-emerald-800/40 border border-emerald-700/50 flex items-center justify-center text-emerald-300">
              <Download className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-lg font-serif font-bold text-white tracking-wide">
                  Download Phethagatsa Web App Starter
                </h3>
                <span className="px-2 py-0.5 rounded text-[10px] uppercase font-mono tracking-widest bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                  Ready to Deploy
                </span>
              </div>
              <p className="text-xs text-stone-400">
                Monorepo architecture with Storefront, Admin portal, Node/Express API, and free DB setup.
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 text-stone-400 hover:text-white rounded-lg hover:bg-white/5 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6">
          {/* Main Action Callout */}
          <div className="bg-gradient-to-r from-emerald-950/80 via-[#182d22] to-emerald-950/80 border border-emerald-700/40 rounded-xl p-5 flex flex-col sm:flex-row items-center justify-between gap-4">
            <div>
              <h4 className="text-base font-semibold text-white flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-emerald-400" />
                Download Complete Web App Starter Archive (.ZIP)
              </h4>
              <p className="text-xs text-stone-300 mt-1">
                Includes all monorepo directories (<code className="text-emerald-300 font-mono">apps/storefront</code>, <code className="text-emerald-300 font-mono">apps/admin</code>, <code className="text-emerald-300 font-mono">server/</code>, <code className="text-emerald-300 font-mono">prisma/</code>, <code className="text-emerald-300 font-mono">packages/shared/</code>).
              </p>
            </div>

            <button
              onClick={handleDownload}
              disabled={isGenerating}
              className="w-full sm:w-auto px-6 py-3 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-medium text-sm flex items-center justify-center gap-2 transition-all shadow-lg hover:shadow-emerald-900/40 cursor-pointer disabled:opacity-50"
            >
              {isGenerating ? (
                <>
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  <span>Packaging Starter ZIP...</span>
                </>
              ) : downloadSuccess ? (
                <>
                  <CheckCircle2 className="w-4 h-4 text-white" />
                  <span>Downloaded Successfully!</span>
                </>
              ) : (
                <>
                  <Download className="w-4 h-4" />
                  <span>Download Starter ZIP</span>
                </>
              )}
            </button>
          </div>

          {/* Directory Tree Layout Visualizer */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Tree Structure */}
            <div className="bg-[#0e1612] border border-emerald-900/40 rounded-xl p-4">
              <div className="flex items-center justify-between mb-3 pb-2 border-b border-white/5">
                <span className="text-xs font-mono font-bold text-emerald-300 flex items-center gap-1.5">
                  <FolderTree className="w-4 h-4" /> Intended Monorepo Layout
                </span>
                <span className="text-[10px] text-stone-500 font-mono">phethagatsa-webapp/</span>
              </div>
              <pre className="text-xs font-mono text-stone-300 leading-relaxed overflow-x-auto p-2 bg-black/40 rounded-lg">
{`phethagatsa-webapp/
├── apps/
│   ├── storefront/     # Customer shopping UI
│   │   ├── src/App.tsx
│   │   └── package.json
│   └── admin/          # Operations dashboard
│       ├── src/App.tsx
│       └── package.json
├── server/             # Shared Node/Express API
│   └── index.ts
├── prisma/             # Schema (Postgres / Mongo)
│   └── schema.prisma
├── packages/shared/    # Shared types & WhatsApp
│   └── index.ts
├── .env.example
└── README.md`}
              </pre>
            </div>

            {/* Free Database Options */}
            <div className="bg-[#0e1612] border border-emerald-900/40 rounded-xl p-4 flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between mb-3 pb-2 border-b border-white/5">
                  <span className="text-xs font-mono font-bold text-emerald-300 flex items-center gap-1.5">
                    <Database className="w-4 h-4" /> Free Database Options
                  </span>
                  <span className="text-[10px] text-emerald-400 bg-emerald-950/80 px-2 py-0.5 rounded border border-emerald-800">
                    $0 / month Free Tier
                  </span>
                </div>

                <div className="space-y-3 text-xs text-stone-300">
                  <div className="p-2.5 rounded-lg bg-white/5 border border-white/5">
                    <div className="font-semibold text-white flex items-center gap-2">
                      <span className="w-2 h-2 rounded-full bg-emerald-400" />
                      Option A: PostgreSQL (Neon / Supabase)
                    </div>
                    <p className="text-stone-400 text-[11px] mt-0.5">
                      Recommended. Unlimited instant branch DBs with free tier. Compatible with standard Prisma queries.
                    </p>
                    <code className="block mt-1 text-[10px] text-emerald-300 font-mono bg-black/40 px-2 py-1 rounded">
                      DATABASE_URL="postgresql://user:pass@ep-free.neon.tech/phethagatsa"
                    </code>
                  </div>

                  <div className="p-2.5 rounded-lg bg-white/5 border border-white/5">
                    <div className="font-semibold text-white flex items-center gap-2">
                      <span className="w-2 h-2 rounded-full bg-emerald-400" />
                      Option B: MongoDB Atlas (M0 Free Cluster)
                    </div>
                    <p className="text-stone-400 text-[11px] mt-0.5">
                      512MB free perpetual storage. Switch Prisma datasource provider to <code className="text-emerald-300">"mongodb"</code>.
                    </p>
                    <code className="block mt-1 text-[10px] text-emerald-300 font-mono bg-black/40 px-2 py-1 rounded">
                      DATABASE_URL="mongodb+srv://user:pass@cluster0.mongodb.net/phethagatsa"
                    </code>
                  </div>
                </div>
              </div>

              <div className="mt-3 pt-2 border-t border-white/5 flex items-center justify-between text-[11px] text-stone-400">
                <span>Migration command:</span>
                <code className="text-emerald-300 font-mono bg-black/30 px-2 py-0.5 rounded">npx prisma db push</code>
              </div>
            </div>
          </div>

          {/* Setup Commands */}
          <div className="bg-[#0e1612] border border-emerald-900/40 rounded-xl p-4">
            <div className="flex items-center justify-between mb-3 pb-2 border-b border-white/5">
              <span className="text-xs font-mono font-bold text-emerald-300 flex items-center gap-1.5">
                <Terminal className="w-4 h-4" /> Quick Setup Instructions
              </span>
              <button
                onClick={() =>
                  handleCopy(
                    `# 1. Unzip and enter folder\ncd phethagatsa-webapp\n\n# 2. Install dependencies\nnpm install\n\n# 3. Configure environment\ncp .env.example .env\n\n# 4. Push schema to free DB\nnpx prisma db push\n\n# 5. Start unified dev server\nnpm run dev`,
                    'commands'
                  )
                }
                className="text-xs text-stone-400 hover:text-emerald-300 flex items-center gap-1 transition-colors cursor-pointer"
              >
                {copiedSection === 'commands' ? (
                  <>
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                    <span className="text-emerald-400">Copied!</span>
                  </>
                ) : (
                  <>
                    <Copy className="w-3.5 h-3.5" />
                    <span>Copy Commands</span>
                  </>
                )}
              </button>
            </div>
            <pre className="text-xs font-mono text-emerald-200 bg-black/50 p-3 rounded-lg overflow-x-auto leading-relaxed">
{`# 1. Enter project directory
cd phethagatsa-webapp

# 2. Install dependencies
npm install

# 3. Configure environment
cp .env.example .env

# 4. Push database schema to Neon / Supabase / MongoDB
npx prisma db push

# 5. Start development
npm run dev`}
            </pre>
          </div>
        </div>

        {/* Footer */}
        <div className="px-6 py-3.5 bg-[#17261e] border-t border-emerald-900/50 flex items-center justify-between text-xs text-stone-400">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-emerald-400" />
            <span>Phethagatsa Solutions · Pretoria & Johannesburg</span>
          </div>

          <button
            onClick={onClose}
            className="px-4 py-1.5 rounded-lg bg-stone-800 hover:bg-stone-700 text-stone-200 transition-colors cursor-pointer"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};
