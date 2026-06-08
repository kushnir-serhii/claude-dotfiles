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
            background: on ? 'var(--accent)' : 'transparent',
            color: on ? 'var(--on-accent)' : 'var(--text-2)',
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
        ...iconBtn, color: file.pinned ? 'var(--accent)' : 'var(--text-3)',
        background: file.pinned ? 'var(--accent-soft)' : 'transparent',
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

function Vault({ rituals, rawAudio, onRename, onDeleteRitual, onTogglePin, onDeleteFile, onLaunchRitual, onEditFile }) {
  const [tab, setTab] = useStateV('rituals');
  const SLOTS = 5;
  const used = rawAudio.length;

  return (
    <div style={{ padding: '24px 20px 200px', animation: 'almaFade 400ms var(--ease)' }}>
      <div style={{ textAlign: 'center', marginBottom: 18 }}>
        <div className="eyebrow">File Manager</div>
        <h1 style={{ margin: '6px 0 0', fontSize: 28, fontWeight: 600, letterSpacing: -0.4 }}>Vault</h1>
      </div>

      {/* storage metric */}
      <div style={{
        display: 'flex', alignItems: 'center', gap: 16,
        padding: '14px 18px', borderRadius: 18, marginBottom: 18,
        background: 'var(--surface)', border: '1px solid var(--hairline)',
      }}>
        <div style={{ flexShrink: 0 }}>
          <div style={{ fontSize: 13, color: 'var(--text-3)', fontWeight: 500 }}>Storage</div>
          <div style={{ fontSize: 19, fontWeight: 600, color: 'var(--text)', marginTop: 2, whiteSpace: 'nowrap' }}>
            {used} / {SLOTS} <span style={{ fontSize: 14, color: 'var(--text-2)', fontWeight: 500 }}>· Free</span>
          </div>
        </div>
        <div style={{ flex: 1, minWidth: 0, display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: 8 }}>
          <div style={{ height: 7, width: '100%', borderRadius: 4, background: 'var(--surface-2)', overflow: 'hidden' }}>
            <div style={{ height: '100%', width: `${(used / SLOTS) * 100}%`, background: 'var(--accent)', borderRadius: 4, transition: 'width 300ms var(--ease)' }} />
          </div>
          <button className="press" style={{ fontSize: 12.5, fontWeight: 600, color: 'var(--accent)', whiteSpace: 'nowrap' }}>Upgrade to Pro →</button>
        </div>
      </div>

      <SegTabs tabs={[{ id: 'rituals', label: 'Saved Rituals' }, { id: 'raw', label: 'Raw Audio' }]} active={tab} onChange={setTab} />

      <div style={{ marginTop: 16 }}>
        {tab === 'rituals' ? (
          <div style={{ background: 'var(--surface)', borderRadius: 20, border: '1px solid var(--hairline)', padding: 4 }}>
            {rituals.length === 0 && <Empty text="No saved rituals yet" />}
            {rituals.map((r, i) => (
              <React.Fragment key={r.id}>
                <RitualVaultRow ritual={r} onRename={onRename} onLaunch={onLaunchRitual} onDelete={onDeleteRitual} />
                {i < rituals.length - 1 && <div style={{ height: 1, background: 'var(--hairline)', margin: '0 12px' }} />}
              </React.Fragment>
            ))}
          </div>
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
                  <button key={i} className="press" style={{
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
