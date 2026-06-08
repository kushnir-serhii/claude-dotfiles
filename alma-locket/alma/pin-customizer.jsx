// ALMA — Pin file customizer: bottom sheet for choosing name, icon + color
// for a saved file or a newly imported one. Renders at device level; controlled by App.

function PinCustomizerSheet({ file, onClose, onSave }) {
  const open = !!file;
  const [color, setColor] = React.useState(file?.color || 'blu');
  const [icon, setIcon] = React.useState(file?.icon || 'wave');
  const [name, setName] = React.useState(file?.name || '');

  // re-sync when a different file is opened
  React.useEffect(() => {
    if (file) {
      setColor(file.color || 'blu');
      setIcon(file.icon || 'wave');
      setName(file.name || '');
    }
  }, [file?.id]);

  const commit = () => {
    if (!file) return;
    onSave(file.id, { color, icon, name: name.trim() || file.name });
    onClose();
  };

  return (
    <>
      <div onClick={onClose} style={{
        position: 'absolute', inset: 0, zIndex: 58,
        background: 'rgba(6,4,3,0.55)',
        backdropFilter: open ? 'blur(3px)' : 'none',
        opacity: open ? 1 : 0, pointerEvents: open ? 'auto' : 'none',
        transition: 'opacity 280ms var(--ease)', borderRadius: 48,
      }} />
      <div style={{
        position: 'absolute', left: 0, right: 0, bottom: 0, zIndex: 59,
        transform: open ? 'translateY(0)' : 'translateY(102%)',
        transition: 'transform 460ms var(--ease-spring)',
        background: 'var(--surface-solid)', borderRadius: '30px 30px 48px 48px',
        padding: '14px 24px 38px', boxShadow: 'var(--shadow)',
        border: '1px solid var(--hairline)', borderBottom: 'none',
      }}>
        <div style={{ width: 40, height: 5, borderRadius: 3, background: 'var(--hairline-strong)', margin: '0 auto 20px' }} />

        {file && (
          <>
            {/* Header preview */}
            <div style={{ display: 'flex', alignItems: 'center', gap: 14, marginBottom: 20 }}>
              <PinOrb color={color} icon={icon} size={56} radius={15} glow />
              <div style={{ flex: 1, minWidth: 0 }}>
                <div className="eyebrow" style={{ marginBottom: 6 }}>Customize</div>
                <input
                  value={name}
                  onChange={e => setName(e.target.value)}
                  placeholder={file.name}
                  style={{
                    width: '100%', background: 'var(--surface-2)', border: '1px solid var(--hairline-strong)',
                    borderRadius: 10, padding: '7px 11px', color: 'var(--text)', fontSize: 15, fontWeight: 600,
                    fontFamily: 'var(--font)', outline: 'none',
                  }}
                />
              </div>
            </div>

            {/* Color row */}
            <div style={{ fontSize: 13, fontWeight: 600, color: 'var(--text-2)', marginBottom: 12 }}>Color</div>
            <div style={{ display: 'flex', gap: 14, marginBottom: 24 }}>
              {PIN_COLORS.map(c => {
                const on = color === c.id;
                return (
                  <button key={c.id} className="press" onClick={() => setColor(c.id)} aria-label={c.name} style={{
                    width: 48, height: 48, borderRadius: '50%', padding: 0,
                    border: on ? '2px solid var(--text)' : '2px solid transparent',
                    boxShadow: on ? '0 0 0 2px var(--surface-solid) inset' : 'none',
                  }}>
                    <span style={{
                      display: 'block', width: '100%', height: '100%', borderRadius: '50%',
                      background: ALMA_GRADIENTS[c.id],
                    }} />
                  </button>
                );
              })}
            </div>

            {/* Icon grid */}
            <div style={{ fontSize: 13, fontWeight: 600, color: 'var(--text-2)', marginBottom: 12 }}>Icon</div>
            <div style={{
              display: 'grid', gridTemplateColumns: 'repeat(5, 1fr)', gap: 10, marginBottom: 26,
            }}>
              {PIN_ICONS.map(i => {
                const on = icon === i.id;
                const Comp = PIN_ICON_MAP[i.id];
                return (
                  <button key={i.id} className="press" onClick={() => setIcon(i.id)} aria-label={i.label} style={{
                    aspectRatio: '1 / 1', borderRadius: 14,
                    background: on ? 'var(--surface-2)' : 'transparent',
                    border: `1px solid ${on ? 'var(--text)' : 'var(--hairline)'}`,
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    color: on ? 'var(--text)' : 'var(--text-2)',
                    transition: 'background 180ms var(--ease), border-color 180ms var(--ease), color 180ms var(--ease)',
                  }}>
                    <Comp size={20} />
                  </button>
                );
              })}
            </div>

            <button className="press" onClick={commit} style={{
              width: '100%', padding: '16px', borderRadius: 18,
              background: 'var(--accent)', color: 'var(--on-accent)',
              fontSize: 16, fontWeight: 600, boxShadow: '0 10px 26px -8px var(--accent-glow)',
              display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 9, whiteSpace: 'nowrap',
            }}>
              <IconCheck size={18} /> {file._isNew ? 'Add to Vault' : 'Save'}
            </button>
          </>
        )}
      </div>
    </>
  );
}

window.PinCustomizerSheet = PinCustomizerSheet;
