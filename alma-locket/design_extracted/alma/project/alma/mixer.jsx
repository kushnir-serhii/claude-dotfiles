// ALMA — Mixer (The Enhancement Studio). Controlled: focus/dur/layer live in App,
// so the launch action bar can be pinned at the device level (above the mini-player).
const { useState: useStateM, useEffect: useEffectM } = React;

function Mixer({ focus, setFocus, dur, setDur, layer, setLayer, tracks, onToast }) {
  const [dropOpen, setDropOpen] = useStateM(false);
  const [previewing, setPreviewing] = useStateM(null);

  const downloaded = tracks.filter(t => t.state === 'downloaded');

  const toggleLayer = (l) => {
    if (layer && layer.id === l.id) { setLayer(null); return; }
    if (layer && layer.id !== l.id) onToast('Only one ambient layer at a time — switched to ' + l.name);
    setLayer(l);
  };

  const previewLayer = (l) => {
    setPreviewing(l.id);
    onToast('Pre-listening ' + l.name + '…');
    setTimeout(() => setPreviewing(p => (p === l.id ? null : p)), 2200);
  };

  return (
    <div style={{ padding: '24px 20px 220px', animation: 'almaFade 400ms var(--ease)' }}>
      <div style={{ textAlign: 'center', marginBottom: 6 }}>
        <div className="eyebrow">Enhancement Studio</div>
        <h1 style={{ margin: '6px 0 0', fontSize: 28, fontWeight: 600, letterSpacing: -0.4 }}>Mixer</h1>
      </div>

      {/* A — Primary Focus Track */}
      <section style={{ marginTop: 24 }}>
        <div className="eyebrow" style={{ marginBottom: 10 }}>Primary Focus Track</div>
        <div style={{
          borderRadius: 22, background: 'var(--surface)', border: '1px solid var(--hairline)',
          padding: 14, position: 'relative',
        }}>
          {focus ? (
            <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
              <Orb grad={focus.grad} size={56} radius={16} glow />
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ fontSize: 17, fontWeight: 600, color: 'var(--text)' }}>{focus.title}</div>
                <div style={{ fontSize: 13.5, color: 'var(--text-2)', marginTop: 1 }}>{focus.sub} · {focus.dur} min</div>
              </div>
              <button className="press" onClick={() => setDropOpen(o => !o)} style={{
                padding: '9px 15px', borderRadius: 13, background: 'var(--surface-2)',
                border: '1px solid var(--hairline)', color: 'var(--text-2)', fontSize: 14, fontWeight: 600,
                display: 'flex', alignItems: 'center', gap: 5, whiteSpace: 'nowrap',
              }}>Change <IconChevDown size={15} style={{ transform: dropOpen ? 'rotate(180deg)' : 'none', transition: 'transform 200ms' }} /></button>
            </div>
          ) : (
            <button className="press" onClick={() => setDropOpen(o => !o)} style={{
              width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'space-between',
              color: 'var(--text-2)', fontSize: 15.5, fontWeight: 500, padding: '6px 4px', gap: 10,
            }}>
              <span style={{ display: 'flex', alignItems: 'center', gap: 11, minWidth: 0 }}>
                <span style={{ width: 56, height: 56, borderRadius: 16, border: '1.5px dashed var(--hairline-strong)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                  <IconPlus size={22} />
                </span>
                <span style={{ whiteSpace: 'nowrap' }}>Select a track from the Vault</span>
              </span>
              <IconChevDown size={18} style={{ flexShrink: 0, transform: dropOpen ? 'rotate(180deg)' : 'none', transition: 'transform 200ms' }} />
            </button>
          )}

          {dropOpen && (
            <div style={{ marginTop: 12, paddingTop: 12, borderTop: '1px solid var(--hairline)', display: 'flex', flexDirection: 'column', gap: 2, animation: 'almaFadeUp 220ms var(--ease)' }}>
              {downloaded.map(t => (
                <button key={t.id} className="press" onClick={() => { setFocus(t); setDropOpen(false); }} style={{
                  display: 'flex', alignItems: 'center', gap: 12, padding: 8, borderRadius: 13,
                  background: focus?.id === t.id ? 'var(--accent-soft)' : 'transparent', textAlign: 'left',
                }}>
                  <Orb grad={t.grad} size={40} radius={11} />
                  <div style={{ flex: 1 }}>
                    <div style={{ fontSize: 15, fontWeight: 600, color: 'var(--text)' }}>{t.title}</div>
                    <div style={{ fontSize: 12.5, color: 'var(--text-3)' }}>{t.sub} · {t.dur} min</div>
                  </div>
                  {focus?.id === t.id && <IconCheck size={18} style={{ color: 'var(--accent)' }} />}
                </button>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* B — Session Timer */}
      <section style={{ marginTop: 26 }}>
        <div className="eyebrow" style={{ marginBottom: 11 }}>Session Length</div>
        <DurationPills value={dur} onChange={setDur} dense />
      </section>

      {/* C — Ambient Layers & Chimes */}
      <section style={{ marginTop: 26 }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 11, gap: 10 }}>
          <div className="eyebrow">Ambient Layers & Chimes</div>
          <span style={{ fontSize: 12, color: 'var(--text-3)', display: 'flex', alignItems: 'center', gap: 5, flexShrink: 0, whiteSpace: 'nowrap' }}>
            <IconLayers size={14} /> one at a time
          </span>
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 9 }}>
          {AMBIENT_LAYERS.map(l => {
            const on = layer?.id === l.id;
            return (
              <div key={l.id} style={{
                display: 'flex', alignItems: 'center', gap: 13, padding: '14px 16px', borderRadius: 17,
                background: on ? 'var(--accent-soft)' : 'var(--surface)',
                border: `1px solid ${on ? 'var(--accent)' : 'var(--hairline)'}`,
                transition: 'background 220ms var(--ease), border-color 220ms var(--ease)',
              }}>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                    <div style={{ fontSize: 15.5, fontWeight: 600, color: 'var(--text)' }}>{l.name}</div>
                    {previewing === l.id && (
                      <span style={{ display: 'flex', alignItems: 'center', color: 'var(--text-2)' }}>
                        <IconWave size={16} />
                      </span>
                    )}
                  </div>
                  <div style={{ fontSize: 12.5, color: 'var(--text-3)', marginTop: 2 }}>{l.desc}</div>
                </div>
                <button className="press" onClick={() => previewLayer(l)} aria-label="Pre-listen" style={{
                  height: 32, padding: '0 12px', borderRadius: 16, border: '1px solid var(--hairline-strong)',
                  display: 'flex', alignItems: 'center', gap: 6, color: 'var(--text-2)', flexShrink: 0,
                  fontSize: 12.5, fontWeight: 600, whiteSpace: 'nowrap',
                }}>
                  <IconPreview size={16} /> Pre-listen
                </button>
                <button className="press" onClick={() => toggleLayer(l)} aria-label="Toggle layer" style={{
                  width: 50, height: 30, borderRadius: 15, position: 'relative', flexShrink: 0,
                  background: on ? 'var(--accent)' : 'var(--surface-2)',
                  border: `1px solid ${on ? 'transparent' : 'var(--hairline)'}`,
                  transition: 'background 220ms var(--ease)',
                }}>
                  <span style={{
                    position: 'absolute', top: 3, left: on ? 23 : 3, width: 22, height: 22, borderRadius: '50%',
                    background: '#fff', transition: 'left 240ms var(--ease-spring)', boxShadow: '0 1px 3px rgba(0,0,0,0.3)',
                  }} />
                </button>
              </div>
            );
          })}
        </div>
      </section>
    </div>
  );
}

// D — Pre-Hear & Launch Action Bar (rendered at device level, pinned, stacks above mini-player)
function MixerActionBar({ focus, dur, layer, raised, onBegin, onPreviewMix }) {
  return (
    <div style={{
      position: 'absolute', left: 14, right: 14, zIndex: 44,
      bottom: raised ? 158 : 98,
      transition: 'bottom 360ms var(--ease-spring)',
    }}>
      <div style={{
        display: 'flex', gap: 11, padding: 10, borderRadius: 22,
        background: 'var(--surface-solid)', border: '1px solid var(--hairline-strong)', boxShadow: 'var(--shadow)',
      }}>
        <button className="press" onClick={() => onPreviewMix(focus, layer)} disabled={!focus} style={{
          flex: '0 0 auto', padding: '15px 16px', borderRadius: 15,
          background: 'var(--surface-2)', border: '1px solid var(--hairline)',
          color: focus ? 'var(--text)' : 'var(--text-3)', fontSize: 14.5, fontWeight: 600,
          display: 'flex', alignItems: 'center', gap: 7, opacity: focus ? 1 : 0.5, whiteSpace: 'nowrap',
        }}>
          <IconWave size={18} /> Pre-listen
        </button>
        <button className="press" onClick={() => onBegin(focus, dur, layer)} disabled={!focus} style={{
          flex: 1, padding: '15px', borderRadius: 15,
          background: focus ? 'var(--accent)' : 'var(--surface-2)',
          color: focus ? 'var(--on-accent)' : 'var(--text-3)', fontSize: 16, fontWeight: 600,
          display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8, whiteSpace: 'nowrap',
          boxShadow: focus ? '0 8px 22px -8px var(--accent-glow)' : 'none', opacity: focus ? 1 : 0.6,
        }}>
          <IconPlay size={19} /> Begin Session
        </button>
      </div>
    </div>
  );
}

Object.assign(window, { Mixer, MixerActionBar });
