// Wraps a scrollable region with blurred, gradient-masked edges (v8 §3.3) — the overlays are pinned
// to this outer wrapper, not the scrolling element itself, so they stay fixed while content scrolls under them.
export function ScrollFade({
  children,
  className = "",
  contentClassName = "",
}: {
  children: React.ReactNode;
  className?: string;
  contentClassName?: string;
}) {
  return (
    <div className={`relative ${className}`}>
      <div className="scroll-fade-top pointer-events-none absolute inset-x-0 top-0 z-10 h-8 backdrop-blur-sm" />
      <div className={`overflow-y-auto ${contentClassName}`}>{children}</div>
      <div className="scroll-fade-bottom pointer-events-none absolute inset-x-0 bottom-0 z-10 h-8 backdrop-blur-sm" />
    </div>
  );
}
