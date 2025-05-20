export function NoiseFilter() {
  return (
    <svg className="hidden" aria-hidden="true">
      <defs>
        <filter id="noiseFilter">
          <feTurbulence
            type="fractalNoise"
            baseFrequency="7.53"
            numOctaves="2"
            stitchTiles="stitch"
          />
        </filter>
      </defs>
    </svg>
  );
}

export function Noise() {
  return (
    <div
      aria-hidden="true"
      className="absolute inset-0 opacity-20 [filter:url(#noiseFilter)]"
    />
  );
}
