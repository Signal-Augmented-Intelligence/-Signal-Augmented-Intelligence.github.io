/** Small sampled-signal mark used beside the lab name when no logo file is set. */
const SAMPLES = [0, -3.8, -6, -4.6, -1, 3.4, 5.6, 4.2];

export function SignalMark({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 34 16" width="34" height="16" aria-hidden="true" focusable="false">
      <line x1="1" y1="8" x2="33" y2="8" stroke="currentColor" strokeWidth="1" opacity="0.35" />
      {SAMPLES.map((dy, i) => {
        const x = 3 + i * 4;
        return (
          <g key={x}>
            <line x1={x} y1="8" x2={x} y2={8 + dy} stroke="currentColor" strokeWidth="1" strokeLinecap="round" />
            <circle cx={x} cy={8 + dy} r="1.15" fill="currentColor" />
          </g>
        );
      })}
    </svg>
  );
}
