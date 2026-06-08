// ALMA — seed content + cover art identities (image-based + a few gradients).
// ALMA_GRADIENTS is the single map used by <Orb> — values are valid CSS background shorthand.

const ALMA_GRADIENTS = {
  // ── Image covers (master tracks) — premium photo-painting artwork
  sun:     "url('alma/img/sun.webp') center / cover no-repeat",
  evening: "url('alma/img/evening.webp') center / cover no-repeat",
  flower:  "url('alma/img/flower.webp') center / cover no-repeat",
  light:   "url('alma/img/light.webp') center / cover no-repeat",
  weve:    "url('alma/img/weve.webp') center / cover no-repeat",
  sea:     "url('alma/img/sea.webp') center / cover no-repeat",
  searay:  "url('alma/img/sea-light.webp') center / cover no-repeat",
  day:     "url('alma/img/day.webp') center / cover no-repeat",

  // ── Ritual gradient images
  g1:      "url('alma/img/gradient1.webp') center / cover no-repeat",
  g2:      "url('alma/img/gradient2.webp') center / cover no-repeat",
  g3:      "url('alma/img/gradient3.webp') center / cover no-repeat",
  g4:      "url('alma/img/gradient4.webp') center / cover no-repeat",
  g5:      "url('alma/img/gradient5.webp') center / cover no-repeat",
  g6:      "url('alma/img/gradient6.webp') center / cover no-repeat",

  // ── Subtle gradients (ambient layers — small thumbs only)
  rain:    'radial-gradient(120% 120% at 45% 30%, #93C5FD 0%, #3B6EA5 55%, #16304D 100%)',
  forest:  'radial-gradient(120% 120% at 40% 30%, #86EFAC 0%, #2E7D5B 55%, #123226 100%)',
  ember:   'radial-gradient(120% 120% at 35% 25%, #FDBA74 0%, #C2541F 55%, #4A1E0A 100%)',
  dawn:    'radial-gradient(120% 120% at 60% 20%, #FCD9B6 0%, #B98A6A 50%, #5C4533 100%)',
  ocean:   'radial-gradient(120% 120% at 30% 30%, #5EEAD4 0%, #2563A8 55%, #0E2A52 100%)',
  theta:   'radial-gradient(120% 120% at 40% 80%, #6366F1 0%, #3730A3 55%, #1E1B4B 100%)',
  violet:  'radial-gradient(120% 120% at 70% 25%, #C4B5FD 0%, #8B5CF6 50%, #4C1D95 100%)',
  bound:   'radial-gradient(120% 120% at 70% 30%, #F0ABFC 0%, #A855F7 50%, #581C87 100%)',

  // ── Muted Pin-File gradients (curated palette for user choice)
  blu:     'linear-gradient(140deg, #7B96BA 0%, #4A6485 55%, #2B3D55 100%)',
  plum:    'linear-gradient(140deg, #8E80A8 0%, #5F5479 55%, #382E4C 100%)',
  ink:     'linear-gradient(140deg, #4A5066 0%, #2A2F3F 55%, #14171F 100%)',
  honey:   'linear-gradient(140deg, #C9AE7B 0%, #91754A 55%, #4F3F26 100%)',
  seaish:  'linear-gradient(140deg, #7CB0A8 0%, #4E807A 55%, #2A4B47 100%)',
};

// Curated Pin-File customization palette
const PIN_COLORS = [
  { id: 'blu',    name: 'Blue' },
  { id: 'plum',   name: 'Plum' },
  { id: 'ink',    name: 'Ink' },
  { id: 'honey',  name: 'Honey' },
  { id: 'seaish', name: 'Sea' },
];

// Curated Pin-File icon set (Lucide outline, white over color)
const PIN_ICONS = [
  { id: 'wave',       label: 'Wave' },
  { id: 'droplets',   label: 'Rain' },
  { id: 'flame',      label: 'Flame' },
  { id: 'leaf',       label: 'Leaf' },
  { id: 'mic',        label: 'Voice' },
  { id: 'music',      label: 'Music' },
  { id: 'bell',       label: 'Bell' },
  { id: 'sparkles',   label: 'Spark' },
  { id: 'headphones', label: 'Phones' },
  { id: 'flower',     label: 'Bloom' },
];

const MASTER_TRACKS = [
  { id: 't1', title: 'Crown of Stillness', sub: 'Theta · Deep Rest',     dur: 22, grad: 'sun',     state: 'downloaded' },
  { id: 't2', title: 'Violet Hour',         sub: 'Guided · Evening',      dur: 15, grad: 'evening', state: 'downloaded' },
  { id: 't3', title: 'Boundless',           sub: 'Ambient · Focus',       dur: 12, grad: 'light',   state: 'downloaded' },
  { id: 't4', title: 'Deep Theta Drift',    sub: 'Binaural · Sleep',      dur: 30, grad: 'weve',    state: 'cloud' },
  { id: 't5', title: 'Oceanic Reset',       sub: 'Soundscape · Calm',     dur: 18, grad: 'sea',     state: 'cloud' },
  { id: 't6', title: 'First Light',         sub: 'Guided · Morning',      dur: 10, grad: 'searay',  state: 'cloud' },
  { id: 't7', title: 'Petal Breath',        sub: 'Pranayama · Reset',     dur: 14, grad: 'flower',  state: 'cloud' },
  { id: 't8', title: 'Solstice',            sub: 'Cinematic · Long-form', dur: 45, grad: 'day',     state: 'cloud' },
];

const SAVED_RITUALS = [
  { id: 'r1', title: 'Deep Morning Focus', layers: 'Boundless + Rainfall',     dur: 25, grad: 'g1' },
  { id: 'r2', title: 'Evening Wind-Down',  layers: 'Violet Hour + Pink Noise', dur: 15, grad: 'g2' },
  { id: 'r3', title: 'Midday Reset',       layers: 'Oceanic Reset + Waves',    dur: 10, grad: 'g3' },
];

const AMBIENT_LAYERS = [
  { id: 'a1', name: 'Pink Noise',      desc: 'Soft, balanced hush',  grad: 'bound' },
  { id: 'a2', name: 'Rainfall',        desc: 'Steady gentle rain',   grad: 'rain' },
  { id: 'a3', name: 'Distant Thunder', desc: 'Low rolling warmth',   grad: 'theta' },
  { id: 'a4', name: 'Forest Night',    desc: 'Crickets & far owls',  grad: 'forest' },
  { id: 'a5', name: 'Ocean Waves',     desc: 'Slow tidal breath',    grad: 'ocean' },
  { id: 'a6', name: 'Tibetan Chimes',  desc: 'Resonant metal bowls', grad: 'ember' },
];

const RAW_AUDIO = [
  { id: 'p1', name: 'rainfall_field_rec.wav',   meta: 'WAV · 41 min', color: 'blu',    icon: 'droplets',   pinned: true },
  { id: 'p2', name: 'tibetan_bowls_long.m4a',   meta: 'M4A · 22 min', color: 'honey',  icon: 'bell',       pinned: true },
  { id: 'p3', name: 'morning_affirmations.mp3', meta: 'MP3 · 8 min',  color: 'plum',   icon: 'mic',        pinned: true },
  { id: 'p4', name: 'lake_at_dawn.wav',         meta: 'WAV · 33 min', color: 'seaish', icon: 'wave',       pinned: false },
];

const DURATIONS = [5, 15, 30, 45];

function fmtTime(totalSec) {
  const m = Math.floor(totalSec / 60);
  const s = Math.floor(totalSec % 60);
  return `${m}:${String(s).padStart(2, '0')}`;
}

Object.assign(window, {
  ALMA_GRADIENTS, MASTER_TRACKS, SAVED_RITUALS,
  AMBIENT_LAYERS, RAW_AUDIO, DURATIONS, PIN_COLORS, PIN_ICONS, fmtTime,
});
