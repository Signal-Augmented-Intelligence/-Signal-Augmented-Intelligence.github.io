/**
 * The home page's one visual: a sampled signal drawn as a stem plot across the page width.
 * Values are computed at build time from two windowed sinusoids, so the drawing is static.
 */
const COUNT = 96;
const WIDTH = 1160;
const HEIGHT = 150;
const MID = HEIGHT / 2;
const STEP = WIDTH / COUNT;

const samples = Array.from({ length: COUNT }, (_, k) => {
  const a = 0.95 * Math.sin((2 * Math.PI * k) / 17) * Math.exp(-(((k - 30) / 20) ** 2));
  const b = 0.55 * Math.sin((2 * Math.PI * k) / 6.5 + 1) * Math.exp(-(((k - 70) / 13) ** 2));
  return (a + b) * (MID - 10);
});

export function SignalPlot({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox={`0 0 ${WIDTH} ${HEIGHT}`} width="100%" role="presentation" aria-hidden="true" focusable="false">
      <line x1="0" y1={MID} x2={WIDTH} y2={MID} stroke="var(--rule)" strokeWidth="1" />
      {samples.map((_, k) =>
        k % 8 === 0 ? <line key={`t${k}`} x1={STEP / 2 + k * STEP} y1={MID} x2={STEP / 2 + k * STEP} y2={MID + 6} stroke="var(--muted)" strokeWidth="1" opacity="0.6" /> : null,
      )}
      {samples.map((v, k) => {
        const x = STEP / 2 + k * STEP;
        const y = MID - v;
        const quiet = Math.abs(v) < 3;
        return (
          <g key={k}>
            {!quiet && <line x1={x} y1={MID} x2={x} y2={y} stroke="var(--muted)" strokeWidth="1" opacity="0.55" />}
            <circle cx={x} cy={y} r={quiet ? 1.6 : 2.6} fill={quiet ? 'var(--muted)' : 'var(--accent)'} opacity={quiet ? 0.5 : 1} />
          </g>
        );
      })}
    </svg>
  );
}
