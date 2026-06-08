// ALMA — Mixer (The Enhancement Studio). Controlled: focus/dur/layer live in App,
// so the launch action bar can be pinned at the device level (above the mini-player).
const { useState: useStateM, useEffect: useEffectM, useRef: useRefM } = React;

function MixerDurationPicker({ value, onChange }) {
  const [customMode, setCustomMode] = useStateM(false);
  const [customInput, setCustomInput] = useStateM('');
  const presets = [5, 15, 30];
  const isPreset = presets.includes(value);

  const activateCustom = () => {
    setCustomMode(true);
    setCustomInput(isPreset ? '' : String(value));
  };

  const onInputChange = (e) => {
    const raw = e.target.value.replace(/\D/g, '');
    setCustomInput(raw);
    const n = parseInt(raw, 10);
    if (n > 0 && n <= 360) onChange(n);
  };

  return (
    <div style={{ display: 'flex', gap: 8 }}>
      {presets.map(min => {
        const active = value === min && !customMode;
        return (
          <button key={min} className="press" onClick={() => { onChange(min); setCustomMode(false); }} style={{
            flex: '1 1 0', padding: '11px 8px', borderRadius: 14,
            background: active ? 'var(--text)' : 'var(--surface)',
            color: active ? 'var(--bg-0)' : 'var(--text-2)',
            border: active ? 'none' : '1px solid var(--hairline)',
            fontSize: 15, fontWeight: 600,
            transition: 'background 200ms var(--ease), color 200ms var(--ease)',
          }}>{min} min</button>
        );
      })}
      {customMode ? (
        <div style={{
          flex: '1 1 0', display: 'flex', alignItems: 'center', justifyContent: 'center',
          borderRadius: 14, background: 'var(--text)', padding: '6px 8px',
        }}>
          <input
            autoFocus
            type="text" inputMode="numeric" pattern="[0-9]*"
            value={customInput}
            onChange={onInputChange}
            placeholder="min"
            style={{
              width: '100%', background: 'transparent', border: 'none', outline: 'none',
              color: 'var(--bg-0)', fontSize: 15, fontWeight: 600,
              textAlign: 'center', fontFamily: 'var(--font)',
            }}
          />
        </div>
      ) : (
        <button className="press" onClick={activateCustom} style={{
          flex: '1 1 0', padding: '11px 8px', borderRadius: 14,
          background: 'var(--surface)', color: 'var(--text-2)',
          border: '1px solid var(--hairline)', fontSize: 15, fontWeight: 600,
        }}>Custom</button>
      )}
    </div>
  );
}

function Mixer({ focus, setFocus, dur, setDur, layer, setLayer, bell, setBell, intervalMin, setIntervalMin, tracks, onToast, onPreviewLayer }) {
  const [dropOpen, setDropOpen] = useStateM(false);
  const [previewing, setPreviewing] = useStateM(null);
  const previewAudioRef = useRefM(null);

  const downloaded = tracks.filter(t => t.state === 'downloaded');

  const toggleLayer = (l) => {
    if (layer && layer.id === l.id) { setLayer(null); return; }
    if (layer && layer.id !== l.id) onToast('Only one ambient layer at a time — switched to ' + l.name);
    setLayer(l);
  };

  const toggleBell = (l) => {
    setBell(b => b?.id === l.id ? null : l);
  };

  const stopPreview = () => {
    previewAudioRef.current?.pause();
    previewAudioRef.current = null;
    setPreviewing(null);
  };

  const previewLayer = (l) => {
    if (previewing === l.id) { stopPreview(); return; }
    stopPreview();
    if (!l.audioSrc) return;
    const a = new Audio(l.audioSrc);
    a.volume = 0.75;
    a.play().catch(() => {});
    previewAudioRef.current = a;
    setPreviewing(l.id);
    const clear = () => { if (previewAudioRef.current === a) { previewAudioRef.current = null; setPreviewing(p => p === l.id ? null : p); } };
    a.onended = clear;
    setTimeout(clear, 12000);
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
                  background: focus?.id === t.id ? 'var(--surface-2)' : 'transparent', textAlign: 'left',
                }}>
                  <Orb grad={t.grad} size={40} radius={11} />
                  <div style={{ flex: 1 }}>
                    <div style={{ fontSize: 15, fontWeight: 600, color: 'var(--text)' }}>{t.title}</div>
                    <div style={{ fontSize: 12.5, color: 'var(--text-3)' }}>{t.sub} · {t.dur} min</div>
                  </div>
                  {focus?.id === t.id && <IconCheck size={18} style={{ color: 'var(--text-2)' }} />}
                </button>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* B — Session Timer */}
      <section style={{ marginTop: 26 }}>
        <div className="eyebrow" style={{ marginBottom: 11 }}>Session Length</div>
        <MixerDurationPicker value={dur} onChange={setDur} />
      </section>

      {/* C — Ambient Layers & Effects */}
      <section style={{ marginTop: 26 }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 11, gap: 10 }}>
          <div className="eyebrow">Ambient Layers & Effects</div>
          <span style={{ fontSize: 12, color: 'var(--text-3)', display: 'flex', alignItems: 'center', gap: 5, flexShrink: 0, whiteSpace: 'nowrap' }}>
            <IconLayers size={14} /> one at a time
          </span>
        </div>

        {[
          { label: 'Nature', ids: ['a1','a2','a3','a4'] },
          { label: 'Frequencies', ids: ['a5','a6','a7'] },
        ].map(group => (
          <div key={group.label} style={{ marginBottom: 18 }}>
            <div style={{ fontSize: 12, fontWeight: 500, letterSpacing: 0.2, color: 'var(--text-3)', marginBottom: 8 }}>{group.label}</div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 9 }}>
          {AMBIENT_LAYERS.filter(l => group.ids.includes(l.id)).map(l => {
            const on = layer?.id === l.id;
            return (
              <div key={l.id} style={{
                borderRadius: 17,
                background: on ? 'var(--surface-2)' : 'var(--surface)',
                border: `1px solid ${on ? 'var(--hairline-strong)' : 'var(--hairline)'}`,
                transition: 'background 220ms var(--ease), border-color 220ms var(--ease)',
                overflow: 'hidden',
              }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 13, padding: '12px 14px' }}>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ fontSize: 15, fontWeight: 600, color: 'var(--text)' }}>{l.name}</div>
                    <div style={{ fontSize: 12.5, color: 'var(--text-3)', marginTop: 2 }}>{l.desc}</div>
                  </div>
                  <button className="press" onClick={() => previewLayer(l)} aria-label={previewing === l.id ? 'Stop' : 'Listen'} style={{
                    width: 90, height: 40, borderRadius: 20, flexShrink: 0,
                    border: '1px solid var(--hairline-strong)',
                    display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 7,
                    color: previewing === l.id ? 'var(--text)' : 'var(--text-2)',
                    fontSize: 13, fontWeight: 600,
                  }}>
                    {previewing === l.id ? <IconStop size={14} /> : <IconPlayFilled size={14} />}
                    {previewing === l.id ? 'Stop' : 'Listen'}
                  </button>
                  <button className="press" onClick={() => toggleLayer(l)} aria-label="Toggle layer" style={{
                    width: 50, height: 30, borderRadius: 15, position: 'relative', flexShrink: 0,
                    background: on ? 'var(--text)' : 'var(--surface-2)',
                    border: `1px solid ${on ? 'transparent' : 'var(--hairline)'}`,
                    transition: 'background 220ms var(--ease)',
                  }}>
                    <span style={{
                      position: 'absolute', top: 3, left: on ? 23 : 3, width: 22, height: 22, borderRadius: '50%',
                      background: on ? 'var(--bg-0)' : '#fff',
                      transition: 'left 240ms var(--ease-spring)', boxShadow: '0 1px 3px rgba(0,0,0,0.3)',
                    }} />
                  </button>
                </div>
                {/* Interval picker — shown when Interval Bell is active */}
                {on && l.isInterval && (
                  <div style={{ padding: '0 14px 14px', animation: 'almaFadeUp 200ms var(--ease)' }}>
                    <div style={{ fontSize: 12, fontWeight: 600, color: 'var(--text-3)', marginBottom: 8, letterSpacing: 0.5 }}>RING EVERY</div>
                    <div style={{ display: 'flex', gap: 7 }}>
                      {[1, 3, 5, 10, 15].map(m => {
                        const active = intervalMin === m;
                        return (
                          <button key={m} className="press" onClick={() => setIntervalMin(m)} style={{
                            flex: '1 1 0', padding: '8px 4px', borderRadius: 11,
                            background: active ? 'var(--text)' : 'var(--surface-2)',
                            color: active ? 'var(--bg-0)' : 'var(--text-2)',
                            border: active ? 'none' : '1px solid var(--hairline)',
                            fontSize: 13, fontWeight: 600,
                            transition: 'background 180ms var(--ease), color 180ms var(--ease)',
                          }}>{m}m</button>
                        );
                      })}
                    </div>
                  </div>
                )}
              </div>
            );
          })}
            </div>
          </div>
        ))}
      </section>

      {/* D — Session Bells */}
      <section style={{ marginTop: 26 }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 11, gap: 10 }}>
          <div className="eyebrow">Session Bells</div>
          <span style={{ fontSize: 12, color: 'var(--text-3)', flexShrink: 0, whiteSpace: 'nowrap' }}>intro · outro · interval</span>
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 9 }}>
          {AMBIENT_LAYERS.filter(l => ['a8','a9'].includes(l.id)).map(l => {
            const on = bell?.id === l.id;
            return (
              <div key={l.id} style={{
                borderRadius: 17,
                background: on ? 'var(--surface-2)' : 'var(--surface)',
                border: `1px solid ${on ? 'var(--hairline-strong)' : 'var(--hairline)'}`,
                transition: 'background 220ms var(--ease), border-color 220ms var(--ease)',
                overflow: 'hidden',
              }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 13, padding: '12px 14px' }}>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ fontSize: 15, fontWeight: 600, color: 'var(--text)' }}>{l.name}</div>
                    <div style={{ fontSize: 12.5, color: 'var(--text-3)', marginTop: 2 }}>{l.desc}</div>
                  </div>
                  <button className="press" onClick={() => previewLayer(l)} aria-label={previewing === l.id ? 'Stop' : 'Listen'} style={{
                    width: 90, height: 40, borderRadius: 20, flexShrink: 0,
                    border: '1px solid var(--hairline-strong)',
                    display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 7,
                    color: previewing === l.id ? 'var(--text)' : 'var(--text-2)',
                    fontSize: 13, fontWeight: 600,
                  }}>
                    {previewing === l.id ? <IconStop size={14} /> : <IconPlayFilled size={14} />}
                    {previewing === l.id ? 'Stop' : 'Listen'}
                  </button>
                  <button className="press" onClick={() => toggleBell(l)} aria-label="Toggle bell" style={{
                    width: 50, height: 30, borderRadius: 15, position: 'relative', flexShrink: 0,
                    background: on ? 'var(--text)' : 'var(--surface-2)',
                    border: `1px solid ${on ? 'transparent' : 'var(--hairline)'}`,
                    transition: 'background 220ms var(--ease)',
                  }}>
                    <span style={{
                      position: 'absolute', top: 3, left: on ? 23 : 3, width: 22, height: 22, borderRadius: '50%',
                      background: on ? 'var(--bg-0)' : '#fff',
                      transition: 'left 240ms var(--ease-spring)', boxShadow: '0 1px 3px rgba(0,0,0,0.3)',
                    }} />
                  </button>
                </div>
                {on && l.isInterval && (
                  <div style={{ padding: '0 14px 14px', animation: 'almaFadeUp 200ms var(--ease)' }}>
                    <div style={{ fontSize: 11, fontWeight: 600, color: 'var(--text-3)', marginBottom: 8, letterSpacing: 0.5 }}>RING EVERY</div>
                    <div style={{ display: 'flex', gap: 7 }}>
                      {[1, 3, 5, 10, 15].map(m => {
                        const active = intervalMin === m;
                        return (
                          <button key={m} className="press" onClick={() => setIntervalMin(m)} style={{
                            flex: '1 1 0', padding: '8px 4px', borderRadius: 11,
                            background: active ? 'var(--text)' : 'var(--surface-2)',
                            color: active ? 'var(--bg-0)' : 'var(--text-2)',
                            border: active ? 'none' : '1px solid var(--hairline)',
                            fontSize: 13, fontWeight: 600,
                            transition: 'background 180ms var(--ease), color 180ms var(--ease)',
                          }}>{m}m</button>
                        );
                      })}
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </section>
    </div>
  );
}

// D — Pre-Hear & Launch Action Bar (rendered at device level, pinned, stacks above mini-player)
function MixerActionBar({ focus, dur, layer, bell, raised, onBegin, onPreviewMix }) {
  const [isPreviewing, setIsPreviewing] = useStateM(false);
  const previewRefs = useRefM([]);

  const stopAll = () => {
    previewRefs.current.forEach(a => { try { a.pause(); } catch(e) {} });
    previewRefs.current = [];
    setIsPreviewing(false);
  };

  const handlePreview = () => {
    if (isPreviewing) { stopAll(); return; }
    if (!focus?.audioSrc) return;

    const audios = [];

    const main = new Audio(focus.audioSrc);
    main.volume = 0.75; main.loop = true;
    main.play().catch(() => {});
    audios.push(main);

    if (layer?.audioSrc) {
      const lyr = new Audio(layer.audioSrc);
      lyr.volume = 0.45; lyr.loop = true;
      lyr.play().catch(() => {});
      audios.push(lyr);
    }

    if (bell?.audioSrc) {
      const b = new Audio(bell.audioSrc);
      b.volume = 0.85;
      setTimeout(() => b.play().catch(() => {}), 400);
      audios.push(b);
    }

    previewRefs.current = audios;
    setIsPreviewing(true);
    setTimeout(stopAll, 15000);
  };

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
        <button className="press" onClick={handlePreview} disabled={!focus} style={{
          flex: '0 0 130px', padding: '15px 0', borderRadius: 15,
          background: 'var(--surface-2)', border: '1px solid var(--hairline)',
          color: focus ? 'var(--text)' : 'var(--text-3)', fontSize: 14.5, fontWeight: 600,
          display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 7,
          opacity: focus ? 1 : 0.5, whiteSpace: 'nowrap',
        }}>
          {isPreviewing ? <IconStop size={18} /> : <IconWave size={18} />}
          {isPreviewing ? 'Stop' : 'Pre-listen'}
        </button>
        <button className="press" onClick={() => onBegin(focus, dur, layer, 'mixer')} disabled={!focus} style={{
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
