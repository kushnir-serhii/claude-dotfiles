// ALMA — Player. Full Deck ("Now Sounding") + compacted Mini-Player pill.
const { useState: useStateP, useRef: useRefP, useEffect: useEffectP } = React;

// ── Morphing mandala — crossfades between 4 SVG shapes in a loop ──
function PlayerMandala({ size = 160 }) {
  const SHAPES = [
    // mandala 1 — double octagon
    { vb: '0 0 310 310', paths: [
      'M298.681 133.403L271.7 106.422V68.251C271.7 51.5213 258.14 37.9609 241.41 37.9609H203.239L176.258 10.9802C164.436 -0.855414 145.253 -0.855414 133.417 10.9802L106.436 37.9609H68.2651C51.5354 37.9609 37.9749 51.5213 37.9749 68.251V106.422L10.9802 133.403C-0.855384 145.239 -0.855384 164.408 10.9802 176.244L37.9749 203.225V241.382C37.9749 258.111 51.5354 271.672 68.2651 271.672H106.422L133.403 298.653C145.239 310.488 164.408 310.488 176.244 298.653L203.225 271.672H241.396C258.126 271.672 271.686 258.111 271.686 241.382V203.225L298.667 176.244C310.502 164.408 310.502 145.239 298.681 133.403Z',
      'M271.869 203.295C271.869 203.295 266.75 180.928 254.129 154.816C266.75 128.705 271.869 106.338 271.869 106.338C271.869 106.338 252.432 94.1519 225.045 84.6021C215.509 57.2147 203.309 37.7785 203.309 37.7785C203.309 37.7785 180.942 42.897 154.831 55.5179C128.72 42.897 106.353 37.7785 106.353 37.7785C106.353 37.7785 94.1663 57.2147 84.6165 84.6021C57.2292 94.1379 37.793 106.338 37.793 106.338C37.793 106.338 42.9114 128.705 55.5323 154.816C42.9114 180.928 37.793 203.295 37.793 203.295C37.793 203.295 57.2292 215.481 84.6165 225.031C94.1523 252.418 106.353 271.854 106.353 271.854C106.353 271.854 128.72 266.736 154.831 254.115C180.942 266.736 203.309 271.854 203.309 271.854C203.309 271.854 215.495 252.418 225.045 225.031C252.432 215.481 271.869 203.295 271.869 203.295Z',
    ]},
    // mandala 3 — star-blob + rotated square
    { vb: '0 0 290 290', paths: [
      'M287.42 203.912C287.42 203.912 281.18 176.679 265.811 144.888C281.18 113.084 287.42 85.8646 287.42 85.8646C287.42 85.8646 263.749 71.0141 230.402 59.4028C218.777 26.0556 203.94 2.3844 203.94 2.3844C203.94 2.3844 176.707 8.62474 144.902 23.9942C113.098 8.62474 85.8646 2.3844 85.8646 2.3844C85.8646 2.3844 71.014 26.0556 59.4027 59.4028C26.0555 71.0281 2.38428 85.8787 2.38428 85.8787C2.38428 85.8787 8.62466 113.112 23.9941 144.902C8.62466 176.693 2.38428 203.94 2.38428 203.94C2.38428 203.94 26.0555 218.791 59.4027 230.402C71.014 263.749 85.8646 287.42 85.8646 287.42C85.8646 287.42 113.098 281.18 144.902 265.811C176.707 281.18 203.94 287.42 203.94 287.42C203.94 287.42 218.777 263.749 230.402 230.402C263.749 218.763 287.42 203.912 287.42 203.912Z',
      'M254.424 254.396C254.424 254.396 261.267 198.85 244.145 144.874C261.267 90.899 254.424 35.353 254.424 35.353C254.424 35.353 198.878 28.5097 144.902 45.632C90.9268 28.5097 35.3808 35.353 35.3808 35.353C35.3808 35.353 28.5375 90.899 45.6598 144.874C28.5375 198.85 35.3808 254.396 35.3808 254.396C35.3808 254.396 90.9268 261.239 144.902 244.117C198.878 261.239 254.424 254.396 254.424 254.396Z',
    ]},
    // mandala 4 — rounded square + 8-blade star + cardinal eyes
    { vb: '0 0 286 286', paths: [
      'M250.616 222.724V187.54L275.493 162.662C286.403 151.752 286.403 134.069 275.493 123.173L250.616 98.2958V63.0975C250.616 47.6719 238.107 35.1772 222.696 35.1632H187.512L162.634 10.286C151.724 -0.624063 134.041 -0.624063 123.145 10.286L98.2678 35.1632H63.0835C47.658 35.1632 35.1633 47.6579 35.1633 63.0834V98.2677L10.2861 123.145C-0.624002 134.055 -0.624002 151.738 10.2861 162.634L35.1633 187.512V222.696C35.1633 238.121 47.658 250.63 63.0835 250.63H98.2678L123.145 275.507C134.055 286.417 151.738 286.417 162.634 275.507L187.512 250.63H222.696C238.121 250.644 250.616 238.149 250.616 222.724Z',
      'M142.875 254.458C190.807 271.637 235.527 262.9 276.741 276.783C262.844 235.569 271.581 190.849 254.416 142.918C271.595 94.9863 262.858 50.2802 276.741 9.05194C235.513 22.9349 190.807 14.2125 142.875 31.3769C94.93 14.1985 50.224 22.9349 9.00977 9.05194C22.9068 50.2802 14.1563 94.9863 31.3347 142.918C14.1563 190.849 22.8928 235.555 9.00977 276.783C50.238 262.886 94.944 271.623 142.875 254.458Z',
    ]},
    // mandala 5 — diamond + inner rotated square + corner petals
    { vb: '0 0 305 305', paths: [
      'M302.205 152.436C302.205 152.436 268.899 109.778 220.295 84.5781C195.095 35.9596 152.437 2.66846 152.437 2.66846C152.437 2.66846 109.778 35.9736 84.5781 84.5781C35.9736 109.778 2.66846 152.436 2.66846 152.436C2.66846 152.436 35.9736 195.095 84.5781 220.295C109.778 268.913 152.437 302.204 152.437 302.204C152.437 302.204 195.095 268.899 220.295 220.295C268.899 195.095 302.205 152.436 302.205 152.436Z',
      'M258.34 258.326C258.34 258.326 264.959 204.617 248.398 152.422C264.959 100.228 258.34 46.519 258.34 46.519C258.34 46.519 204.631 39.9001 152.437 56.4615C100.242 39.9001 46.5333 46.519 46.5333 46.519C46.5333 46.519 39.9143 100.228 56.4758 152.422C39.9143 204.617 46.5333 258.326 46.5333 258.326C46.5333 258.326 100.242 264.945 152.437 248.383C204.631 264.945 258.34 258.326 258.34 258.326Z',
    ]},
  ];

  const CYCLE = 20; // full loop duration in seconds
  const PER = CYCLE / SHAPES.length; // seconds each shape is "on deck"

  return (
    <div style={{ position: 'relative', width: size, height: size, flexShrink: 0 }}>
      {SHAPES.map((shape, i) => (
        <svg
          key={i}
          viewBox={shape.vb}
          width={size}
          height={size}
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          style={{
            position: 'absolute',
            inset: 0,
            opacity: 0,
            animation: `almaMorph ${CYCLE}s ${i * PER}s ease-in-out infinite`,
          }}
        >
          {shape.paths.map((d, j) => (
            <path key={j} d={d} stroke="rgba(255,255,255,0.65)" strokeWidth="4.20697" strokeMiterlimit="10" />
          ))}
        </svg>
      ))}
    </div>
  );
}

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
function FullPlayer({ track, duration, elapsed, isPlaying, muted, mode, motion = true,
  onTogglePlay, onCollapse, onSeek, onCustomize, onToggleMute, onSaveRitual, savedFlash, canSaveRitual }) {
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
      {/* frosted glass overlay */}
      <div style={{ position: 'absolute', inset: 0, background: 'rgba(128,128,128,0.08)', backdropFilter: 'blur(10px)', WebkitBackdropFilter: 'blur(10px)' }} />
      {/* soft bottom legibility gradient — keep hero image prominent */}
      <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to bottom, rgba(14,11,9,0) 35%, rgba(14,11,9,0.45) 70%, rgba(14,11,9,0.85) 100%)' }} />
      <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to top, rgba(14,11,9,0) 80%, rgba(14,11,9,0.40) 100%)' }} />

      {/* drag handle / collapse chevron — top center */}
      <div onPointerDown={onDown} onPointerMove={onMove} onPointerUp={onUp} style={{
        position: 'absolute', top: 0, left: 0, right: 0, zIndex: 5,
        paddingTop: 54, paddingBottom: 20, touchAction: 'none', cursor: 'grab',
        display: 'flex', flexDirection: 'column', alignItems: 'center',
      }}>
        <button className="press" onClick={onCollapse} aria-label="Collapse player" style={{
          width: 52, height: 30, borderRadius: 15, display: 'flex', alignItems: 'center', justifyContent: 'center',
          background: 'rgba(255,255,255,0.12)', color: '#fff',
        }}>
          <IconChevDownSmall size={22} />
        </button>
      </div>

      {/* content column */}
      <div style={{
        position: 'absolute', inset: 0, display: 'flex', flexDirection: 'column',
        padding: '128px 30px 42px', color: '#fff',
      }}>
        {/* mandala + countdown */}
        <div style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', minHeight: 0, gap: 28 }}>
          <PlayerMandala />
          <div style={{ textAlign: 'center' }}>
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
          <CircleBtn onClick={onCustomize}><IconSliders size={22} /></CircleBtn>
          <button className="press" onClick={onTogglePlay} aria-label={isPlaying ? 'Pause' : 'Play'} style={{
            width: 78, height: 78, borderRadius: '50%', background: '#fff', color: '#16100C',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            boxShadow: '0 10px 30px rgba(0,0,0,0.35)',
          }}>
            {isPlaying ? <IconPause size={34} /> : <IconPlay size={32} style={{ marginLeft: 3 }} />}
          </button>
          <CircleBtn onClick={onToggleMute} active={muted}><IconMute size={22} /></CircleBtn>
        </div>

        {/* save as ritual — only shown when playing a mixer session */}
        {canSaveRitual && (
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
        )}
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
function MiniPlayer({ track, duration, elapsed, isPlaying, mode, onExpand, onTogglePlay, onClose }) {
  const total = duration * 60;
  const pct = Math.max(0, Math.min(1, elapsed / total));
  const show = mode === 'mini';

  // swipe-left-to-dismiss
  const swipeRef = useRefP(null);
  const [swipeDx, setSwipeDx] = useStateP(0);
  const onPointerDown = (e) => { swipeRef.current = { startX: e.clientX, startY: e.clientY, moved: false }; };
  const onPointerMove = (e) => {
    if (!swipeRef.current) return;
    const dx = e.clientX - swipeRef.current.startX;
    const dy = e.clientY - swipeRef.current.startY;
    if (!swipeRef.current.moved && Math.abs(dy) > Math.abs(dx)) { swipeRef.current = null; return; }
    if (dx < 0) { swipeRef.current.moved = true; setSwipeDx(dx); }
  };
  const onPointerUp = () => {
    if (swipeRef.current?.moved && swipeDx < -80) { onClose?.(); }
    swipeRef.current = null;
    setSwipeDx(0);
  };

  return (
    <div style={{
      position: 'absolute', left: 14, right: 14, bottom: 96, zIndex: 45,
      transform: show ? `translateY(0) translateX(${swipeDx}px)` : 'translateY(140%)',
      opacity: show ? Math.max(0, 1 + swipeDx / 200) : 0,
      transition: swipeDx !== 0 ? 'none' : 'transform 440ms var(--ease-spring), opacity 240ms var(--ease)',
      pointerEvents: show ? 'auto' : 'none',
    }}
      onPointerDown={onPointerDown} onPointerMove={onPointerMove} onPointerUp={onPointerUp} onPointerCancel={onPointerUp}
    >
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
