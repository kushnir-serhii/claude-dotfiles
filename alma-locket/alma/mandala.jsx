// ALMA — Morphing mandala for the full-screen player.
// 4 mandala variations crossfade in a continuous loop over the track's hero image.
// Rendered in white with transparency, slowly rotates, gently breathes.

function Mandala({ active = true, size = 380 }) {
  const C = 200;       // SVG center
  const W = '#FFFFFF'; // white stroke

  // helpers
  const ring = (n, r, render) =>
    Array.from({ length: n }, (_, i) => {
      const a = (i / n) * Math.PI * 2 - Math.PI / 2;
      const x = C + Math.cos(a) * r;
      const y = C + Math.sin(a) * r;
      return <g key={i}>{render(x, y, ((a + Math.PI / 2) * 180) / Math.PI)}</g>;
    });
  const starPts = (r1, r2, n) =>
    Array.from({ length: n * 2 }, (_, i) => {
      const r = i % 2 === 0 ? r1 : r2;
      const a = (i / (n * 2)) * Math.PI * 2 - Math.PI / 2;
      return `${C + Math.cos(a) * r},${C + Math.sin(a) * r}`;
    }).join(' ');
  const polyPts = (r, n, offset = 0) =>
    Array.from({ length: n }, (_, i) => {
      const a = (i / n) * Math.PI * 2 - Math.PI / 2 + offset;
      return `${C + Math.cos(a) * r},${C + Math.sin(a) * r}`;
    }).join(' ');

  const s = (sw = 1.1) => ({ stroke: W, fill: 'none', strokeWidth: sw, strokeLinecap: 'round', strokeLinejoin: 'round' });

  // ── Shape A — Flower-of-Life lotus, 12 petal circles + outer ring
  const ShapeA = (
    <g>
      <circle cx={C} cy={C} r="172" {...s(0.8)} />
      <circle cx={C} cy={C} r="156" {...s(1.0)} />
      {ring(12, 100, (x, y) => <circle cx={x} cy={y} r="56" {...s(0.9)} />)}
      <circle cx={C} cy={C} r="56" {...s(1.0)} />
      <circle cx={C} cy={C} r="22" {...s(1.0)} />
    </g>
  );

  // ── Shape B — Hexagram inside circle + 6 petal rounds
  const ShapeB = (
    <g>
      <circle cx={C} cy={C} r="170" {...s(0.8)} />
      <circle cx={C} cy={C} r="150" {...s(1.0)} />
      <polygon points={polyPts(140, 3, 0)} {...s(1.0)} />
      <polygon points={polyPts(140, 3, Math.PI)} {...s(1.0)} />
      {ring(6, 95, (x, y) => <circle cx={x} cy={y} r="42" {...s(0.9)} />)}
      <circle cx={C} cy={C} r="42" {...s(1.0)} />
      <circle cx={C} cy={C} r="18" {...s(1.0)} />
    </g>
  );

  // ── Shape C — 8-pointed star, square frame
  const ShapeC = (
    <g>
      <circle cx={C} cy={C} r="172" {...s(0.8)} />
      <polygon points={polyPts(160, 4, 0)} {...s(1.0)} />
      <polygon points={polyPts(160, 4, Math.PI / 4)} {...s(1.0)} />
      <polygon points={starPts(140, 90, 8)} {...s(1.0)} />
      <polygon points={starPts(100, 60, 8)} {...s(1.0)} transform={`rotate(22.5 ${C} ${C})`} />
      <circle cx={C} cy={C} r="34" {...s(1.0)} />
      <circle cx={C} cy={C} r="14" {...s(1.0)} />
    </g>
  );

  // ── Shape D — 12-point sunburst star with dots
  const ShapeD = (
    <g>
      <circle cx={C} cy={C} r="172" {...s(0.8)} />
      <polygon points={starPts(170, 110, 12)} {...s(1.0)} />
      <polygon points={starPts(120, 70, 12)} {...s(0.9)} transform={`rotate(15 ${C} ${C})`} />
      {ring(24, 145, (x, y) => <circle cx={x} cy={y} r="1.8" fill={W} />)}
      <circle cx={C} cy={C} r="44" {...s(1.0)} />
      {ring(12, 44, (x, y) => <circle cx={x} cy={y} r="1.6" fill={W} />)}
      <circle cx={C} cy={C} r="16" {...s(1.0)} />
    </g>
  );

  // ── Shape E — Many-petal flower (24 petals)
  const ShapeE = (
    <g>
      <circle cx={C} cy={C} r="170" {...s(0.8)} />
      {ring(24, 120, (x, y, deg) => (
        <ellipse cx={x} cy={y} rx="9" ry="36"
          transform={`rotate(${deg} ${x} ${y})`} {...s(0.9)} />
      ))}
      <circle cx={C} cy={C} r="62" {...s(1.0)} />
      {ring(12, 62, (x, y) => <circle cx={x} cy={y} r="2.2" fill={W} />)}
      <circle cx={C} cy={C} r="22" {...s(1.0)} />
    </g>
  );

  // 5 shapes × 5s slot = 25s loop. Same keyframe (almaMorph), staggered by +5s each.
  // Visible windows (of 25s wall-time): A 0-5, B 5-10, C 10-15, D 15-20, E 20-25.
  const slotDelay = (idx) => `${idx * 5}s`;

  const shapeStyle = (idx) => ({
    transformOrigin: '200px 200px',
    transformBox: 'fill-box',
    animation: active ? `almaMorph 25s ease-in-out infinite` : 'none',
    animationDelay: slotDelay(idx),
    opacity: 0, // initial; overridden by animation
  });

  return (
    <div style={{
      width: size, height: size, opacity: 0.55,
      animation: active ? 'breathe 9s ease-in-out infinite' : 'none',
      willChange: 'transform',
      mixBlendMode: 'screen',
    }}>
      <svg viewBox="0 0 400 400" width="100%" height="100%" style={{ overflow: 'visible' }}>
        {/* Slow global rotation gives morph a sense of constant motion */}
        <g style={{
          transformOrigin: '200px 200px',
          animation: active ? 'spinCW 240s linear infinite' : 'none',
        }}>
          <g style={shapeStyle(0)}>{ShapeA}</g>
          <g style={shapeStyle(1)}>{ShapeB}</g>
          <g style={shapeStyle(2)}>{ShapeC}</g>
          <g style={shapeStyle(3)}>{ShapeD}</g>
          <g style={shapeStyle(4)}>{ShapeE}</g>
        </g>
      </svg>
    </div>
  );
}

window.Mandala = Mandala;
