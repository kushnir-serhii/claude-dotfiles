// ALMA — Sanctuary (Home) + Quick-Configuration sheet
const { useState: useStateS } = React;

// Premium master-track tile (dual-state: downloaded vs in-cloud).
// Flush layout — no card wrapper — so orb left edge aligns with section head.
function MasterCard({ track, onSelect, onPreview, onLoad, loading, justLoaded }) {
  const downloaded = track.state === 'downloaded';
  return (
    <div className="press" onClick={() => downloaded && onSelect(track)} style={{
      width: 168,
      cursor: downloaded ? 'pointer' : 'default',
    }}>
      <Orb grad={track.grad} size={168} radius={22} glow style={{ width: '100%' }}>
        {/* state badge */}
        <div style={{
          position: 'absolute', top: 10, right: 10, width: 28, height: 28, borderRadius: '50%',
          background: 'rgba(10,8,6,0.42)', backdropFilter: 'blur(6px)',
          display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff',
        }}>
          {downloaded ? <IconCheck size={16} /> : <IconCloud size={16} />}
        </div>
        {/* duration chip — bottom left, on the artwork */}
        {downloaded && (
          <div style={{
            position: 'absolute', left: 10, bottom: 10, padding: '4px 9px', borderRadius: 20,
            background: 'rgba(10,8,6,0.42)', backdropFilter: 'blur(6px)', color: '#fff',
            fontSize: 12, fontWeight: 600, letterSpacing: 0.2, whiteSpace: 'nowrap',
          }}>{track.dur} min</div>
        )}
      </Orb>
      <div style={{ marginTop: 11 }}>
        <div style={{ fontSize: 15.5, fontWeight: 600, color: 'var(--text)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{track.title}</div>
        <div style={{ fontSize: 12.5, color: 'var(--text-3)', marginTop: 2, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{track.sub}</div>
      </div>
      {!downloaded && (
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginTop: 10 }}>
          <button className="press" onClick={(e) => { e.stopPropagation(); onPreview(track); }} style={{
            display: 'flex', alignItems: 'center', gap: 6, fontSize: 13, fontWeight: 600, color: 'var(--text-2)',
          }}>
            <IconPreview size={16} /> Pre-listen
          </button>
          <button className="press" onClick={(e) => { e.stopPropagation(); onLoad(track); }} aria-label="Load to Vault" style={{
            width: 36, height: 36, borderRadius: '50%', border: '1px solid var(--hairline-strong)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            color: justLoaded ? 'var(--text)' : 'var(--text-2)',
            background: loading ? 'var(--surface-2)' : 'transparent',
          }}>
            {justLoaded ? <IconCheck size={16} /> : loading ? <Spinner /> : <IconDownload size={16} />}
          </button>
        </div>
      )}
    </div>
  );
}

function Spinner() {
  return <div style={{
    width: 16, height: 16, borderRadius: '50%',
    border: '2px solid var(--hairline-strong)', borderTopColor: 'var(--text)',
    animation: 'spinCW 0.7s linear infinite',
  }} />;
}

// Saved-ritual card (horizontal lane). Uses ritual gradient image as full-bleed cover.
function RitualCard({ ritual, onLaunch }) {
  return (
    <div className="press" onClick={() => onLaunch(ritual)} style={{
      width: 230, borderRadius: 22, overflow: 'hidden', position: 'relative',
      cursor: 'pointer',
    }}>
      <div style={{ height: 138, background: ALMA_GRADIENTS[ritual.grad], backgroundColor: '#1a1714', position: 'relative' }}>
        <div style={{ position: 'absolute', inset: 0, borderRadius: 22, background: 'rgba(128,128,128,0.08)', backdropFilter: 'blur(10px)', WebkitBackdropFilter: 'blur(10px)' }} />
        <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to top, rgba(8,6,5,0.65), rgba(8,6,5,0.10) 55%, transparent 80%)' }} />
        <div style={{
          position: 'absolute', top: 12, right: 12, padding: '4px 10px', borderRadius: 20,
          background: 'rgba(10,8,6,0.42)', backdropFilter: 'blur(6px)', color: '#fff',
          fontSize: 12, fontWeight: 600, letterSpacing: 0.2, whiteSpace: 'nowrap',
        }}>{ritual.dur} min</div>
        <div style={{ position: 'absolute', left: 14, bottom: 12, right: 14 }}>
          <div style={{ fontSize: 16, fontWeight: 600, color: '#fff', letterSpacing: -0.1 }}>{ritual.title}</div>
          <div style={{ fontSize: 12.5, color: 'rgba(255,255,255,0.78)', marginTop: 2 }}>{ritual.layers}</div>
        </div>
      </div>
    </div>
  );
}

// Pinned file row — flush list (no outer card wrapper).
function PinnedRow({ file, onSelect, onEdit, divider }) {
  return (
    <>
      <div className="press" onClick={() => onSelect(file)} style={{
        display: 'flex', alignItems: 'center', gap: 14, padding: '7px 0',
        cursor: 'pointer',
      }}>
        <PinOrb color={file.color} icon={file.icon} size={48} radius={13} />
        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={{ fontSize: 15, fontWeight: 500, color: 'var(--text)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{file.name}</div>
          <div style={{ fontSize: 12.5, color: 'var(--text-3)', marginTop: 1 }}>{file.meta}</div>
        </div>
        <button className="press" onClick={(e) => { e.stopPropagation(); onEdit(file); }} aria-label="Customize" style={{
          width: 34, height: 34, borderRadius: '50%', flexShrink: 0,
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          color: 'var(--text-3)', border: '1px solid var(--hairline)',
        }}>
          <IconEdit size={16} />
        </button>
        <PlayBadge size={34} onClick={(e) => { e?.stopPropagation?.(); onSelect(file); }} />
      </div>
      {divider && <div style={{ height: 1, background: 'var(--hairline)', marginLeft: 62 }} />}
    </>
  );
}

// "Add more rituals" call-to-action card (last in Saved Rituals lane)
function AddMoreRitualCard({ onClick }) {
  return (
    <button className="press" onClick={onClick} style={{
      width: 230, height: 138, borderRadius: 22, flexShrink: 0,
      border: '1.5px dashed var(--hairline-strong)',
      background: 'transparent', color: 'var(--text-2)',
      display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
      gap: 10, padding: 16,
    }}>
      <span style={{
        width: 44, height: 44, borderRadius: '50%',
        border: '1.5px dashed var(--hairline-strong)',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        color: 'var(--text-2)',
      }}>
        <IconPlus size={20} />
      </span>
      <div style={{ textAlign: 'center' }}>
        <div style={{ fontSize: 14.5, fontWeight: 600, color: 'var(--text)' }}>Create a Ritual</div>
        <div style={{ fontSize: 12, color: 'var(--text-3)', marginTop: 2 }}>Build one in the Mixer</div>
      </div>
    </button>
  );
}

function Sanctuary({ theme, onToggleTheme, tracks, rituals, pinned, onConfigure, onPreview, onLoad,
  loadingId, loadedIds, onLaunchRitual, onPlayFile, onEditFile, onAddMoreRitual, onUpgrade }) {
  return (
    <div style={{ padding: '60px 20px 200px', animation: 'almaFade 400ms var(--ease)' }}>
      <AlmaHeader theme={theme} onToggleTheme={onToggleTheme} sub="A quiet place for your sound." />

      {/* Master Tracks */}
      <section style={{ marginTop: 32 }}>
        <SectionHead title="Master Tracks" counter={`${tracks.length} tracks`} style={{ marginBottom: 16 }} />
        <div className="hscroll">
          {tracks.map(t => (
            <MasterCard key={t.id} track={t} onSelect={onConfigure} onPreview={onPreview}
              onLoad={onLoad} loading={loadingId === t.id} justLoaded={loadedIds.includes(t.id)} />
          ))}
        </div>
      </section>

      {/* Saved Rituals */}
      <section style={{ marginTop: 36 }}>
        <SectionHead title="Your Saved Rituals" counter={`${rituals.length} saved`} style={{ marginBottom: 16 }} />
        <div className="hscroll">
          {rituals.map(r => <RitualCard key={r.id} ritual={r} onLaunch={onLaunchRitual} />)}
          <AddMoreRitualCard onClick={onAddMoreRitual} />
        </div>
      </section>

      {/* Pinned Audio Files — flush list, aligned with section head */}
      <section style={{ marginTop: 36 }}>
        <SectionHead title="Pinned Files" counter={`${pinned.length} pinned`} style={{ marginBottom: 4 }} />
        <div style={{ display: 'flex', flexDirection: 'column' }}>
          {pinned.map((f, i) => (
            <PinnedRow key={f.id} file={f} onSelect={onPlayFile} onEdit={onEditFile} divider={i < pinned.length - 1} />
          ))}
        </div>
      </section>

      {/* Pro upgrade banner */}
      <section style={{ marginTop: 32 }}>
        <button className="press" onClick={onUpgrade} style={{
          width: '100%', borderRadius: 22, overflow: 'hidden',
          position: 'relative', height: 110, display: 'block',
          background: `url('alma/img/gradient4.webp') center / cover no-repeat`,
          border: 'none', cursor: 'pointer',
        }}>
          <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(100deg, rgba(0,0,0,0.62) 40%, rgba(0,0,0,0.18) 100%)' }} />
          <div style={{ position: 'absolute', right: -24, top: '50%', transform: 'translateY(-50%)', opacity: 0.45, pointerEvents: 'none' }}>
            <PlayerMandala />
          </div>
          <div style={{ position: 'absolute', left: 20, top: '50%', transform: 'translateY(-50%)', textAlign: 'left' }}>
            <div style={{ fontSize: 11, fontWeight: 700, letterSpacing: 2.5, color: 'rgba(255,255,255,0.6)', textTransform: 'uppercase', marginBottom: 4 }}>ALMA Pro</div>
            <div style={{ fontSize: 18, fontWeight: 700, color: '#fff', letterSpacing: -0.3, lineHeight: 1.2, marginBottom: 8 }}>Unlock everything</div>
            <div style={{ display: 'inline-flex', alignItems: 'center', gap: 6, padding: '5px 13px', borderRadius: 20, background: 'rgba(255,255,255,0.18)', backdropFilter: 'blur(6px)', border: '1px solid rgba(255,255,255,0.22)' }}>
              <span style={{ fontSize: 12.5, fontWeight: 600, color: '#fff', whiteSpace: 'nowrap' }}>Start free trial →</span>
            </div>
          </div>
        </button>
      </section>
    </div>
  );
}

// ── Quick-Configuration bottom sheet ──
function QuickConfigSheet({ track, onClose, onBegin, onAddLayers }) {
  const [dur, setDur] = useStateS(15);
  const open = !!track;
  return (
    <>
      {/* backdrop */}
      <div onClick={onClose} style={{
        position: 'absolute', inset: 0, zIndex: 55, background: 'rgba(6,4,3,0.5)',
        backdropFilter: open ? 'blur(3px)' : 'none',
        opacity: open ? 1 : 0, pointerEvents: open ? 'auto' : 'none',
        transition: 'opacity 300ms var(--ease)', borderRadius: 48,
      }} />
      {/* sheet */}
      <div style={{
        position: 'absolute', left: 0, right: 0, bottom: 0, zIndex: 56,
        transform: open ? 'translateY(0)' : 'translateY(102%)',
        transition: 'transform 460ms var(--ease-spring)',
        background: 'var(--surface-solid)', borderRadius: '30px 30px 48px 48px',
        padding: '14px 24px 40px', boxShadow: 'var(--shadow)',
        border: '1px solid var(--hairline)', borderBottom: 'none',
      }}>
        <div style={{ width: 40, height: 5, borderRadius: 3, background: 'var(--hairline-strong)', margin: '0 auto 22px' }} />
        {track && (
          <>
            <div style={{ display: 'flex', alignItems: 'center', gap: 15, marginBottom: 26 }}>
              <Orb grad={track.grad} size={64} radius={18} glow />
              <div>
                <div className="eyebrow" style={{ marginBottom: 4 }}>Configure session</div>
                <div style={{ fontSize: 21, fontWeight: 600, color: 'var(--text)' }}>{track.title}</div>
                <div style={{ fontSize: 14, color: 'var(--text-2)', marginTop: 1 }}>{track.sub}</div>
              </div>
            </div>

            <div style={{ fontSize: 13, fontWeight: 600, color: 'var(--text-2)', marginBottom: 11 }}>Duration</div>
            <DurationPills value={dur} onChange={setDur} dense />

            <button className="press" onClick={() => onBegin(track, dur)} style={{
              width: '100%', marginTop: 26, padding: '17px', borderRadius: 18,
              background: 'var(--accent)', color: 'var(--on-accent)',
              fontSize: 17, fontWeight: 600, boxShadow: '0 10px 26px -8px var(--accent-glow)',
              display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 9, whiteSpace: 'nowrap',
            }}>
              <IconPlay size={18} /> Begin Session
            </button>

            <button className="press" onClick={() => onAddLayers(track)} style={{
              width: '100%', marginTop: 14, color: 'var(--text-2)', fontSize: 15, fontWeight: 500,
              display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6, whiteSpace: 'nowrap',
            }}>
              Add Ambient Layers & Effects <IconChevRight size={16} />
            </button>
          </>
        )}
      </div>
    </>
  );
}

Object.assign(window, { Sanctuary, QuickConfigSheet, MasterCard, RitualCard, PinnedRow, AddMoreRitualCard });
