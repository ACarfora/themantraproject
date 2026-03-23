'use client';

import { useState } from 'react';
import { useMantraStore } from '@/stores/useMantraStore';
import { GlassPanel } from '@/components/ui/GlassPanel';

export function MantraEditor() {
  const [text, setText] = useState('');
  const addMantra = useMantraStore((s) => s.addMantra);

  const canSave = text.trim().length > 0;

  const handleSave = () => {
    if (!canSave) return;
    addMantra({ text: text.trim(), font: 'heading' });
    setText('');
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && (e.metaKey || e.ctrlKey) && canSave) {
      handleSave();
    }
  };

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
        className="w-full bg-transparent border-0 rounded-lg
                   px-4 py-3 text-[var(--color-text)] placeholder:text-[var(--color-text-secondary)]/50
                   focus:outline-none
                   transition-colors duration-300 resize-none
                   font-heading"
      />

      {/* Save button */}
      <button
        onClick={handleSave}
        disabled={!canSave}
        className="w-full mt-4 py-2.5 rounded-lg text-sm font-medium
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
