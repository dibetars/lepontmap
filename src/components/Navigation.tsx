'use client';

interface Props {
  onMenuClick: () => void;
  wellCount: number;
  ngoName: string;
}

export default function Navigation({ onMenuClick, wellCount, ngoName }: Props) {
  return (
    <nav className="absolute top-0 inset-x-0 z-20 flex items-center justify-between px-6 py-4">
      {/* Hamburger menu */}
      <button
        onClick={onMenuClick}
        className="text-white hover:opacity-60 transition-opacity"
        aria-label="Open well list"
      >
        <svg viewBox="0 0 28 18" fill="none" className="w-7 h-[18px]">
          <line x1="0" y1="1" x2="28" y2="1" stroke="white" strokeWidth="1.5" />
          <line x1="0" y1="9" x2="28" y2="9" stroke="white" strokeWidth="1.5" />
          <line x1="0" y1="17" x2="28" y2="17" stroke="white" strokeWidth="1.5" />
        </svg>
      </button>

      {/* Brand / logo */}
      <div className="text-center select-none">
        <div className="flex items-center justify-center gap-2 text-white">
          <WaterDropIcon className="w-4 h-4" />
          <span className="font-serif text-lg tracking-[0.15em]">{ngoName}</span>
        </div>
        <p className="font-sans text-[9px] tracking-[0.25em] text-white/50 uppercase mt-0.5">
          {wellCount} Wells Built
        </p>
      </div>

      {/* Donate CTA */}
      <a
        href="#"
        className="font-sans text-[11px] tracking-[0.2em] uppercase text-white hover:opacity-60 transition-opacity"
      >
        Donate
      </a>
    </nav>
  );
}

function WaterDropIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 30" fill="currentColor" className={className}>
      <path d="M12 0C12 0 2 11 2 18a10 10 0 0020 0C22 11 12 0 12 0z" />
    </svg>
  );
}
