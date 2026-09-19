const RADIUS = 36;
const CIRCUMFERENCE = 2 * Math.PI * RADIUS;

export function FleetCard({
  normalCount,
  total,
  lowCount,
}: {
  normalCount: number;
  total: number;
  lowCount: number;
}) {
  const pct = total === 0 ? 0 : normalCount / total;
  const dash = `${(CIRCUMFERENCE * pct).toFixed(1)} ${CIRCUMFERENCE.toFixed(1)}`;

  return (
    <div className="mb-5 flex items-center gap-4 rounded-card bg-primary p-[22px] text-primary-foreground shadow-lg">
      <div className="min-w-0 flex-1">
        <div className="mb-2.5 text-xs font-medium tracking-wide text-primary-foreground/70 uppercase">
          Fleet status
        </div>
        <div className="mb-3 flex items-baseline gap-2">
          <span className="font-heading text-[38px] leading-none font-semibold">{normalCount}</span>
          <span className="text-sm text-primary-foreground/75">of {total} normal</span>
        </div>
        <div
          className="inline-flex h-6 items-center rounded-full px-2.5 text-xs font-medium"
          style={{
            background: lowCount ? "var(--primary-foreground)" : "rgba(255,255,255,.18)",
            color: lowCount ? "var(--destructive-ink)" : "inherit",
          }}
        >
          {lowCount ? `${lowCount} awaiting refill` : "Every machine reporting normal"}
        </div>
      </div>
      <div className="relative size-[86px] flex-none">
        <svg width="86" height="86" viewBox="0 0 86 86" className="block -rotate-90">
          <circle cx="43" cy="43" r={RADIUS} fill="none" stroke="rgba(255,255,255,.18)" strokeWidth="9" />
          <circle
            cx="43"
            cy="43"
            r={RADIUS}
            fill="none"
            stroke="var(--primary-foreground)"
            strokeWidth="9"
            strokeLinecap="round"
            strokeDasharray={dash}
          />
        </svg>
        <div className="font-heading absolute inset-0 flex items-center justify-center text-lg font-semibold">
          {Math.round(pct * 100)}%
        </div>
      </div>
    </div>
  );
}
