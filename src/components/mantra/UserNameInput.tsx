'use client';

import { useState } from 'react';
import { usePreferencesStore } from '@/stores/usePreferencesStore';

interface UserNameInputProps {
  compact?: boolean;
}

export function UserNameInput({ compact = false }: UserNameInputProps) {
  const userName = usePreferencesStore((s) => s.userName);
  const setUserName = usePreferencesStore((s) => s.setUserName);
  const [editing, setEditing] = useState(false);
  const [draft, setDraft] = useState(userName);

  const handleSave = () => {
    setUserName(draft.trim());
    setEditing(false);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') handleSave();
    if (e.key === 'Escape') {
      setDraft(userName);
      setEditing(false);
    }
  };

  // Compact mode: just an edit button that opens inline input
  if (compact && !editing) {
    return (
      <button
        onClick={() => {
          setDraft(userName);
          setEditing(true);
        }}
        className="text-xs text-[var(--color-text-secondary)] hover:text-[var(--color-accent)]
                   transition-colors duration-200 underline underline-offset-2 decoration-dotted"
      >
        edit
      </button>
    );
  }

  if (compact && editing) {
    return (
      <div className="flex items-center gap-2">
        <input
          type="text"
          value={draft}
          onChange={(e) => setDraft(e.target.value)}
          onKeyDown={handleKeyDown}
          onBlur={handleSave}
          autoFocus
          className="w-28 bg-transparent border-b border-[var(--color-border)]
                     text-sm text-[var(--color-text)] px-1 py-0.5
                     focus:outline-none focus:border-[var(--color-accent)]
                     transition-colors duration-200"
          placeholder="Your name"
        />
      </div>
    );
  }

  // Full mode: shown when no name is set yet
  return (
    <div className="flex items-center justify-center gap-2">
      <input
        type="text"
        value={draft}
        onChange={(e) => setDraft(e.target.value)}
        onKeyDown={handleKeyDown}
        className="w-48 bg-transparent border-b border-[var(--color-border)]
                   text-center text-sm text-[var(--color-text)] px-2 py-1.5
                   focus:outline-none focus:border-[var(--color-accent)]
                   transition-colors duration-200 placeholder:text-[var(--color-text-secondary)]/50"
        placeholder="Enter your name"
      />
      {draft.trim() && (
        <button
          onClick={handleSave}
          className="text-xs px-3 py-1.5 rounded-lg
                     border border-[var(--color-accent)]/50 text-[var(--color-accent)]
                     hover:bg-[var(--color-accent)]/10
                     transition-all duration-200"
        >
          Save
        </button>
      )}
    </div>
  );
}
