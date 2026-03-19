interface GlassPanelProps {
  children: React.ReactNode;
  className?: string;
  padding?: 'none' | 'sm' | 'md' | 'lg';
}

const paddingMap: Record<NonNullable<GlassPanelProps['padding']>, string> = {
  none: '',
  sm: 'p-3',
  md: 'p-5',
  lg: 'p-8',
};

export function GlassPanel({
  children,
  className = '',
  padding = 'md',
}: GlassPanelProps) {
  return (
    <div
      className={`
        rounded-xl
        bg-[var(--color-surface)]/50
        backdrop-blur-lg
        border border-[var(--color-border)]
        ${paddingMap[padding]}
        ${className}
      `}
    >
      {children}
    </div>
  );
}
