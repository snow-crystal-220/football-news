import React from 'react';

interface AdSlotProps {
  slotId: string;
  className?: string;
  fallback?: React.ReactNode;
}

export default function AdSlot({ slotId, className = '' }: AdSlotProps) {
  const adContent: Record<string, { label: string; size: string }> = {
    'header-banner': { label: 'Advertisement', size: '728x90' },
    'sidebar-top': { label: 'Sponsored', size: '300x250' },
    'sidebar-bottom': { label: 'Sponsored', size: '300x250' },
    'in-article': { label: 'Advertisement', size: '728x90' },
    'homepage-mid': { label: 'Advertisement', size: '970x250' },
    'footer-banner': { label: 'Advertisement', size: '728x90' },
    'mobile-sticky': { label: 'Ad', size: '320x50' },
  };

  const ad = adContent[slotId];
  if (!ad) return null;

  return (
    <div className={`ad-slot ${className}`} data-slot-id={slotId}>
      <div className="bg-gray-50 border border-dashed border-gray-200 rounded-lg flex flex-col items-center justify-center py-6 px-4">
        <span className="text-[10px] text-gray-400 uppercase tracking-wider font-medium">{ad.label}</span>
        <div className="text-xs text-gray-300 mt-1">{ad.size}</div>
      </div>
    </div>
  );
}
