'use client';

import { useAudio } from '@/hooks/useAudio';
import { usePreferencesStore } from '@/stores/usePreferencesStore';
import { GlassPanel } from '@/components/ui/GlassPanel';

type SoundId = 'rain' | 'ocean' | 'forest' | 'bowls';

const soundscapes: { id: SoundId; name: string }[] = [
  { id: 'rain', name: 'Rain' },
  { id: 'ocean', name: 'Ocean' },
  { id: 'forest', name: 'Forest' },
  { id: 'bowls', name: 'Singing Bowls' },
];

function SoundIcon({ id, active }: { id: SoundId; active: boolean }) {
  const stroke = active ? 'var(--color-accent)' : 'var(--color-text-secondary)';

  if (id === 'rain') {
    return (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke={stroke} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <path d="M4 14.899A7 7 0 1 1 15.71 8h1.79a4.5 4.5 0 0 1 2.5 8.242" />
        <path d="M8 19v1" />
        <path d="M8 14v1" />
        <path d="M16 19v1" />
        <path d="M16 14v1" />
        <path d="M12 21v1" />
        <path d="M12 16v1" />
      </svg>
    );
  }

  if (id === 'ocean') {
    return (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke={stroke} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <path d="M2 6c.6.5 1.2 1 2.5 1C7 7 7 5 9.5 5c2.6 0 2.4 2 5 2 2.5 0 2.5-2 5-2 1.3 0 1.9.5 2.5 1" />
        <path d="M2 12c.6.5 1.2 1 2.5 1 2.5 0 2.5-2 5-2 2.6 0 2.4 2 5 2 2.5 0 2.5-2 5-2 1.3 0 1.9.5 2.5 1" />
        <path d="M2 18c.6.5 1.2 1 2.5 1 2.5 0 2.5-2 5-2 2.6 0 2.4 2 5 2 2.5 0 2.5-2 5-2 1.3 0 1.9.5 2.5 1" />
      </svg>
    );
  }

  if (id === 'forest') {
    return (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke={stroke} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <path d="M12 3L5 14h4l-2 7h10l-2-7h4L12 3z" />
        <path d="M12 22v-3" />
      </svg>
    );
  }

  // bowls
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke={stroke} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M5.5 16a6.5 6.5 0 0 1 13 0" />
      <ellipse cx="12" cy="16" rx="8" ry="3" />
      <path d="M12 8v-3" />
      <path d="M10 6c0-.6.4-1 1-1h2c.6 0 1 .4 1 1v1h-4V6z" />
      <path d="M9 3.5c1-.3 2-.5 3-.5s2 .2 3 .5" />
    </svg>
  );
}

export function SoundscapePlayer() {
  const activeSound = usePreferencesStore((s) => s.activeSound);
  const setActiveSound = usePreferencesStore((s) => s.setActiveSound);
  const storedVolume = usePreferencesStore((s) => s.volume);
  const setStoredVolume = usePreferencesStore((s) => s.setVolume);

  const soundType = (activeSound ?? '') as 'rain' | 'ocean' | 'forest' | 'bowls' | '';
  const audio = useAudio(soundType);

  const handleSelect = (id: SoundId) => {
    if (activeSound === id) {
      audio.pause();
      setActiveSound(null);
    } else {
      audio.pause();
      setActiveSound(id);
    }
  };

  const handlePlayPause = () => {
    if (!activeSound) return;
    audio.toggle();
  };

  const handleVolumeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const v = parseFloat(e.target.value);
    audio.setVolume(v);
    setStoredVolume(v);
  };

  return (
    <GlassPanel padding="sm" className="w-full max-w-xs">
      {/* Sound selection */}
      <div className="flex items-center justify-center gap-2 mb-3">
        {soundscapes.map((s) => (
          <button
            key={s.id}
            onClick={() => handleSelect(s.id)}
            aria-label={s.name}
            title={s.name}
            className={`w-10 h-10 flex items-center justify-center rounded-lg
                       transition-all duration-300
                       ${
                         activeSound === s.id
                           ? 'bg-[var(--color-accent)]/15 ring-1 ring-[var(--color-accent)]/50 scale-110'
                           : 'hover:bg-[var(--color-surface-alt)] hover:scale-105'
                       }`}
          >
            <SoundIcon id={s.id} active={activeSound === s.id} />
          </button>
        ))}
      </div>

      {/* Controls */}
      <div className="flex items-center gap-3">
        {/* Play/pause */}
        <button
          onClick={handlePlayPause}
          disabled={!activeSound}
          aria-label={audio.isPlaying ? 'Pause' : 'Play'}
          className="w-8 h-8 flex items-center justify-center rounded-full
                     text-[var(--color-accent)] transition-opacity duration-300
                     disabled:opacity-30 hover:bg-[var(--color-accent)]/10"
        >
          {audio.isPlaying ? (
            <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
              <rect x="6" y="4" width="4" height="16" rx="1" />
              <rect x="14" y="4" width="4" height="16" rx="1" />
            </svg>
          ) : (
            <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
              <polygon points="6,3 20,12 6,21" />
            </svg>
          )}
        </button>

        {/* Volume slider */}
        <input
          type="range"
          min="0"
          max="1"
          step="0.01"
          value={storedVolume}
          onChange={handleVolumeChange}
          aria-label="Volume"
          className="flex-1 h-1 appearance-none rounded-full
                     bg-[var(--color-border)] accent-[var(--color-accent)]"
        />

        {/* Volume icon — click to mute/unmute */}
        <button
          onClick={() => {
            if (storedVolume > 0) {
              audio.setVolume(0);
              setStoredVolume(0);
            } else {
              audio.setVolume(0.5);
              setStoredVolume(0.5);
            }
          }}
          aria-label={storedVolume > 0 ? 'Mute' : 'Unmute'}
          className="shrink-0 w-6 h-6 flex items-center justify-center
                     text-[var(--color-text-secondary)] hover:text-[var(--color-accent)]
                     transition-colors duration-200"
        >
          <svg
            width="16"
            height="16"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5" />
            {storedVolume > 0 ? (
              <>
                {storedVolume > 0.01 && (
                  <path d="M15.54 8.46a5 5 0 0 1 0 7.07" />
                )}
                {storedVolume > 0.5 && (
                  <path d="M19.07 4.93a10 10 0 0 1 0 14.14" />
                )}
              </>
            ) : (
              <>
                <line x1="16" y1="9" x2="22" y2="15" />
                <line x1="22" y1="9" x2="16" y2="15" />
              </>
            )}
          </svg>
        </button>
      </div>
    </GlassPanel>
  );
}
