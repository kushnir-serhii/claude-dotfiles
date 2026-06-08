// ALMA — Vault (The File Manager)
const { useState: useStateV } = React;

function SegTabs({ tabs, active, onChange }) {
  return (
    <div style={{
      display: 'flex', padding: 4, borderRadius: 16, background: 'var(--surface)',
      border: '1px solid var(--hairline)', gap: 4,
    }}>
      {tabs.map(t => {
        const on = active === t.id;
        return (
          <button key={t.id} className="press" onClick={() => onChange(t.id)} style={{
            flex: 1, padding: '11px', borderRadius: 12, fontSize: 14.5, fontWeight: 600,
            background: on ? 'var(--text)' : 'transparent',
            color: on ? 'var(--bg-0)' : 'var(--text-2)',
            transition: 'background 220ms var(--ease), color 220ms var(--ease)',
          }}>{t.label}</button>
        );
      })}
    </div>
  );
}

function RitualVaultRow({ ritual, onRename, onLaunch, onDelete }) {
  const [editing, setEditing] = useStateV(false);
  const [val, setVal] = useStateV(ritual.title);
  const commit = () => { onRename(ritual.id, val.trim() || ritual.title); setEditing(false); };
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 13, padding: '11px 12px' }}>
      <Orb grad={ritual.grad} size={46} radius={13} />
      <div style={{ flex: 1, minWidth: 0 }}>
        {editing ? (
          <input autoFocus value={val} onChange={e => setVal(e.target.value)}
            onBlur={commit} onKeyDown={e => e.key === 'Enter' && commit()}
            style={{
              width: '100%', background: 'var(--surface-2)', border: '1px solid var(--accent)',
              borderRadius: 9, padding: '6px 9px', color: 'var(--text)', fontSize: 15, fontWeight: 600,
              fontFamily: 'var(--font)', outline: 'none',
            }} />
        ) : (
          <div style={{ fontSize: 15.5, fontWeight: 600, color: 'var(--text)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{ritual.title}</div>
        )}
        <div style={{ fontSize: 12.5, color: 'var(--text-3)', marginTop: 2 }}>{ritual.layers} · {ritual.dur} min</div>
      </div>
      <button className="press" onClick={() => editing ? commit() : setEditing(true)} aria-label="Rename" style={iconBtn}>
        {editing ? <IconCheck size={16} style={{ color: 'var(--accent)' }} /> : <IconEdit size={16} />}
      </button>
      <button className="press" onClick={() => onDelete(ritual.id)} aria-label="Delete" style={iconBtn}>
        <IconTrash size={16} />
      </button>
    </div>
  );
}

function RawRow({ file, onTogglePin, onDelete, onEdit }) {
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 13, padding: '11px 12px' }}>
      <PinOrb color={file.color} icon={file.icon} size={46} radius={13} />
      <div style={{ flex: 1, minWidth: 0 }}>
        <div style={{ fontSize: 15, fontWeight: 500, color: 'var(--text)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{file.name}</div>
        <div style={{ fontSize: 12.5, color: 'var(--text-3)', marginTop: 1 }}>{file.meta}</div>
      </div>
      <button className="press" onClick={() => onEdit(file)} aria-label="Customize" style={iconBtn}>
        <IconEdit size={16} />
      </button>
      <button className="press" onClick={() => onTogglePin(file.id)} aria-label="Pin to Sanctuary" style={{
        ...iconBtn, color: file.pinned ? 'var(--text)' : 'var(--text-3)',
        background: file.pinned ? 'var(--surface-2)' : 'transparent',
      }}>
        <IconPin size={16} />
      </button>
      <button className="press" onClick={() => onDelete(file.id)} aria-label="Clear slot" style={iconBtn}>
        <IconTrash size={16} />
      </button>
    </div>
  );
}

const iconBtn = {
  width: 36, height: 36, borderRadius: '50%', flexShrink: 0,
  display: 'flex', alignItems: 'center', justifyContent: 'center',
  color: 'var(--text-2)', border: '1px solid var(--hairline)',
};

function Vault({ rituals, rawAudio, onRename, onDeleteRitual, onTogglePin, onDeleteFile, onLaunchRitual, onEditFile, onGoMixer, onImportFile }) {
  const [tab, setTab] = useStateV('rituals');
  const fileInputRef = React.useRef(null);
  const SLOTS = 5;
  const used = rawAudio.length;

  const handleImportClick = () => { if (used < SLOTS) fileInputRef.current?.click(); };
  const handleFileChange = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const url = URL.createObjectURL(file);
    const name = file.name.replace(/\.[^.]+$/, '');
    onImportFile({ id: 'imp-' + Date.now(), name, meta: file.type.includes('wav') ? 'WAV · Imported' : 'MP3 · Imported', color: 'blu', icon: 'music', pinned: false, audioSrc: url });
    e.target.value = '';
  };

  return (
    <div style={{ padding: '24px 20px 200px', animation: 'almaFade 400ms var(--ease)' }}>
      <div style={{ textAlign: 'center', marginBottom: 18 }}>
        <div className="eyebrow">File Manager</div>
        <h1 style={{ margin: '6px 0 0', fontSize: 28, fontWeight: 600, letterSpacing: -0.4 }}>Vault</h1>
      </div>

      {/* hidden file input */}
      <input ref={fileInputRef} type="file" accept="audio/*" style={{ display: 'none' }} onChange={handleFileChange} />

      {/* Pro banner */}
      <button className="press" onClick={onUpgrade} style={{
        width: '100%', borderRadius: 22, marginBottom: 18, overflow: 'hidden',
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
        <div style={{ position: 'absolute', bottom: 10, right: 14, fontSize: 11.5, fontWeight: 600, color: 'rgba(255,255,255,0.55)', whiteSpace: 'nowrap' }}>
          {used}/{SLOTS} slots used
        </div>
      </button>

      <SegTabs tabs={[{ id: 'rituals', label: 'Saved Rituals' }, { id: 'raw', label: 'Raw Audio' }]} active={tab} onChange={setTab} />

      <div style={{ marginTop: 16 }}>
        {tab === 'rituals' ? (
          <>
          <div style={{ background: 'var(--surface)', borderRadius: 20, border: '1px solid var(--hairline)', padding: 4 }}>
            {rituals.length === 0 && <Empty text="No saved rituals yet" />}
            {rituals.map((r, i) => (
              <React.Fragment key={r.id}>
                <RitualVaultRow ritual={r} onRename={onRename} onLaunch={onLaunchRitual} onDelete={onDeleteRitual} />
                {i < rituals.length - 1 && <div style={{ height: 1, background: 'var(--hairline)', margin: '0 12px' }} />}
              </React.Fragment>
            ))}
          </div>
          <button className="press" onClick={onGoMixer} style={{
            display: 'flex', alignItems: 'center', gap: 12, padding: 14, borderRadius: 16, marginTop: 10,
            border: '1.5px dashed var(--hairline-strong)', color: 'var(--text-3)',
            background: 'transparent', width: '100%',
          }}>
            <span style={{ width: 36, height: 36, borderRadius: 11, border: '1.5px dashed var(--hairline-strong)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <IconPlus size={18} />
            </span>
            <span style={{ fontSize: 14.5, fontWeight: 500, whiteSpace: 'nowrap' }}>Add Ritual — open the Mixer</span>
          </button>
          </>
        ) : (
          <>
            <div style={{ background: 'var(--surface)', borderRadius: 20, border: '1px solid var(--hairline)', padding: 4 }}>
              {rawAudio.map((f, i) => (
                <React.Fragment key={f.id}>
                  <RawRow file={f} onTogglePin={onTogglePin} onDelete={onDeleteFile} onEdit={onEditFile} />
                  {i < rawAudio.length - 1 && <div style={{ height: 1, background: 'var(--hairline)', margin: '0 12px' }} />}
                </React.Fragment>
              ))}
            </div>
            {/* empty upload slots */}
            {used < SLOTS && (
              <div style={{ display: 'flex', flexDirection: 'column', gap: 9, marginTop: 12 }}>
                {Array.from({ length: SLOTS - used }).map((_, i) => (
                  <button key={i} className="press" onClick={handleImportClick} style={{
                    display: 'flex', alignItems: 'center', gap: 12, padding: 14, borderRadius: 16,
                    border: '1.5px dashed var(--hairline-strong)', color: 'var(--text-3)',
                    background: 'transparent', width: '100%',
                  }}>
                    <span style={{ width: 36, height: 36, borderRadius: 11, border: '1.5px dashed var(--hairline-strong)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                      <IconPlus size={18} />
                    </span>
                    <span style={{ fontSize: 14.5, fontWeight: 500, whiteSpace: 'nowrap' }}>Import audio — slot {used + i + 1}</span>
                  </button>
                ))}
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}

function Empty({ text }) {
  return <div style={{ padding: '34px 0', textAlign: 'center', color: 'var(--text-3)', fontSize: 14 }}>{text}</div>;
}

window.Vault = Vault;
