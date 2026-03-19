'use client';

import { useState } from 'react';
import { useMantraStore } from '@/stores/useMantraStore';
import { GlassPanel } from '@/components/ui/GlassPanel';
import type { Mantra } from '@/types';

const fontOptions: { value: Mantra['font']; label: string; className: string }[] = [
  { value: 'serif', label: 'Cormorant Garamond', className: 'font-serif' },
  { value: 'heading', label: 'Lora', className: 'font-heading' },
  { value: 'body', label: 'Inter', className: 'font-body' },
];

export function MantraEditor() {
  const [text, setText] = useState('');
  const [font, setFont] = useState<Mantra['font']>('serif');
  const addMantra = useMantraStore((s) => s.addMantra);

  const canSave = text.trim().length > 0;

  const handleSave = () => {
    if (!canSave) return;
    addMantra({ text: text.trim(), font });
    setText('');
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && (e.metaKey || e.ctrlKey) && canSave) {
      handleSave();
    }
  };

  const activeFont = fontOptions.find((f) => f.value === font);

  return (
    <GlassPanel padding="lg" className="w-full max-w-lg mx-auto">
      <h2 className="font-heading text-lg text-[var(--color-text)] mb-4">
        Create Your Mantra
      </h2>

      {/* Textarea */}
      <textarea
        value={text}
        onChange={(e) => setText(e.target.value)}
        onKeyDown={handleKeyDown}
        placeholder="Write your personal mantra..."
        rows={3}
        className={`w-full bg-transparent border border-[var(--color-border)] rounded-lg
                   px-4 py-3 text-[var(--color-text)] placeholder:text-[var(--color-text-secondary)]/50
                   focus:outline-none focus:border-[var(--color-accent)]
                   transition-colors duration-300 resize-none
                   ${activeFont?.className ?? 'font-serif'}`}
      />

      {/* Font selector */}
      <div className="flex items-center gap-2 mt-4 mb-4">
        <span className="text-xs text-[var(--color-text-secondary)] mr-1">Font:</span>
        {fontOptions.map((opt) => (
          <button
            key={opt.value}
            onClick={() => setFont(opt.value)}
            className={`px-3 py-1.5 rounded-lg text-sm transition-all duration-300
                       ${opt.className}
                       ${
                         font === opt.value
                           ? 'bg-[var(--color-accent)]/15 text-[var(--color-accent)] ring-1 ring-[var(--color-accent)]'
                           : 'text-[var(--color-text-secondary)] hover:text-[var(--color-text)] hover:bg-[var(--color-surface)]'
                       }`}
          >
            {opt.label}
          </button>
        ))}
      </div>

      {/* Save button */}
      <button
        onClick={handleSave}
        disabled={!canSave}
        className="w-full py-2.5 rounded-lg text-sm font-medium
                   bg-[var(--color-accent)] text-[var(--color-bg)]
                   transition-all duration-300
                   hover:brightness-110 active:scale-[0.98]
                   disabled:opacity-30 disabled:cursor-not-allowed"
      >
        Save Mantra
      </button>
    </GlassPanel>
  );
}
