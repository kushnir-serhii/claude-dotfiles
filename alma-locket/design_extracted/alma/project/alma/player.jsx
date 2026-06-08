// ALMA — Player. Full Deck ("Now Sounding") + compacted Mini-Player pill.
const { useState: useStateP, useRef: useRefP, useEffect: useEffectP } = React;

// ── Draggable / tappable progress timeline ──
function Scrubber({ elapsed, total, onSeek }) {
  const barRef = useRefP(null);
  const [drag, setDrag] = useStateP(false);
  const pct = Math.max(0, Math.min(1, elapsed / total));

  const seekFromEvent = (clientX) => {
    const el = barRef.current; if (!el) return;
    const r = el.getBoundingClientRect();
    onSeek(Math.max(0, Math.min(1, (clientX - r.left) / r.width)) * total);
  };
  const down = (e) => { setDrag(true); seekFromEvent(e.clientX ?? e.touches?.[0]?.clientX); };
  useEffectP(() => {
    if (!drag) return;
    const move = (e) => seekFromEvent(e.clientX ?? e.touches?.[0]?.clientX);
    const up = () => setDrag(false);
    window.addEventListener('pointermove', move);
    window.addEventListener('pointerup', up);
    return () => { window.removeEventListener('pointermove', move); window.removeEventListener('pointerup', up); };
  }, [drag]);

  return (
    <div style={{ width: '100%' }}>
      <div ref={barRef} className="press" onPointerDown={down} style={{
        height: 22, display: 'flex', alignItems: 'center', cursor: 'pointer', touchAction: 'none',
      }}>
        <div style={{ position: 'relative', width: '100%', height: 4, borderRadius: 4, background: 'rgba(255,255,255,0.22)' }}>
          <div style={{ position: 'absolute', inset: 0, width: `${pct * 100}%`, background: '#fff', borderRadius: 4 }} />
          <div style={{
            position: 'absolute', top: '50%', left: `${pct * 100}%`,
            width: drag ? 16 : 12, height: drag ? 16 : 12, borderRadius: '50%', background: '#fff',
            transform: 'translate(-50%, -50%)', boxShadow: '0 2px 6px rgba(0,0,0,0.4)',
            transition: 'width 120ms, height 120ms',
          }} />
        </div>
      </div>
      <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 4, fontSize: 13, fontWeight: 500, color: 'rgba(255,255,255,0.65)', fontVariantNumeric: 'tabular-nums' }}>
        <span>{fmtTime(elapsed)}</span>
        <span>-{fmtTime(Math.max(0, total - elapsed))}</span>
      </div>
    </div>
  );
}

// ── Full Player Deck ──
function FullPlayer({ track, duration, elapsed, isPlaying, liked, muted, mode, motion = true,
  onTogglePlay, onCollapse, onSeek, onToggleLike, onToggleMute, onSaveRitual, savedFlash }) {
  const total = duration * 60;
  const remaining = Math.max(0, total - elapsed);
  const open = mode === 'full';

  // drag-to-dismiss
  const [dragY, setDragY] = useStateP(0);
  const startY = useRefP(null);
  const onDown = (e) => { startY.current = e.clientY ?? e.touches?.[0]?.clientY; };
  const onMove = (e) => {
    if (startY.current == null) return;
    const y = e.clientY ?? e.touches?.[0]?.clientY;
    setDragY(Math.max(0, y - startY.current));
  };
  const onUp = () => {
    if (dragY > 120) onCollapse();
    setDragY(0); startY.current = null;
  };

  const grad = ALMA_GRADIENTS[track?.grad] || ALMA_GRADIENTS.violet;

  return (
    <div style={{
      position: 'absolute', inset: 0, zIndex: 70,
      transform: open ? `translateY(${dragY}px)` : 'translateY(102%)',
      transition: startY.current != null ? 'none' : 'transform 480ms var(--ease-spring)',
      pointerEvents: open ? 'auto' : 'none',
      overflow: 'hidden', borderRadius: 48,
    }}>
      {/* full-bleed hero artwork */}
      <div style={{ position: 'absolute', inset: 0, background: grad, backgroundColor: '#16100C' }} />
      {/* soft bottom legibility gradient — keep hero image prominent */}
      <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to bottom, rgba(14,11,9,0) 35%, rgba(14,11,9,0.45) 70%, rgba(14,11,9,0.85) 100%)' }} />
      <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to top, rgba(14,11,9,0) 80%, rgba(14,11,9,0.40) 100%)' }} />

      {/* drag handle / collapse chevron — top center */}
      <div onPointerDown={onDown} onPointerMove={onMove} onPointerUp={onUp} style={{
        position: 'absolute', top: 0, left: 0, right: 0, zIndex: 5,
        paddingTop: 54, paddingBottom: 20, touchAction: 'none', cursor: 'grab',
        display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 8,
      }}>
        <button className="press" onClick={onCollapse} aria-label="Collapse player" style={{
          width: 52, height: 30, borderRadius: 15, display: 'flex', alignItems: 'center', justifyContent: 'center',
          background: 'rgba(255,255,255,0.12)', color: '#fff',
        }}>
          <IconChevDownSmall size={22} />
        </button>
        <span style={{ fontSize: 11, fontWeight: 600, letterSpacing: 2, color: 'rgba(255,255,255,0.6)', textTransform: 'uppercase' }}>Now Sounding</span>
      </div>

      {/* content column */}
      <div style={{
        position: 'absolute', inset: 0, display: 'flex', flexDirection: 'column',
        padding: '128px 30px 42px', color: '#fff',
      }}>
        {/* mandala + countdown */}
        <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', position: 'relative', minHeight: 0 }}>
          <div style={{ position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <Mandala active={open && motion} size={360} />
          </div>
          <div style={{ position: 'relative', textAlign: 'center' }}>
            <div style={{ fontSize: 72, fontWeight: 300, letterSpacing: 1, lineHeight: 1, fontVariantNumeric: 'tabular-nums' }}>
              {fmtTime(remaining)}
            </div>
            <div style={{ fontSize: 13, fontWeight: 500, letterSpacing: 1.5, color: 'rgba(255,255,255,0.6)', marginTop: 12, textTransform: 'uppercase' }}>
              {duration} min session
            </div>
          </div>
        </div>

        {/* title */}
        <div style={{ textAlign: 'center', marginBottom: 22 }}>
          <div style={{ fontSize: 27, fontWeight: 600, letterSpacing: -0.3 }}>{track?.title}</div>
          <div style={{ fontSize: 15, color: 'rgba(255,255,255,0.6)', marginTop: 4 }}>{track?.sub || track?.layers}</div>
        </div>

        {/* scrubber */}
        <div style={{ marginBottom: 22 }}>
          <Scrubber elapsed={elapsed} total={total} onSeek={onSeek} />
        </div>

        {/* controls */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 28, marginBottom: 26 }}>
          <CircleBtn onClick={onToggleLike} active={liked}><IconHeart size={22} filled={liked} /></CircleBtn>
          <button className="press" onClick={onTogglePlay} aria-label={isPlaying ? 'Pause' : 'Play'} style={{
            width: 78, height: 78, borderRadius: '50%', background: '#fff', color: '#16100C',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            boxShadow: '0 10px 30px rgba(0,0,0,0.35)',
          }}>
            {isPlaying ? <IconPause size={34} /> : <IconPlay size={32} style={{ marginLeft: 3 }} />}
          </button>
          <CircleBtn onClick={onToggleMute} active={muted}><IconMute size={22} /></CircleBtn>
        </div>

        {/* save as ritual */}
        <button className="press" onClick={onSaveRitual} style={{
          alignSelf: 'center', display: 'flex', alignItems: 'center', gap: 9,
          padding: '13px 24px', borderRadius: 30,
          background: savedFlash ? '#fff' : 'rgba(255,255,255,0.10)',
          border: '1px solid rgba(255,255,255,0.18)',
          color: savedFlash ? '#16100C' : '#fff',
          fontSize: 15, fontWeight: 600, transition: 'background 240ms var(--ease), color 240ms var(--ease)',
        }}>
          {savedFlash ? <IconCheck size={18} /> : <IconStar size={18} />}
          {savedFlash ? 'Saved to Rituals' : 'Save as Ritual'}
        </button>
      </div>
    </div>
  );
}

function CircleBtn({ children, onClick, active }) {
  return (
    <button className="press" onClick={onClick} style={{
      width: 56, height: 56, borderRadius: '50%',
      background: active ? 'rgba(255,255,255,0.28)' : 'rgba(255,255,255,0.12)',
      color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center',
      transition: 'background 200ms var(--ease)',
    }}>{children}</button>
  );
}

// ── Compacted Mini-Player pill ──
function MiniPlayer({ track, duration, elapsed, isPlaying, mode, onExpand, onTogglePlay }) {
  const total = duration * 60;
  const pct = Math.max(0, Math.min(1, elapsed / total));
  const show = mode === 'mini';
  return (
    <div style={{
      position: 'absolute', left: 14, right: 14, bottom: 96, zIndex: 45,
      transform: show ? 'translateY(0)' : 'translateY(140%)',
      opacity: show ? 1 : 0,
      transition: 'transform 440ms var(--ease-spring), opacity 240ms var(--ease)',
      pointerEvents: show ? 'auto' : 'none',
    }}>
      <div className="press" onClick={onExpand} style={{
        position: 'relative', display: 'flex', alignItems: 'center', gap: 12,
        padding: 8, paddingRight: 18, borderRadius: 20, overflow: 'hidden',
        background: 'var(--surface-solid)', border: '1px solid var(--hairline-strong)',
        boxShadow: 'var(--shadow)', cursor: 'pointer',
      }}>
        <button className="press" onClick={(e) => { e.stopPropagation(); onTogglePlay(); }} aria-label={isPlaying ? 'Pause' : 'Play'} style={{
          width: 44, height: 44, borderRadius: 14, flexShrink: 0,
          background: 'var(--text)', color: 'var(--bg-0)',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
        }}>
          {isPlaying ? <IconPause size={20} /> : <IconPlay size={18} style={{ marginLeft: 2 }} />}
        </button>
        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={{ fontSize: 15, fontWeight: 600, color: 'var(--text)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{track?.title}</div>
          <div style={{ fontSize: 12.5, color: 'var(--text-2)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{fmtTime(Math.max(0, total - elapsed))} left · {track?.sub || track?.layers}</div>
        </div>
        <Orb grad={track?.grad} size={32} radius={10} />
        {/* thin progress along bottom edge — grayscale */}
        <div style={{ position: 'absolute', left: 0, bottom: 0, height: 2.5, width: `${pct * 100}%`, background: 'var(--text)', transition: 'width 400ms linear' }} />
      </div>
    </div>
  );
}

Object.assign(window, { FullPlayer, MiniPlayer, Scrubber });
