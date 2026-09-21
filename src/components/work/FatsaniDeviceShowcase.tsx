import React, { useState, useEffect, useRef } from 'react';
import { studioAudio } from '../../utils/audio';
import {
  Laptop,
  Tablet,
  Smartphone,
  Layers,
  ExternalLink,
  Sparkles,
  Upload,
  CheckCircle2
} from 'lucide-react';

interface MockupItem {
  id: 'macbook' | 'ipad' | 'iphone';
  name: string;
  deviceLabel: string;
  viewportBadge: string;
  imageSrc: string;
  altText: string;
  fileName: string;
}

const MOCKUPS: MockupItem[] = [
  {
    id: 'macbook',
    name: 'MacBook Pro',
    deviceLabel: 'MacBook Pro Mockup',
    viewportBadge: 'Desktop Viewport Render',
    imageSrc: '/macbook_pro_mock_up.jpg',
    altText: 'MacBook Pro Mockup Render — Fatsani Music',
    fileName: 'macbook_pro_mock_up.jpg'
  },
  {
    id: 'ipad',
    name: 'iPad Pro',
    deviceLabel: 'iPad Pro Mockup',
    viewportBadge: 'Tablet Viewport Render',
    imageSrc: '/ipad_mock_up.jpg',
    altText: 'iPad Pro Mockup Render — Fatsani Music',
    fileName: 'ipad_mock_up.jpg'
  },
  {
    id: 'iphone',
    name: 'iPhone 17 Pro Max',
    deviceLabel: 'iPhone 17 Pro Max Mockup',
    viewportBadge: 'Mobile Viewport Render',
    imageSrc: '/iphone_pro_max_mock_up.jpg',
    altText: 'iPhone 17 Pro Max Mockup Render — Fatsani Music',
    fileName: 'iphone_pro_max_mock_up.jpg'
  }
];

export const FatsaniDeviceShowcase: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'macbook' | 'ipad' | 'iphone' | 'all'>('macbook');
  const [imageErrors, setImageErrors] = useState<Record<string, boolean>>({});
  const [customSrcs, setCustomSrcs] = useState<Record<string, string>>({});
  const [uploadSuccess, setUploadSuccess] = useState<string | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Check initial mockup file existence from server API & preload all device mockups in memory
  useEffect(() => {
    // Preload mockups for instant tab switching
    MOCKUPS.forEach((m) => {
      const img = new Image();
      img.src = m.imageSrc;
    });

    fetch('/api/mockup-status')
      .then((res) => res.json())
      .then((status: Record<string, boolean>) => {
        const errors: Record<string, boolean> = {};
        MOCKUPS.forEach((m) => {
          if (status[m.fileName] === false && !customSrcs[m.id]) {
            errors[m.id] = true;
          }
        });
        setImageErrors((prev) => ({ ...prev, ...errors }));
      })
      .catch(() => {});
  }, [customSrcs]);

  const handleImageError = (id: string) => {
    setImageErrors((prev) => ({ ...prev, [id]: true }));
  };

  const handleFileProcess = async (files: FileList | null) => {
    if (!files || files.length === 0) return;

    studioAudio.playClick(1100);
    const uploadedNames: string[] = [];

    for (let i = 0; i < files.length; i++) {
      const file = files[i];
      const lowerName = file.name.toLowerCase();

      // Determine target mockup slot based on file name or current active tab
      let targetId: 'macbook' | 'ipad' | 'iphone' = 'macbook';
      let targetFileName = 'macbook_pro_mock_up.jpg';

      if (lowerName.includes('ipad')) {
        targetId = 'ipad';
        targetFileName = 'ipad_mock_up.jpg';
      } else if (lowerName.includes('iphone')) {
        targetId = 'iphone';
        targetFileName = 'iphone_pro_max_mock_up.jpg';
      } else if (lowerName.includes('macbook')) {
        targetId = 'macbook';
        targetFileName = 'macbook_pro_mock_up.jpg';
      } else if (activeTab !== 'all') {
        targetId = activeTab;
        targetFileName =
          activeTab === 'ipad'
            ? 'ipad_mock_up.jpg'
            : activeTab === 'iphone'
            ? 'iphone_pro_max_mock_up.jpg'
            : 'macbook_pro_mock_up.jpg';
      }

      // Read as base64 data URI
      const reader = new FileReader();
      reader.onload = async (e) => {
        const base64Data = e.target?.result as string;
        if (!base64Data) return;

        // Immediately update preview in real-time
        setCustomSrcs((prev) => ({ ...prev, [targetId]: base64Data }));
        setImageErrors((prev) => ({ ...prev, [targetId]: false }));

        // Persist to server /public folder via API
        try {
          await fetch('/api/upload-mockup', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ fileName: targetFileName, base64Data })
          });
        } catch (err) {
          console.error('Failed to sync to server disk:', err);
        }
      };
      reader.readAsDataURL(file);
      uploadedNames.push(targetFileName);
    }

    setUploadSuccess(`Loaded ${uploadedNames.join(', ')}`);
    setTimeout(() => setUploadSuccess(null), 5000);
  };

  const selectedMockup = MOCKUPS.find((m) => m.id === activeTab) || MOCKUPS[0];

  const getSourceFor = (mockup: MockupItem) => {
    if (customSrcs[mockup.id]) return customSrcs[mockup.id];
    return `${mockup.imageSrc}?v=1`;
  };

  return (
    <div className="w-full space-y-4">
      {/* Hidden File Input for Direct Upload */}
      <input
        type="file"
        ref={fileInputRef}
        onChange={(e) => handleFileProcess(e.target.files)}
        accept="image/jpeg,image/png,image/webp"
        multiple
        className="hidden"
      />

      {/* Viewport & Device Switcher (Unique Amaze Design System) */}
      <div className="flex flex-wrap items-center justify-between gap-3 p-2 rounded-xl bg-[#090D12] border border-white/10">
        <div className="flex items-center gap-2">
          <span className="font-mono text-xs uppercase tracking-wider text-[#008280] font-bold px-2.5 py-1 bg-[#008280]/10 rounded border border-[#008280]/25 flex items-center gap-1.5">
            <Sparkles className="h-3.5 w-3.5" />
            <span>PORTFOLIO MOCKUPS</span>
          </span>
          <span className="hidden sm:inline font-mono text-xs text-[#94A3B8]">
            PROJECT DEVICE RENDERS:
          </span>
        </div>

        <div className="flex flex-wrap items-center gap-1.5 font-mono text-xs">
          <button
            onClick={() => {
              studioAudio.playClick(900);
              setActiveTab('macbook');
            }}
            className={`flex items-center gap-2 px-3.5 py-2 rounded-lg transition-all uppercase font-semibold ${
              activeTab === 'macbook'
                ? 'bg-[#008280] text-white shadow-[0_0_16px_rgba(0,130,128,0.35)]'
                : 'text-[#94A3B8] hover:text-[#EBECF0] hover:bg-white/5'
            }`}
          >
            <Laptop className="h-4 w-4" />
            <span>MACBOOK PRO</span>
          </button>

          <button
            onClick={() => {
              studioAudio.playClick(950);
              setActiveTab('ipad');
            }}
            className={`flex items-center gap-2 px-3.5 py-2 rounded-lg transition-all uppercase font-semibold ${
              activeTab === 'ipad'
                ? 'bg-[#008280] text-white shadow-[0_0_16px_rgba(0,130,128,0.35)]'
                : 'text-[#94A3B8] hover:text-[#EBECF0] hover:bg-white/5'
            }`}
          >
            <Tablet className="h-4 w-4" />
            <span>IPAD</span>
          </button>

          <button
            onClick={() => {
              studioAudio.playClick(1000);
              setActiveTab('iphone');
            }}
            className={`flex items-center gap-2 px-3.5 py-2 rounded-lg transition-all uppercase font-semibold ${
              activeTab === 'iphone'
                ? 'bg-[#008280] text-white shadow-[0_0_16px_rgba(0,130,128,0.35)]'
                : 'text-[#94A3B8] hover:text-[#EBECF0] hover:bg-white/5'
            }`}
          >
            <Smartphone className="h-4 w-4" />
            <span>IPHONE 17 PRO MAX</span>
          </button>

          <button
            onClick={() => {
              studioAudio.playClick(1050);
              setActiveTab('all');
            }}
            className={`flex items-center gap-2 px-3.5 py-2 rounded-lg transition-all uppercase font-semibold ${
              activeTab === 'all'
                ? 'bg-[#008280] text-white shadow-[0_0_16px_rgba(0,130,128,0.35)]'
                : 'text-[#94A3B8] hover:text-[#EBECF0] hover:bg-white/5'
            }`}
          >
            <Layers className="h-4 w-4" />
            <span>ALL RENDERS</span>
          </button>
        </div>
      </div>

      {/* Upload / Replace Mockup Action Strip */}
      <div className="flex flex-wrap items-center justify-between gap-2 px-3.5 py-2 rounded-lg bg-[#050607] border border-white/10 font-mono text-xs">
        <div className="flex items-center gap-2">
          <button
            onClick={() => fileInputRef.current?.click()}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-md bg-[#008280]/20 hover:bg-[#008280]/30 border border-[#008280]/40 text-[#5EEAD4] font-semibold transition-all shadow-sm"
          >
            <Upload className="h-3.5 w-3.5" />
            <span>UPLOAD / REPLACE MOCKUP FILE</span>
          </button>
        </div>

        {uploadSuccess && (
          <div className="inline-flex items-center gap-1.5 text-[#10B981] font-mono text-xs">
            <CheckCircle2 className="h-3.5 w-3.5" />
            <span>{uploadSuccess}</span>
          </div>
        )}
      </div>

      {/* Single Device View */}
      {activeTab !== 'all' ? (
        <div
          onDragOver={(e) => {
            e.preventDefault();
            setIsDragging(true);
          }}
          onDragLeave={() => setIsDragging(false)}
          onDrop={(e) => {
            e.preventDefault();
            setIsDragging(false);
            handleFileProcess(e.dataTransfer.files);
          }}
          className={`relative rounded-2xl border ${
            isDragging ? 'border-[#008280] ring-2 ring-[#008280]/40' : 'border-white/10'
          } bg-[#090D12] overflow-hidden shadow-2xl transition-all`}
        >
          {/* Header Bar */}
          <div className="flex items-center justify-between px-5 py-3 border-b border-white/10 bg-black/40">
            <div className="flex items-center gap-3">
              <span className="font-mono text-xs uppercase tracking-widest text-[#008280] font-bold">
                {selectedMockup.deviceLabel}
              </span>
              <span className="text-[#94A3B8] text-xs font-mono">
                // {selectedMockup.viewportBadge}
              </span>
            </div>

            <a
              href="https://fatsanimusic.com/"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 font-mono text-xs text-[#CBD5E1] hover:text-[#008280] uppercase transition-colors"
            >
              <span>LIVE SITE</span>
              <ExternalLink className="h-3 w-3" />
            </a>
          </div>

          {/* Image Container — Render Mockup */}
          <div className="p-4 sm:p-6 lg:p-8 flex items-center justify-center bg-black/60 min-h-[440px]">
            {!imageErrors[selectedMockup.id] || customSrcs[selectedMockup.id] ? (
              <img
                src={getSourceFor(selectedMockup)}
                alt={selectedMockup.altText}
                loading={selectedMockup.id === 'macbook' ? 'eager' : 'lazy'}
                decoding="async"
                fetchPriority={selectedMockup.id === 'macbook' ? 'high' : 'auto'}
                onError={() => handleImageError(selectedMockup.id)}
                referrerPolicy="no-referrer"
                className="max-h-[640px] w-auto max-w-full object-contain rounded-lg shadow-2xl transition-all"
              />
            ) : (
              <div
                onClick={() => fileInputRef.current?.click()}
                className="flex flex-col items-center justify-center p-10 text-center space-y-3 max-w-md border-2 border-dashed border-white/20 hover:border-[#008280]/60 rounded-xl bg-[#050607]/80 cursor-pointer transition-all hover:bg-[#050607]"
              >
                <div className="p-3 rounded-full bg-[#008280]/10 border border-[#008280]/30 text-[#008280]">
                  <Upload className="h-6 w-6" />
                </div>
                <div>
                  <h4 className="font-display font-bold text-white text-sm uppercase">
                    {selectedMockup.deviceLabel}
                  </h4>
                  <p className="font-mono text-xs text-[#94A3B8] mt-1">
                    File required: <code className="text-[#5EEAD4]">{selectedMockup.fileName}</code>
                  </p>
                </div>
                <p className="font-sans text-xs text-[#CBD5E1] leading-relaxed">
                  Click here or drag &amp; drop <strong>{selectedMockup.fileName}</strong> to view the render immediately.
                </p>
              </div>
            )}
          </div>
        </div>
      ) : (
        /* All 3 Renders Gallery View */
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          {MOCKUPS.map((mockup) => (
            <div
              key={mockup.id}
              className="rounded-xl border border-white/10 bg-[#090D12] overflow-hidden shadow-xl flex flex-col"
            >
              <div className="px-4 py-2.5 border-b border-white/10 bg-black/40 flex items-center justify-between">
                <span className="font-mono text-xs text-[#008280] font-bold uppercase tracking-wider">
                  {mockup.name}
                </span>
                <span className="font-mono text-[10px] text-[#94A3B8] uppercase">
                  {mockup.viewportBadge}
                </span>
              </div>

              <div className="p-4 bg-black/60 flex-1 flex items-center justify-center min-h-[300px]">
                {!imageErrors[mockup.id] || customSrcs[mockup.id] ? (
                  <img
                    src={getSourceFor(mockup)}
                    alt={mockup.altText}
                    loading="lazy"
                    decoding="async"
                    onError={() => handleImageError(mockup.id)}
                    referrerPolicy="no-referrer"
                    className="max-h-[420px] w-auto max-w-full object-contain rounded-md shadow-lg"
                  />
                ) : (
                  <div
                    onClick={() => fileInputRef.current?.click()}
                    className="flex flex-col items-center justify-center p-6 text-center space-y-2 text-[#94A3B8] border border-dashed border-white/15 rounded-lg hover:border-[#008280]/60 cursor-pointer w-full"
                  >
                    <Upload className="h-5 w-5 text-[#008280]" />
                    <span className="font-mono text-xs text-white uppercase">{mockup.name}</span>
                    <span className="font-mono text-[11px] text-[#5EEAD4]">{mockup.fileName}</span>
                    <span className="text-[10px] text-[#94A3B8]">Click to select file</span>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
