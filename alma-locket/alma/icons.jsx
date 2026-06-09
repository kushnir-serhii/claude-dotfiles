// ALMA — Lucide icon set. All icons rendered with stroke="currentColor",
// strokeWidth 1.8, rounded caps/joins. Default size 18 (min 16 enforced).

function _lucide(children, { size: defaultSize = 18, sw = 1.8, fill = 'none' } = {}) {
  return (props) => {
    const { size, style, strokeWidth, ...rest } = props || {};
    const s = Math.max(16, size || defaultSize);
    return (
      <svg width={s} height={s} viewBox="0 0 24 24" fill={fill}
        stroke="currentColor" strokeWidth={strokeWidth ?? sw}
        strokeLinecap="round" strokeLinejoin="round"
        style={{ flexShrink: 0, ...style }} {...rest}>
        {children}
      </svg>
    );
  };
}

// Solid icons (filled, no stroke)
function _solid(children, { size: defaultSize = 18 } = {}) {
  return (props) => {
    const { size, style, ...rest } = props || {};
    const s = Math.max(16, size || defaultSize);
    return (
      <svg width={s} height={s} viewBox="0 0 24 24" fill="currentColor"
        style={{ flexShrink: 0, ...style }} {...rest}>
        {children}
      </svg>
    );
  };
}

// ── Playback ──
const IconPlay = _solid(<path d="M6 4.5c0-.79.87-1.27 1.54-.85l11.6 7.5a1 1 0 0 1 0 1.7l-11.6 7.5A1 1 0 0 1 6 19.5v-15z" />);
const IconPause = _solid(<><rect x="6" y="4" width="4" height="16" rx="1" /><rect x="14" y="4" width="4" height="16" rx="1" /></>);

// ── System ──
const IconMoon = _lucide(<path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z" />);
const IconSun = _lucide(<><circle cx="12" cy="12" r="4" /><path d="M12 2v2M12 20v2M4.93 4.93l1.41 1.41M17.66 17.66l1.41 1.41M2 12h2M20 12h2M6.34 17.66l-1.41 1.41M19.07 4.93l-1.41 1.41" /></>);

// ── Heart (Lucide heart — supports filled) ──
const IconHeart = (props) => {
  const { size, style, filled, ...rest } = props || {};
  const s = Math.max(16, size || 18);
  return (
    <svg width={s} height={s} viewBox="0 0 24 24" fill={filled ? 'currentColor' : 'none'}
      stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"
      style={{ flexShrink: 0, ...style }} {...rest}>
      <path d="M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.29 1.51 4.04 3 5.5l7 7Z" />
    </svg>
  );
};

const IconMute = _lucide(<><path d="M11 5 6 9H2v6h4l5 4V5z" /><path d="M22 9l-6 6M16 9l6 6" /></>);

// ── Chevrons ──
const IconChevDown = _lucide(<polyline points="6 9 12 15 18 9" />, { sw: 2 });
const IconChevRight = _lucide(<polyline points="9 6 15 12 9 18" />, { sw: 2 });
const IconChevDownSmall = _lucide(<polyline points="6 9 12 15 18 9" />, { sw: 2.2 });

// ── Cloud / download ──
const IconDownload = _lucide(<><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" /><polyline points="7 10 12 15 17 10" /><line x1="12" y1="15" x2="12" y2="3" /></>);
const IconCloud = _lucide(<path d="M17.5 19H9a7 7 0 1 1 6.71-9h1.79a4.5 4.5 0 1 1 0 9z" />);

// ── Preview (play-circle) ──
const IconPreview = _lucide(<><circle cx="12" cy="12" r="9" /><path d="M10 8.5v7l6-3.5z" fill="currentColor" stroke="none" /></>);

// ── Plus / Pin / Layers / Sliders ──
const IconPlus = _lucide(<><line x1="12" y1="5" x2="12" y2="19" /><line x1="5" y1="12" x2="19" y2="12" /></>, { sw: 2 });
const IconPin = _lucide(<><line x1="12" y1="17" x2="12" y2="22" /><path d="M5 17h14v-1.76a2 2 0 0 0-1.11-1.79l-1.78-.9A2 2 0 0 1 15 10.76V6h1a2 2 0 0 0 0-4H8a2 2 0 0 0 0 4h1v4.76a2 2 0 0 1-1.11 1.79l-1.78.9A2 2 0 0 0 5 15.24z" /></>);
const IconLayers = _lucide(<><polygon points="12 2 2 7 12 12 22 7 12 2" /><polyline points="2 17 12 22 22 17" /><polyline points="2 12 12 17 22 12" /></>);
const IconSliders = _lucide(<><line x1="21" y1="4" x2="14" y2="4" /><line x1="10" y1="4" x2="3" y2="4" /><line x1="21" y1="12" x2="12" y2="12" /><line x1="8" y1="12" x2="3" y2="12" /><line x1="21" y1="20" x2="16" y2="20" /><line x1="12" y1="20" x2="3" y2="20" /><line x1="14" y1="2" x2="14" y2="6" /><line x1="8" y1="10" x2="8" y2="14" /><line x1="16" y1="18" x2="16" y2="22" /></>);

// ── Tab bar ──
const IconHome = _lucide(<><path d="M3 10a2 2 0 0 1 .709-1.528l7-5.999a2 2 0 0 1 2.582 0l7 5.999A2 2 0 0 1 21 10v9a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" /><path d="M9 21V12h6v9" /></>);
const IconMixer = _lucide(<><path d="M4 21V14" /><path d="M4 10V3" /><path d="M12 21v-9" /><path d="M12 8V3" /><path d="M20 21v-5" /><path d="M20 12V3" /><line x1="1" y1="14" x2="7" y2="14" /><line x1="9" y1="8" x2="15" y2="8" /><line x1="17" y1="16" x2="23" y2="16" /></>);
const IconVault = _lucide(<><rect x="2" y="4" width="20" height="5" rx="2" /><path d="M4 9v9a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V9" /><line x1="10" y1="13" x2="14" y2="13" /></>);

// ── Status / actions ──
const IconCheck = _lucide(<polyline points="20 6 9 17 4 12" />, { sw: 2.2 });
const IconClose = _lucide(<><line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" /></>, { sw: 2 });
const IconEdit = _lucide(<><path d="M17 3a2.85 2.83 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5L17 3Z" /><path d="m15 5 4 4" /></>);
const IconTrash = _lucide(<><path d="M3 6h18" /><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6" /><path d="M8 6V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" /><line x1="10" y1="11" x2="10" y2="17" /><line x1="14" y1="11" x2="14" y2="17" /></>);

// ── Star (Lucide star — supports filled) ──
const IconStar = (props) => {
  const { size, style, filled, ...rest } = props || {};
  const s = Math.max(16, size || 18);
  return (
    <svg width={s} height={s} viewBox="0 0 24 24" fill={filled ? 'currentColor' : 'none'}
      stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"
      style={{ flexShrink: 0, ...style }} {...rest}>
      <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
    </svg>
  );
};

// ── Audio waveform ──
const IconWave = _lucide(<><path d="M2 10v3" /><path d="M6 6v11" /><path d="M10 3v18" /><path d="M14 8v7" /><path d="M18 5v13" /><path d="M22 10v3" /></>);

// ── Picker icons (used on pinned-file orbs) ──
const IconWaves     = _lucide(<><path d="M2 6c.7 0 1.4-.2 2-.6.6.4 1.3.6 2 .6s1.4-.2 2-.6c.6.4 1.3.6 2 .6s1.4-.2 2-.6c.6.4 1.3.6 2 .6s1.4-.2 2-.6c.6.4 1.3.6 2 .6s1.4-.2 2-.6c.6.4 1.3.6 2 .6" /><path d="M2 12c.7 0 1.4-.2 2-.6.6.4 1.3.6 2 .6s1.4-.2 2-.6c.6.4 1.3.6 2 .6s1.4-.2 2-.6c.6.4 1.3.6 2 .6s1.4-.2 2-.6c.6.4 1.3.6 2 .6s1.4-.2 2-.6c.6.4 1.3.6 2 .6" /><path d="M2 18c.7 0 1.4-.2 2-.6.6.4 1.3.6 2 .6s1.4-.2 2-.6c.6.4 1.3.6 2 .6s1.4-.2 2-.6c.6.4 1.3.6 2 .6s1.4-.2 2-.6c.6.4 1.3.6 2 .6s1.4-.2 2-.6c.6.4 1.3.6 2 .6" /></>);
const IconDroplets  = _lucide(<><path d="M7 16.3c2.2 0 4-1.83 4-4.05 0-1.16-.57-2.26-1.71-3.19S7.29 6.75 7 5.3c-.29 1.45-1.14 2.84-2.29 3.76S3 11.1 3 12.25c0 2.22 1.8 4.05 4 4.05z" /><path d="M12.56 6.6A10.97 10.97 0 0 0 14 3.02c.5 2.5 2 4.9 4 6.5s3 3.5 3 5.5a6.98 6.98 0 0 1-11.91 4.97" /></>);
const IconFlame     = _lucide(<path d="M8.5 14.5A2.5 2.5 0 0 0 11 12c0-1.38-.5-2-1-3-1.072-2.143-.224-4.054 2-6 .5 2.5 2 4.9 4 6.5 2 1.6 3 3.5 3 5.5a7 7 0 1 1-14 0c0-1.153.433-2.294 1-3a2.5 2.5 0 0 0 2.5 2.5z" />);
const IconLeaf      = _lucide(<><path d="M11 20A7 7 0 0 1 9.8 6.1C15.5 5 17 4.48 19.2 2.96c1.4 9.3-3.4 15.6-8.2 17.04z" /><path d="M2 21c0-3 1.85-5.36 5.08-6" /></>);
const IconMic       = _lucide(<><rect x="9" y="2" width="6" height="12" rx="3" /><path d="M19 10v2a7 7 0 0 1-14 0v-2" /><line x1="12" y1="19" x2="12" y2="22" /></>);
const IconMusic     = _lucide(<><path d="M9 18V5l12-2v13" /><circle cx="6" cy="18" r="3" /><circle cx="18" cy="16" r="3" /></>);
const IconBell      = _lucide(<><path d="M6 8a6 6 0 0 1 12 0c0 7 3 9 3 9H3s3-2 3-9" /><path d="M10.3 21a1.94 1.94 0 0 0 3.4 0" /></>);
const IconSparkles  = _lucide(<><path d="M9.94 14.34 7.5 21l-2.44-6.66L0 12l5.06-2.34L7.5 3l2.44 6.66L15 12z" transform="translate(2 0)" /><path d="M19 3v4M21 5h-4M18 17v3M19.5 18.5h-3" /></>);
const IconHeadphones= _lucide(<><path d="M3 18v-6a9 9 0 0 1 18 0v6" /><path d="M21 19a2 2 0 0 1-2 2h-1a2 2 0 0 1-2-2v-3a2 2 0 0 1 2-2h3z" /><path d="M3 19a2 2 0 0 0 2 2h1a2 2 0 0 0 2-2v-3a2 2 0 0 0-2-2H3z" /></>);
const IconFlower    = _lucide(<><circle cx="12" cy="12" r="3" /><path d="M12 16.5A4.5 4.5 0 1 1 7.5 12 4.5 4.5 0 1 1 12 7.5a4.5 4.5 0 1 1 4.5 4.5 4.5 4.5 0 1 1-4.5 4.5" /><path d="M12 7.5V9M7.5 12H9M12 16.5V15M16.5 12H15" /></>);
const IconStop = ({ size = 18, style } = {}) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor" xmlns="http://www.w3.org/2000/svg" style={style}>
    <rect x="5" y="5" width="14" height="14" rx="2" />
  </svg>
);
const IconPlayFilled = ({ size = 18, style } = {}) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor" xmlns="http://www.w3.org/2000/svg" style={style}>
    <polygon points="6,3 20,12 6,21" />
  </svg>
);

const IconUser      = _lucide(<><circle cx="12" cy="8" r="4" /><path d="M4 20c0-4 3.6-7 8-7s8 3 8 7" /></>);
const IconTarget    = _lucide(<><circle cx="12" cy="12" r="10" /><circle cx="12" cy="12" r="6" /><circle cx="12" cy="12" r="2" /></>);
const IconChevLeft  = _lucide(<path d="M15 18l-6-6 6-6" />);
const IconBarChart  = _lucide(<><rect x="3" y="12" width="4" height="9" rx="1" /><rect x="9.5" y="7" width="4" height="14" rx="1" /><rect x="16" y="3" width="4" height="18" rx="1" /></>);

Object.assign(window, {
  IconPlay, IconPause, IconMoon, IconSun, IconHeart, IconMute,
  IconChevDown, IconChevRight, IconChevDownSmall, IconDownload, IconCloud,
  IconPreview, IconPlus, IconPin, IconLayers, IconSliders, IconHome,
  IconMixer, IconVault, IconCheck, IconClose, IconEdit, IconTrash, IconStar, IconWave,
  IconWaves, IconDroplets, IconFlame, IconLeaf, IconMic, IconMusic, IconBell,
  IconSparkles, IconHeadphones, IconFlower, IconStop, IconPlayFilled,
  IconUser, IconTarget, IconChevLeft, IconBarChart,
});
