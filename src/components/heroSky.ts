/**
 * Falling-formula positions for the home hero's night phase, computed once at build time.
 * Positions are percentages of the field beside the lab name so the layout scales with the page width.
 */
const FIELD_W = 850;
const FIELD_H = 412;

/** Night phase length before the hero fades to the photo hero (ms). */
export const NIGHT_MS = 6000;

const FALLING = [
  'X(ω) = ∫ x(t) e^{−jωt} dt', 'softmax(QKᵀ/√d) V', 'y[n] = Σ h[k] x[n−k]', 'P(wₜ | w₁:ₜ₋₁)', 'SNR = 10 log₁₀ Pₛ/Pₙ',
  'H(X) = −Σ p log p', 'G = ξ / (1 + ξ)', '∂L / ∂θ', 'σ(Wx + b)',
];
/** Launch order alternates distant cells of the 3 x 3 start grid. */
const ORDER = [0, 8, 4, 2, 6, 1, 7, 3, 5];
const CYCLE_S = 12;

let seed = 7;
function rand() {
  seed = (seed * 16807) % 2147483647;
  return (seed - 1) / 2147483646;
}
const pct = (px: number, total: number) => `${((px / total) * 100).toFixed(2)}%`;

export type SkyItem = { text: string; left: string; top: string; size: number; duration: number; delay: number };

/** Falling formulas: one start point per cell of a jittered 3 x 3 grid, staggered over one cycle. */
export const METEORS: SkyItem[] = FALLING.map((text, i) => {
  const col = i % 3;
  const row = Math.floor(i / 3);
  return {
    text,
    left: pct(250 + col * 130 + rand() * 60, FIELD_W),
    top: pct(6 + row * 64 + rand() * 30, FIELD_H),
    size: 15 + rand() * 3,
    duration: CYCLE_S,
    delay: -(ORDER.indexOf(i) / FALLING.length) * CYCLE_S - rand() * 0.6,
  };
});

/** Photo hero slides (public/images/home/), shown after the night phase. */
export const SLIDES = ['/images/home/lab-1.jpg', '/images/home/lab-2.jpg', '/images/home/lab-3.jpg'];
export const SLIDE_MS = 6000;
