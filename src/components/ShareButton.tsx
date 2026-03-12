import { useState, useEffect, useRef } from 'react';
import { Share2, Check } from 'lucide-react';
import type { Location } from '../types';

interface Props {
  location: Location;
}

export default function ShareButton({ location }: Props) {
  const [copied, setCopied] = useState(false);
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    return () => {
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
    };
  }, []);

  const handleShare = async () => {
    const url = `${window.location.origin}${window.location.pathname}?location=${location.id}`;
    const message = `🌳 Check out this shady play spot I found on TreePatch!\n\n${location.name} (${location.neighborhood})\n\n${url}`;

    try {
      await navigator.clipboard.writeText(message);
    } catch {
      // fallback
      const el = document.createElement('textarea');
      el.value = message;
      document.body.appendChild(el);
      el.select();
      document.execCommand('copy');
      document.body.removeChild(el);
    }

    setCopied(true);
    if (timeoutRef.current) clearTimeout(timeoutRef.current);
    timeoutRef.current = setTimeout(() => setCopied(false), 2500);
  };

  return (
    <button
      onClick={handleShare}
      className={`
        flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-semibold font-body
        transition-all duration-200
        ${copied
          ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/60 dark:text-emerald-300'
          : 'bg-slate-100 hover:bg-slate-200 text-slate-700 dark:bg-slate-700 dark:hover:bg-slate-600 dark:text-slate-200'
        }
      `}
    >
      {copied ? (
        <>
          <Check size={15} strokeWidth={2.5} />
          Copied!
        </>
      ) : (
        <>
          <Share2 size={15} strokeWidth={2} />
          Share
        </>
      )}
    </button>
  );
}
