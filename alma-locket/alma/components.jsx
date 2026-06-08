// ALMA — shared UI components. Exported to window.
const { useState, useEffect, useRef } = React;

// Gradient "cover art" tile
function Orb({ grad, size = 64, radius = 18, style = {}, children, glow = false }) {
  const g = ALMA_GRADIENTS[grad] || ALMA_GRADIENTS.g1;
  return (
    <div style={{
      width: size, height: size, borderRadius: radius, background: g, backgroundColor: '#1a1714',
      position: 'relative', flexShrink: 0, overflow: 'hidden',
      boxShadow: glow ? '0 10px 30px -8px rgba(0,0,0,0.55)' : 'none',
      ...style,
    }}>
      <div style={{
        position: 'absolute', inset: 0, borderRadius: radius, pointerEvents: 'none',
        boxShadow: 'inset 0 1px 1px rgba(255,255,255,0.18), inset 0 -10px 24px rgba(0,0,0,0.16)',
      }} />
      {children}
    </div>
  );
}

// Small circular play badge
function PlayBadge({ size = 38, onClick, playing = false, tone = 'glass' }) {
  const isAccent = tone === 'accent';
  return (
    <button className="press" onClick={onClick} aria-label={playing ? 'Pause' : 'Play'} style={{
      width: size, height: size, borderRadius: '50%',
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      background: isAccent ? 'var(--accent)' : 'var(--surface-2)',
      color: isAccent ? 'var(--on-accent)' : 'var(--text)',
      border: isAccent ? 'none' : '1px solid var(--hairline-strong)',
      flexShrink: 0,
    }}>
      {playing
        ? <IconPause size={size * 0.46} />
        : <IconPlay size={size * 0.42} style={{ marginLeft: size * 0.04 }} />}
    </button>
  );
}

// Duration pill row
function DurationPills({ value, onChange, options = DURATIONS, dense = false }) {
  return (
    <div style={{ display: 'flex', gap: dense ? 8 : 10, flexWrap: 'wrap' }}>
      {options.map(min => {
        const active = value === min;
        return (
          <button key={min} className="press" onClick={() => onChange(min)} style={{
            flex: dense ? '1 1 0' : '0 0 auto',
            minWidth: dense ? 0 : 70,
            padding: dense ? '11px 8px' : '12px 18px',
            borderRadius: 14,
            background: active ? 'var(--text)' : 'var(--surface)',
            color: active ? 'var(--bg-0)' : 'var(--text-2)',
            border: active ? 'none' : '1px solid var(--hairline)',
            fontSize: 15, fontWeight: 600, letterSpacing: 0.2,
            transition: 'background 200ms var(--ease), color 200ms var(--ease)',
            whiteSpace: 'nowrap',
          }}>
            {min} min
          </button>
        );
      })}
    </div>
  );
}

// Section header with right-side counter or chevron
function SectionHead({ title, counter, onMore, style = {} }) {
  return (
    <div style={{ display: 'flex', alignItems: 'baseline', justifyContent: 'space-between', gap: 12, ...style }}>
      <h2 style={{ margin: 0, fontSize: 22, fontWeight: 600, letterSpacing: -0.3, color: 'var(--text)', whiteSpace: 'nowrap', flex: 1, minWidth: 0 }}>{title}</h2>
      {counter != null && (
        <span style={{ fontSize: 13, fontWeight: 600, color: 'var(--text-3)', letterSpacing: 0.3, flexShrink: 0, whiteSpace: 'nowrap' }}>{counter}</span>
      )}
      {onMore && (
        <button className="press" onClick={onMore} style={{ display: 'flex', alignItems: 'center', color: 'var(--text-3)' }}>
          <IconChevRight size={20} />
        </button>
      )}
    </div>
  );
}

// Bottom tab bar — grayscale (no purple)
function TabBar({ active, onChange, hasMini }) {
  const tabs = [
    { id: 'sanctuary', label: 'Sanctuary', Icon: IconHome },
    { id: 'mixer', label: 'Mixer', Icon: IconMixer },
    { id: 'vault', label: 'Vault', Icon: IconVault },
  ];
  return (
    <div style={{
      position: 'absolute', left: 0, right: 0, bottom: 0, zIndex: 40,
      paddingBottom: 30, paddingTop: 12,
      background: 'linear-gradient(to top, var(--bg-1) 62%, transparent)',
    }}>
      <div style={{
        display: 'flex', justifyContent: 'space-around', alignItems: 'center',
        padding: '0 22px',
      }}>
        {tabs.map(({ id, label, Icon }) => {
          const on = active === id;
          return (
            <button key={id} className="press" onClick={() => onChange(id)} style={{
              display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 5,
              color: on ? 'var(--text)' : 'var(--text-3)', flex: 1,
            }}>
              <Icon size={24} strokeWidth={on ? 2 : 1.7} />
              <span style={{ fontSize: 12, fontWeight: on ? 600 : 500, letterSpacing: 0.2 }}>{label}</span>
            </button>
          );
        })}
      </div>
    </div>
  );
}

// Top header: ALMA wordmark + sun/moon toggle
function AlmaHeader({ theme, onToggleTheme, sub }) {
  return (
    <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: 4 }}>
      <div>
        <div style={{
          fontSize: 34, fontWeight: 600, letterSpacing: 6, color: 'var(--text)', lineHeight: 1,
        }}>ALMA</div>
        {sub && <div style={{ fontSize: 14, color: 'var(--text-2)', marginTop: 8, letterSpacing: 0.2 }}>{sub}</div>}
      </div>
      <ThemeToggle theme={theme} onToggle={onToggleTheme} />
    </div>
  );
}

// Sun/Moon switch — grayscale
function ThemeToggle({ theme, onToggle }) {
  const isMoon = theme === 'moon';
  return (
    <button className="press" onClick={onToggle} aria-label="Toggle theme" style={{
      width: 74, height: 38, borderRadius: 19, position: 'relative',
      background: 'var(--surface-2)', border: '1px solid var(--hairline)',
      display: 'flex', alignItems: 'center', padding: 3,
    }}>
      <div style={{
        position: 'absolute', top: 3, left: isMoon ? 3 : 39,
        width: 32, height: 30, borderRadius: 15,
        background: 'var(--text)', transition: 'left 320ms var(--ease-spring)',
        boxShadow: '0 2px 8px rgba(0,0,0,0.25)',
      }} />
      <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1, color: isMoon ? 'var(--bg-0)' : 'var(--text-3)' }}>
        <IconMoon size={16} />
      </div>
      <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1, color: !isMoon ? 'var(--bg-0)' : 'var(--text-3)' }}>
        <IconSun size={16} />
      </div>
    </button>
  );
}

// Toast notification
function Toast({ message }) {
  if (!message) return null;
  return (
    <div style={{
      position: 'absolute', bottom: 150, left: '50%', transform: 'translateX(-50%)',
      zIndex: 90, background: 'var(--surface-solid)', color: 'var(--text)',
      padding: '13px 20px', borderRadius: 16, fontSize: 14, fontWeight: 500,
      boxShadow: 'var(--shadow)', border: '1px solid var(--hairline-strong)',
      whiteSpace: 'nowrap', animation: 'almaFadeUp 300ms var(--ease) both',
      display: 'flex', alignItems: 'center', gap: 9,
    }}>
      <span style={{ width: 7, height: 7, borderRadius: '50%', background: 'var(--text)' }} />
      {message}
    </div>
  );
}

Object.assign(window, {
  Orb, PlayBadge, DurationPills, SectionHead, TabBar, AlmaHeader, ThemeToggle, Toast,
});

// ── Customizable pin orb (gradient + centered Lucide icon) ──
const PIN_ICON_MAP = {
  wave: IconWave,
  droplets: IconDroplets,
  flame: IconFlame,
  leaf: IconLeaf,
  mic: IconMic,
  music: IconMusic,
  bell: IconBell,
  sparkles: IconSparkles,
  headphones: IconHeadphones,
  flower: IconFlower,
};

function PinOrb({ color = 'blu', icon = 'wave', size = 48, radius = 13, glow = false }) {
  const Icon = PIN_ICON_MAP[icon] || IconMusic;
  const iconSize = Math.max(16, Math.round(size * 0.46));
  return (
    <Orb grad={color} size={size} radius={radius} glow={glow}>
      <div style={{
        position: 'absolute', inset: 0, display: 'flex',
        alignItems: 'center', justifyContent: 'center', color: '#fff',
      }}>
        <Icon size={iconSize} />
      </div>
    </Orb>
  );
}

Object.assign(window, { PinOrb, PIN_ICON_MAP });
